import catalog from '../../examples/astro-component-lab/src/catalog/components.json' with { type: 'json' };
import { buildTreeTableRows } from '../../examples/astro-component-lab/src/components/tree-table-model.ts';
import { splitEditorMdx, treeProperties, treeNodeRanges } from './wiki-editor-mdx.mjs';
import { catalogComponentAliases } from './wiki-editor-transform.mjs';

const descriptor = catalog.components['tree-table'];
const properties = descriptor.properties.node;
const fail = reason => ({ ok: false, reason });

function authorizedParts(source, path) {
  const aliases = catalogComponentAliases(source, path);
  return splitEditorMdx(source, path).parts.filter(part => part.tree && !part.unclosed && aliases.includes(part.opening.match(/^<([A-Z][\w$]*)/)?.[1]));
}

export function nodeAt(source, path, start, end, renderMarkdown) {
  if (!path?.endsWith('.mdx')) return null;
  const part = authorizedParts(source, path).find(part => start >= part.bodyStart && end <= part.end);
  if (!part) return null;
  const ranges = treeNodeRanges(part);
  const range = ranges.find(range => start >= range.start && end <= range.end);
  if (!range) return null;
  try {
    const props = treeProperties(part.opening), nodes = new Map();
    buildTreeTableRows(renderMarkdown(part.markdown), props, nodes);
    if (nodes.size !== ranges.length || !nodes.has(range.key)) throw Error('No se puede identificar el nodo inequívocamente.');
    const node = nodes.get(range.key);
    const label = source.slice(range.start, range.end);
    const annotation = label.match(/(?:^|\s)\[([^<>\[\]\r\n]+)\]$/);
    const explicit = Object.entries(node.properties).filter(([, p]) => p.explicit);
    // The renderer is authoritative. Only replace a literal source annotation that matches its declarations exactly.
    let annotationStart = range.end;
    if (explicit.length) {
      if (!annotation) throw Error('La anotación del nodo no se puede editar sin alterar su formato.');
      const entries = annotation[1].split(/[;,]/).map(entry => entry.trim().match(/^([A-Za-z][\w-]*)\s*=\s*([^\s]+)$/));
      if (entries.some(e => !e) || entries.length !== explicit.length || explicit.some(([key,p]) => !entries.some(e => e[1] === key && (key === 'start' ? Number(e[2]) === p.value : e[2] === String(p.value))))) throw Error('No se puede identificar de forma segura la anotación del nodo.');
      annotationStart = range.start + annotation.index;
    }
    return { part, props, node, nodes, ranges, range, annotationStart };
  } catch (error) { return { error: error.message }; }
}

export function planNodeEdit({ source, path, start, end, values, renderMarkdown }) {
  const target = nodeAt(source, path, start, end, renderMarkdown);
  if (!target || target.error) return fail(target?.error ?? 'Selecciona un nodo de TreeTable.');
  try {
    const entries = Object.entries(values);
    if (entries.some(([key,value]) => !Object.hasOwn(properties,key) || typeof value !== 'string' || !/^[\w-]+$/.test(value))) throw Error('Propiedad o valor de nodo no válido.');
    const annotation = entries.length ? ` [${entries.map(([key,value]) => `${key}=${value}`).join('; ')}]` : '';
    const after = source.slice(0,target.annotationStart) + annotation + source.slice(target.range.end);
    const nextEnd = target.annotationStart + annotation.length;
    const updated = nodeAt(after, path, target.range.start, target.range.start, renderMarkdown);
    if (!updated || updated.error) throw Error(updated?.error ?? 'El cambio no produce un nodo válido.');
    const declarations = Object.entries(updated.node.properties).filter(([,p])=>p.explicit);
    if (declarations.length !== entries.length || declarations.some(([key,p])=>!Object.hasOwn(values,key)||(key==='start'?Number(values[key])!==p.value:values[key]!==String(p.value)))) throw Error('La anotación no se interpreta como propiedades del nodo.');
    // Compute all inline IDs from the model, not from textual matches in code or labels.
    if (values.id) {
      let count = 0;
      for (const part of authorizedParts(after,path)) {
        const nodes = new Map(); buildTreeTableRows(renderMarkdown(part.markdown),treeProperties(part.opening),nodes);
        for (const node of nodes.values()) if (node.properties.id.value === values.id) count++;
      }
      if (count > 1) throw Error(`Identificador duplicado en el documento: ${values.id}.`);
    }
    return { ok:true,before:{value:source,start,end},after:{value:after,start:target.range.start,end:nextEnd} };
  } catch (error) { return fail(error.message); }
}

export function renderNodeInspector({ doc, fields, message, target, jump }) {
  const controls = new Map();
  const make = (tag,text) => { const el=doc.createElement(tag); if(text) el.textContent=text; return el; };
  const originText = origin => origin.kind==='node' ? `Nodo: ${target.nodes.get(origin.key)?.label ?? origin.key}` : origin.kind==='component' ? 'Etiqueta de apertura' : origin.kind==='level' ? `Etiqueta, clase del nivel ${origin.level}` : origin.kind==='counter' ? 'Contador de hermanos (no heredado)' : 'Valor predeterminado';
  const headings = make('p', `Nodo: ${target.node.label} · nivel ${target.node.level}`); fields.append(headings);
  for (const [name,property] of Object.entries(properties)) {
    const state=target.node.properties[name], group=make('fieldset'); group.append(make('legend',property.label));
    const enable=make('input'); enable.type='checkbox'; enable.checked=state.explicit; enable.dataset.inspectorExplicit=name;
    const label=make('label'); label.append(enable,' Personalizar'); group.append(label);
    let control;
    if(property.type==='enum') { control=make('select'); for(const value of property.values){const option=make('option',property.valueLabels[value]);option.value=value;control.append(option);} }
    else { control=make('input'); control.type=property.type==='boolean'?'checkbox':property.type==='integer'?'number':'text'; if(property.type==='integer'){control.min=String(property.constraints.minimum);control.step='1';} }
    control.dataset.inspectorValue=name; control.setAttribute('aria-label',property.label);
    const setValue=value=>{ if(property.type==='boolean')control.checked=value===true;else control.value=value==null?'':String(value); };
    const getValue=()=>property.type==='boolean'?String(control.checked):control.value;
    setValue(state.value);
    const valueLabel=make('label'); valueLabel.append(property.type==='boolean'?'Activado ':'Valor ',control);group.append(valueLabel);
    const source=make('small'); const go=make('button','Ir al origen');go.type='button';
    const help=make('small',property.description); group.append(source,go,help);
    let known;
    if(property.type==='css-class') {
      known=make('select');known.setAttribute('aria-label','Clase registrada');const empty=make('option','Elegir clase registrada');empty.value='';known.append(empty);
      for(const entry of [{name:'none',label:'Sin clase'},...descriptor.classes.known]){const option=make('option',entry.label);option.value=entry.name;known.append(option);}
      known.addEventListener('change',()=>{if(known.value) control.value=known.value;});group.append(known);
    }
    const fallback=state.fallback??state;
    const displayValue=value=>typeof value==='boolean'?(value?'Sí':'No'):property.valueLabels?.[value]??String(value);
    const refresh=()=>{const origin=enable.checked?{kind:'node',key:target.node.key}:fallback.origin;source.textContent=`Origen: ${enable.checked?'Declarado en este nodo':originText(origin)}${!enable.checked&&fallback.value!==null?` · ${displayValue(fallback.value)}`:''}`;go.hidden=enable.checked||!['node','component','level'].includes(origin.kind);go.onclick=()=>jump(origin);control.disabled=!enable.checked;if(known)known.disabled=!enable.checked;};
    enable.addEventListener('change',()=>{if(!enable.checked)setValue(fallback.value);else if(name==='start'&&!control.value)control.value='1';refresh();updateRules();});
    control.addEventListener('change',()=>updateRules());controls.set(name,{enable,control,getValue,setValue,refresh,source,state,known});fields.append(group);
    refresh();
  }
  function updateRules(){
    const number=controls.get('numbering');const active=number.getValue()==='arabic';
    for(const key of ['start','tiered']){const c=controls.get(key);if(!active&&c.enable.checked){c.enable.checked=false;c.setValue(c.state.fallback?.value??null);}c.refresh();c.enable.disabled=!active;c.control.disabled=!active||!c.enable.checked;if(!active)c.source.textContent+=' · Requiere numeración activa.';else if(key==='tiered'&&target.props.numbering!=='path')c.source.textContent+=' · La ruta solo se muestra con numbering="path" en la etiqueta.';}
    const fold=controls.get('folded'),collapsible=controls.get('collapsible');fold.refresh();if(!target.node.hasChildren||collapsible.getValue()!=='true')fold.source.textContent+=' · No efectivo en este nodo; puede heredarse.';
    collapsible.refresh();if(!target.node.hasChildren)collapsible.source.textContent+=' · Una hoja no muestra control de plegado.';
  }
  updateRules();
  message.textContent='Personaliza una propiedad para sobrescribirla; desmárcala para restaurar la herencia. Los valores heredados se muestran deshabilitados.';
  return ()=>Object.fromEntries([...controls].filter(([,c])=>c.enable.checked).map(([name,c])=>[name,c.getValue()]));
}
