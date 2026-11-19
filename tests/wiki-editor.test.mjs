import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';
import { installWikiEditor, renderEditorMarkdown } from '../src/lib/wiki-editor.mjs';
import { createMdxPreview, splitEditorMdx } from '../src/lib/wiki-editor-mdx.mjs';
import { annotateMarkdown, interpolateScroll } from '../src/lib/wiki-editor-sync.mjs';
import { installGitHubSettings } from '../src/lib/github-settings.mjs';
import { tokenKey } from '../src/lib/github-connection.mjs';
import { validatePageSource } from '../src/lib/wiki-editor-pat.mjs';

const fakeToken = 'github_pat_' + 'test_only';
const sha = 'a'.repeat(40);
const commit = 'b'.repeat(40);
const settle = () => new Promise(resolve => setTimeout(resolve, 0));
const renderPage = path => readFileSync(new URL(`../dist/${path}/index.html`, import.meta.url), 'utf8');

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
    assert.equal(target.querySelectorAll('astro-xmind-tree-table').length, 10);
    assert.equal(target.querySelectorAll('[role="tablist"]').length, 10);
    assert.match(target.textContent, /Nodo1Subnodo1/);
    assert.match(target.textContent, /7\.5\.3\./);
    assert.doesNotMatch(target.querySelector('h1').previousSibling?.textContent ?? '', /import/);
    assert.equal(target.querySelector('script'), null);
    const ids = [...dom.window.document.querySelectorAll('[id]')].map(node => node.id);
    assert.equal(new Set(ids).size, ids.length);
    const first = target.querySelector('astro-xmind-tree-table');
    render(source.replace('Cada ejemplo ofrece', 'Texto actualizado: cada ejemplo ofrece'), target);
    assert.match(target.textContent, /Texto actualizado/);
    assert.equal(target.querySelector('astro-xmind-tree-table'), first);
    render(source.replace('<Demo1 />', '<Demo2 />'), target);
    assert.equal(target.querySelectorAll('astro-xmind-tree-table').length, 9);
    assert.match(target.querySelector('.editor-mdx-warning').textContent, /nueva compilación/);
    render(source.replace('gradual.mdx";', 'otro.mdx";'), target);
    assert.equal(target.querySelectorAll('astro-xmind-tree-table').length, 0);
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
    assert.match(input.value.slice(input.selectionStart, input.selectionEnd), /^<ComponentExample source=\{Demo2Source\}[\s\S]*<\/ComponentExample>$/);
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
      requests.push({ url, options });
      const json = (status, data) => ({ status, ok: status >= 200 && status < 300, json: async () => data });
      if (url.endsWith('/git/ref/heads/main')) return json(200, {});
      assert.match(url, /\/contents\/src\/content\/docs\/pruebas-jerarquia\/articulo-1\.md/);
      if (options.method === 'PUT') {
        if (conflict) return json(409, {});
        remote = Buffer.from(JSON.parse(options.body).content, 'base64').toString('utf8');
        return json(200, { content: { sha }, commit: { sha: commit } });
      }
      assert.match(url, /\?ref=main$/);
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
    const sent = requests.at(-1);
    const body = JSON.parse(sent.options.body);
    assert.equal(body.branch, 'main');
    assert.equal(body.sha, sha);
    assert.equal(sent.options.headers.Authorization, `Bearer ${fakeToken}`);
    assert.equal(remote, input.value);
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
