const indent = '  ';
const listMarker = /^( *)([-+*]|\d{1,9}[.)])([ \t]+)(.*)$/;

// Return a single replacement and the final selection, without altering other lines.
export function editIndentation(value, start, end, key, shift = false) {
  const lineStart = start === 0 ? 0 : value.lastIndexOf('\n', start - 1) + 1;
  const lineEnd = value.indexOf('\n', start);
  const line = value.slice(lineStart, lineEnd < 0 ? value.length : lineEnd);
  if (key === 'Enter') {
    if (start !== end) return null;
    const match = line.match(listMarker);
    if (!match || start < lineStart + match[1].length + match[2].length + match[3].length) return null;
    // Enter on an empty item ends the list, like a conventional Markdown editor.
    if (!match[4].trim()) return { from: lineStart, to: lineStart + line.length, text: '', start: lineStart, end: lineStart };
    const marker = /^\d/.test(match[2]) ? String(Number.parseInt(match[2], 10) + 1) + match[2].at(-1) : match[2];
    const checkbox = /^\[[ xX]\]\s/.test(match[4]) ? '[ ] ' : '';
    const text = '\n' + match[1] + marker + ' ' + checkbox;
    return { from: start, to: end, text, start: start + text.length, end: start + text.length };
  }
  if (key !== 'Tab') return null;
  const selection = start !== end;
  if (!shift && !selection && !listMarker.test(line) && start > lineStart + (line.match(/^ */)?.[0].length ?? 0)) {
    return { from: start, to: end, text: indent, start: start + indent.length, end: start + indent.length };
  }
  // A selection ending exactly at the start of another line excludes that line.
  const last = selection && value[end - 1] === '\n' ? end - 1 : end;
  const nextNewline = value.indexOf('\n', last);
  const to = nextNewline < 0 ? value.length : nextNewline;
  const lines = value.slice(lineStart, to).split('\n');
  let firstDelta = 0, totalDelta = 0;
  const text = lines.map((part, index) => {
    const removal = shift ? Math.min(indent.length, part.match(/^ */)[0].length) : 0;
    const delta = shift ? -removal : indent.length;
    if (!index) firstDelta = delta;
    totalDelta += delta;
    return shift ? part.slice(removal) : indent + part;
  }).join('\n');
  const newStart = Math.max(lineStart, start + firstDelta);
  const newEnd = selection ? Math.max(newStart, end + totalDelta) : newStart;
  return { from: lineStart, to, text, start: newStart, end: newEnd };
}

export function installEditorKeys(input) {
  let navigateNextTab = false;
  input.addEventListener('blur', () => { navigateNextTab = false; });
  input.addEventListener('keydown', event => {
    if (event.isComposing || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'Escape' && !input.readOnly) {
      event.preventDefault();
      event.stopPropagation();
      navigateNextTab = true;
      return;
    }
    if (event.key === 'Tab' && navigateNextTab) { navigateNextTab = false; return; }
    navigateNextTab = false;
    if (input.readOnly || (event.key === 'Enter' && event.shiftKey)) return;
    const edit = editIndentation(input.value, input.selectionStart, input.selectionEnd, event.key, event.shiftKey);
    if (!edit) return;
    event.preventDefault();
    if (input.maxLength >= 0 && input.value.length - (edit.to - edit.from) + edit.text.length > input.maxLength) return;
    if (input.value.slice(edit.from, edit.to) === edit.text) return;
    const direction = input.selectionDirection;
    input.setRangeText(edit.text, edit.from, edit.to, 'preserve');
    input.setSelectionRange(edit.start, edit.end, direction);
    input.dispatchEvent(new input.ownerDocument.defaultView.Event('input', { bubbles: true }));
  });
}
