import { repository, branch, api, readToken, forgetToken, watchToken, githubRequest } from './github-connection.mjs';
const path = 'editor-drafts/preview.md';
const contents = `${api}/contents/${path}`;

function encode(window, text) {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return window.btoa(binary);
}

function decode(window, base64) {
  const bytes = Uint8Array.from(window.atob(base64.replace(/\s/g, '')), char => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function installGitHubPatDraft(root, { input, render }) {
  const controls = root.querySelector('[data-editor-pat]');
  if (!controls) return;
  const window = root.ownerDocument.defaultView;
  const load = controls.querySelector('[data-pat-load]');
  const save = controls.querySelector('[data-pat-save]');
  const result = controls.querySelector('[data-pat-result]');
  const status = root.querySelector('[data-pat-status]');
  let token = '';
  let sha;
  let lastMarkdown;
  let busy = false;

  function message(text, state = 'idle') {
    status.textContent = text;
    status.dataset.state = state;
  }

  function updateControls() {
    load.disabled = busy || !token;
    save.disabled = busy || !token || sha === undefined;
  }

  function forget() {
    token = '';
    sha = undefined;
    lastMarkdown = undefined;
    result.hidden = true;
    forgetToken(window);
    updateControls();
  }

  async function request(url, method = 'GET', body) {
    const requestToken = token;
    const response = await githubRequest(window, token, url, method, body);
    if (token !== requestToken) throw Error('La conexión cambió. Vuelve a abrir el borrador.');
    if (response.status === 401) {
      forget();
      throw Error('El token ya no es válido. Guarda uno nuevo en Configuración de GitHub.');
    }
    if (response.status === 403) throw Error('GitHub rechazó la operación. Comprueba los permisos de Contents y vuelve a abrir el borrador.');
    return response;
  }

  async function run(action) {
    if (busy) return;
    busy = true;
    updateControls();
    try { await action(); }
    catch (error) { message(error.message || 'No se pudo completar la operación.', 'error'); }
    finally {
      busy = false;
      updateControls();
    }
  }

  async function openDraft({ automatic = false } = {}) {
    sha = undefined;
    lastMarkdown = undefined;
    result.hidden = true;
    if (!token) throw Error('Guarda el token en Configuración de GitHub para abrir el borrador.');
    message('Conectando con GitHub…');
    const ref = await request(`${api}/git/ref/heads/${branch}`);
    if (!ref.ok) throw Error('No se puede abrir la rama de borradores. Comprueba el acceso o la existencia de la rama.');
    const response = await request(`${contents}?ref=${encodeURIComponent(branch)}`);
    if (response.status === 404) {
      sha = null;
      message('Conectado. Listo para crear el borrador de prueba.', 'success');
      return;
    }
    if (!response.ok) throw Error('No se pudo recuperar el borrador de GitHub.');
    const data = await response.json();
    if (data.type !== 'file' || data.encoding !== 'base64' || !/^[a-f0-9]{40}$/.test(data.sha)) throw Error('GitHub devolvió un borrador inesperado.');
    const markdown = decode(window, data.content);
    if (markdown !== input.value && (!automatic || input.value !== input.defaultValue)) {
      if (automatic || !window.confirm('¿Cargar el borrador de GitHub? Descarga tu texto actual si quieres conservarlo.')) {
        message('Hay texto distinto en el editor. Descárgalo si quieres conservarlo y pulsa Abrir borrador de GitHub para habilitar el guardado.');
        return;
      }
    }
    input.value = markdown;
    render();
    sha = data.sha;
    lastMarkdown = markdown;
    message('Conectado. Borrador de GitHub abierto.', 'success');
  }

  load.addEventListener('click', () => void run(() => openDraft()));

  save.addEventListener('click', () => void run(async () => {
    if (!token || sha === undefined) return;
    const markdown = input.value;
    if (markdown.length > 120000) throw Error('El borrador supera el límite de 120.000 caracteres.');
    if (sha && markdown === lastMarkdown) {
      message('El borrador ya está guardado en GitHub. No hay cambios nuevos.', 'success');
      return;
    }
    const previous = sha;
    // A missing response may still mean GitHub committed the change. Require reloading before retrying.
    sha = undefined;
    result.hidden = true;
    message('Guardando en GitHub…');
    const response = await request(contents, 'PUT', { branch, message: 'Guardar borrador de AstroXmind',
      content: encode(window, markdown), ...(previous ? { sha: previous } : {}) });
    if (response.status === 409 || response.status === 422) throw Error('El borrador cambió o GitHub rechazó la escritura. Vuelve a abrirlo antes de guardar.');
    if (!response.ok) throw Error('No se pudo confirmar el guardado. Vuelve a abrir el borrador antes de reintentar.');
    const data = await response.json();
    if (!/^[a-f0-9]{40}$/.test(data.content?.sha) || !/^[a-f0-9]{40}$/.test(data.commit?.sha)) throw Error('No se pudo verificar el commit. Vuelve a abrir el borrador.');
    sha = data.content.sha;
    lastMarkdown = markdown;
    result.href = `https://github.com/${repository}/commit/${data.commit.sha}`;
    result.hidden = false;
    const time = new Date().toLocaleTimeString('es-ES');
    const confirmation = input.value === markdown
      ? `Borrador guardado en GitHub a las ${time}.`
      : `Versión guardada a las ${time}. Hay cambios nuevos en el editor.`;
    message(`${confirmation} Commit: ${data.commit.sha}`, 'success');
  }));

  watchToken(window, next => {
    token = next;
    sha = undefined;
    lastMarkdown = undefined;
    result.hidden = true;
    updateControls();
    message(token ? 'El token cambió en otra pestaña. Abre el borrador para continuar.' : 'El token se eliminó en otra pestaña.');
  });
  try {
    token = readToken(window);
    updateControls();
    if (token) void run(() => openDraft({ automatic: true }));
  } catch {
    message('El navegador no permite conservar el token. Activa el almacenamiento local para usar GitHub.', 'error');
  }
}
