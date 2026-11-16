import { parse as parseYaml } from 'yaml';

function visit(node, fn) {
  fn(node);
  for (const child of node.children || []) visit(child, fn);
}

const names = new Set(['definicion','articulo','nota','advertencia','ejemplo','pregunta','tema','capitulo','seccion','plegable','referencia','cita','regla','resumen','concepto','tabla-estudio','tabla-arbol','xmind','rootTopic','nodo']);
const isDirective = (node, name) => node.type === 'containerDirective' && node.name === name;
const treeNodes = (node) => (node.children || []).filter((child) => isDirective(child, 'nodo'));
const classesFrom = (attrs = {}) => {
  const value = attrs.className || attrs.class || [];
  return Array.isArray(value) ? value : typeof value === 'string' ? value.split(/\s+/).filter(Boolean) : [];
};
const htmlNode = (tag, properties = {}, children = []) => ({
  type: 'containerDirective',
  name: '__ax_' + tag,
  attributes: {},
  data: { hName: tag, hProperties: properties },
  children,
});
const xmindValue = (value) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (/^-?(?:0|[1-9]\d*)(?:\.\d+)?$/.test(trimmed)) return Number(trimmed);
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (trimmed === 'null') return null;
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try { return JSON.parse(trimmed); } catch { return value; }
  }
  return value;
};

const isXmindConfig = (node) => node.type === 'code' && node.lang === 'yaml' && node.meta?.trim() === 'xmind';
const isClassConfig = (node) => node.type === 'code' && node.lang === 'yaml' && node.meta?.trim() === 'clases';
const deepMerge = (base, override) => {
  if (!base || typeof base !== 'object' || Array.isArray(base)) return override;
  if (!override || typeof override !== 'object' || Array.isArray(override)) return override;
  const merged = { ...base };
  for (const [key, value] of Object.entries(override)) {
    merged[key] = key in merged ? deepMerge(merged[key], value) : value;
  }
  return merged;
};
function parseXmindConfig(node) {
  const value = parseYaml(node.value, { uniqueKeys: true });
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('El bloque xmind debe contener un objeto de propiedades YAML.');
  return value;
}

function parseClassConfig(node) {
  const value = parseYaml(node.value, { uniqueKeys: true });
  if (!value || typeof value !== 'object' || Array.isArray(value) || !value.niveles || typeof value.niveles !== 'object' || Array.isArray(value.niveles)) {
    throw new Error('El bloque clases debe contener un objeto YAML con la propiedad niveles.');
  }
  if (Object.keys(value).some((key) => key !== 'niveles')) throw new Error('El bloque clases solo admite la propiedad niveles.');

  const levels = {};
  for (const [level, configuredClasses] of Object.entries(value.niveles)) {
    if (!/^[1-9]\\d*$/.test(level)) throw new Error(`El nivel de clases "${level}" debe ser un entero positivo.`);
    const classList = typeof configuredClasses === 'string' ? [configuredClasses] : configuredClasses;
    if (!Array.isArray(classList) || classList.some((name) => typeof name !== 'string' || !/^[A-Za-z_][A-Za-z0-9_-]*$/.test(name))) {
      throw new Error(`Las clases del nivel ${level} deben ser nombres CSS válidos o una lista de nombres CSS.`);
    }
    levels[level] = [...new Set(classList)];
  }
  return levels;
}

function mergeClassLevels(base, override) {
  const merged = { ...base };
  for (const [level, classes] of Object.entries(override)) {
    merged[level] = [...new Set([...(merged[level] || []), ...classes])];
  }
  return merged;
}

function classLevelsFrom(children) {
  return (children || []).filter(isClassConfig).reduce(
    (levels, block) => mergeClassLevels(levels, parseClassConfig(block)),
    {},
  );
}

function applyLevelClasses(nodes, classLevels, level = 1) {
  for (const node of nodes) {
    node.classes = [...new Set([...(classLevels[level] || []), ...(node.classes || [])])];
    applyLevelClasses(node.children || [], classLevels, level + 1);
  }
}

// Heading suffixes are reserved for wiki classes and anchors: {.css-class #wiki-id}.
// XMind properties use their own indented `xmind` code block, never inline JSON.
function headingAttributes(heading) {
  const children = [...(heading.children || [])];
  const last = children.at(-1);
  if (!last || last.type !== 'text') return { children, classes: [], id: undefined };
  const trimmed = last.value.trimEnd();
  if (!trimmed.endsWith('}')) return { children, classes: [], id: undefined };
  let depth = 0;
  let start = -1;
  for (let i = trimmed.length - 1; i >= 0; i--) {
    if (trimmed[i] === '}') depth++;
    else if (trimmed[i] === '{' && --depth === 0) { start = i; break; }
  }
  if (start < 1 || !/\s/.test(trimmed[start - 1])) return { children, classes: [], id: undefined };
  const tokens = trimmed.slice(start + 1, -1).split(/\s+/).filter(Boolean);
  const classes = [];
  let id;
  for (const token of tokens) {
    if (token.startsWith('.')) classes.push(token.slice(1));
    else if (token.startsWith('#')) id = token.slice(1);
  }
  last.value = trimmed.slice(0, start).trimEnd();
  if (!last.value) children.pop();
  return { children, classes, id };
}

function directiveNode(node) {
  const children = treeNodes(node);
  const content = (node.children || []).filter((child) => !children.includes(child));
  return {
    content,
    classes: classesFrom(node.attributes),
    id: node.attributes?.id,
    children: children.map(directiveNode),
  };
}

function listNodes(list) {
  return (list.children || []).filter((item) => item.type === 'listItem').map((item) => {
    const nestedLists = (item.children || []).filter((child) => child.type === 'list');
    const content = (item.children || []).filter((child) => child.type !== 'list');
    return { content, classes: [], children: nestedLists.flatMap(listNodes) };
  });
}

function headingNodes(children) {
  const root = { content: [], children: [], xmindProperties: {}, classLevels: {} };
  const stack = [root];
  let title = [];
  let current = root;

  for (const block of children || []) {
    if (block.type === 'heading') {
      if (block.depth === 1) {
        title = block.children || [];
        current = root;
        stack.length = 1;
        continue;
      }

      const depth = Math.max(1, block.depth - 1);
      while (stack.length > depth) stack.pop();
      const parent = stack[depth - 1] || root;
      const heading = headingAttributes(block);
      const model = {
        content: [{ type: 'paragraph', children: heading.children }],
        classes: heading.classes,
        id: heading.id,
        xmindProperties: {},
        children: [],
      };
      parent.children.push(model);
      stack[depth] = model;
      stack.length = depth + 1;
      current = model;
      continue;
    }

    if (isClassConfig(block)) {
      root.classLevels = mergeClassLevels(root.classLevels, parseClassConfig(block));
    } else if (isXmindConfig(block)) {
      current.xmindProperties = deepMerge(current.xmindProperties, parseXmindConfig(block));
    } else if (block.type === 'list') {
      current.children.push(...listNodes(block));
    } else if (current !== root) {
      current.content.push(block);
    } else if (block.type !== 'html' && block.type !== 'thematicBreak') {
      root.content.push(block);
    }
  }

  return { title, children: root.children, xmindProperties: root.xmindProperties, classLevels: root.classLevels };
}

const isTreeContent = (children) => (children || []).some((child) => child.type === 'heading');
const leafCount = (node) => node.children.length ? node.children.reduce((total, child) => total + leafCount(child), 0) : 1;
const maxDepth = (nodes, depth = 1) => nodes.reduce((max, node) => Math.max(max, node.children.length ? maxDepth(node.children, depth + 1) : depth), depth);

function tableForTree(title, roots) {
  const depth = Math.max(1, maxDepth(roots));
  const rowCount = Math.max(1, roots.reduce((sum, node) => sum + leafCount(node), 0));
  const rows = Array.from({ length: rowCount }, () => []);

  function place(node, column, firstRow) {
    const span = leafCount(node);
    rows[firstRow].push({
      cell: htmlNode('td', {
        className: ['ax-tree-cell', ...node.classes],
        dataAxTreeCell: true,
        ...(span > 1 ? { rowSpan: span } : {}),
        ...(node.id ? { id: node.id } : {}),
        ...(Object.keys(node.xmindProperties || {}).length
          ? { 'data-xmind-properties': JSON.stringify(node.xmindProperties) }
          : {}),
      }, node.content.length ? node.content : [{ type: 'paragraph', children: [] }]),
      column,
    });

    let nextRow = firstRow;
    for (const child of node.children) {
      place(child, column + 1, nextRow);
      nextRow += leafCount(child);
    }
  }

  let nextRootRow = 0;
  for (const root of roots) {
    place(root, 0, nextRootRow);
    nextRootRow += leafCount(root);
  }

  const titleCell = {
    ...htmlNode('th', { className: ['ax-tree-title'], colSpan: depth, scope: 'colgroup' }, title.length ? [{ type: 'paragraph', children: title }] : [{ type: 'paragraph', children: [{ type: 'text', value: 'Tabla árbol' }] }]),
  };
  const bodyRows = [];
  for (const row of rows) {
    row.sort((a, b) => a.column - b.column);
    bodyRows.push(htmlNode('tr', {}, row.map(({ cell }) => cell)));
  }

  return htmlNode('table', { className: ['ax-tree-table'], 'aria-label': 'Estructura jerárquica en tabla' }, [
    htmlNode('thead', {}, [htmlNode('tr', {}, [titleCell])]),
    htmlNode('tbody', {}, bodyRows),
  ]);
}

function renderTreeDirective(node, attrs) {
  const usesHeadings = isTreeContent(node.children);
  const tree = usesHeadings
    ? headingNodes(node.children)
    : { title: [], children: treeNodes(node).map(directiveNode), xmindProperties: {}, classLevels: classLevelsFrom(node.children) };
  applyLevelClasses(tree.children, tree.classLevels);
  const headingTitle = tree.title;
  const explicitTitle = attrs.titulo ? [{ type: 'text', value: attrs.titulo }] : [];
  const title = headingTitle.length ? headingTitle : explicitTitle;
  const table = tableForTree(title, tree.children);
  node.children = [table];
  node.data = node.data || {};
  node.data.hName = 'section';
  node.data.hProperties = {
    className: ['ax-tabla-arbol', ...classesFrom(attrs)],
    'aria-label': attrs['aria-label'] || attrs.titulo || 'Tabla árbol',
    'data-xmind-structure-class': attrs.structureClass || tree.xmindProperties.structureClass || 'org.xmind.ui.treetable.toptitle',
    'data-xmind-properties': JSON.stringify({
      ...tree.xmindProperties,
      structureClass: attrs.structureClass || tree.xmindProperties.structureClass || 'org.xmind.ui.treetable.toptitle',
      ...Object.fromEntries(Object.entries(attrs)
        .filter(([key]) => !['class', 'className', 'id', 'aria-label', 'titulo', 'structureClass'].includes(key))
        .map(([key, value]) => [key, xmindValue(value)])),
    }),
  };
  if (attrs.id) node.data.hProperties.id = attrs.id;
}

export default function astroXmindDirectives() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type !== 'containerDirective' || !names.has(node.name)) return;
      const attrs = node.attributes || {};
      const data = node.data || (node.data = {});

      if (['tabla-arbol', 'xmind', 'rootTopic'].includes(node.name)) {
        renderTreeDirective(node, attrs);
      } else if (node.name === 'nodo') {
        data.hName = 'div';
        data.hProperties = { className: ['ax-directive', 'ax-tree-node', ...classesFrom(attrs)] };
        if (attrs.id) data.hProperties.id = attrs.id;
      } else if (node.name === 'tabla-estudio') {
        data.hName = 'div';
        data.hProperties = { className: ['ax-tabla-estudio', ...classesFrom(attrs)] };
        if (attrs.id) data.hProperties.id = attrs.id;
      } else {
        const classes = ['ax-directive', 'ax-' + node.name, ...classesFrom(attrs)];
        if (node.name === 'plegable') {
          data.hName = 'details';
          data.hProperties = { className: classes, open: false };
          node.children.unshift({type:'paragraph',data:{hName:'summary'},children:[{type:'text',value:attrs.titulo || 'Mostrar contenido'}]});
        } else if (node.name === 'referencia') {
          data.hName = 'div';
          data.hProperties = {className:classes};
          if (attrs.destino) node.children.push({type:'paragraph',children:[{type:'link',url:attrs.destino,children:[{type:'text',value:'Abrir referencia'}]}]});
        } else {
          data.hName = node.name === 'cita' ? 'blockquote' : 'section';
          data.hProperties = {className:classes};
        }
        if (attrs.id) data.hProperties.id = attrs.id;
        for (const key of ['numero','dificultad','fuente']) if(attrs[key]) data.hProperties['data-'+key]=attrs[key];
      }
    });
  };
}
