import { loadNavigation } from './navigation-content.mjs';
import { resolveDocumentReference } from '../src/lib/navigation/references.mjs';

/** Transform actual Markdown links only; fenced/raw example code is never interpreted. */
export default function remarkDocumentReferences(options) {
  return tree => {
    let index;
    const definitions = new Map();
    const visit = (node, fn) => { fn(node); for (const child of node.children ?? []) visit(child, fn); };
    visit(tree, node => { if (node.type === 'definition') definitions.set(node.identifier.toLowerCase(), node); });
    visit(tree, node => {
      if (node.type === 'linkReference') {
        const definition = definitions.get(node.identifier.toLowerCase());
        if (!definition?.url?.startsWith('doc:')) return;
        node.type = 'link'; node.url = definition.url; node.title = definition.title;
        delete node.identifier; delete node.label; delete node.referenceType;
      }
      if (node.type !== 'link' || !node.url?.startsWith('doc:')) return;
      index ??= loadNavigation(options.root, options);
      const reference = node.url;
      node.url = resolveDocumentReference(index, reference).href;
      node.data ??= {};
      node.data.hProperties = { ...node.data.hProperties, 'data-doc-reference': reference };
    });
  };
}
