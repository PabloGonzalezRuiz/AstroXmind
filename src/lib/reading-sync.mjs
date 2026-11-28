/** Extrae exclusivamente el texto marcado, en orden y sin duplicar marcas superpuestas. */
export function readingSegments(root, decorate = false) {
  const segments = [];
  const document = root.ownerDocument;
  const title = document.querySelector('h1#_top');
  const blocks = [...(title ? [title] : []), ...root.querySelectorAll('h2,h3,h4,p,li')];
  for (const block of blocks) {
    if (block.closest('details,[data-reading-ignore]') || block.querySelector('p,li')) continue;
    const walker = document.createTreeWalker(block, 4);
    let pending = null;
    let gap = '';
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const parent = node.parentElement;
      if (parent?.closest('[aria-hidden="true"],[data-reading-ignore],.sr-only')) continue;
      const marked = parent?.closest('.study-pink,.study-purple,.study-pen,.study-circle');
      if (!marked) {
        if (pending) {
          if (/^[\s\p{P}]*$/u.test(node.data)) gap += node.data;
          else { pending = null; gap = ''; }
        }
        continue;
      }
      if (!node.data.trim()) { if (pending) gap += node.data; continue; }
      if (!pending) { pending = { text: '', parts: [] }; segments.push(pending); }
      pending.text += gap + node.data;
      gap = '';
      if (decorate) pending.parts.push(node);
    }
  }
  for (const segment of segments) {
    segment.text = segment.text.replace(/\s+/g, ' ').trim();
    if (decorate) segment.parts = segment.parts.map(node => {
      const span = document.createElement('span');
      span.className = 'reading-fragment';
      span.textContent = node.data;
      node.replaceWith(span);
      return span;
    });
  }
  return segments;
}

export function readingIndexAt(cues, time) {
  let low = 0, high = cues.length;
  while (low < high) {
    const mid = (low + high) >>> 1;
    if (cues[mid].start <= time) low = mid + 1;
    else high = mid;
  }
  return Math.max(0, low - 1);
}
