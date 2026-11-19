import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { mdxFromMarkdown } from 'mdast-util-mdx';
import { gfm } from 'micromark-extension-gfm';
import { mdxjs } from 'micromark-extension-mdxjs';
import { micromark } from 'micromark';
import { gfmHtml } from 'micromark-extension-gfm';
import catalog from '../../examples/astro-component-lab/src/catalog/components.json' with { type: 'json' };
import { buildTreeTableRows } from '../../examples/astro-component-lab/src/components/tree-table-model.ts';

// Repository-relative POSIX paths, independent of the browser or OS.
function normalizePath(path) {
  const parts = [];
  for (const part of path.split('/')) {
    if (!part || part === '.') continue;
    if (part === '..') { if (!parts.length) return null; parts.pop(); }
    else parts.push(part);
  }
  return parts.join('/');
}
function resolveImport(file, specifier) {
  if (!specifier.startsWith('./') && !specifier.startsWith('../')) return null;
  return normalizePath(file.split('/').slice(0, -1).join('/') + '/' + specifier);
}
export function relativeComponentImport(file, target) {
  const from = file.split('/').slice(0, -1);
  const to = target.split('/');
  while (from.length && to.length && from[0] === to[0]) { from.shift(); to.shift(); }
  const relative = [...from.map(() => '..'), ...to].join('/');
  return relative.startsWith('../') ? relative : './' + relative;
}

function documentAst(source) {
  const frontmatter = source.match(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/)?.[0].length ?? 0;
  if (source.startsWith('---\n') || source.startsWith('---\r\n')) {
    if (!frontmatter) throw Error('El bloque YAML inicial no está cerrado.');
  }
  const tree = fromMarkdown(source.slice(frontmatter), { extensions: [gfm(), mdxjs()], mdastExtensions: [gfmFromMarkdown(), mdxFromMarkdown()] });
  return { tree, frontmatter };
}

function walk(node, callback) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { for (const item of node) walk(item, callback); return; }
  callback(node);
  for (const [key, value] of Object.entries(node)) if (!['position', 'loc', 'range'].includes(key)) walk(value, callback);
}

function importInfo(tree, path, descriptor) {
  const used = new Set();
  const matching = [];
  let targetAlreadyImported = false;
  walk(tree, node => {
    if (node.type === 'Identifier') used.add(node.name);
    if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') used.add(node.name?.split('.')[0]);
    if (node.type !== 'ImportDeclaration' || resolveImport(path, node.source.value) !== descriptor.import.path) return;
    targetAlreadyImported = true;
    for (const specifier of node.specifiers) {
      if (specifier.type === 'ImportDefaultSpecifier' || (specifier.type === 'ImportSpecifier' && specifier.imported.name === 'default')) matching.push(specifier.local.name);
    }
  });
  return { used, matching, targetAlreadyImported };
}

// The preview uses this only for known catalog components; never executes imports.
export function catalogComponentAliases(source, path, componentId = 'tree-table') {
  const descriptor = catalog.components[componentId];
  if (!descriptor || !path) return [];
  try { return importInfo(documentAst(source).tree, path, descriptor).matching; }
  catch { return []; }
}

const fail = reason => ({ ok: false, reason });

/** Plan an atomic edit. Source and selections use UTF-16 offsets (textarea-compatible). */
export function planComponentTransformation({ source, start, end, path, componentId = 'tree-table' }) {
  const descriptor = catalog.components[componentId];
  if (!descriptor || descriptor.content.kind !== 'markdown-list') return fail('Componente no disponible para esta selección.');
  if (typeof path !== 'string' || !/^src\/content\/docs\/(?:[A-Za-z0-9_.-]+\/)*[A-Za-z0-9_.-]+\.mdx$/.test(path) || normalizePath(path) !== path) return fail('La creación de componentes requiere un documento MDX. No se renombra el archivo automáticamente.');
  if (typeof source !== 'string' || !Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end > source.length || start >= end) return fail('Selecciona una lista Markdown completa.');
  let parsed;
  try { parsed = documentAst(source); } catch { return fail('El MDX contiene sintaxis incompleta; corrígela antes de transformar.'); }
  const { tree, frontmatter } = parsed;
  if (start < frontmatter) return fail('No se puede transformar el YAML inicial.');
  const candidates = tree.children.filter(node => node.type === 'list' && start <= frontmatter + node.position.start.offset && end >= frontmatter + node.position.end.offset);
  if (candidates.length !== descriptor.content.rootCount) return fail('Selecciona una sola lista completa, no un fragmento ni una lista dentro de otro componente.');
  const list = candidates[0];
  const listStart = frontmatter + list.position.start.offset;
  const listEnd = frontmatter + list.position.end.offset;
  if (source.slice(start, listStart).trim() || source.slice(listEnd, end).trim()) return fail('La selección incluye texto ajeno a la lista.');
  let containsMdx = false;
  walk(list, node => { if (typeof node.type === 'string' && node.type.startsWith('mdx')) containsMdx = true; });
  if (containsMdx && !descriptor.content.allowNestedComponents) return fail('La lista contiene MDX no compatible con la tabla.');
  const lineStart = listStart === 0 ? 0 : source.lastIndexOf('\n', listStart - 1) + 1;
  const followingLine = source.indexOf('\n', listEnd);
  const lineEnd = followingLine < 0 ? source.length : followingLine - (source[followingLine - 1] === '\r' ? 1 : 0);
  const content = source.slice(lineStart, lineEnd);
  try { buildTreeTableRows(micromark(content, { extensions: [gfm()], htmlExtensions: [gfmHtml()] })); }
  catch (error) { return fail(error.message); }
  const { matching, used, targetAlreadyImported } = importInfo(tree, path, descriptor);
  if (targetAlreadyImported && !matching.length) return fail('El componente ya está importado sin una referencia por defecto; revisa ese import antes de transformar.');
  if (matching.length && !matching.some(name => /^[A-Z][\w$]*$/.test(name))) return fail('El componente está importado con un alias no utilizable como etiqueta MDX.');
  let name = matching.find(name => /^[A-Z][\w$]*$/.test(name)) ?? descriptor.name;
  if (!matching.length) for (let i = 2; used.has(name); i++) name = descriptor.name + i;
  const nl = source.includes('\r\n') ? '\r\n' : '\n';
  const before = source.slice(0, lineStart);
  const after = source.slice(lineEnd);
  const leading = before && !before.endsWith(nl + nl) ? nl : '';
  const trailing = after && !after.startsWith(nl + nl) ? nl : '';
  const opening = descriptor.syntax.opening.replace(descriptor.name, name);
  const closing = descriptor.syntax.closing.replace(descriptor.name, name);
  const replacement = leading + opening + nl + nl + content + nl + nl + closing + trailing;
  let transformed = before + replacement + after;
  let selectionStart = lineStart + leading.length + opening.length + nl.length * 2;
  if (!matching.length) {
    // Insert at the start of the MDX body, never inside or ahead of frontmatter.
    const separator = frontmatter && !source.slice(0, frontmatter).endsWith(nl) ? nl : '';
    const declaration = separator + `import ${name} from "${relativeComponentImport(path, descriptor.import.path)}";` + nl + nl;
    transformed = transformed.slice(0, frontmatter) + declaration + transformed.slice(frontmatter);
    selectionStart += declaration.length;
  }
  // Parsing the proposed document is a non-executing syntax check before committing an edit.
  try { documentAst(transformed); } catch { return fail('La transformación no produce un MDX válido.'); }
  return { ok: true, componentId, name, addedImport: !matching.length,
    before: { value: source, start, end }, after: { value: transformed, start: selectionStart, end: selectionStart + content.length } };
}

/** A transaction changes the entire affected document once; undo/redo cannot overwrite newer edits. */
export function applyComponentTransaction(input, transaction, undo = false) {
  if (!transaction?.ok || input.readOnly) return false;
  const expected = undo ? transaction.after : transaction.before;
  const desired = undo ? transaction.before : transaction.after;
  if (input.value !== expected.value || (input.maxLength >= 0 && desired.value.length > input.maxLength)) return false;
  input.setRangeText(desired.value, 0, input.value.length, 'preserve');
  input.setSelectionRange(desired.start, desired.end);
  input.dispatchEvent(new input.ownerDocument.defaultView.Event('input', { bubbles: true }));
  return true;
}

/** Reusable adapter for CTX-03; one Ctrl/⌘+Z removes the wrapper and its import. */
export function createComponentTransactionHistory(input) {
  const past = [], future = [];
  const undo = () => {
    const transaction = past.at(-1);
    if (!applyComponentTransaction(input, transaction, true)) return false;
    future.push(past.pop());
    return true;
  };
  const redo = () => {
    const transaction = future.at(-1);
    if (!applyComponentTransaction(input, transaction)) return false;
    past.push(future.pop());
    return true;
  };
  const keydown = event => {
    if (event.isComposing || event.altKey || !(event.ctrlKey || event.metaKey)) return;
    const key = event.key.toLowerCase();
    if (key !== 'z' && key !== 'y') return;
    if ((key === 'y' || event.shiftKey ? redo : undo)()) event.preventDefault();
  };
  input.addEventListener('keydown', keydown);
  return {
    apply(transaction) {
      if (!applyComponentTransaction(input, transaction)) return false;
      past.push(transaction); future.length = 0;
      if (past.length > 20) past.shift();
      return true;
    },
    undo, redo,
    dispose() { input.removeEventListener('keydown', keydown); past.length = 0; future.length = 0; },
  };
}
