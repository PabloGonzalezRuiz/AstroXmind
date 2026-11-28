/** Extrae el texto de un rango sin controles, notas ni etiquetas de página. */
export function studyRangeText(root, range) {
  const document = root.ownerDocument;
  const walker = document.createTreeWalker(root, 4);
  const chunks = [];
  let previousBlock = null;
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const parent = node.parentElement;
    if (!parent || parent.closest('[data-reading-ignore],[aria-hidden="true"],.sr-only,details,button,script,style') || !range.intersectsNode(node)) continue;
    const block = parent.closest('p,li,h1,h2,h3,h4,h5,h6,td,th,blockquote') || parent;
    if (/^Página \d+ de \d+$/.test(block.textContent.trim())) continue;
    const start = node === range.startContainer ? range.startOffset : 0;
    const end = node === range.endContainer ? range.endOffset : node.length;
    if (end <= start) continue;
    if (previousBlock && previousBlock !== block) chunks.push('\n');
    chunks.push(node.data.slice(start, end));
    previousBlock = block;
  }
  return chunks.join('').trim();
}
