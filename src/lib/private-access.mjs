import { readToken, watchToken, tokenChangedEvent } from './github-connection.mjs';

// Identidad estable de la cuenta propietaria, no un nombre editable ni una sesión local.
const authorizedAccountId = 4293401;
const userEndpoint = 'https://api.github.com/user';

export async function validatePrivateIdentity(window, token) {
  if (!/^github_pat_[\w]+$/.test(token)) return false;
  const response = await window.fetch(userEndpoint, {
    method: 'GET', redirect: 'error', credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
  });
  if (!response.ok) return false;
  const user = await response.json();
  return user?.id === authorizedAccountId;
}

// Solo controla la interfaz pública. Los datos privados deberán tener autorización
// independiente en el servicio de almacenamiento; nunca se incluyen en esta página.
export function installPrivateAccess(document) {
  const window = document.defaultView;
  const menus = [...document.querySelectorAll('[data-private-menu]')];
  const panels = [...document.querySelectorAll('[data-private-authorized]')];
  const statuses = [...document.querySelectorAll('[data-private-status]')];
  if (!menus.length && !panels.length) return;
  let revision = 0;
  function update(authorized, text) {
    for (const element of [...menus, ...panels]) element.hidden = !authorized;
    for (const status of statuses) { status.hidden = authorized; status.textContent = text; }
  }
  async function refresh() {
    const current = ++revision;
    update(false, 'Comprobando autorización con GitHub…');
    try {
      const token = readToken(window);
      if (!token) { update(false, 'Acceso restringido. Configura tu token de GitHub.'); return; }
      const authorized = await validatePrivateIdentity(window, token);
      if (current !== revision || token !== readToken(window)) return;
      update(authorized, 'Acceso restringido. GitHub no ha confirmado una cuenta autorizada.');
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
