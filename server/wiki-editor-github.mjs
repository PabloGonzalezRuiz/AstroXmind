import { createHash, randomBytes } from 'node:crypto';
import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';

const prefix = '/AstroXmind/editor-api';
const editor = '/AstroXmind/editar-prueba/';
const repository = 'PabloGonzalezRuiz/AstroXmind';
const branch = 'editor/drafts';
const file = 'editor-drafts/preview.md';
const contentPath = `/repos/${repository}/contents/${file}`;
const sessionLifetime = 30 * 60_000;
const maxCharacters = 120_000;
const maxRequestBytes = 750_000;
const shaPattern = /^[0-9a-f]{40}$/;
const nonce = () => randomBytes(32).toString('base64url');

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function reply(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function cookie(req, name) {
  return (req.headers.cookie ?? '').split(/;\s*/).find(item => item.startsWith(name + '='))?.slice(name.length + 1);
}

function setCookie(name, value, duration) {
  return `${name}=${value}; Max-Age=${duration}; Path=${prefix}/; Secure; HttpOnly; SameSite=Lax`;
}

function redirect(res, destination, cookies) {
  res.writeHead(303, { Location: destination, 'Set-Cookie': cookies });
  res.end();
}

function remember(map, key, entry, limit) {
  for (const [id, value] of map) if (value.expires <= Date.now()) map.delete(id);
  if (map.size >= limit) throw new HttpError(503, 'Servicio ocupado. Inténtalo de nuevo.');
  map.set(key, entry);
}

async function readDraftPayload(req) {
  if (req.headers['content-type']?.split(';')[0] !== 'application/json') {
    throw new HttpError(415, 'Se esperaba JSON.');
  }
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxRequestBytes) throw new HttpError(413, 'Borrador demasiado grande.');
    chunks.push(chunk);
  }
  let data;
  try { data = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw new HttpError(400, 'JSON no válido.'); }
  if (typeof data?.markdown !== 'string' || data.markdown.length > maxCharacters ||
      !(data.sha === null || (typeof data.sha === 'string' && shaPattern.test(data.sha)))) {
    throw new HttpError(400, 'Texto o revisión no válidos.');
  }
  return data;
}

export function createEditorHandler({ origin, clientId, clientSecret, editorId, fetcher = fetch }) {
  const url = new URL(origin);
  if (url.protocol !== 'https:' || url.origin !== origin || !clientId || !clientSecret ||
      !Number.isSafeInteger(editorId) || editorId < 1) {
    throw new Error('Configura el origen HTTPS, la GitHub App y el ID numérico del editor.');
  }
  const callback = origin + prefix + '/callback';
  const logins = new Map();
  const sessions = new Map();
  const gh = (path, token, options = {}) => fetcher('https://api.github.com' + path, {
    ...options, redirect: 'error', signal: AbortSignal.timeout(10_000),
    headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json', 'User-Agent': 'AstroXmind-editor', 'X-GitHub-Api-Version': '2022-11-28' },
  });

  async function getDraft(token) {
    const response = await gh(contentPath + '?ref=' + encodeURIComponent(branch), token);
    if (response.status === 404) return { markdown: null, sha: null };
    if (!response.ok) throw new HttpError(502, 'No se pudo leer el borrador de GitHub.');
    const data = await response.json();
    if (data.type !== 'file' || data.encoding !== 'base64' || !shaPattern.test(data.sha) ||
        typeof data.content !== 'string' || data.content.length > maxRequestBytes) {
      throw new HttpError(502, 'GitHub no devolvió un borrador válido.');
    }
    return { markdown: Buffer.from(data.content, 'base64').toString('utf8'), sha: data.sha };
  }

  return async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    try {
      const requestUrl = new URL(req.url, origin);
      if (requestUrl.origin !== origin) throw new HttpError(400, 'Origen no válido.');
      const route = requestUrl.pathname;
      if (req.method === 'GET' && route === prefix + '/login') {
        const state = nonce(), verifier = nonce();
        remember(logins, state, { verifier, expires: Date.now() + 5 * 60_000 }, 200);
        const authorize = new URL('https://github.com/login/oauth/authorize');
        authorize.search = new URLSearchParams({
          client_id: clientId, redirect_uri: callback, state,
          code_challenge: createHash('sha256').update(verifier).digest('base64url'), code_challenge_method: 'S256',
        }).toString();
        return redirect(res, authorize.href, [setCookie('ax_oauth', state, 300)]);
      }
      if (req.method === 'GET' && route === prefix + '/callback') {
        const state = requestUrl.searchParams.get('state'), code = requestUrl.searchParams.get('code');
        const attempt = logins.get(state);
        if (!code || !attempt || state !== cookie(req, 'ax_oauth') || attempt.expires <= Date.now()) {
          throw new HttpError(400, 'Inicio de sesión caducado o no válido.');
        }
        logins.delete(state);
        const exchange = await fetcher('https://github.com/login/oauth/access_token', {
          method: 'POST', redirect: 'error', signal: AbortSignal.timeout(10_000),
          headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, code,
            code_verifier: attempt.verifier, redirect_uri: callback }),
        });
        const credentials = await exchange.json();
        const token = credentials.access_token;
        if (!exchange.ok || typeof token !== 'string' || !token) throw new HttpError(401, 'GitHub no autorizó la sesión.');
        const identity = await gh('/user', token);
        if (!identity.ok || (await identity.json()).id !== editorId) throw new HttpError(403, 'Esta cuenta no está autorizada.');
        const sessionId = nonce();
        const expires = Date.now() + Math.min(sessionLifetime, Number(credentials.expires_in || 1800) * 1000);
        if (!Number.isFinite(expires) || expires <= Date.now()) throw new HttpError(401, 'GitHub devolvió una sesión caducada.');
        sessions.delete(cookie(req, 'ax_editor'));
        remember(sessions, sessionId, { token, expires }, 50);
        return redirect(res, editor, [setCookie('ax_oauth', '', 0), setCookie('ax_editor', sessionId, Math.floor((expires - Date.now()) / 1000))]);
      }

      if (route !== prefix + '/draft' || !['GET', 'PUT'].includes(req.method)) {
        throw new HttpError(404, 'Ruta no disponible.');
      }
      const session = sessions.get(cookie(req, 'ax_editor'));
      if (!session || session.expires <= Date.now()) throw new HttpError(401, 'Inicia sesión con GitHub.');
      if (req.method === 'GET') return reply(res, 200, await getDraft(session.token));
      if (req.headers.origin !== origin) throw new HttpError(403, 'Origen no autorizado.');

      const { markdown, sha } = await readDraftPayload(req);
      const current = await getDraft(session.token);
      if (current.sha !== sha) throw new HttpError(409, 'El borrador cambió en GitHub. Conserva tu texto y vuelve a cargar la revisión.');
      const saved = await gh(contentPath, session.token, { method: 'PUT', body: JSON.stringify({
        message: 'Save AstroXmind wiki editor draft', branch,
        content: Buffer.from(markdown, 'utf8').toString('base64'),
        ...(sha ? { sha } : {}),
      }) });
      if (saved.status === 409 || saved.status === 422) throw new HttpError(409, 'GitHub rechazó la revisión. Comprueba la rama y vuelve a abrir el borrador.');
      if (!saved.ok) throw new HttpError(502, 'GitHub no guardó el borrador. Tu texto sigue en el editor.');
      const result = await saved.json();
      if (!shaPattern.test(result.content?.sha ?? '')) throw new HttpError(502, 'GitHub no confirmó la revisión guardada.');
      return reply(res, 200, { sha: result.content.sha, url: `https://github.com/${repository}/blob/${branch}/${file}` });
    } catch (error) {
      if (error instanceof HttpError) return reply(res, error.status, { error: error.message });
      return reply(res, 502, { error: 'El servicio de GitHub no está disponible.' });
    }
  };
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const { WIKI_EDITOR_ORIGIN, GITHUB_APP_CLIENT_ID, GITHUB_APP_CLIENT_SECRET, WIKI_EDITOR_USER_ID } = process.env;
  const handler = createEditorHandler({ origin: WIKI_EDITOR_ORIGIN, clientId: GITHUB_APP_CLIENT_ID,
    clientSecret: GITHUB_APP_CLIENT_SECRET, editorId: Number(WIKI_EDITOR_USER_ID) });
  createServer({ requestTimeout: 15_000, headersTimeout: 10_000 }, handler).listen(8788, '127.0.0.1');
}
