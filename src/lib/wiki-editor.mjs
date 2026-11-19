import { micromark } from 'micromark';
import { installGitHubPageEditor } from './wiki-editor-pat.mjs';
import { gfm, gfmHtml } from 'micromark-extension-gfm';
import { createMdxPreview } from './wiki-editor-mdx.mjs';
import { annotateMarkdown, installEditorSync } from './wiki-editor-sync.mjs';
import { installEditorKeys } from './wiki-editor-keys.mjs';
import { installEditorContext } from './wiki-editor-context.mjs';
import { createComponentTransactionHistory } from './wiki-editor-transform.mjs';
import { installOpeningInspector } from './wiki-editor-inspector.mjs';
import { waitForPublication } from './wiki-editor-publication.mjs';

export function renderEditorMarkdown(markdown) {
  return micromark(markdown, { extensions: [gfm()], htmlExtensions: [gfmHtml()] });
}

// Starlight isolates the main pane in its own stacking context; a fixed menu
// cannot receive pointer events beneath the separate right-hand TOC.
export function positionPageActions(menu) {
  const window = menu.ownerDocument.defaultView;
  const main = menu.closest('main');
  if (!main) return;
  const update = () => {
    const rect = main.getBoundingClientRect();
    if (rect.width > 0) {
      const viewport = menu.ownerDocument.documentElement.clientWidth || window.innerWidth;
      menu.style.setProperty('--editor-actions-right', `${Math.max(16, viewport - rect.right + 16)}px`);
    }
  };
  update();
  window.addEventListener('resize', update);
  if (window.ResizeObserver) new window.ResizeObserver(update).observe(main);
}

export function installWikiEditor(root) {
  const practice = root.hasAttribute('data-practice-editor');
  const window = root.ownerDocument.defaultView;
  const input = root.querySelector('textarea');
  const preview = root.querySelector('[data-editor-result]');
  const workspace = root.querySelector('[data-editor-workspace]');
  const sourceDialog = root.querySelector('[data-source-dialog]');
  const menu = root.querySelector('[data-page-actions]');
  if (menu) positionPageActions(menu);
  const status = root.querySelector('[data-editor-status]');
  const download = root.querySelector('[data-editor-download]');
  const buttons = [...root.querySelectorAll('[data-editor-view]')];
  let renderMdx = root.dataset.sourcePath.endsWith('.mdx') ? createMdxPreview(root, input.defaultValue, renderEditorMarkdown) : null;
  const sync = installEditorSync(root, input, preview);
  installEditorKeys(input);
  const componentHistory = createComponentTransactionHistory(input);
  installEditorContext(root, input, componentHistory);
  installOpeningInspector(root, input, componentHistory, renderEditorMarkdown);
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
  let publication;
  const session = practice ? { isDirty: () => input.value !== input.defaultValue, isBusy: () => false } : installGitHubPageEditor(root, { input, render, onSaved(confirmation, url, source, commit) {
    const notice = root.querySelector('[data-page-save-status]');
    const link = root.ownerDocument.createElement('a');
    link.href = url;
    link.textContent = 'Ver commit';
    const refresh = root.ownerDocument.createElement('a');
    const revisionUrl = new URL(window.location.href);
    revisionUrl.searchParams.set('_astroxmind_revision', commit);
    refresh.href = revisionUrl.href;
    refresh.textContent = 'Actualizar página';
    const state = root.ownerDocument.createElement('span');
    state.textContent = 'Publicando cambios… La página se actualizará automáticamente cuando estén disponibles.';
    notice.replaceChildren(confirmation + ' ', state, ' ', link, ' · ', refresh);
    notice.hidden = false;
    status.textContent = 'Página guardada.';
    closeDialog(workspace);
    publication?.abort();
    const controller = new window.AbortController();
    publication = controller;
    void waitForPublication(window, { path: root.dataset.sourcePath, source, commit, signal: controller.signal }).then(published => {
      if (controller.signal.aborted) return;
      if (published && !workspace.hasAttribute('open') && !session.isDirty()) {
        state.textContent = 'Cambios publicados. Actualizando página…';
        window.location.replace(revisionUrl.href);
      } else {
        state.textContent = 'El commit está guardado, pero aún no se ha confirmado su publicación. Puedes actualizar manualmente o consultar GitHub Actions.';
        const actions = root.ownerDocument.createElement('a');
        actions.href = 'https://github.com/PabloGonzalezRuiz/AstroXmind/actions';
        actions.textContent = 'Ver publicación';
        notice.append(' · ', actions);
      }
    });
    window.addEventListener('pagehide', () => controller.abort(), { once: true });
  } });
  function canClose() {
    return !session.isBusy() && (!session.isDirty() || window.confirm('Hay cambios sin guardar. ¿Cerrar la edición?'));
  }
  root.querySelector('[data-editor-open]')?.addEventListener('click', () => {
    if (publication && !publication.signal.aborted) {
      publication.abort();
      const notice = root.querySelector('[data-page-save-status] span');
      if (notice) notice.textContent = 'Comprobación de publicación pausada al volver a editar. Puedes actualizar manualmente.';
    }
    openDialog(workspace);
    render();
    input.focus();
    void session.open();
  });
  root.querySelector('[data-editor-close]')?.addEventListener('click', () => { if (canClose()) closeDialog(workspace); });
  workspace.addEventListener('cancel', event => { if (!canClose()) event.preventDefault(); });
  root.querySelector('[data-editor-source-open]')?.addEventListener('click', () => {
    sourceDialog.querySelector('[data-editor-source-content]').textContent = input.defaultValue;
    openDialog(sourceDialog);
  });
  root.querySelector('[data-source-close]')?.addEventListener('click', () => closeDialog(sourceDialog));
  if (practice) {
    root.querySelector('[data-practice-reset]').addEventListener('click', () => {
      input.value = input.defaultValue;
      input.setSelectionRange(0,0);
      componentHistory.clear();
      renderMdx = root.dataset.sourcePath.endsWith('.mdx') ? createMdxPreview(root,input.defaultValue,renderEditorMarkdown) : null;
      input.dispatchEvent(new window.Event('input'));
      window.clearTimeout(timer); render();
      status.textContent = 'Ejemplo restablecido.';
      input.focus();
    });
    render();
  }
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
    status.textContent = practice ? (session.isDirty() ? 'Práctica modificada; no afecta al ejemplo.' : 'Copia del ejemplo original.') : session.isDirty() ? 'Cambios sin guardar.' : 'Sin cambios pendientes.';
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
