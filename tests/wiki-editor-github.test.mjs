import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { test } from 'node:test';
import { createEditorHandler } from '../server/wiki-editor-github.mjs';

const origin = 'https://wiki.example';
const prefix = '/AstroXmind/editor-api';
const filePath = '/repos/PabloGonzalezRuiz/AstroXmind/contents/editor-drafts/preview.md';
const revision = 'a'.repeat(40);
const mockToken = 'test-user-token';
const json = (data, status = 200) => new Response(JSON.stringify(data), { status });

async function call(handler, method, url, headers = {}, body) {
  const request = Readable.from(body ? [Buffer.from(JSON.stringify(body))] : []);
  Object.assign(request, { method, url, headers });
  let status, details, output;
  await handler(request, {
    setHeader() {},
    writeHead(code, headers) { status = code; details = headers; },
    end(data) { output = data && JSON.parse(data); },
  });
  return { status, details, output };
}

test('GitHub draft flow scopes writes, rejects stale revisions and opens the saved text', async () => {
  let stored;
  let writes = 0;
  const expected = '## Texto de prueba';
  const handler = createEditorHandler({ origin, clientId: 'test-app', clientSecret: 'test-secret', editorId: 17,
    fetcher: async (href, options) => {
      const url = new URL(href);
      if (url.origin === 'https://github.com') {
        assert.equal(url.pathname, '/login/oauth/access_token');
        assert.ok(options.body.get('code_verifier'));
        return json({ access_token: mockToken });
      }
      assert.equal(url.origin, 'https://api.github.com');
      assert.equal(options.headers.Authorization, 'Bearer ' + mockToken);
      if (url.pathname === '/user') return json({ id: 17 });
      assert.equal(url.pathname, filePath);
      if (options.method === 'PUT') {
        const payload = JSON.parse(options.body);
        assert.equal(payload.branch, 'editor/drafts');
        assert.equal(Buffer.from(payload.content, 'base64').toString(), expected);
        assert.equal(payload.sha, undefined);
        stored = payload.content;
        writes++;
        return json({ content: { sha: revision } }, 201);
      }
      assert.equal(url.searchParams.get('ref'), 'editor/drafts');
      return stored ? json({ type: 'file', encoding: 'base64', sha: revision, content: stored }) : json({}, 404);
    },
  });
  assert.equal((await call(handler, 'GET', prefix + '/draft')).status, 401);
  const login = await call(handler, 'GET', prefix + '/login');
  assert.equal(login.status, 303);
  const redirect = new URL(login.details.Location);
  assert.equal(redirect.searchParams.get('code_challenge_method'), 'S256');
  const state = redirect.searchParams.get('state');
  const callback = prefix + '/callback?code=demo&state=' + state;
  assert.equal((await call(handler, 'GET', callback)).status, 400);
  const authenticated = await call(handler, 'GET', callback, { cookie: 'ax_oauth=' + state });
  assert.equal(authenticated.status, 303);
  assert.equal((await call(handler, 'GET', callback, { cookie: 'ax_oauth=' + state })).status, 400);
  const session = authenticated.details['Set-Cookie'][1];
  assert.match(session, /Secure; HttpOnly; SameSite=Lax/);
  assert.ok(!session.includes(mockToken));
  const headers = { cookie: session.split(';')[0], origin, 'content-type': 'application/json' };
  const draft = { markdown: expected, sha: null };
  assert.equal((await call(handler, 'PUT', prefix + '/draft', { ...headers, origin: 'https://other.example' }, draft)).status, 403);
  assert.equal((await call(handler, 'PUT', prefix + '/draft', headers, draft)).status, 200);
  assert.deepEqual((await call(handler, 'GET', prefix + '/draft', headers)).output, { markdown: expected, sha: revision });
  assert.equal((await call(handler, 'PUT', prefix + '/draft', headers, draft)).status, 409);
  assert.equal(writes, 1);
});
