import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { gfm } from 'micromark-extension-gfm';

const rangeSelector = '[data-source-start][data-source-end]';
export function markSourceRange(element, start, end) {
  element.dataset.sourceStart = String(start);
  element.dataset.sourceEnd = String(end);
}

const tags = {
  paragraph: ['P'], heading: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'], code: ['PRE'],
  list: ['UL', 'OL'], listItem: ['LI'], blockquote: ['BLOCKQUOTE'], thematicBreak: ['HR'],
  table: ['TABLE'], tableRow: ['TR'], tableCell: ['TH', 'TD'],
};

// Use the same Markdown grammar as the renderer. Match block elements in order,
// rather than searching for their text (which can be repeated or contain markup).
export function annotateMarkdown(fragment, markdown, offset = 0) {
  const tree = fromMarkdown(markdown, { extensions: [gfm()], mdastExtensions: [gfmFromMarkdown()] });
  function walk(nodes, elements) {
    let index = 0;
    for (const node of nodes) {
      if (!tags[node.type]) continue;
      const element = elements[index];
      if (!element || !tags[node.type].includes(element.tagName)) continue;
      index++;
      const { start, end } = node.position;
      markSourceRange(element, offset + start.offset, offset + end.offset);
      if (node.type === 'table') walk(node.children, [...element.querySelectorAll(':scope > thead > tr, :scope > tbody > tr')]);
      else if (node.type === 'list' || node.type === 'listItem' || node.type === 'blockquote' || node.type === 'tableRow') {
        walk(node.children, [...element.children]);
      }
    }
  }
  walk(tree.children, [...fragment.children]);
}

export function interpolateScroll(anchors, position) {
  if (!anchors.length) return 0;
  for (let i = 1; i < anchors.length; i++) {
    const [x, y] = anchors[i];
    if (position <= x) {
      const [prevX, prevY] = anchors[i - 1];
      return x === prevX ? y : prevY + (y - prevY) * Math.max(0, (position - prevX) / (x - prevX));
    }
  }
  return anchors.at(-1)[1];
}

// A layout mirror measures wrapped source lines using the textarea's actual
// typography and width. No source text is interpreted as HTML.
function sourceGeometry(input) {
  const doc = input.ownerDocument;
  const win = doc.defaultView;
  const style = win.getComputedStyle(input);
  const mirror = doc.createElement('div');
  mirror.setAttribute('aria-hidden', 'true');
  for (const key of ['fontFamily', 'fontSize', 'fontStyle', 'fontWeight', 'fontVariant', 'letterSpacing', 'lineHeight', 'wordSpacing', 'tabSize', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'textIndent', 'direction']) mirror.style[key] = style[key];
  Object.assign(mirror.style, { position: 'fixed', top: '0', left: '-10000px', visibility: 'hidden', pointerEvents: 'none', boxSizing: 'border-box', width: `${input.clientWidth}px`, whiteSpace: 'pre-wrap', overflowWrap: 'break-word', border: '0', margin: '0' });
  const text = doc.createTextNode(input.value + '\n');
  mirror.append(text);
  input.parentElement.append(mirror);
  const range = doc.createRange();
  const top = mirror.getBoundingClientRect().top;
  const lineHeight = Number.parseFloat(style.lineHeight) || (Number.parseFloat(style.fontSize) || 16) * 1.5;
  return {
    at(offset) {
      range.setStart(text, Math.min(offset, text.length - 1));
      range.collapse(true);
      const rect = range.getBoundingClientRect?.();
      return rect ? rect.top - top : input.value.slice(0, offset).split('\n').length * lineHeight - lineHeight;
    },
    dispose() { mirror.remove(); },
  };
}

export function installEditorSync(root, input, preview) {
  const button = root.querySelector('[data-editor-sync]');
  const win = root.ownerDocument.defaultView;
  let mappedValue = '';
  let active = null;
  let scheduled = false;
  let pending = null;
  const expected = new WeakMap();
  const enabled = () => button.getAttribute('aria-pressed') === 'true' && root.dataset.activeView === 'split' && mappedValue === input.value;
  const ranges = () => [...preview.querySelectorAll(rangeSelector)];
  const start = el => Number(el.dataset.sourceStart);
  const end = el => Number(el.dataset.sourceEnd);
  function highlight(element) {
    active?.classList.remove('editor-source-highlight');
    active = element;
    active?.classList.add('editor-source-highlight');
  }
  function scroll(element, top) {
    const max = Math.max(0, element.scrollHeight - element.clientHeight);
    const value = Math.max(0, Math.min(max, top));
    if (Math.abs(element.scrollTop - value) < 1) return;
    element.scrollTop = value;
    expected.set(element, element.scrollTop);
  }
  const previewTop = element => element.getBoundingClientRect().top - preview.getBoundingClientRect().top + preview.scrollTop;
  function cursor() {
    if (!enabled()) return;
    const position = input.selectionStart;
    const match = ranges().filter(el => start(el) <= position && position <= end(el)).sort((a, b) => end(a) - start(a) - (end(b) - start(b)) || start(b) - start(a))[0];
    highlight(match ?? null);
    if (match) {
      const y = previewTop(match);
      if (y < preview.scrollTop || y > preview.scrollTop + preview.clientHeight - 32) scroll(preview, y - 16);
    }
  }
  function syncScroll(from) {
    const previous = expected.get(from);
    expected.delete(from);
    if (previous !== undefined && Math.abs(previous - from.scrollTop) <= 1) return;
    if (!enabled()) return;
    pending = from;
    if (scheduled) return;
    scheduled = true;
    const frame = win.requestAnimationFrame ? win.requestAnimationFrame.bind(win) : fn => win.setTimeout(fn, 0);
    frame(() => {
      scheduled = false;
      const source = pending;
      pending = null;
      if (!enabled() || !source) return;
      const geometry = sourceGeometry(input);
      try {
        const xMax = Math.max(0, input.scrollHeight - input.clientHeight);
        const yMax = Math.max(0, preview.scrollHeight - preview.clientHeight);
        const anchors = [[0, 0]];
        for (const el of preview.children) {
          if (!el.matches(rangeSelector)) continue;
          const x = Math.min(xMax, geometry.at(start(el)));
          const y = Math.min(yMax, previewTop(el));
          const [lastX, lastY] = anchors.at(-1);
          if (x > lastX && y > lastY && x < xMax && y < yMax) anchors.push([x, y]);
        }
        anchors.push([xMax, yMax]);
        if (source === input) scroll(preview, interpolateScroll(anchors, input.scrollTop));
        else scroll(input, interpolateScroll(anchors.map(([x, y]) => [y, x]), preview.scrollTop));
      } finally { geometry.dispose(); }
    });
  }
  button.addEventListener('click', () => {
    const on = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(on));
    if (on) cursor(); else highlight(null);
  });
  preview.addEventListener('click', event => {
    if (!enabled() || event.target.closest('a, button, input, select, textarea, [role="tab"]') || win.getSelection()?.toString()) return;
    const element = event.target.closest(rangeSelector);
    if (!element || !preview.contains(element)) return;
    input.focus({ preventScroll: true });
    input.setSelectionRange(start(element), end(element));
    const geometry = sourceGeometry(input);
    try { scroll(input, geometry.at(start(element)) - 16); } finally { geometry.dispose(); }
    highlight(element);
    if (element.matches('td[data-tree-key]')) input.dispatchEvent(new win.Event('tree-node-selected'));
  });
  for (const event of ['click', 'keyup', 'select']) input.addEventListener(event, cursor);
  input.addEventListener('scroll', () => syncScroll(input));
  preview.addEventListener('scroll', () => syncScroll(preview));
  return { refresh() { mappedValue = input.value; cursor(); } };
}
