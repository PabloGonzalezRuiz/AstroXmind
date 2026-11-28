import { parse } from 'node-html-parser';

const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

export function annotateText(text, marks) {
  const ranges = marks.map(entry => {
    let start = -1;
    for (let i = 0; i < (entry.occurrence ?? 1); i++) {
      start = text.indexOf(entry.text, start + 1);
      if (start < 0) throw new Error(`Anotación sin coincidencia: ${entry.text}`);
    }
    return { ...entry, start, end: start + entry.text.length };
  });
  const cuts = [...new Set([0, text.length, ...ranges.flatMap(range => [range.start, range.end])])].sort((a,b) => a-b);
  let html = '';
  for (let i = 0; i < cuts.length - 1; i++) {
    const start = cuts[i], end = cuts[i+1];
    const styles = ranges.filter(range => range.style && range.start <= start && range.end >= end).map(range => `study-${range.style}`);
    const part = escape(text.slice(start, end));
    html += styles.length ? `<span class="${styles.join(' ')}">${part}</span>` : part;
    for (const range of ranges.filter(range => range.note && range.end === end)) {
      html += `<button type="button" class="study-note" data-study-note="${escape(range.note)}" aria-label="Abrir nota manuscrita sobre ${escape(range.text)}" aria-expanded="false" data-reading-ignore><svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 3h14v11H9l-4 4v-4H3z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M6 7h8M6 10h5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg></button>`;
    }
  }
  return html;
}

export function annotateStudyHtml(html, annotations) {
  const root = parse(html);
  const elements = root.querySelectorAll('h2,h3,h4,p,li');
  for (const entry of annotations) {
    const matches = elements.filter(element => element.textContent.startsWith(entry.block));
    if (matches.length !== 1) throw new Error(`Bloque de anotación ambiguo o inexistente: ${entry.block}`);
    const element = matches[0];
    // Este PDF convertido tiene texto plano; no sobreescribir formato ajeno.
    if (element.childNodes.some(child => child.nodeType !== 3)) throw new Error(`Bloque con formato no previsto: ${entry.block}`);
    element.set_content(annotateText(element.textContent, entry.marks));
  }
  return root.toString();
}
