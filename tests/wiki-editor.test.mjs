import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';
import { installWikiEditor, renderEditorMarkdown } from '../src/lib/wiki-editor.mjs';

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
    installWikiEditor(root);
    const input = root.querySelector('textarea');
    const preview = root.querySelector('[data-editor-result]');
    const save = root.querySelector('[data-editor-save]');
    const status = root.querySelector('[role=status]');
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
