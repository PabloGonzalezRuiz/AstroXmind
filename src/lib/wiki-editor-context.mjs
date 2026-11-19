import catalog from '../../examples/astro-component-lab/src/catalog/components.json' with { type: 'json' };
import { createComponentTransactionHistory, planComponentTransformation } from './wiki-editor-transform.mjs';

export function installEditorContext(root, input) {
  const doc = root.ownerDocument;
  const container = root.querySelector('[data-editor-create]');
  const toggle = container.querySelector('[data-create-toggle]');
  const panel = container.querySelector('[data-create-panel]');
  const options = container.querySelector('[data-create-options]');
  const closeButton = container.querySelector('[data-create-close]');
  const history = createComponentTransactionHistory(input);
  const refresh = () => { toggle.dataset.selection = String(input.selectionStart !== input.selectionEnd); };
  function close(focus = false) {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    if (focus) input.focus();
  }
  function open() {
    if (root.dataset.activeView === 'result') return;
    const snapshot = { source: input.value, start: input.selectionStart, end: input.selectionEnd, path: root.dataset.sourcePath };
    options.replaceChildren();
    for (const [componentId, descriptor] of Object.entries(catalog.components)) {
      let plan = input.readOnly ? { ok: false, reason: 'Espera a que termine la operación actual.' } : planComponentTransformation({ ...snapshot, componentId });
      if (plan.ok && input.maxLength >= 0 && plan.after.value.length > input.maxLength) plan = { ok: false, reason: 'El documento superaría el tamaño máximo del editor.' };
      const button = doc.createElement('button');
      button.type = 'button';
      button.textContent = descriptor.label;
      button.dataset.createComponent = componentId;
      button.disabled = !plan.ok;
      const description = doc.createElement('p');
      description.textContent = plan.ok ? descriptor.description : plan.reason;
      button.addEventListener('click', () => {
        if (input.value !== snapshot.source || input.selectionStart !== snapshot.start || input.selectionEnd !== snapshot.end || !history.apply(plan)) {
          open();
          return;
        }
        close(true);
      });
      options.append(button, description);
    }
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    (options.querySelector('button:not(:disabled)') ?? closeButton).focus();
  }
  toggle.addEventListener('click', () => panel.hidden ? open() : close(true));
  closeButton.addEventListener('click', () => close(true));
  container.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) { event.preventDefault(); event.stopPropagation(); close(true); }
  });
  input.addEventListener('contextmenu', event => {
    if (input.selectionStart !== input.selectionEnd) { event.preventDefault(); open(); }
  });
  input.addEventListener('keydown', event => {
    if (event.key === 'ContextMenu' || (event.key === 'F10' && event.shiftKey)) { event.preventDefault(); open(); }
  });
  for (const event of ['select', 'keyup', 'pointerup']) input.addEventListener(event, refresh);
  input.addEventListener('input', () => { close(); refresh(); });
  doc.addEventListener('pointerdown', event => { if (!container.contains(event.target)) close(); });
  root.querySelector('[data-editor-workspace]').addEventListener('close', () => close());
  for (const button of root.querySelectorAll('[data-editor-view]')) button.addEventListener('click', () => {
    close(); toggle.disabled = button.dataset.editorView === 'result';
  });
  refresh();
}
