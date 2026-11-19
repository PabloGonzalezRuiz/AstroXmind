import catalog from '../../examples/astro-component-lab/src/catalog/components.json' with { type: 'json' };
import { buildTreeTableRows } from '../../examples/astro-component-lab/src/components/tree-table-model.ts';
import { splitEditorMdx, treeProperties } from './wiki-editor-mdx.mjs';
import { catalogComponentAliases } from './wiki-editor-transform.mjs';
import { nodeAt, planNodeEdit, renderNodeInspector } from './wiki-editor-node-inspector.mjs';

const descriptor = catalog.components['tree-table'];
const properties = descriptor.properties.component;

export function openingAt(source, path, start, end = start) {
  if (!path?.endsWith('.mdx')) return null;
  const aliases = catalogComponentAliases(source, path);
  const part = splitEditorMdx(source, path).parts.find(part => part.tree && !part.unclosed && start >= part.start && end <= part.start + part.opening.trimEnd().length);
  if (!part) return null;
  const name = part.opening.match(/^<([A-Z][\w$]*)/)?.[1];
  if (!aliases.includes(name)) return null;
  try { return { ...part, name, props: treeProperties(part.opening) }; }
  catch (error) { return { ...part, error: error.message }; }
}

export function planOpeningEdit({ source, path, start, end, values, renderMarkdown }) {
  const part = openingAt(source, path, start, end);
  if (!part || part.error) return { ok: false, reason: part?.error ?? 'Selecciona una etiqueta de apertura TreeTable válida.' };
  try {
    const attrs = [];
    for (const [key, value] of Object.entries(values)) {
      if (!Object.hasOwn(properties, key) || typeof value !== 'string' || /["'<>\r\n&{}]/.test(value)) throw Error('Propiedad o valor no válido.');
      attrs.push(`${key}="${value}"`);
    }
    buildTreeTableRows(renderMarkdown(part.markdown), values);
    const opening = `<${part.name}${attrs.length ? ' ' + attrs.join(' ') : ''}>`;
    const after = source.slice(0, part.start) + opening + source.slice(part.start + part.opening.trimEnd().length);
    return { ok: true, before: { value: source, start, end }, after: { value: after, start: part.start, end: part.start + opening.length } };
  } catch (error) { return { ok: false, reason: error.message }; }
}

export function installOpeningInspector(root, input, history, renderMarkdown) {
  const doc = root.ownerDocument;
  const toggle = root.querySelector('[data-inspector-toggle]');
  const panel = root.querySelector('[data-inspector-panel]');
  const fields = panel.querySelector('[data-inspector-fields]');
  const message = panel.querySelector('[data-inspector-message]');
  const apply = panel.querySelector('[data-inspector-apply]');
  const close = panel.querySelector('[data-inspector-close]');
  let snapshot, controls, nodeValues;
  function hide(focus = false) { panel.hidden = true; toggle.setAttribute('aria-expanded', 'false'); if (focus) input.focus(); }
  function element(tag, text) { const el = doc.createElement(tag); if (text) el.textContent = text; return el; }
  function open(focus = false) {
    if (input.readOnly || root.dataset.activeView === 'result') return;
    const source = input.value, start = input.selectionStart, end = input.selectionEnd;
    const part = openingAt(source, root.dataset.sourcePath, start, end);
    const node = !part ? nodeAt(source, root.dataset.sourcePath, start, end, renderMarkdown) : null;
    if (!part && !node && !focus) { hide(); return; }
    snapshot = { source, start, end, path: root.dataset.sourcePath };
    controls = new Map(); nodeValues = null; fields.replaceChildren();
    message.textContent = part?.error ?? node?.error ?? (part ? 'Marca una propiedad para declararla explícitamente. Desmárcala para usar su valor predeterminado.' : 'Sitúa el cursor en la etiqueta de apertura o en un nodo de TreeTable.');
    apply.disabled = (!part && !node) || !!part?.error || !!node?.error;
    if (node && !node.error) nodeValues = renderNodeInspector({ doc, fields, message, target: node, jump(origin) {
      if(input.value !== source || input.readOnly) return;
      const range = origin.kind === 'node' ? node.ranges.find(r=>r.key===origin.key) : {start:node.part.start,end:node.part.start+node.part.opening.length};
      if(!range) return;
      input.focus(); input.setSelectionRange(range.start,range.end); input.scrollTop = input.scrollHeight * range.start / Math.max(1,input.value.length); open(false);
    } });
    if (part && !part.error) for (const [name, property] of Object.entries(properties)) {
      const group = element('fieldset');
      group.append(element('legend', property.label));
      const enabled = element('input'); enabled.type = 'checkbox'; enabled.checked = Object.hasOwn(part.props, name); enabled.dataset.inspectorExplicit = name;
      const label = element('label'); label.append(enabled, ' Declarar explícitamente'); group.append(label);
      const value = String(part.props[name] ?? property.default);
      let control;
      if (property.type === 'boolean') { control = element('input'); control.type = 'checkbox'; control.checked = value === 'true'; }
      else if (property.type === 'enum') {
        control = element('select');
        for (const option of property.values) { const item = element('option', property.valueLabels[option]); item.value = option; control.append(item); }
        if (!property.values.includes(value)) { const item = element('option', `Valor no válido: ${value}`); item.value = value; control.append(item); }
        control.value = value;
      } else { control = element('input'); control.type = 'text'; control.value = value; control.placeholder = '0:ArticuloCabecera; 1:ArticuloPunto'; }
      control.dataset.inspectorValue = name; control.setAttribute('aria-label', property.label); control.disabled = !enabled.checked;
      const valueLabel = element('label'); valueLabel.append(property.type === 'boolean' ? 'Activado ' : 'Valor ', control); group.append(valueLabel);
      const help = element('small', `${property.description} Predeterminado: ${property.type === 'enum' ? property.valueLabels[property.default] : property.default === '' ? 'sin clases' : property.default ? 'sí' : 'no'}.`); group.append(help);
      if (property.type === 'level-class-map') {
        const level = element('input'); level.type = 'number'; level.min = '0'; level.step = '1'; level.value = '0'; level.setAttribute('aria-label', 'Nivel de clase');
        const classes = element('select'); classes.setAttribute('aria-label', 'Clase conocida');
        for (const known of descriptor.classes.known) { const option = element('option', `${known.label} (${known.name})`); option.value = known.name; classes.append(option); }
        const add = element('button', 'Asignar clase al nivel'); add.type = 'button';
        const row = element('div'); row.append(level, classes, add); group.append(row);
        const sync = () => { level.disabled = classes.disabled = add.disabled = !enabled.checked; }; enabled.addEventListener('change', sync); sync();
        add.addEventListener('click', () => {
          if (!/^\d+$/.test(level.value) || !Number.isSafeInteger(Number(level.value))) { message.textContent = 'Indica un nivel entero desde 0.'; return; }
          const key = Number(level.value);
          const entries = control.value.split(/[;,]/).map(entry => entry.trim()).filter(Boolean).filter(entry => Number(entry.split(':')[0]) !== key);
          control.value = [...entries, `${key}:${classes.value}`].join('; ');
        });
      }
      enabled.addEventListener('change', () => { control.disabled = !enabled.checked; });
      controls.set(name, { enabled, control, property }); fields.append(group);
    }
    panel.hidden = false; toggle.setAttribute('aria-expanded', 'true');
    if (focus) (fields.querySelector('input') ?? close).focus();
  }
  toggle.addEventListener('click', () => panel.hidden ? open(true) : hide(true));
  input.addEventListener('click', () => open());
  input.addEventListener('tree-node-selected', () => open());
  input.addEventListener('input', () => hide());
  panel.addEventListener('keydown', event => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); hide(true); } });
  close.addEventListener('click', () => hide(true));
  apply.addEventListener('click', () => {
    if (!snapshot || input.value !== snapshot.source || input.readOnly) { message.textContent = 'La fuente ha cambiado; vuelve a abrir el inspector.'; return; }
    const values = nodeValues ? nodeValues() : {};
    if (!nodeValues) for (const [name, {enabled, control, property}] of controls) if (enabled.checked) values[name] = property.type === 'boolean' ? String(control.checked) : control.value;
    const tx = (nodeValues ? planNodeEdit : planOpeningEdit)({ ...snapshot, values, renderMarkdown });
    if (!tx.ok) { message.textContent = tx.reason; return; }
    if (tx.before.value !== tx.after.value && !history.apply(tx)) { message.textContent = 'No se pudo aplicar el cambio.'; return; }
    hide(true);
  });
  root.querySelector('[data-editor-workspace]').addEventListener('close', () => hide());
  for (const button of root.querySelectorAll('[data-editor-view]')) button.addEventListener('click', () => { hide(); toggle.disabled = button.dataset.editorView === 'result'; });
  doc.addEventListener('pointerdown', event => { if (!panel.contains(event.target) && event.target !== toggle && event.target !== input) hide(); });
}
