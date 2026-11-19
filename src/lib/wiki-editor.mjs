import { micromark } from 'micromark';
import { installGitHubPageEditor } from './wiki-editor-pat.mjs';
import { gfm, gfmHtml } from 'micromark-extension-gfm';
import { createMdxPreview } from './wiki-editor-mdx.mjs';
import { annotateMarkdown, installEditorSync } from './wiki-editor-sync.mjs';

export function renderEditorMarkdown(markdown) {
  return micromark(markdown, { extensions: [gfm()], htmlExtensions: [gfmHtml()] });
}

export function installWikiEditor(root) {
  const window = root.ownerDocument.defaultView;
  const input = root.querySelector('textarea');
  const preview = root.querySelector('[data-editor-result]');
  const workspace = root.querySelector('[data-editor-workspace]');
  const sourceDialog = root.querySelector('[data-source-dialog]');
  const menu = root.querySelector('[data-page-actions]');
  const status = root.querySelector('[data-editor-status]');
  const download = root.querySelector('[data-editor-download]');
  const buttons = [...root.querySelectorAll('[data-editor-view]')];
  const renderMdx = root.dataset.sourcePath.endsWith('.mdx') ? createMdxPreview(root, input.defaultValue, renderEditorMarkdown) : null;
  const sync = installEditorSync(root, input, preview);
  let timer;
  const render = () => {
    try {
      const body = input.value.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, '');
      if (renderMdx) renderMdx(input.value, preview);
      else {
        preview.innerHTML = renderEditorMarkdown(body);
        annotateMarkdown(preview, body, input.value.length - body.length);
      }
      sync.refresh();
    } catch {
      status.textContent = 'No se ha podido actualizar la vista previa. Tu texto sigue en el editor.';
    }
  };
  function openDialog(dialog) {
    menu.open = false;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }
  function closeDialog(dialog) {
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
    if (dialog === workspace) { window.clearTimeout(timer); preview.replaceChildren(); }
    menu.querySelector('summary').focus();
  }
  const session = installGitHubPageEditor(root, { input, render, onSaved(confirmation, url) {
    const notice = root.querySelector('[data-page-save-status]');
    const link = root.ownerDocument.createElement('a');
    link.href = url;
    link.textContent = 'Ver commit';
    const refresh = root.ownerDocument.createElement('a');
    refresh.href = window.location.pathname;
    refresh.textContent = 'Actualizar página';
    notice.replaceChildren(confirmation + ' ', link, ' · ', refresh);
    notice.hidden = false;
    status.textContent = 'Página guardada.';
    closeDialog(workspace);
  } });
  function canClose() {
    return !session.isBusy() && (!session.isDirty() || window.confirm('Hay cambios sin guardar. ¿Cerrar la edición?'));
  }
  root.querySelector('[data-editor-open]').addEventListener('click', () => {
    openDialog(workspace);
    render();
    input.focus();
    void session.open();
  });
  root.querySelector('[data-editor-close]').addEventListener('click', () => { if (canClose()) closeDialog(workspace); });
  workspace.addEventListener('cancel', event => { if (!canClose()) event.preventDefault(); });
  root.querySelector('[data-editor-source-open]').addEventListener('click', () => {
    sourceDialog.querySelector('[data-editor-source-content]').textContent = input.defaultValue;
    openDialog(sourceDialog);
  });
  root.querySelector('[data-source-close]').addEventListener('click', () => closeDialog(sourceDialog));
  const formats = {
    bold: text => `**${text || 'texto'}**`, italic: text => `*${text || 'texto'}*`,
    heading: text => `## ${text || 'Título'}`, list: text => (text || 'Elemento').split('\n').map(line => `- ${line}`).join('\n'),
    ordered: text => (text || 'Elemento').split('\n').map((line, index) => `${index + 1}. ${line}`).join('\n'),
    code: text => `\`${text || 'código'}\``, link: text => `[${text || 'enlace'}](https://ejemplo.com)`,
  };
  for (const button of root.querySelectorAll('[data-editor-format]')) button.addEventListener('click', () => {
    if (input.readOnly) return;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const replacement = formats[button.dataset.editorFormat](input.value.slice(start, end));
    if (input.value.length - (end - start) + replacement.length > input.maxLength) return;
    input.setRangeText(replacement, start, end, 'select');
    if (root.dataset.activeView === 'result') buttons.find(candidate => candidate.dataset.editorView === 'split').click();
    input.dispatchEvent(new window.Event('input'));
    input.focus();
  });
  download.disabled = false;

  input.addEventListener('input', () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(render, 120);
    status.textContent = session.isDirty() ? 'Cambios sin guardar.' : 'Sin cambios pendientes.';
  });
  download.addEventListener('click', () => {
    const url = window.URL.createObjectURL(new window.Blob([input.value], { type: 'text/markdown;charset=utf-8' }));
    const link = root.ownerDocument.createElement('a');
    link.href = url;
    link.download = root.dataset.sourcePath.split('/').at(-1);
    link.click();
    window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
  });
  for (const button of buttons) button.addEventListener('click', () => {
    root.dataset.activeView = button.dataset.editorView;
    for (const candidate of buttons) candidate.setAttribute('aria-pressed', String(button === candidate));
    if (button.dataset.editorView !== 'edit') render();
  });
}
