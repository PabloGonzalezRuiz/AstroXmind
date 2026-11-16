import test from 'node:test';
import assert from 'node:assert/strict';
import astroXmindDirectives from '../scripts/remark-semantic.mjs';

const heading = (depth, value) => ({
  type: 'heading', depth, children: [{ type: 'text', value }],
});
const yaml = (value) => ({ type: 'code', lang: 'yaml', meta: 'xmind', value });
const directive = (...children) => ({
  type: 'containerDirective', name: 'rootTopic', attributes: { className: ['Ley'] }, children,
});
const transform = (root) => {
  astroXmindDirectives()({ type: 'root', children: [root] });
  return root;
};
const tableOf = (root) => root.children[0];
const bodyRows = (root) => tableOf(root).children[1].children;
const cellsOf = (row) => row.children;

test('rootTopic convierte títulos en tabla y respeta rowspan de las ramas', () => {
  const root = transform(directive(
    yaml('structureClass: org.xmind.ui.treetable.toptitle'),
    heading(1, 'Derechos'),
    heading(2, 'Capítulo I'),
    heading(3, 'Artículo 1'),
    heading(3, 'Artículo 2'),
    heading(2, 'Capítulo II'),
    heading(3, 'Artículo 3'),
  ));
  assert.equal(root.data.hName, 'section');
  assert.equal(root.data.hProperties['data-xmind-structure-class'], 'org.xmind.ui.treetable.toptitle');
  assert.ok(root.data.hProperties.className.includes('Ley'));
  assert.equal(tableOf(root).data.hName, 'table');
  const rows = bodyRows(root);
  assert.equal(rows.length, 3);
  assert.equal(cellsOf(rows[0])[0].data.hProperties.rowSpan, 2);
  assert.equal(cellsOf(rows[1]).length, 1);
  assert.equal(cellsOf(rows[2]).length, 2);
  assert.equal(tableOf(root).children[0].children[0].children[0].data.hProperties.colSpan, 2);
});

test('encabezado soporta clase CSS, ancla y propiedades XMind YAML tipadas', () => {
  const root = transform(directive(
    yaml('structureClass: org.xmind.ui.treetable.toptitle\ncustomWidth: 978'),
    heading(1, 'TablaArbol'),
    heading(2, 'Derechos {.rama-principal #derechos}'),
    yaml('style:\n  properties:\n    fo:font-weight: bold\ncustomWidth: 420\nvisible: true'),
    heading(3, 'Artículo 14'),
  ));
  const cell = cellsOf(bodyRows(root)[0])[0];
  assert.equal(cell.data.hProperties.id, 'derechos');
  assert.ok(cell.data.hProperties.className.includes('rama-principal'));
  assert.equal(cell.children[0].children[0].value, 'Derechos');
  assert.deepEqual(JSON.parse(cell.data.hProperties['data-xmind-properties']), {
    style: { properties: { 'fo:font-weight': 'bold' } },
    customWidth: 420, visible: true,
  });
  assert.equal(JSON.parse(root.data.hProperties['data-xmind-properties']).customWidth, 978);
});

test('bloques YAML sucesivos combinan objetos sin borrar propiedades anteriores', () => {
  const root = transform(directive(
    yaml('style:\n  properties:\n    color: blue\n    weight: 400'),
    yaml('style:\n  properties:\n    weight: 700'),
    heading(1, 'Tabla'),
    heading(2, 'Nodo'),
  ));
  assert.deepEqual(JSON.parse(root.data.hProperties['data-xmind-properties']).style, {
    properties: { color: 'blue', weight: 700 },
  });
});

test('YAML inválido o no-objeto se rechaza explícitamente', () => {
  assert.throws(() => transform(directive(yaml('not-an-object'), heading(1, 'Tabla'))), /objeto de propiedades YAML/);
  assert.throws(() => transform(directive(yaml('foo: 1\nfoo: 2'), heading(1, 'Tabla'))));
});

test('tema sin structureClass explícito conserva el valor por defecto', () => {
  const root = transform(directive(heading(1, 'Tabla'), heading(2, 'Nodo')));
  assert.equal(root.data.hProperties['data-xmind-structure-class'], 'org.xmind.ui.treetable.toptitle');
});
