import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { test } from 'node:test';
import Ajv from 'ajv';
import catalog from '../examples/astro-component-lab/src/catalog/components.json' with { type: 'json' };
import schema from '../examples/astro-component-lab/src/catalog/components.schema.json' with { type: 'json' };
import { buildTreeTableRows } from '../examples/astro-component-lab/src/components/tree-table-model.ts';

const root = new URL('../', import.meta.url);
const tree = catalog.components['tree-table'];
const read = path => readFileSync(new URL(path, root), 'utf8');
const rows = (html, props) => buildTreeTableRows(html, props).flat();
const single = label => `<ul><li>${label}</li></ul>`;

test('catalog validates against versioned schema and rejects malformed descriptors', () => {
  const validate = new Ajv({ allErrors: true, allowUnionTypes: true }).compile(schema);
  assert.equal(validate(catalog), true, JSON.stringify(validate.errors));
  const invalid = structuredClone(catalog);
  delete invalid.components['tree-table'].properties.node.start.label;
  assert.equal(validate(invalid), false);
  invalid.schemaVersion = 2;
  assert.equal(validate(invalid), false);
});

test('catalog import, stylesheet, enum defaults and all rule references are consistent', () => {
  for (const component of Object.values(catalog.components)) {
    assert.ok(existsSync(new URL(component.import.path, root)));
    const allProperties = new Map(Object.entries(component.properties).flatMap(([scope, properties]) => Object.entries(properties).map(([key, value]) => [`${scope}.${key}`, value])));
    for (const descriptor of allProperties.values()) {
      if (descriptor.type === 'enum') {
        assert.ok(descriptor.values.includes(descriptor.default));
        assert.deepEqual(Object.keys(descriptor.valueLabels).sort(), [...descriptor.values].sort());
      }
      if (descriptor.constraints?.pattern) assert.doesNotThrow(() => new RegExp(descriptor.constraints.pattern));
    }
    assert.equal(new Set(component.rules.map(rule => rule.id)).size, component.rules.length);
    for (const rule of component.rules) {
      assert.ok(allProperties.has(rule.target), rule.target);
      const condition = allProperties.get(rule.condition.property);
      assert.ok(condition || rule.condition.property === 'node.hasChildren', rule.condition.property);
      if (condition?.type === 'enum') assert.ok(condition.values.includes(rule.condition.equals));
      if (condition?.type === 'boolean' || rule.condition.property === 'node.hasChildren') assert.equal(typeof rule.condition.equals, 'boolean');
    }
    for (const style of component.classes.known) assert.ok(read(style.stylesheet).includes(`td.${style.name}`));
  }
  assert.equal(tree.classes.allowCustom, true);
  assert.equal(tree.content.indentSpaces, 2);
});

test('TreeTable component properties match actual defaults and accepted values', () => {
  assert.deepEqual(Object.keys(tree.properties.component).sort(), ['collapsible', 'folded', 'levelClasses', 'numbering']);
  const html = '<ul><li>Raíz [numbering=arabic; tiered=true]<ul><li>Hijo</li></ul></li></ul>';
  assert.equal(rows(html)[0].numberLabel, undefined);
  assert.equal(rows(html)[0].collapsible, false);
  assert.equal(rows(html)[0].folded, false);
  for (const mode of tree.properties.component.numbering.values) assert.doesNotThrow(() => rows(html, { numbering: mode }));
  assert.equal(rows(html, { numbering: 'siblings' })[1].numberLabel, '1.');
  assert.equal(rows(html, { numbering: 'path' })[1].numberLabel, '1.1.');
  assert.throws(() => rows(html, { numbering: 'bad' }), /numbering/);
  for (const key of ['collapsible', 'folded']) assert.throws(() => rows(html, { [key]: 'bad' }), new RegExp(key));
  assert.throws(() => rows(html, { levelClasses: '1:A;1:B' }), /duplicado/);
  assert.throws(() => rows('<p>no es una lista</p>'), /exactamente una lista/);
});

test('node numbering dependencies, inheritance, cut and counter agree with the catalog', () => {
  assert.deepEqual(Object.keys(tree.properties.node).sort(), ['class', 'collapsible', 'folded', 'id', 'numbering', 'start', 'tiered']);
  assert.equal(tree.properties.node.start.inheritance, 'none');
  for (const annotation of ['start=2', 'tiered=true', 'tiered=false', 'numbering=none; start=2']) assert.throws(() => rows(single(`Raíz [${annotation}]`)), /requieren numeración activa/);
  for (const start of ['0', '-1', '1.5', '9007199254740992']) assert.throws(() => rows(single(`Raíz [numbering=arabic; start=${start}]`)), /entero mayor/);
  const html = '<ul><li>A [numbering=arabic; tiered=true; start=3]<ul><li>B [start=5]<ul><li>C</li></ul></li><li>D</li><li>Sin [numbering=none]<ul><li>Reactivar [numbering=arabic]</li></ul></li></ul></li></ul>';
  const cells = rows(html, { numbering: 'path' });
  const value = label => cells.find(cell => cell.labelHtml === label).numberLabel;
  assert.equal(value('A'), '3.');
  assert.equal(value('B'), '3.5.');
  assert.equal(value('C'), '3.5.1.');
  assert.equal(value('D'), '3.6.');
  assert.equal(value('Sin'), undefined);
  assert.equal(value('Reactivar'), '1.');
});

test('folded is inherited but only effective for collapsible branches, and classes follow precedence', () => {
  const html = '<ul><li>A [class=Custom]<ul><li>B [collapsible=false]<ul><li>C [collapsible=true]<ul><li>D</li></ul></li></ul></li><li>E [class=none]</li></ul></li></ul>';
  const cells = rows(html, { collapsible: true, folded: true, levelClasses: '1:ArticuloCabecera' });
  const cell = label => cells.find(item => item.labelHtml === label);
  assert.equal(cell('A').folded, true);
  assert.equal(cell('B').folded, false);
  assert.equal(cell('C').folded, true);
  assert.equal(cell('D').folded, false);
  assert.equal(cell('A').resolvedClass, 'Custom');
  assert.equal(cell('B').resolvedClass, 'ArticuloCabecera');
  assert.equal(cell('C').resolvedClass, 'ArticuloCabecera');
  assert.equal(cell('E').resolvedClass, 'none');
  assert.throws(() => rows(single('A [class=invalid!]')), /nombre CSS/);
});

test('reference IDs are local, validated and not inherited', () => {
  assert.equal(tree.properties.node.id.inheritance, 'none');
  const cells = rows('<ul><li>A [id=ref-a]<ul><li>B</li></ul></li></ul>');
  assert.equal(cells[0].referenceId, 'ref-a');
  assert.equal(cells[1].referenceId, undefined);
  assert.throws(() => rows(single('A [id=bad]')), /ref-nombre/);
  assert.throws(() => rows('<ul><li>A [id=ref-a]</li><li>B [id=ref-a]</li></ul>'), /id duplicado/);
});
