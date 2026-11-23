export const repository = 'PabloGonzalezRuiz/AstroXmind';
export const branch = 'main';
export const api = `https://api.github.com/repos/${repository}`;
export const tokenKey = 'astroxmind:github-token:v1';
export const tokenChangedEvent = 'astroxmind:github-token-changed';

export function readToken(window) {
  return window.localStorage.getItem(tokenKey) || '';
}

export function saveToken(window, token) {
  if (!/^github_pat_[\w]+$/.test(token)) throw Error('Introduce un token de acceso personal de grano fino de GitHub.');
  window.localStorage.setItem(tokenKey, token);
  window.dispatchEvent(new window.Event(tokenChangedEvent));
}

export function forgetToken(window) {
  window.localStorage.removeItem(tokenKey);
  window.dispatchEvent(new window.Event(tokenChangedEvent));
}

export function watchToken(window, callback) {
  window.addEventListener('storage', event => {
    if (event.key === tokenKey || event.key === null) callback(readToken(window));
  });
}

export async function githubRequest(window, token, url, method = 'GET', body) {
  if (!token || !url.startsWith(`${api}/`)) throw Error('La conexión con GitHub no está configurada.');
  return window.fetch(url, {
    method, redirect: 'error', credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json',
      ...(body ? { 'Content-Type': 'application/json' } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}

export function checkConnection(window, token) {
  return githubRequest(window, token, `${api}/git/ref/heads/${branch}`);
}
