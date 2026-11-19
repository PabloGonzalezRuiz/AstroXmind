import { readToken, saveToken, forgetToken, watchToken, checkConnection } from './github-connection.mjs';

export function installGitHubSettings(root) {
  const window = root.ownerDocument.defaultView;
  const field = root.querySelector('[data-connection-token]');
  const store = root.querySelector('[data-connection-store]');
  const check = root.querySelector('[data-connection-check]');
  const forget = root.querySelector('[data-connection-forget]');
  const status = root.querySelector('[data-connection-status]');
  let token = '';
  let busy = false;

  function message(text, state = 'idle') {
    status.textContent = text;
    status.dataset.state = state;
  }

  function controls() {
    field.disabled = store.disabled = busy;
    check.disabled = forget.disabled = busy || !token;
  }

  async function run(action) {
    if (busy) return;
    busy = true;
    controls();
    try { await action(); }
    catch (error) { message(error.message || 'No se pudo comprobar la conexión.', 'error'); }
    finally { busy = false; controls(); }
  }

  async function verify() {
    message('Comprobando conexión con GitHub…');
    const candidate = token;
    const response = await checkConnection(window, candidate);
    if (token !== candidate) return;
    if (response.status === 401) {
      forgetToken(window);
      token = '';
      throw Error('El token ya no es válido. Guarda uno nuevo.');
    }
    if (!response.ok) throw Error('GitHub no confirmó el acceso. Comprueba el token y los permisos del repositorio.');
    message('Conexión comprobada. El repositorio y la rama de borradores son accesibles.', 'success');
  }

  store.addEventListener('click', () => void run(async () => {
    const entered = field.value.trim();
    saveToken(window, entered);
    token = entered;
    field.value = '';
    await verify();
  }));
  check.addEventListener('click', () => void run(verify));
  forget.addEventListener('click', () => void run(async () => {
    forgetToken(window);
    token = '';
    field.value = '';
    message('Token eliminado de este navegador.');
  }));
  watchToken(window, next => {
    token = next;
    controls();
    message(token ? 'Token guardado. Pulsa Comprobar conexión.' : 'No hay token guardado.');
  });
  try {
    token = readToken(window);
    controls();
    if (token) void run(verify);
  } catch { message('El navegador no permite almacenar el token.', 'error'); }
}
