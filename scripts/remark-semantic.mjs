import { visit } from 'unist-util-visit';

const names = new Set(['definicion','articulo','nota','advertencia','ejemplo','pregunta','tema','capitulo','seccion','plegable','referencia','cita','regla','resumen','concepto']);
export default function astroXmindDirectives() {
  return (tree) => {
    visit(tree, (node) => {
      if (!['containerDirective','leafDirective','textDirective'].includes(node.type) || !names.has(node.name)) return;
      const attrs = node.attributes || {};
      const classes = ['ax-directive', 'ax-' + node.name, ...(attrs.className || '').split(/\s+/).filter(Boolean)];
      const data = node.data || (node.data = {});
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
    });
  };
}
