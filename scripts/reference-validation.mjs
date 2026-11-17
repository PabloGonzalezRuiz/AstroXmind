import { parse } from 'node-html-parser';
import { resolveDocumentReference, REFERENCE_TARGET_PATTERN } from '../src/lib/navigation/references.mjs';

/** Validate actual rendered destinations, including MDX components and TreeTable cells. */
export function validateRenderedReferences(index, htmlByDocument) {
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
  for (const [source, {page}] of pages) {
    for (const anchor of page.querySelectorAll('a[href]')) {
      const href = anchor.getAttribute('href');
      if (href.startsWith('doc:')) throw new Error(`Referencias: enlace sin resolver en ${source}; usar Markdown o DocLink para MDX.`);
      const reference = anchor.getAttribute('data-doc-reference');
      if (reference === undefined) continue;
      const resolved = resolveDocumentReference(index, reference);
      if (href !== resolved.href) throw new Error(`Referencias: URL divergente para ${reference} en ${source}.`);
      if (resolved.fragment && !pages.get(resolved.documentId)?.ids.has(resolved.fragment)) throw new Error(`Referencias: destino inexistente ${reference} desde ${source}.`);
      references.push({ source, target: resolved.documentId, fragment: resolved.fragment, href });
    }
  }
  return { schemaVersion: 1, references };
}
