function visit(node, fn) { fn(node); for (const child of node.children || []) visit(child, fn); }

const names = new Set(['definicion','articulo','nota','advertencia','ejemplo','pregunta','tema','capitulo','seccion','plegable','referencia','cita','regla','resumen','concepto','tabla-estudio','tabla-arbol','nodo','__ax_tree_row']);
const isDirective = (node, name) => node.type === 'containerDirective' && node.name === name;
const treeNodes = (node) => (node.children || []).filter((child) => isDirective(child, 'nodo'));
const leafCount = (node) => {
  const children = treeNodes(node);
  return children.length ? children.reduce((total, child) => total + leafCount(child), 0) : 1;
};
const classesFrom = (attrs) => {
  const value = attrs.className || [];
  return Array.isArray(value) ? value : typeof value === 'string' ? value.split(/\s+/).filter(Boolean) : [];
};
const wrapTreeChildren = (node) => {
  const children = treeNodes(node);
  if (!children.length) return;
  const first = node.children.findIndex((child) => children.includes(child));
  node.children = node.children.filter((child) => !children.includes(child));
  node.children.splice(first, 0, {
    type: 'containerDirective',
    name: '__ax_tree_row',
    attributes: {},
    children,
    data: {},
  });
};

export default function astroXmindDirectives() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type !== 'containerDirective' || !names.has(node.name)) return;
      const attrs = node.attributes || {};
      const data = node.data || (node.data = {});

      if (node.name === 'tabla-arbol') {
        wrapTreeChildren(node);
        data.hName = 'section';
        data.hProperties = {
          className: ['ax-tabla-arbol', ...classesFrom(attrs)],
          'aria-label': attrs['aria-label'] || attrs.titulo || 'Tabla árbol',
        };
        if (attrs.id) data.hProperties.id = attrs.id;
      } else if (node.name === '__ax_tree_row') {
        const children = treeNodes(node);
        const leaves = children.reduce((total, child) => total + leafCount(child), 0);
        data.hName = 'div';
        data.hProperties = {
          className: ['ax-tree-row'],
          'data-branches': String(children.length),
          style: '--ax-tree-leaves: ' + Math.max(leaves, 1),
        };
      } else if (node.name === 'nodo') {
        wrapTreeChildren(node);
        data.hName = 'div';
        data.hProperties = {
          className: ['ax-directive', 'ax-tree-node', ...classesFrom(attrs)],
          'data-leaves': String(leafCount(node)),
          style: '--ax-tree-span: ' + leafCount(node),
        };
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