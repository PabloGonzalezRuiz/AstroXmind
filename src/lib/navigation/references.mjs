import { getNode } from './index.mjs';
export const REFERENCE_TARGET_PATTERN = /^ref-[a-z][a-z0-9-]*$/;
export function parseDocumentReference(value) {
  const match = typeof value === 'string' && value.match(/^doc:(doc-[0-9]{6})(?:#(ref-[a-z][a-z0-9-]*))?$/);
  if (!match) throw new Error(`Referencia documental inválida: ${value}. Usar doc:doc-000001 o doc:doc-000001#ref-apartado.`);
  return { documentId: match[1], fragment: match[2] ?? null };
}
export function resolveDocumentReference(index, value) {
  const { documentId, fragment } = parseDocumentReference(value);
  const node = getNode(index, documentId);
  return { documentId, fragment, href: node.url + (fragment ? '#' + fragment : '') };
}
