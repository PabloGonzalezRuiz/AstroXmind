import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';
import { installWikiEditor, renderEditorMarkdown, positionPageActions } from '../src/lib/wiki-editor.mjs';
import { createMdxPreview, splitEditorMdx } from '../src/lib/wiki-editor-mdx.mjs';
import { annotateMarkdown, interpolateScroll } from '../src/lib/wiki-editor-sync.mjs';
import { editIndentation, installEditorKeys } from '../src/lib/wiki-editor-keys.mjs';
import { planComponentTransformation } from '../src/lib/wiki-editor-transform.mjs';
import { openingAt, planOpeningEdit } from '../src/lib/wiki-editor-inspector.mjs';
import { nodeAt, planNodeEdit } from '../src/lib/wiki-editor-node-inspector.mjs';
import { matchesPublishedSource, waitForPublication } from '../src/lib/wiki-editor-publication.mjs';
import { installGitHubSettings } from '../src/lib/github-settings.mjs';
import { tokenKey } from '../src/lib/github-connection.mjs';
import { validatePageSource } from '../src/lib/wiki-editor-pat.mjs';

const fakeToken = 'github_pat_' + 'test_only';
const sha = 'a'.repeat(40);
const commit = 'b'.repeat(40);
const settle = () => new Promise(resolve => setTimeout(resolve, 0));
const renderPage = path => readFileSync(new URL(`../dist/${path}/index.html`, import.meta.url), 'utf8');

test('floating document actions stay inside the main pane when sidebar width changes', () => {
  const dom = new JSDOM(renderPage('editar-prueba'));
  const {window}=dom;
  try {
    const menu=window.document.querySelector('[data-page-actions]');
    const main=menu.closest('main');
    Object.defineProperty(window,'innerWidth',{value:1360,configurable:true});
    let right=1030;
    main.getBoundingClientRect=()=>({width:730,right});
    positionPageActions(menu);
    assert.equal(menu.style.getPropertyValue('--editor-actions-right'),'346px');
    right=1360;window.dispatchEvent(new window.Event('resize'));
    assert.equal(menu.style.getPropertyValue('--editor-actions-right'),'16px');
  } finally {window.close();}
});

test('learning examples are read-only and independent practice copies reset without GitHub', async () => {
  const dom=new JSDOM(renderPage('componentes/tree-table'),{url:'https://example.test/AstroXmind/componentes/tree-table/'});
  const {window}=dom;
  try {
    const reference=window.document.querySelector('.sl-markdown-content [data-example-file="base.mdx"]');
    const practice=reference.nextElementSibling.querySelector('[data-practice-editor]');
    assert.ok(practice);assert.equal(reference.querySelector('textarea'),null);
    assert.equal(practice.querySelector('[data-pat-save]'),null);
    const preserved=reference.innerHTML;let calls=0;window.fetch=async()=>{calls++;throw Error('Unexpected fetch');};
    const input=practice.querySelector('textarea'),original=input.value;
    installWikiEditor(practice);
    assert.ok(practice.querySelector('[data-editor-result] table'));
    input.value=input.value.replace('TablaArbol','Mi práctica');input.dispatchEvent(new window.Event('input'));
    await new Promise(resolve=>setTimeout(resolve,180));assert.match(practice.querySelector('[data-editor-result]').textContent,/Mi práctica/);
    practice.querySelector('[data-practice-reset]').click();assert.equal(input.value,original);assert.match(practice.querySelector('[data-editor-result]').textContent,/TablaArbol/);
    const picker=practice.querySelector('[data-practice-select]');
    assert.equal(picker.value,'tree-table/base');assert.equal(picker.options.length,10);
    assert.equal(picker.querySelector('optgroup').label,'Tablas / TreeTable');
    const change=key=>{picker.value=key;picker.dispatchEvent(new window.Event('change'));};
    change('tree-table/plegado');assert.equal(practice.dataset.sourcePath,'src/examples/tree-table/plegado.mdx');
    const selected=input.value;assert.notEqual(selected,original);assert.ok(practice.querySelector('[data-editor-result] table'));
    input.value+='\nPrueba';input.dispatchEvent(new window.Event('input'));
    window.confirm=()=>false;change('tree-table/base');assert.equal(picker.value,'tree-table/plegado');assert.match(input.value,/Prueba$/);
    practice.querySelector('[data-practice-reset]').click();assert.equal(input.value,selected);
    input.value+='\nOtro cambio';window.confirm=()=>true;change('tree-table/base');assert.equal(input.value,original);
    assert.equal(reference.innerHTML,preserved);assert.equal(calls,0);
    const ids=[...window.document.querySelectorAll('[data-practice-editor] textarea')].map(el=>el.id);assert.equal(ids.length,new Set(ids).size);
  } finally {window.close();}
});

test('node numbering automatically enables hidden table presentation in one transaction', async () => {
  const dom = new JSDOM(renderPage('editar-prueba'), {url:'https://example.test/AstroXmind/editar-prueba/'});
  const {window}=dom;
  try {
    const root=window.document.querySelector('[data-wiki-editor]'), input=root.querySelector('textarea'), path=root.dataset.sourcePath;
    const source='---\ntitle: Prueba\nnavigation:\n  id: doc-000011\n---\nimport TT from "../../../examples/astro-component-lab/src/components/TreeTable.astro";\n\n<TT collapsible="true">\n\n- Raíz\n  - Hijo\n\n</TT>\n';
    const plan=(text,values)=>{const start=text.indexOf('Raíz');return planNodeEdit({source:text,path,start,end:start,values,renderMarkdown:renderEditorMarkdown});};
    for(const text of [source,source.replace('<TT collapsible','<TT numbering=\'none\' collapsible')]) {
      const tx=plan(text,{numbering:'arabic',start:'2'});assert.ok(tx.ok,tx.reason);
      assert.match(tx.after.value,/<TT[^>]*numbering=["']path["']/);
      assert.match(tx.after.value,/- Raíz \[numbering=arabic; start=2\]\n  - Hijo/);
      assert.match(tx.after.value.slice(tx.after.start,tx.after.end),/Raíz \[numbering=arabic; start=2\]/);
    }
    assert.match(plan(source.replace('<TT collapsible','<TT numbering="siblings" collapsible'),{numbering:'arabic'}).after.value,/numbering="siblings"/);
    assert.match(plan(source,{class:'ArticuloCabecera'}).after.value,/<TT collapsible="true">/);
    input.defaultValue=source;input.value=source;installWikiEditor(root);root.querySelector('[data-editor-open]').click();await settle();
    const at=source.indexOf('Raíz');input.setSelectionRange(at,at);input.dispatchEvent(new window.MouseEvent('click',{bubbles:true}));
    const panel=root.querySelector('[data-inspector-panel]');panel.querySelector('[data-inspector-explicit="numbering"]').click();
    const numbering=panel.querySelector('[data-inspector-value="numbering"]');numbering.value='arabic';numbering.dispatchEvent(new window.Event('change',{bubbles:true}));
    panel.querySelector('[data-inspector-apply]').click();
    assert.match(input.value,/<TT collapsible="true" numbering="path">/);
    await new Promise(resolve=>setTimeout(resolve,180));
    assert.match(root.querySelector('[data-editor-result] td[data-tree-key="0"]').textContent,/1\. Raíz/);
    input.dispatchEvent(new window.KeyboardEvent('keydown',{key:'z',ctrlKey:true,bubbles:true,cancelable:true}));assert.equal(input.value,source);
  } finally {window.close();}
});

test('node inspector traces real inheritance, validates exceptions and changes only one annotation', async () => {
  const dom = new JSDOM(renderPage('editar-prueba'), { url: 'https://example.test/AstroXmind/editar-prueba/' });
  const {window}=dom;
  try {
    const root=window.document.querySelector('[data-wiki-editor]'), input=root.querySelector('textarea'), path=root.dataset.sourcePath;
    const source='---\ntitle: Prueba\nnavigation:\n  id: doc-000011\n---\nimport TT from "../../../examples/astro-component-lab/src/components/TreeTable.astro";\n\n<TT numbering="path" collapsible="true" folded="true" levelClasses="1:ArticuloCabecera">\n\n- Raíz [numbering=arabic; tiered=true]\n  - Padre\n    - Hijo\n    - Excepción [class=ArticuloPunto; start=5]\n  - Sin número [numbering=none]\n    - Reactiva [numbering=arabic]\n\n</TT>\n';
    input.defaultValue=source;input.value=source;
    const start=source.indexOf('Hijo'), get=(label)=>nodeAt(source,path,source.indexOf(label),source.indexOf(label),renderEditorMarkdown);
    const node=get('Hijo');
    assert.equal(node.node.properties.numbering.origin.key,'0');
    assert.equal(node.node.properties.class.origin.kind,'level'); assert.equal(node.node.properties.class.origin.level,1);
    assert.equal(node.node.properties.collapsible.origin.kind,'component'); assert.equal(node.node.properties.folded.effective,false);
    assert.equal(node.node.properties.start.origin.kind,'counter');
    assert.equal(get('Excepción').node.properties.class.fallback.value,'ArticuloCabecera');
    assert.equal(get('Reactiva').node.properties.numbering.value,'arabic');
    assert.equal(get('Reactiva').node.properties.start.value,1);
    const invalid=planNodeEdit({source,path,start,end:start,values:{numbering:'none',start:'3'},renderMarkdown:renderEditorMarkdown});assert.equal(invalid.ok,false);
    const restore=planNodeEdit({source,path,start:source.indexOf('Excepción'),end:source.indexOf('Excepción'),values:{start:'5'},renderMarkdown:renderEditorMarkdown});assert.ok(restore.ok);assert.ok(restore.after.value.includes('Excepción [start=5]'));
    installWikiEditor(root);root.querySelector('[data-editor-open]').click();await settle();
    input.setSelectionRange(start,start);input.dispatchEvent(new window.MouseEvent('click',{bubbles:true}));
    const panel=root.querySelector('[data-inspector-panel]');assert.equal(panel.hidden,false);
    const explicit=name=>panel.querySelector(`[data-inspector-explicit="${name}"]`), value=name=>panel.querySelector(`[data-inspector-value="${name}"]`);
    assert.equal(value('numbering').value,'arabic');assert.equal(value('numbering').disabled,true);assert.match(panel.textContent,/Nodo: Raíz/);
    explicit('numbering').click(); value('numbering').value='none';value('numbering').dispatchEvent(new window.Event('change',{bubbles:true}));
    assert.equal(explicit('start').disabled,true);assert.equal(explicit('tiered').disabled,true);
    panel.querySelector('[data-inspector-apply]').click();assert.equal(input.value,source.replace('    - Hijo','    - Hijo [numbering=none]'));
    input.dispatchEvent(new window.KeyboardEvent('keydown',{key:'z',ctrlKey:true,bubbles:true,cancelable:true}));assert.equal(input.value,source);
  } finally {window.close();}
});

test('opening inspector uses catalog defaults, edits only the opening and supports atomic undo', async () => {
  const dom = new JSDOM(renderPage('editar-prueba'), { url: 'https://example.test/AstroXmind/editar-prueba/' });
  const { window } = dom;
  try {
    const root = window.document.querySelector('[data-wiki-editor]');
    const input = root.querySelector('textarea');
    const source = '---\ntitle: Prueba\nnavigation:\n  id: doc-000011\n---\nimport TT from "../../../examples/astro-component-lab/src/components/TreeTable.astro";\n\n<TT numbering="path">\n\n- Raíz [numbering=arabic; tiered=true]\n  - Hijo\n\n</TT>\n';
    input.defaultValue = source; input.value = source;
    const start = source.indexOf('<TT');
    const path = root.dataset.sourcePath;
    assert.equal(openingAt(source, path, source.indexOf('- Raíz')), null);
    assert.equal(openingAt(source, path, start).name, 'TT');
    const invalid = planOpeningEdit({ source, path, start, end: start, values: { levelClasses: '1:Foo; 1:Bar' }, renderMarkdown: renderEditorMarkdown });
    assert.equal(invalid.ok, false);
    const fenced = source.replace('<TT numbering="path">', '```mdx\n<TT numbering="path">').replace('</TT>', '</TT>\n```');
    assert.equal(openingAt(fenced, path, fenced.indexOf('<TT')), null);
    installWikiEditor(root);
    root.querySelector('[data-editor-open]').click(); await settle();
    input.setSelectionRange(start + 2, start + 2); input.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    const panel = root.querySelector('[data-inspector-panel]');
    assert.equal(panel.hidden, false);
    const explicit = name => panel.querySelector(`[data-inspector-explicit="${name}"]`);
    const value = name => panel.querySelector(`[data-inspector-value="${name}"]`);
    assert.equal(explicit('numbering').checked, true); assert.equal(value('numbering').value, 'path');
    assert.equal(explicit('collapsible').checked, false); assert.equal(value('collapsible').disabled, true);
    explicit('collapsible').click(); value('collapsible').click();
    explicit('levelClasses').click(); value('levelClasses').value = '0:ArticuloCabecera';
    panel.querySelector('[data-inspector-apply]').click();
    assert.equal(input.value, source.replace('<TT numbering="path">', '<TT numbering="path" collapsible="true" levelClasses="0:ArticuloCabecera">'));
    await new Promise(resolve => setTimeout(resolve, 180));
    assert.ok(root.querySelector('[data-editor-result] td.ArticuloCabecera'));
    input.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'z', ctrlKey: true, bubbles: true, cancelable: true }));
    assert.equal(input.value, source);
  } finally { window.close(); }
});

test('publication waits for the actual saved source rather than the previous static page', async () => {
  const dom = new JSDOM(renderPage('editar-prueba'), { url: 'https://example.test/AstroXmind/editar-prueba/#crear-componentes-desde-markdown' });
  const { window } = dom;
  try {
    const root = window.document.querySelector('[data-wiki-editor]');
    const path = root.dataset.sourcePath;
    const source = root.querySelector('textarea').value + '\nCambio <TreeTable> & texto';
    const before = dom.serialize();
    root.querySelector('textarea').textContent = source;
    const after = dom.serialize();
    assert.equal(matchesPublishedSource(window, before, path, source), false);
    assert.equal(matchesPublishedSource(window, after, path, source), true);
    assert.equal(matchesPublishedSource(window, after, 'other.mdx', source), false);
    let calls = 0;
    window.fetch = async (url, options) => {
      assert.equal(new URL(url).origin, window.location.origin);
      assert.equal(new URL(url).searchParams.get('_astroxmind_revision'), commit);
      assert.equal(options.cache, 'no-store');
      assert.equal(options.headers, undefined);
      return { ok: true, text: async () => ++calls === 1 ? before : after };
    };
    const controller = new window.AbortController();
    assert.equal(await waitForPublication(window, { path, source, commit, signal: controller.signal, interval: 1, timeout: 1000 }), true);
    assert.equal(calls, 2);
    controller.abort();
    assert.equal(await waitForPublication(window, { path, source, commit, signal: controller.signal }), false);
  } finally { window.close(); }
});

test('contextual creation wraps a complete list, previews it and supports one-step undo/redo', async () => {
  const dom = new JSDOM(renderPage('editar-prueba'), { url: 'https://example.test/AstroXmind/editar-prueba/' });
  const { window } = dom;
  try {
    const root = window.document.querySelector('[data-wiki-editor]');
    // Keep the interaction fixture independent of the publicly editable demo.
    // Saving a real TreeTable (or deleting that example) must not break CI.
    const input = root.querySelector('textarea');
    input.defaultValue = '---\ntitle: Prueba del editor\nnavigation:\n  id: doc-000011\n  parent: doc-000001\n---\n\n- Proyecto de ejemplo\n  - Planificación\n    - Objetivo\n  - Desarrollo\n    - Pruebas\n  - Entrega\n';
    input.value = input.defaultValue;
    installWikiEditor(root);
    root.querySelector('[data-editor-open]').click();
    await settle();
    const original = input.value;
    const start = original.indexOf('- Proyecto de ejemplo');
    const end = original.indexOf('  - Entrega', start) + '  - Entrega'.length;
    const toggle = root.querySelector('[data-create-toggle]');
    const panel = root.querySelector('[data-create-panel]');
    input.setSelectionRange(start, start + 5);
    toggle.click();
    assert.equal(root.querySelector('[data-create-component]').disabled, true);
    assert.match(panel.textContent, /lista completa/);
    root.querySelector('[data-create-close]').click();
    input.setSelectionRange(start, end);
    input.dispatchEvent(new window.KeyboardEvent('keydown', {key: 'F10', shiftKey: true, bubbles: true, cancelable: true}));
    assert.equal(panel.hidden, false);
    const choice = root.querySelector('[data-create-component]');
    assert.equal(choice.disabled, false);
    choice.click();
    assert.equal(panel.hidden, true);
    assert.match(input.value, /import TreeTable from/);
    assert.match(input.value, /<TreeTable>\n\n- Proyecto de ejemplo/);
    await new Promise(resolve => setTimeout(resolve, 180));
    assert.ok(root.querySelector('[data-editor-result] table')?.textContent.includes('Proyecto de ejemplo') || [...root.querySelectorAll('[data-editor-result] table')].some(table => table.textContent.includes('Proyecto de ejemplo')));
    const transformed = input.value;
    input.dispatchEvent(new window.KeyboardEvent('keydown', {key: 'z', ctrlKey: true, bubbles: true, cancelable: true}));
    assert.equal(input.value, original);
    input.dispatchEvent(new window.KeyboardEvent('keydown', {key: 'z', ctrlKey: true, shiftKey: true, bubbles: true, cancelable: true}));
    assert.equal(input.value, transformed);
  } finally { window.close(); }
});

test('a newly transformed list renders live without invalidating the published examples', () => {
  const dom = new JSDOM(renderPage('clases-astro'));
  try {
    const root = dom.window.document.querySelector('[data-wiki-editor]');
    const original = root.querySelector('textarea').value;
    const list = '- Padre\n  - Hijo\n    - Nieto';
    const source = original + '\n\n' + list + '\n';
    const start = source.lastIndexOf(list);
    const tx = planComponentTransformation({ source, start, end: start + list.length, path: root.dataset.sourcePath });
    assert.equal(tx.ok, true, tx.reason);
    const preview = root.querySelector('[data-editor-result]');
    const render = createMdxPreview(root, original, renderEditorMarkdown);
    render(original, preview);
    const examples = preview.querySelectorAll('[data-example-file]').length;
    assert.ok(examples > 0);
    render(tx.after.value, preview);
    assert.equal(preview.querySelectorAll('[data-example-file]').length, examples);
    assert.match(preview.querySelector('astro-xmind-tree-table[data-source-start]').textContent, /Padre.*Hijo.*Nieto/s);
  } finally { dom.window.close(); }
});

test('editor keys indent and outdent two spaces, including multi-line selections', () => {
  const dom = new JSDOM('<textarea maxlength="120000"></textarea>');
  try {
    const input = dom.window.document.querySelector('textarea');
    installEditorKeys(input);
    input.value = '- Padre\n  - Hijo\n    - Nieto\n- Otro';
    const original = input.value;
    const start = original.indexOf('  - Hijo');
    const end = original.indexOf('- Otro');
    input.setSelectionRange(start, end);
    const press = (key, shiftKey = false) => input.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key, shiftKey, cancelable: true, bubbles: true }));
    assert.equal(press('Tab'), false);
    assert.equal(input.value, '- Padre\n    - Hijo\n      - Nieto\n- Otro');
    assert.equal(press('Tab', true), false);
    assert.equal(input.value, original);
    input.setSelectionRange(input.value.indexOf('Hijo') + 2, input.value.indexOf('Hijo') + 2);
    press('Tab');
    assert.match(input.value, /\n    - Hijo/);
    const before = input.value;
    assert.equal(press('Escape'), false);
    assert.equal(press('Tab'), true);
    assert.equal(input.value, before);
    assert.equal(press('Tab'), false);
  } finally { dom.window.close(); }
});

test('Enter continues a list at the current indentation and ends an empty item', () => {
  const source = '    - Punto';
  const change = editIndentation(source, source.length, source.length, 'Enter');
  assert.equal(change.text, '\n    - ');
  const ordered = '  9. Elemento';
  assert.equal(editIndentation(ordered, ordered.length, ordered.length, 'Enter').text, '\n  10. ');
  const empty = '  - ';
  assert.equal(editIndentation(empty, empty.length, empty.length, 'Enter').text, '');
  assert.equal(editIndentation('Texto', 5, 5, 'Enter'), null);
});

test('Markdown preview renders GFM tables and suppresses raw HTML and unsafe URLs', () => {
  const result = renderEditorMarkdown('## Título\n\n| Uno | Dos |\n| --- | --- |\n| 1 | 2 |\n\n<x-test>raw</x-test>\n\n[no](javascript:blocked)\n');
  assert.match(result, /<h2>Título<\/h2>/);
  assert.match(result, /<td>2<\/td>/);
  assert.doesNotMatch(result, /<x-test|href="javascript:/i);
});

test('TreeTable page preview shows all compiled examples and live prose without imports', () => {
  const dom = new JSDOM(renderPage('componentes/tree-table'));
  try {
    const root = dom.window.document.querySelector('[data-wiki-editor]');
    const source = root.querySelector('textarea').value;
    const target = root.querySelector('[data-editor-result]');
    const render = createMdxPreview(root, source, renderEditorMarkdown);
    render(source, target);
    assert.equal(target.querySelectorAll('astro-xmind-tree-table').length, 11);
    assert.equal(target.querySelectorAll('[role="tablist"]').length, 10);
    assert.match(target.textContent, /Nodo1Subnodo1/);
    assert.match(target.textContent, /7\.5\.3\./);
    assert.doesNotMatch(target.querySelector('h1').previousSibling?.textContent ?? '', /import/);
    assert.equal(target.querySelector('script'), null);
    const ids = [...dom.window.document.querySelectorAll('[id]')].map(node => node.id);
    assert.equal(new Set(ids).size, ids.length);
    const first = target.querySelector('[data-example-file] astro-xmind-tree-table');
    render(source.replace('Cada ejemplo ofrece', 'Texto actualizado: cada ejemplo ofrece'), target);
    assert.match(target.textContent, /Texto actualizado/);
    assert.equal(target.querySelector('[data-example-file] astro-xmind-tree-table'), first);
    render(source.replace('<Demo1 />', '<Demo2 />'), target);
    assert.equal(target.querySelectorAll('astro-xmind-tree-table').length, 10);
    assert.match(target.querySelector('.editor-mdx-warning').textContent, /nueva compilación/);
    render(source.replace('gradual.mdx";', 'otro.mdx";'), target);
    assert.equal(target.querySelectorAll('astro-xmind-tree-table').length, 1);
  } finally { dom.window.close(); }
});

test('inline TreeTable uses shared renderer, updates numbers, rows and classes and maps cells to source', () => {
  const dom = new JSDOM(renderPage('componentes/tree-table'));
  try {
    const root = dom.window.document.querySelector('[data-wiki-editor]');
    const source = root.querySelector('textarea').value;
    const target = root.querySelector('[data-editor-result]');
    const render = createMdxPreview(root, source, renderEditorMarkdown);
    render(source, target);
    const live = () => target.querySelector('astro-xmind-tree-table[data-source-start]');
    const article = () => live().querySelector('[data-tree-key="1"]');
    assert.match(article().textContent, /1\.3\./);
    assert.equal(article().dataset.treeClass, 'ArticuloCabecera');
    assert.equal(source.slice(Number(article().dataset.sourceStart), Number(article().dataset.sourceEnd)), '- Artículo 1 [start=3]');
    const changed = source.replace('Artículo 1 [start=3]', 'Artículo de prueba [start=7]').replace('    - Primer punto', '    - Primer punto\n    - Nuevo punto');
    render(changed, target);
    assert.match(article().textContent, /1\.7\. Artículo de prueba/);
    assert.match(live().textContent, /Nuevo punto/);
    render(source.replace('start=3', 'start=0'), target);
    assert.match(target.querySelector('.editor-mdx-warning').textContent, /entero mayor que cero/);
    render(source.replace('numbering="path" collapsible="true"', 'numbering="path" onclick="bad" collapsible="true"'), target);
    assert.match(target.querySelector('.editor-mdx-warning').textContent, /propiedades conocidas/);
  } finally { dom.window.close(); }
});

test('live TreeTable can be edited without credentials, but cannot be saved', async () => {
  const dom = new JSDOM(renderPage('componentes/tree-table'), { url: 'https://example.test/AstroXmind/componentes/tree-table/' });
  try {
    const root = dom.window.document.querySelector('[data-wiki-editor]');
    installWikiEditor(root);
    root.querySelector('[data-editor-open]').click();
    await settle();
    const input = root.querySelector('textarea');
    assert.equal(input.readOnly, false);
    assert.equal(root.querySelector('[data-pat-save]').disabled, true);
    const target = root.querySelector('[data-editor-result]');
    const cell = target.querySelector('astro-xmind-tree-table[data-source-start] [data-tree-key="1"]');
    cell.click();
    assert.equal(input.value.slice(input.selectionStart, input.selectionEnd), '- Artículo 1 [start=3]');
    input.setRangeText('- Artículo nuevo [start=7]', input.selectionStart, input.selectionEnd, 'end');
    input.dispatchEvent(new dom.window.Event('input'));
    await new Promise(resolve => setTimeout(resolve, 180));
    assert.match(target.querySelector('astro-xmind-tree-table[data-source-start] [data-tree-key="1"]').textContent, /1\.7\. Artículo nuevo/);
  } finally { dom.window.close(); }
});

test('MDX scanner preserves literal imports and components in fenced examples', () => {
  const source = '```mdx\nimport Demo from "./demo.mdx";\n<ComponentExample filename="demo.mdx">\n</ComponentExample>\n```';
  const parsed = splitEditorMdx(source);
  assert.deepEqual(parsed.imports, []);
  assert.deepEqual(parsed.parts, [{ markdown: source, start: 0 }]);
});

test('source ranges distinguish duplicate paragraphs, nested list items and GFM table cells', () => {
  const source = '## Título\n\nRepetido\n\nRepetido\n\n- Uno\n  - Dos\n\n| A | B |\n| --- | --- |\n| C | D |\n';
  const dom = new JSDOM(renderEditorMarkdown(source));
  try {
    const body = dom.window.document.body;
    annotateMarkdown(body, source, 12);
    const [first, second] = body.querySelectorAll('p');
    assert.equal(Number(first.dataset.sourceStart), 12 + source.indexOf('Repetido'));
    assert.equal(Number(second.dataset.sourceStart), 12 + source.lastIndexOf('Repetido'));
    const nested = body.querySelector('li li');
    assert.equal(source.slice(Number(nested.dataset.sourceStart) - 12, Number(nested.dataset.sourceEnd) - 12), '- Dos');
    const cell = body.querySelector('td');
    assert.match(source.slice(Number(cell.dataset.sourceStart) - 12, Number(cell.dataset.sourceEnd) - 12), /C/);
    assert.equal(interpolateScroll([[0, 0], [100, 200], [300, 250]], 200), 225);
  } finally { dom.window.close(); }
});

test('clicking a TreeTable selects its exact MDX source and cursor highlights a paragraph; switch disables sync', () => {
  const dom = new JSDOM(renderPage('componentes/tree-table'), { url: 'https://example.test/AstroXmind/componentes/tree-table/' });
  try {
    const root = dom.window.document.querySelector('[data-wiki-editor]');
    const input = root.querySelector('textarea');
    installWikiEditor(root);
    root.querySelector('[data-editor-open]').click();
    const target = root.querySelector('[data-editor-result]');
    const demo = target.querySelector('[data-example-file="plegado.mdx"]');
    demo.querySelector('td').click();
    assert.match(input.value.slice(input.selectionStart, input.selectionEnd), /^<ComponentExample practice source=\{Demo2Source\}[\s\S]*<\/ComponentExample>$/);
    assert.ok(demo.classList.contains('editor-source-highlight'));
    const paragraph = [...target.querySelectorAll('p')].find(el => el.textContent.includes('Cada ejemplo ofrece'));
    const offset = input.value.indexOf('Cada ejemplo ofrece');
    input.setSelectionRange(offset + 4, offset + 4);
    input.dispatchEvent(new dom.window.Event('keyup'));
    assert.ok(paragraph.classList.contains('editor-source-highlight'));
    root.querySelector('[data-editor-sync]').click();
    demo.querySelector('td').click();
    assert.equal(input.selectionStart, offset + 4);
    assert.equal(target.querySelector('.editor-source-highlight'), null);
  } finally { dom.window.close(); }
});

test('preview clones run the actual Starlight tabs and TreeTable fold controls independently', () => {
  const dom = new JSDOM(renderPage('componentes/tree-table'), { url: 'https://example.test/AstroXmind/componentes/tree-table/', runScripts: 'outside-only', pretendToBeVisual: true });
  try {
    const { window } = dom;
    window.scrollTo = () => {};
    const scripts = [...window.document.querySelectorAll('script[type="module"]')].map(script => {
      const src = script.getAttribute('src');
      return src?.startsWith('/AstroXmind/_astro/') ? readFileSync(new URL('../dist/' + src.slice('/AstroXmind/'.length), import.meta.url), 'utf8') : script.textContent;
    });
    for (const tag of ['starlight-tabs', 'astro-xmind-tree-table']) {
      const script = scripts.find(script => script.includes(`customElements.define("${tag}"`));
      assert.ok(script, tag);
      window.eval(script);
    }
    const root = window.document.querySelector('[data-wiki-editor]');
    const source = root.querySelector('textarea').value;
    const target = root.querySelector('[data-editor-result]');
    createMdxPreview(root, source, renderEditorMarkdown)(source, target);
    const example = target.querySelector('[data-example-file="plegado.mdx"]');
    const toggle = example.querySelector('.tree-toggle');
    assert.equal(toggle.hidden, false);
    const before = toggle.getAttribute('aria-expanded');
    toggle.click();
    assert.notEqual(toggle.getAttribute('aria-expanded'), before);
    const tabs = [...example.querySelectorAll('[role="tab"]')];
    tabs[1].click();
    assert.equal(tabs[1].getAttribute('aria-selected'), 'true');
    assert.equal(example.querySelector('[role="tabpanel"]').hidden, true);
    const reader = window.document.querySelector('.sl-markdown-content [data-example-file="plegado.mdx"]:not([data-wiki-editor] *)');
    assert.ok(reader);
    assert.equal(reader.querySelector('[role="tab"]').getAttribute('aria-selected'), 'true');
  } finally { dom.window.close(); }
});

test('every rendered document has exactly one page editor with the actual complete source', () => {
  const index = JSON.parse(readFileSync(new URL('../dist/navigation.json', import.meta.url), 'utf8'));
  for (const id of index.traversal) {
    const route = index.nodes[id].url.replace('/AstroXmind/', '').replace(/\/$/, '');
    const dom = new JSDOM(renderPage(route), { url: `https://example.test${index.nodes[id].url}` });
    try {
      const roots = dom.window.document.querySelectorAll('[data-wiki-editor]');
      assert.equal(roots.length, 1, id);
      const root = roots[0];
      assert.equal(root.dataset.documentId, id);
      const original = readFileSync(new URL(`../${root.dataset.sourcePath}`, import.meta.url), 'utf8');
      assert.equal(root.querySelector('textarea').value, original.replace(/\r\n/g, '\n'));
      assert.doesNotThrow(() => validatePageSource(original, id));
      assert.equal(root.querySelector('[data-editor-workspace]').hasAttribute('open'), false);
    } finally { dom.window.close(); }
  }
});

test('configuration and whole-page editor automatically load and save the real page to main', async () => {
  const route = 'pruebas-jerarquia/articulo-1';
  const dom = new JSDOM(renderPage(route), { url: `https://example.test/AstroXmind/${route}/` });
  const settings = new JSDOM(renderPage('configuracion'), { url: 'https://example.test/AstroXmind/configuracion/' });
  const { window } = dom;
  try {
    const root = window.document.querySelector('[data-wiki-editor]');
    const input = root.querySelector('textarea');
    const save = root.querySelector('[data-pat-save]');
    const workspace = root.querySelector('[data-editor-workspace]');
    const status = root.querySelector('[data-pat-status]');
    const original = input.value;
    let remote = original;
    let conflict = false;
    const requests = [];
    window.confirm = () => true;
    window.fetch = async (url, options) => {
      if (new URL(url).origin === window.location.origin) return { ok: true, text: async () => renderPage(route) };
      requests.push({ url, options });
      const json = (status, data) => ({ status, ok: status >= 200 && status < 300, json: async () => data });
      if (url.endsWith('/git/ref/heads/main')) return json(200, {});
      if (url.includes('/commits?')) {
        const revision = remote.match(/^---\n# astroxmind-revision: ([a-f0-9-]{36}) /)?.[1];
        return json(200, [{ sha: commit, commit: { message: revision ? 'Editar [' + revision + ']' : 'Creación' } }]);
      }
      assert.match(url, /\/contents\/src\/content\/docs\/pruebas-jerarquia\/articulo-1\.md/);
      if (options.method === 'PUT') {
        if (conflict) return json(409, {});
        remote = Buffer.from(JSON.parse(options.body).content, 'base64').toString('utf8');
        return json(200, { content: { sha }, commit: { sha: commit } });
      }
      assert.match(url, new RegExp('\\?ref=(main|' + commit + ')$'));
      return json(200, { type: 'file', encoding: 'base64', sha, content: Buffer.from(remote).toString('base64') });
    };
    settings.window.fetch = window.fetch;
    const config = settings.window.document.querySelector('[data-github-settings]');
    installGitHubSettings(config);
    config.querySelector('[data-connection-token]').value = fakeToken;
    config.querySelector('[data-connection-store]').click();
    await settle();
    window.localStorage.setItem(tokenKey, settings.window.localStorage.getItem(tokenKey));
    installWikiEditor(root);
    assert.equal(save.disabled, true);
    root.querySelector('[data-editor-open]').click();
    await settle();
    assert.equal(workspace.hasAttribute('open'), true);
    assert.equal(save.disabled, false);
    assert.equal(input.value, original);
    assert.equal(root.querySelector('[data-pat-load]').hidden, true);
    assert.equal(root.querySelector('[data-editor-result]').textContent.includes('navigation:'), false);
    input.value += '\n\n## Cambio de prueba ñ\n';
    input.dispatchEvent(new window.Event('input'));
    save.click();
    await settle();
    const sent = requests.findLast(request => request.options.method === 'PUT');
    const body = JSON.parse(sent.options.body);
    assert.equal(body.branch, 'main');
    assert.equal(body.sha, sha);
    assert.equal(sent.options.headers.Authorization, `Bearer ${fakeToken}`);
    assert.equal(remote, input.value);
    assert.match(remote, /^---\n# astroxmind-revision: [a-f0-9-]{36} \| previous-blob: [a-f0-9]{40} \| saved-at: /);
    assert.equal(requests.at(-1).url.endsWith('?ref=' + commit), true);
    assert.match(root.querySelector('.reader-caption').textContent, /Guardado en GitHub/);
    assert.equal(workspace.hasAttribute('open'), false);
    assert.match(root.querySelector('[data-page-save-status]').textContent, new RegExp(commit));
    root.querySelector('[data-editor-open]').click();
    await settle();
    input.value = input.value.replace('doc-000006', 'doc-000099');
    const count = requests.length;
    save.click();
    await settle();
    assert.equal(requests.length, count);
    assert.match(status.textContent, /identificador/);
    input.value = remote + '\nNuevo cambio';
    conflict = true;
    save.click();
    await settle();
    assert.match(status.textContent, /Recupera la revisión/);
    assert.equal(save.disabled, true);
    assert.equal(input.value, remote + '\nNuevo cambio');
    assert.equal(root.querySelector('[data-pat-load]').hidden, false);
  } finally { dom.window.close(); settings.window.close(); }
});
