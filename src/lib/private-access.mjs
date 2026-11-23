import { readToken, watchToken, tokenChangedEvent } from './github-connection.mjs';

// Identidad estable de la cuenta propietaria, no un nombre editable ni una sesión local.
const authorizedAccountId = 4293401;
const userEndpoint = 'https://api.github.com/user';

export async function validatePrivateIdentity(window, token) {
  if (!/^github_pat_[\w]+$/.test(token)) return { authorized: false, message: 'El token guardado no tiene el formato admitido.' };
  const response = await window.fetch(userEndpoint, {
    method: 'GET', redirect: 'error', credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
  });
  if (!response.ok) return { authorized: false, message: response.status === 401 ? 'El token no es válido o ha caducado. Revísalo en Configuración.' : 'GitHub no ha confirmado la autorización. Revisa la conexión y los permisos.' };
  const user = await response.json();
  return user?.id === authorizedAccountId
    ? { authorized: true, message: 'Cuenta autorizada.' }
    : { authorized: false, message: 'El token pertenece a una cuenta distinta de la autorizada.' };
}

// Solo controla la interfaz pública. Los datos privados deberán tener autorización
// independiente en el servicio de almacenamiento; nunca se incluyen en esta página.
export function installPrivateAccess(document) {
  const window = document.defaultView;
  const menus = [...document.querySelectorAll('[data-private-menu]')];
  const panels = [...document.querySelectorAll('[data-private-authorized]')];
  const statuses = [...document.querySelectorAll('[data-private-status]')];
  const menuStatuses = [...document.querySelectorAll('[data-private-menu-status]')];
  if (!menus.length && !panels.length) return;
  let revision = 0;
  function update(authorized, text) {
    for (const element of [...menus, ...panels]) element.hidden = !authorized;
    for (const status of statuses) { status.hidden = authorized; status.textContent = text; }
    for (const status of menuStatuses) { status.hidden = authorized; status.textContent = authorized ? '' : text; }
    if (!authorized) window.dispatchEvent(new window.Event(text === 'Comprobando autorización con GitHub…' ? 'astroxmind:private-access-checking' : 'astroxmind:private-access-revoked'));
  }
  async function refresh() {
    const current = ++revision;
    update(false, 'Comprobando autorización con GitHub…');
    try {
      const token = readToken(window);
      if (!token) { update(false, 'Acceso restringido. Configura tu token de GitHub.'); return; }
      const result = await validatePrivateIdentity(window, token);
      if (current !== revision || token !== readToken(window)) return;
      update(result.authorized, result.message);
    } catch {
      if (current === revision) update(false, 'No se ha podido comprobar la autorización con GitHub.');
    }
  }
  watchToken(window, refresh);
  window.addEventListener(tokenChangedEvent, refresh);
  window.addEventListener('focus', refresh);
  window.addEventListener('pageshow', refresh);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void refresh();
    else { ++revision; update(false, 'Autorización pendiente de comprobación.'); }
  });
  const timer = window.setInterval(() => { if (document.visibilityState === 'visible') void refresh(); }, 60000);
  window.addEventListener('pagehide', event => { ++revision; update(false, 'Autorización pendiente de comprobación.'); if (!event.persisted) window.clearInterval(timer); });
  void refresh();
}
