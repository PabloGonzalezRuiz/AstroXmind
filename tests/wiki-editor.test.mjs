import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';
import { installWikiEditor, renderEditorMarkdown } from '../src/lib/wiki-editor.mjs';
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
