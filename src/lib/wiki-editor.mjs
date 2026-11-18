import { installGitHubDraft } from './wiki-editor-remote.mjs';
import { micromark } from 'micromark';
import { gfm, gfmHtml } from 'micromark-extension-gfm';

export function renderEditorMarkdown(markdown) {
  return micromark(markdown, { extensions: [gfm()], htmlExtensions: [gfmHtml()] });
}

export function installWikiEditor(root) {
  const window = root.ownerDocument.defaultView;
  const input = root.querySelector('textarea');
  const preview = root.querySelector('[data-editor-result]');
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
      preview.innerHTML = renderEditorMarkdown(input.value);
    } catch {
      status.textContent = 'No se ha podido actualizar la vista previa. Tu texto sigue en el editor.';
    }
  };
  render();
  for (const button of [save, download]) button.disabled = false;

  input.addEventListener('input', () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(render, 120);
    status.textContent = input.value === saved ? 'Borrador guardado en este navegador.' : 'Cambios sin guardar.';
  });
  const saveLocal = () => {
    try {
      if (window.localStorage.getItem(key) !== saved) {
        status.textContent = 'Otra pestaña cambió el borrador. Descarga tu Markdown antes de recargar para conservar tus cambios.';
        return false;
      }
      window.localStorage.setItem(key, input.value);
      saved = input.value;
      status.textContent = 'Borrador guardado en este navegador.';
      return true;
    } catch {
      status.textContent = 'No se pudo guardar en el navegador. Descarga el Markdown para conservarlo.';
      return false;
    }
  };
  save.addEventListener('click', saveLocal);
  installGitHubDraft(root, { input, status, render, saveLocal });
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
