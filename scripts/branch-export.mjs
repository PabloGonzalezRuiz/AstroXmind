import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { extname } from 'node:path';
import { parse } from 'node-html-parser';

const mime = new Map([
  ['.png', 'image/png'], ['.jpg', 'image/jpeg'], ['.jpeg', 'image/jpeg'],
  ['.gif', 'image/gif'], ['.svg', 'image/svg+xml'], ['.webp', 'image/webp'],
  ['.avif', 'image/avif'], ['.ico', 'image/x-icon'],
]);
const idReferences = ['aria-labelledby', 'aria-describedby', 'aria-controls', 'headers', 'for'];

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);
}

function readableName(node) {
  return escapeHtml(node.numberLabel ? `${node.numberLabel}. ${node.title}` : node.title);
}

function extractPage(html) {
  const page = parse(html);
  const content = page.querySelector('.sl-markdown-content');
  if (!content) throw new Error('Exportación de rama: falta el contenido de una página.');
  const references = page.querySelector('[data-reference-relations]:not([hidden])');
  const copy = parse(content.innerHTML + (references?.outerHTML ?? ''));
  // The HTML already contains every TreeTable cell. Keep only the visible example panel.
  for (const element of copy.querySelectorAll('script, style, link, iframe, object, embed, audio, video, button, [role="tablist"], [role="tabpanel"][hidden], .tree-fullscreen, .tree-toggle')) {
    element.remove();
  }
  for (const panel of copy.querySelectorAll('[role="tabpanel"]')) {
    panel.removeAttribute('role');
    panel.removeAttribute('aria-labelledby');
    panel.removeAttribute('tabindex');
  }
  for (const details of copy.querySelectorAll('details')) details.setAttribute('open', '');
  return { html: copy.toString(), ids: new Set(copy.querySelectorAll('[id]').map(el => el.id)) };
}

function rewriteImage(image, pageUrl, output, basePath) {
  for (const key of ['srcset', 'sizes', 'loading']) image.removeAttribute(key);
  const src = image.getAttribute('src');
  if (!src || src.startsWith('data:image/')) return;
  const url = new URL(src, pageUrl);
  const relative = url.pathname.startsWith(basePath) ? url.pathname.slice(basePath.length) : '';
  const type = mime.get(extname(relative).toLowerCase());
  if (url.origin === pageUrl.origin && type && relative) {
    const segments = relative.split('/').map(decodeURIComponent);
    if (segments.every(part => part && part !== '.' && part !== '..' && !/[\\/]/.test(part))) {
      const file = new URL(segments.map(encodeURIComponent).join('/'), output);
      if (existsSync(file)) {
        image.setAttribute('src', `data:${type};base64,${readFileSync(file).toString('base64')}`);
        return;
      }
    }
  }
  const label = image.getAttribute('alt') || 'Imagen externa';
  image.replaceWith(
    /^https?:$/.test(url.protocol)
      ? `<a href="${escapeHtml(url.href)}">${escapeHtml(label)} (en línea)</a>`
      : escapeHtml(label),
  );
}

function renderDocument(node, extracted, branch, indexByPath, site, output, basePath) {
  const content = parse(extracted.get(node.id).html);
  const pageUrl = new URL(node.url, site);
  for (const pictureSource of content.querySelectorAll('picture source')) pictureSource.remove();
  for (const el of content.querySelectorAll('*')) {
    for (const key of Object.keys(el.attributes)) {
      if (/^on/i.test(key) || key === 'autofocus') el.removeAttribute(key);
    }
    if (el.id) el.id = `${node.id}--${el.id}`;
    for (const key of idReferences) {
      const value = el.getAttribute(key);
      if (value) el.setAttribute(key, value.split(/\s+/).map(id => `${node.id}--${id}`).join(' '));
    }
  }
  for (const a of content.querySelectorAll('a[href]')) {
    const url = new URL(a.getAttribute('href'), pageUrl);
    if (!['https:', 'http:', 'mailto:', 'tel:'].includes(url.protocol)) {
      a.removeAttribute('href');
      continue;
    }
    const target = url.origin === pageUrl.origin && !url.search ? indexByPath.get(url.pathname) : undefined;
    let hash = url.hash.slice(1);
    try { hash = decodeURIComponent(hash); } catch { /* Keep malformed external fragments literal. */ }
    if (target && branch.has(target) && (!hash || extracted.get(target).ids.has(hash))) {
      a.setAttribute('href', '#' + encodeURIComponent(hash ? `${target}--${hash}` : target));
    } else {
      a.setAttribute('href', url.href);
    }
    a.removeAttribute('target');
  }
  for (const image of content.querySelectorAll('img')) rewriteImage(image, pageUrl, output, basePath);
  return `<article id="${node.id}" data-export-document><h2>${readableName(node)}</h2>${content}</article>`;
}

const style = `
  :root { color: #182334; background: #fff; font: 1rem/1.55 system-ui, sans-serif; }
  body { max-width: 68rem; padding: 0 1.25rem 3rem; margin: 2rem auto; }
  a { color: #204f9c; overflow-wrap: anywhere; }
  :target { scroll-margin-top: 1rem; outline: 2px solid #5178b5; outline-offset: 2px; }
  h1, h2, h3 { line-height: 1.2; }
  article { border-top: 1px solid #bdc6d2; margin-top: 2rem; padding-top: .5rem; }
  pre { white-space: pre-wrap; overflow-wrap: anywhere; padding: .65rem; background: #f1f3f6; }
  img, video { height: auto; max-width: 100%; }
  table { border-collapse: collapse; width: 100%; table-layout: fixed; }
  td, th { border: 1px solid #9ca8b8; padding: .35rem; overflow-wrap: anywhere; }
  th, td:first-child { background: #f1f3f6; }
  .actions { display: flex; flex-wrap: wrap; gap: .75rem 1.25rem; align-items: center; }
  .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
  @media print {
    @page { margin: 14mm; }
    body { margin: 0; padding: 0; max-width: none; font-size: 10pt; }
    .actions, .online-note { display: none; }
    article { break-before: page; }
    h1, h2, h3, h4, summary { break-after: avoid; }
    tr, img { break-inside: avoid; }
    pre { background: none; border: 1px solid #aaa; }
    a { color: inherit; }
    :target { outline: none; }
  }
`;

export function writeBranchExports(index, pages, output, site, base) {
  const directory = new URL('rama/', output);
  mkdirSync(directory, { recursive: true });
  const extracted = new Map(index.traversal.map(id => [id, extractPage(pages.get(id))]));
  const indexByPath = new Map(index.traversal.map(id => [new URL(index.nodes[id].url, site).pathname, id]));
  const basePath = base.replace(/\/$/, '') + '/';
  for (const id of index.traversal) {
    const nodes = index.traversal.filter(candidate => candidate === id || index.nodes[candidate].ancestors.includes(id))
      .map(candidate => index.nodes[candidate]);
    const branch = new Set(nodes.map(node => node.id));
    const title = readableName(nodes[0]);
    const documents = nodes.map(node => renderDocument(node, extracted, branch, indexByPath, site, output, basePath));
    const contents = nodes.map(node => `<li style="margin-inline-start:${node.ancestors.length - nodes[0].ancestors.length}em"><a href="#${node.id}">${readableName(node)}</a></li>`);
    const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} · AstroXmind</title><style>${style}</style></head>
<body data-pagefind-ignore><header><h1>${title}</h1><div class="actions">
<button type="button" onclick="window.print()">Imprimir o guardar como PDF</button>
<a href="" download="AstroXmind-${id}.html">Descargar HTML</a>
<a href="${escapeHtml(new URL(nodes[0].url, site).href)}">Abrir en la wiki</a></div>
<p class="online-note">Los enlaces a documentos de esta rama funcionan sin conexión. Los destinos fuera de la rama se abren en la wiki o en su sitio original.</p>
</header><nav aria-label="Índice de la rama"><h2>Índice de la rama</h2><ol>${contents.join('')}</ol></nav>
<main>${documents.join('\n')}</main></body></html>`;
    writeFileSync(new URL(`${id}.html`, directory), html);
  }
}
