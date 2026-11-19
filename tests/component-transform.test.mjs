import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { planComponentTransformation, relativeComponentImport, applyComponentTransaction, createComponentTransactionHistory } from '../src/lib/wiki-editor-transform.mjs';
import { splitEditorMdx } from '../src/lib/wiki-editor-mdx.mjs';

const path = 'src/content/docs/editar-prueba.mdx';
const target = 'examples/astro-component-lab/src/components/TreeTable.astro';
const importPath = '../../../' + target;
const header = '---\ntitle: Prueba\nnavigation:\n  id: doc-000011\n---\n';
const list = '- Padre\n  - Hijo\n    - Nieto\n- Otro';
const select = (source, text = list, file = path) => {
  const start = source.indexOf(text);
  assert.notEqual(start, -1);
  return planComponentTransformation({ source, start, end: start + text.length, path: file });
};

test('wraps a complete list and inserts a single relative catalog import after YAML', () => {
  const source = header + '\n## Lista\n\n' + list + '\n\nTexto final.\n';
  const tx = select(source);
  assert.equal(tx.ok, true, tx.reason);
  assert.equal(tx.addedImport, true);
  assert.ok(tx.after.value.startsWith(header));
  assert.ok(tx.after.value.includes(`import TreeTable from "${importPath}";`));
  assert.ok(tx.after.value.includes(`<TreeTable>\n\n${list}\n\n</TreeTable>`));
  assert.ok(tx.after.value.endsWith('\n\nTexto final.\n'));
  assert.equal(tx.after.value.slice(tx.after.start, tx.after.end), list);
  assert.equal(tx.before.value, source);
  assert.equal(relativeComponentImport('src/content/docs/componentes/test.mdx', target), '../../../../' + target);
});

test('reuses existing default imports and aliases without duplicate imports', () => {
  for (const declaration of [`import Arbol from '${importPath}';`, `import { default as Arbol } from '${importPath}';`, `import Arbol from '${importPath.replace('/src/', '/src/./')}';`]) {
    const source = header + '\n' + declaration + '\n\n' + list;
    const tx = select(source);
    assert.equal(tx.ok, true, tx.reason);
    assert.equal(tx.addedImport, false);
    assert.equal(tx.name, 'Arbol');
    assert.equal(tx.after.value.match(/import\s/g).length, 1);
    assert.ok(tx.after.value.includes('<Arbol>\n\n' + list + '\n\n</Arbol>'));
    assert.equal(splitEditorMdx(tx.after.value, path).parts.filter(part => part.tree).length, 1);
  }
});

test('a name collision or raw import is not mistaken for the component', () => {
  const source = header + `\nimport TreeTable from './Other.astro';\nimport TreeTableSource from '${importPath}?raw';\n\n` + list;
  const tx = select(source);
  assert.equal(tx.ok, true, tx.reason);
  assert.equal(tx.name, 'TreeTable2');
  assert.ok(tx.after.value.includes(`import TreeTable2 from "${importPath}";`));
  assert.ok(tx.after.value.includes("import TreeTable from './Other.astro';"));
  assert.equal(splitEditorMdx(tx.after.value, path).parts.filter(part => part.tree).length, 1);
  assert.match(select(header + `\nimport * as Tree from '${importPath}';\n\n` + list).reason, /ya está importado/);
});

test('rejects partial lists, mixed selections, nested components and fenced examples', () => {
  const source = header + '\nTexto\n\n' + list;
  for (const text of ['- Padre', '  - Hijo\n    - Nieto', 'Texto\n\n' + list, '- Otro']) assert.equal(select(source, text).ok, false, text);
  assert.equal(select(header + '\n<TreeTable>\n\n' + list + '\n\n</TreeTable>').ok, false);
  assert.equal(select(header + '\n```md\n' + list + '\n```').ok, false);
  assert.equal(select(header + '\n> ' + list.replaceAll('\n', '\n> '), '> - Padre').ok, false);
  assert.equal(select(source, list, 'src/content/docs/pruebas-jerarquia/articulo-1.md').ok, false);
  assert.equal(select(source, list, 'src/content/docs/../unsafe.mdx').ok, false);
});

test('rejects invalid annotation, unsupported inline MDX, and incomplete unrelated MDX', () => {
  const invalid = '- Raíz [start=3]';
  assert.match(select(header + '\n' + invalid, invalid).reason, /numeración activa/);
  const expression = '- Raíz {1 + 2}';
  assert.equal(select(header + '\n' + expression, expression).ok, false);
  assert.equal(select(header + '\n' + list + '\n\n<Broken>').ok, false);
});

test('ordered lists, surrounding whitespace, and CRLF preserve exact content', () => {
  const ordered = '1. Padre\r\n   - Hijo\r\n2. Otro  ';
  const source = header.replaceAll('\n', '\r\n') + '\r\n' + ordered + '\r\n\r\n## Final\r\n';
  const tx = select(source, ordered);
  assert.equal(tx.ok, true, tx.reason);
  assert.equal(tx.after.value.slice(tx.after.start, tx.after.end), ordered);
  assert.ok(!tx.after.value.replaceAll('\r\n', '').includes('\n'));
  assert.ok(tx.after.value.endsWith('\r\n\r\n## Final\r\n'));
});

test('transaction applies, undoes and redoes wrapper and import with one input event each', () => {
  const source = header + '\n' + list;
  const tx = select(source);
  const dom = new JSDOM('<textarea maxlength="120000"></textarea>');
  try {
    const input = dom.window.document.querySelector('textarea');
    input.value = source;
    input.setSelectionRange(tx.before.start, tx.before.end);
    let updates = 0;
    input.addEventListener('input', () => updates++);
    const history = createComponentTransactionHistory(input);
    assert.equal(history.apply(tx), true);
    assert.equal(input.value, tx.after.value);
    assert.equal(updates, 1);
    const key = (shiftKey = false) => input.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'z', ctrlKey: true, shiftKey, cancelable: true, bubbles: true }));
    assert.equal(key(), false);
    assert.equal(input.value, source);
    assert.equal(input.selectionStart, tx.before.start);
    assert.equal(updates, 2);
    assert.equal(key(true), false);
    assert.equal(input.value, tx.after.value);
    assert.equal(updates, 3);
    input.value += '\nNuevo texto';
    assert.equal(key(), true);
    assert.equal(applyComponentTransaction(input, tx, true), false);
    assert.ok(input.value.endsWith('Nuevo texto'));
    history.dispose();
  } finally { dom.window.close(); }
});

test('real wiki source transforms without replacing previously imported examples', () => {
  const file = 'src/content/docs/clases-astro.mdx';
  const original = readFileSync(new URL('../' + file, import.meta.url), 'utf8');
  const source = original + '\n\n' + list + '\n';
  const tx = select(source, list, file);
  assert.equal(tx.ok, true, tx.reason);
  const before = splitEditorMdx(original, file);
  const after = splitEditorMdx(tx.after.value, file);
  assert.deepEqual(after.parts.filter(part => part.block).map(part => part.block), before.parts.filter(part => part.block).map(part => part.block));
  assert.ok(before.imports.every(item => after.imports.includes(item)));
});
