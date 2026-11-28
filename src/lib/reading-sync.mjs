/** Frases reproducibles a partir del HTML; se preserva el formato de cada nodo. */
export function readingSegments(root, decorate = false) {
  /** @type {{text: string, parts: HTMLElement[]}[]} */
  const segments = [];
  const document = root.ownerDocument;
  const title = document.querySelector('h1#_top');
  const blocks = [...(title ? [title] : []), ...root.querySelectorAll('h2,h3,h4,p,li')];
  for (const block of blocks) {
    if (block.closest('details') || block.querySelector('p,li') || block.closest('[data-reading-ignore]')) continue;
    if (/^Página [1-6] de 6$/.test(block.textContent.trim())) continue;
    const walker = document.createTreeWalker(block, 4);
    const nodes = [];
    let text = '';
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.parentElement?.closest('[aria-hidden="true"],[data-reading-ignore],.sr-only')) continue;
      nodes.push({ node, start: text.length, end: text.length + node.data.length });
      text += node.data;
    }
    const cuts = [0];
    if (!/^H[1234]$/.test(block.tagName)) {
      for (const match of text.matchAll(/[.!?…]+[»”"')\]]*(?=\s|$)/g)) cuts.push(match.index + match[0].length);
    }
    if (cuts.at(-1) !== text.length) cuts.push(text.length);
    const ranges = [];
    for (let i = 1; i < cuts.length; i++) {
      let start = cuts[i - 1], end = cuts[i];
      while (start < end && /\s/.test(text[start])) start++;
      while (end > start && /\s/.test(text[end - 1])) end--;
      if (start === end) continue;
      const index = segments.length;
      segments.push({ text: text.slice(start, end).replace(/\s+/g, ' '), parts: [] });
      ranges.push({ start, end, index });
    }
    if (!decorate) continue;
    for (const { node, start, end } of nodes) {
      const fragment = document.createDocumentFragment();
      let cursor = start;
      for (const range of ranges) {
        const left = Math.max(start, range.start), right = Math.min(end, range.end);
        if (left >= right) continue;
        if (left > cursor) fragment.append(document.createTextNode(text.slice(cursor, left)));
        const span = document.createElement('span');
        span.className = 'reading-fragment';
        span.dataset.readingIndex = String(range.index);
        span.textContent = text.slice(left, right);
        segments[range.index].parts.push(span);
        fragment.append(span);
        cursor = right;
      }
      if (cursor < end) fragment.append(document.createTextNode(text.slice(cursor, end)));
      node.replaceWith(fragment);
    }
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
