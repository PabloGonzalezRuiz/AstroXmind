import { createHash } from 'node:crypto';
import { parse } from 'node-html-parser';
import { resolveDocumentReference, REFERENCE_TARGET_PATTERN } from '../src/lib/navigation/references.mjs';

/** Validate actual rendered destinations, including MDX components and TreeTable cells. */
export function validateRenderedReferences(index, htmlByDocument, { annotate = false } = {}) {
  const pages = new Map();
  for (const id of index.traversal) {
    const html = htmlByDocument.get(id);
    if (typeof html !== 'string') throw new Error(`Referencias: falta HTML de ${id}.`);
    const page = parse(html);
    const ids = new Set();
    for (const element of page.querySelectorAll('[id]')) {
      const target = element.getAttribute('id');
      if (ids.has(target)) throw new Error(`Referencias: ID de destino duplicado ${target} en ${id}.`);
      if (target.startsWith('ref-') && !REFERENCE_TARGET_PATTERN.test(target)) throw new Error(`Referencias: ID de destino inválido ${target} en ${id}.`);
      ids.add(target);
    }
    pages.set(id, { page, ids });
  }
  const references = [];
  for (const [source, {page, ids}] of pages) {
    for (const anchor of page.querySelectorAll('a[href]')) {
      const href = anchor.getAttribute('href');
      if (href.startsWith('doc:')) throw new Error(`Referencias: enlace sin resolver en ${source}; usar Markdown o DocLink para MDX.`);
      const reference = anchor.getAttribute('data-doc-reference');
      if (reference === undefined) continue;
      const resolved = resolveDocumentReference(index, reference);
      if (href !== resolved.href) throw new Error(`Referencias: URL divergente para ${reference} en ${source}.`);
      if (resolved.fragment && !pages.get(resolved.documentId)?.ids.has(resolved.fragment)) throw new Error(`Referencias: destino inexistente ${reference} desde ${source}.`);
      const edge = { source, target: resolved.documentId, fragment: resolved.fragment, href };
      if (annotate) {
        const label = anchor.text.trim().replace(/\s+/g, ' ');
        const block = anchor.closest('p, li, td, th, blockquote, h2, h3, h4, h5, h6');
        const blockContent = block ? parse(block.innerHTML) : null;
        blockContent?.querySelectorAll('.tree-toggle, [aria-hidden="true"]').forEach(element => element.remove());
        const sentence = blockContent?.text ?? label;
        const context = excerpt(sentence, label);
        const key = createHash('sha256').update(JSON.stringify([reference, label, context])).digest('hex').slice(0, 16);
        const base = 'ref-cita-' + key;
        let citation = anchor.id || base;
        for (let suffix = 2; !anchor.id && ids.has(citation); suffix++) citation = base + '-' + suffix;
        anchor.id = citation;
        ids.add(citation);
        Object.assign(edge, { citation, label, context });
      }
      references.push(edge);
    }
  }
  if (annotate) {
    const outgoing = new Map();
    const incoming = new Map();
    for (const edge of references) {
      append(outgoing, edge.source, edge);
      append(incoming, edge.target, edge);
    }
    for (const [id, {page}] of pages) {
      const panel = page.querySelector('[data-reference-relations]');
      if (!panel) throw new Error(`Referencias: falta el panel en ${id}.`);
      const sections = [
        relationList(index, 'Enlaces salientes', outgoing.get(id), false),
        relationList(index, 'Enlaces entrantes', incoming.get(id), true),
      ].join('');
      if (sections) {
        panel.innerHTML = sections;
        panel.removeAttribute('hidden');
      }
      htmlByDocument.set(id, page.toString());
    }
  }
  return { schemaVersion: annotate ? 2 : 1, references };
}

function excerpt(sentence, label) {
  const text = sentence.trim().replace(/\s+/g, ' ');
  if (text.length <= 180) return text;
  const start = Math.max(0, text.indexOf(label) - 50);
  return (start ? '…' : '') + text.slice(start, start + 180) + (start + 180 < text.length ? '…' : '');
}

function append(map, id, edge) {
  if (!map.has(id)) map.set(id, []);
  map.get(id).push(edge);
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);
}

function relationList(index, title, edges, incoming) {
  if (!edges?.length) return '';
  const items = edges.map(edge => {
    const related = index.nodes[incoming ? edge.source : edge.target];
    const href = incoming ? related.url + '#' + encodeURIComponent(edge.citation) : edge.href;
    const label = incoming || !edge.label ? related.title : related.title + ' · ' + edge.label;
    return `<li><a href="${escapeHtml(href)}">${escapeHtml(label)}</a><p>${escapeHtml(edge.context)}</p></li>`;
  }).join('');
  return `<details open><summary>${title} (${edges.length})</summary><ul>${items}</ul></details>`;
}
