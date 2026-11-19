import { micromark } from 'micromark';
import { installGitHubPatDraft } from './wiki-editor-pat.mjs';
import { gfm, gfmHtml } from 'micromark-extension-gfm';

export function renderEditorMarkdown(markdown) {
  return micromark(markdown, { extensions: [gfm()], htmlExtensions: [gfmHtml()] });
}

export function installWikiEditor(root) {
  const window = root.ownerDocument.defaultView;
  const input = root.querySelector('textarea');
  const preview = root.querySelector('[data-editor-result]');
  const reader = root.querySelector('[data-editor-reader]');
  const workspace = root.querySelector('[data-editor-workspace]');
  const sourceDialog = root.querySelector('[data-source-dialog]');
  const menu = root.querySelector('[data-page-actions]');
  const status = root.querySelector('[data-editor-status]');
  const save = root.querySelector('[data-editor-save]');
  const download = root.querySelector('[data-editor-download]');
  const buttons = [...root.querySelectorAll('[data-editor-view]')];
  const key = 'astroxmind:wiki-editor:demo:v1';
  let saved = null;
  let timer;

  try {
    saved = window.localStorage.getItem(key);
    if (saved !== null) {
      input.value = saved;
      status.textContent = 'Borrador recuperado en este navegador.';
    }
  } catch {
    status.textContent = 'El navegador no permite guardar borradores. Puedes descargar el Markdown.';
  }
  const render = () => {
    try {
      const html = renderEditorMarkdown(input.value);
      preview.innerHTML = html;
      reader.innerHTML = html;
    } catch {
      status.textContent = 'No se ha podido actualizar la vista previa. Tu texto sigue en el editor.';
    }
  };
  render();
  function openDialog(dialog) {
    menu.open = false;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }
  function closeDialog(dialog) {
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
    menu.querySelector('summary').focus();
  }
  root.querySelector('[data-editor-open]').addEventListener('click', () => {
    openDialog(workspace);
    input.focus();
  });
  root.querySelector('[data-editor-close]').addEventListener('click', () => closeDialog(workspace));
  root.querySelector('[data-editor-source-open]').addEventListener('click', () => {
    sourceDialog.querySelector('[data-editor-source-content]').textContent = input.value;
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
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const replacement = formats[button.dataset.editorFormat](input.value.slice(start, end));
    if (input.value.length - (end - start) + replacement.length > input.maxLength) return;
    input.setRangeText(replacement, start, end, 'select');
    if (root.dataset.activeView === 'result') buttons.find(candidate => candidate.dataset.editorView === 'split').click();
    input.dispatchEvent(new window.Event('input'));
    input.focus();
  });
  for (const button of [save, download]) button.disabled = false;
  installGitHubPatDraft(root, { input, render });

  input.addEventListener('input', () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(render, 120);
    status.textContent = input.value === saved ? 'Borrador guardado en este navegador.' : 'Cambios sin guardar localmente.';
  });
  save.addEventListener('click', () => {
    try {
      if (window.localStorage.getItem(key) !== saved) {
        status.textContent = 'Otra pestaña cambió el borrador. Descarga tu Markdown antes de recargar para conservar tus cambios.';
        return;
      }
      window.localStorage.setItem(key, input.value);
      saved = input.value;
      status.textContent = 'Borrador guardado en este navegador.';
    } catch {
      status.textContent = 'No se pudo guardar en el navegador. Descarga el Markdown para conservarlo.';
    }
  });
  download.addEventListener('click', () => {
    const url = window.URL.createObjectURL(new window.Blob([input.value], { type: 'text/markdown;charset=utf-8' }));
    const link = root.ownerDocument.createElement('a');
    link.href = url;
    link.download = 'borrador-astroxmind.md';
    link.click();
    window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
  });
  for (const button of buttons) button.addEventListener('click', () => {
    root.dataset.activeView = button.dataset.editorView;
    for (const candidate of buttons) candidate.setAttribute('aria-pressed', String(button === candidate));
    if (button.dataset.editorView === 'result') render();
  });
}
