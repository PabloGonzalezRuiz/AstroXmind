const citationSelector = 'a[data-doc-reference], [data-reference-relations] a[href]';
const headings = 'h1, h2, h3, h4, h5, h6';

function cleanText(element) {
  const copy = element.cloneNode(true);
  copy.querySelectorAll('button, script, style, [aria-hidden="true"]').forEach(part => part.remove());
  return copy.textContent.replace(/\s+/g, ' ').trim();
}

function extractPreview(document, hash) {
  const content = document.querySelector('.sl-markdown-content');
  if (!content) throw new Error('Missing document content');
  const title = document.querySelector('main h1')?.textContent.trim() || document.title;
  const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
  if (hash && !target) throw new Error('Missing preview anchor');
  let heading = title;
  let blocks = [];

  if (target?.matches(headings)) {
    heading = cleanText(target) || title;
    const block = target.closest('.sl-heading-wrapper') ?? target;
    for (let next = block.nextElementSibling; next && blocks.length < 4; next = next.nextElementSibling) {
      if (next.matches(headings) || next.querySelector(headings)) break;
      const text = cleanText(next);
      if (text) blocks.push(text);
    }
  } else if (target) {
    blocks = [cleanText(target.closest('td, th, p, li, blockquote') ?? target)];
  } else {
    blocks = [...content.querySelectorAll('p')].slice(0, 4).map(cleanText);
  }

  let remaining = 750;
  const excerpt = [];
  for (const block of blocks.filter(Boolean)) {
    if (remaining <= 0) break;
    excerpt.push(block.length > remaining ? block.slice(0, remaining).trimEnd() + '…' : block);
    remaining -= block.length;
  }
  return { heading, title, excerpt };
}

export function installReferencePreview(document) {
  const dialog = document.querySelector('[data-reference-preview]');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const window = document.defaultView;
  const title = dialog.querySelector('h2');
  const content = dialog.querySelector('[data-preview-content]');
  const status = dialog.querySelector('[data-preview-status]');
  const open = dialog.querySelector('[data-preview-open]');
  const base = dialog.dataset.previewBase.replace(/\/$/, '') + '/';
  const sources = new WeakMap();
  const decorated = new WeakSet();
  let opener;
  let source;
  let request;

  const decorate = () => {
    for (const anchor of document.querySelectorAll(citationSelector)) {
      if (decorated.has(anchor) || anchor.target || anchor.hasAttribute('download')) continue;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || !url.pathname.startsWith(base)) continue;
      decorated.add(anchor);
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = 'Vista previa';
      button.setAttribute('data-preview-trigger', '');
      button.setAttribute('aria-haspopup', 'dialog');
      button.setAttribute('aria-label', 'Vista previa: ' + (anchor.textContent.trim() || 'referencia'));
      sources.set(button, anchor);
      anchor.after(button);
    }
  };
  decorate();
  // TreeTable physically detaches folded rows. Decorate newly revealed links as well.
  new window.MutationObserver(decorate).observe(document.body, { subtree: true, childList: true });

  dialog.querySelector('[data-preview-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    if (dialog.open) return;
    request?.abort();
    opener?.focus({ preventScroll: true });
  });

  open.addEventListener('click', event => {
    if (!source || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    dialog.close();
    // Follow the original link so the reading-return feature records the original citation.
    source.click();
  });

  document.addEventListener('click', async event => {
    const button = event.target.closest?.('[data-preview-trigger]');
    const anchor = sources.get(button);
    if (!anchor || dialog.open) return;
    opener = button;
    source = anchor;
    open.href = anchor.href;
    title.textContent = 'Vista previa';
    content.replaceChildren();
    status.textContent = 'Cargando vista previa…';
    dialog.showModal();
    request?.abort();
    const current = new window.AbortController();
    request = current;

    try {
      const url = new URL(anchor.href);
      const hash = url.hash;
      url.hash = '';
      const response = await window.fetch(url, { signal: current.signal, mode: 'same-origin', redirect: 'error' });
      if (!response.ok) throw new Error('Preview unavailable');
      const html = await response.text();
      if (current.signal.aborted || !dialog.open) return;
      const preview = extractPreview(new window.DOMParser().parseFromString(html, 'text/html'), hash);
      title.textContent = preview.heading;
      for (const text of preview.heading === preview.title ? preview.excerpt : [preview.title, ...preview.excerpt]) {
        if (!text) continue;
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        content.append(paragraph);
      }
      status.textContent = preview.excerpt.length ? '' : 'Este destino no tiene un extracto de texto.';
    } catch {
      if (!current.signal.aborted && dialog.open) status.textContent = 'Vista previa no disponible. Puedes abrir el documento completo.';
    }
  });
}
