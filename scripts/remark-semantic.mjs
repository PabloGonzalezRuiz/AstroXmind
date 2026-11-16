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
  const root = { content: [], children: [] };
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
      const model = { content: [{ type: 'paragraph', children: block.children || [] }], classes: [], children: [] };
      parent.children.push(model);
      stack[depth] = model;
      stack.length = depth + 1;
      current = model;
      continue;
    }

    if (block.type === 'list') {
      current.children.push(...listNodes(block));
    } else if (current !== root) {
      current.content.push(block);
    } else if (block.type !== 'html' && block.type !== 'thematicBreak') {
      root.content.push(block);
    }
  }

  return { title, children: root.children };
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
  const tree = usesHeadings ? headingNodes(node.children) : { title: [], children: treeNodes(node).map(directiveNode) };
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
    'data-xmind-structure-class': attrs.structureClass || 'org.xmind.ui.treetable.toptitle',
    'data-xmind-properties': JSON.stringify({
      structureClass: attrs.structureClass || 'org.xmind.ui.treetable.toptitle',
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
