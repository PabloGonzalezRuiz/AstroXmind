import { parse } from 'node-html-parser';
import { resolveDocumentReference } from './references.mjs';

/** Content Layer can cache Markdown HTML. Resolve identity again at server render time. */
export function resolveRenderedReferences(html, index) {
  const root = parse(html);
  for (const anchor of root.querySelectorAll('a[data-doc-reference]')) {
    const reference = anchor.getAttribute('data-doc-reference');
    anchor.setAttribute('href', resolveDocumentReference(index, reference).href);
  }
  return root.toString();
}
