import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';
import { installWikiEditor, renderEditorMarkdown } from '../src/lib/wiki-editor.mjs';
import { installGitHubSettings } from '../src/lib/github-settings.mjs';
import { tokenKey } from '../src/lib/github-connection.mjs';

test('Markdown preview renders GFM tables and suppresses raw HTML and unsafe URLs', () => {
  const result = renderEditorMarkdown('## Título\n\n| Uno | Dos |\n| --- | --- |\n| 1 | 2 |\n\n<x-test>raw</x-test>\n\n[no](javascript:blocked)\n');
  assert.match(result, /<h2>Título<\/h2>/);
  assert.match(result, /<td>2<\/td>/);
  assert.doesNotMatch(result, /<x-test|href="javascript:/i);
});

test('the editor updates in place, restores a saved draft and detects changes from another tab', async () => {
  const html = readFileSync(new URL('../dist/editar-prueba/index.html', import.meta.url), 'utf8');
  const dom = new JSDOM(html, { url: 'https://example.test/AstroXmind/editar-prueba/' });
  try {
    const { window } = dom;
    const root = window.document.querySelector('[data-wiki-editor]');
    assert.equal(window.document.querySelector('header a[aria-label="Configuración"]')?.getAttribute('href'), '/AstroXmind/configuracion/');
    installWikiEditor(root);
    const input = root.querySelector('textarea');
    const preview = root.querySelector('[data-editor-result]');
    const save = root.querySelector('[data-editor-save]');
    const status = root.querySelector('[data-editor-status]');
    assert.match(preview.textContent, /Mi nota de prueba/);
    input.value = '## Título cambiado';
    input.dispatchEvent(new window.Event('input'));
    await new Promise(resolve => window.setTimeout(resolve, 150));
    assert.equal(preview.querySelector('h2').textContent, 'Título cambiado');
    root.querySelector('[data-editor-view=result]').click();
    assert.equal(input.value, '## Título cambiado');
    assert.equal(root.dataset.activeView, 'result');
    save.click();
    assert.match(status.textContent, /Borrador guardado/);

    const remounted = new JSDOM(html, { url: window.location.href });
    try {
      const key = window.localStorage.key(0);
      remounted.window.localStorage.setItem(key, window.localStorage.getItem(key));
      const next = remounted.window.document.querySelector('[data-wiki-editor]');
      installWikiEditor(next);
      assert.equal(next.querySelector('textarea').value, '## Título cambiado');
      assert.match(next.querySelector('[data-editor-status]').textContent, /Borrador recuperado/);
      window.localStorage.setItem(key, 'Cambio de otra pestaña');
      input.value = 'Mi versión';
      save.click();
      assert.equal(window.localStorage.getItem(key), 'Cambio de otra pestaña');
      assert.equal(input.value, 'Mi versión');
      assert.match(status.textContent, /Otra pestaña/);
    } finally {
      remounted.window.close();
    }
  } finally {
    dom.window.close();
  }
});

test('GitHub Pages remembers the token, restores the draft and protects repeated saves', async () => {
  const html = readFileSync(new URL('../dist/editar-prueba/index.html', import.meta.url), 'utf8');
  const dom = new JSDOM(html, { url: 'https://example.test/AstroXmind/editar-prueba/' });
  try {
    const { window } = dom;
    const root = window.document.querySelector('[data-wiki-editor]');
    const input = root.querySelector('textarea');
    const load = root.querySelector('[data-pat-load]');
    const save = root.querySelector('[data-pat-save]');
    const result = root.querySelector('[data-pat-result]');
    const status = root.querySelector('[data-pat-status]');
    const fakeToken = 'github_pat_' + 'test_only';
    const calls = [];
    let exists = false;
    let conflict = false;
    let remoteMarkdown = '';
    const sha = 'a'.repeat(40);
    const commit = 'b'.repeat(40);
    window.confirm = () => true;
    window.fetch = async (url, options) => {
      calls.push({ url, options });
      const json = (status, data) => ({ status, ok: status >= 200 && status < 300, json: async () => data });
      if (url.includes('/git/ref/heads/editor/drafts')) return json(200, {});
      if (options.method === 'PUT') {
        if (conflict) return json(409, {});
        exists = true;
        remoteMarkdown = Buffer.from(JSON.parse(options.body).content, 'base64').toString('utf8');
        return json(201, { content: { sha }, commit: { sha: commit } });
      }
      return exists ? json(200, { type: 'file', encoding: 'base64', sha, content: Buffer.from(remoteMarkdown).toString('base64') }) : json(404, {});
    };
    installWikiEditor(root);
    const settle = () => new Promise(resolve => setTimeout(resolve, 0));
    assert.equal(save.disabled, true);
    const configHtml = readFileSync(new URL('../dist/configuracion/index.html', import.meta.url), 'utf8');
    const settings = new JSDOM(configHtml, { url: 'https://example.test/AstroXmind/configuracion/' });
    const settingsRoot = settings.window.document.querySelector('[data-github-settings]');
    settings.window.fetch = window.fetch;
    installGitHubSettings(settingsRoot);
    const tokenField = settingsRoot.querySelector('[data-connection-token]');
    tokenField.value = fakeToken;
    settingsRoot.querySelector('[data-connection-store]').click();
    await settle();
    assert.equal(tokenField.value, '');
    assert.equal(settingsRoot.querySelector('[data-connection-status]').dataset.state, 'success');
    window.localStorage.setItem(tokenKey, settings.window.localStorage.getItem(tokenKey));
    window.dispatchEvent(new window.StorageEvent('storage', { key: tokenKey, newValue: fakeToken }));
    load.click();
    await settle();
    assert.equal(save.disabled, false);
    assert.equal(window.localStorage.getItem('astroxmind:github-token:v1'), fakeToken);
    assert.equal(window.sessionStorage.length, 0);
    input.value = '## Prueba ñ';
    save.click();
    await settle();
    const first = calls.at(-1);
    assert.equal(first.url, 'https://api.github.com/repos/PabloGonzalezRuiz/AstroXmind/contents/editor-drafts/preview.md');
    assert.equal(first.options.headers.Authorization, `Bearer ${fakeToken}`);
    const body = JSON.parse(first.options.body);
    assert.equal(body.branch, 'editor/drafts');
    assert.equal(body.sha, undefined);
    assert.equal(Buffer.from(body.content, 'base64').toString('utf8'), input.value);
    assert.equal(result.href, `https://github.com/PabloGonzalezRuiz/AstroXmind/commit/${commit}`);
    assert.match(status.textContent, /Borrador guardado en GitHub/);
    assert.ok(status.textContent.includes(`Commit: ${commit}`));
    assert.equal(status.dataset.state, 'success');
    input.value = '## Segundo cambio';
    input.dispatchEvent(new window.Event('input'));
    assert.match(status.textContent, /Borrador guardado en GitHub/);
    save.click();
    await settle();
    assert.equal(JSON.parse(calls.at(-1).options.body).sha, sha);
    assert.equal(remoteMarkdown, '## Segundo cambio');
    const countBeforeNoop = calls.length;
    save.click();
    await settle();
    assert.equal(calls.length, countBeforeNoop);
    assert.match(status.textContent, /No hay cambios nuevos/);
    const reloaded = new JSDOM(html, { url: window.location.href });
    try {
      reloaded.window.localStorage.setItem('astroxmind:github-token:v1', fakeToken);
      reloaded.window.fetch = window.fetch;
      const next = reloaded.window.document.querySelector('[data-wiki-editor]');
      installWikiEditor(next);
      await settle();
      assert.equal(next.querySelector('textarea').value, remoteMarkdown);
      assert.equal(next.querySelector('[data-pat-save]').disabled, false);
      assert.equal(next.querySelector('[data-pat-token]'), null);
    } finally { reloaded.window.close(); }
    load.click();
    await settle();
    conflict = true;
    input.value = 'Cambios sin perder';
    save.click();
    await settle();
    assert.equal(JSON.parse(calls.at(-1).options.body).sha, sha);
    assert.match(status.textContent, /Vuelve a abrirlo/);
    assert.equal(input.value, 'Cambios sin perder');
    assert.equal(save.disabled, true);
    settingsRoot.querySelector('[data-connection-forget]').click();
    await settle();
    assert.equal(settings.window.localStorage.getItem(tokenKey), null);
    settings.window.close();
    window.localStorage.removeItem(tokenKey);
    window.dispatchEvent(new window.StorageEvent('storage', { key: tokenKey, newValue: null }));
    assert.equal(window.localStorage.getItem('astroxmind:github-token:v1'), null);
    const count = calls.length;
    load.click();
    await settle();
    assert.equal(calls.length, count);
  } finally {
    dom.window.close();
  }
});
