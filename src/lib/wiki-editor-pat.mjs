import { parseDocument } from 'yaml';
import { validateNavigation } from './navigation/index.mjs';
import { repository, branch, api, readToken, forgetToken, watchToken, githubRequest } from './github-connection.mjs';

function encode(window, text) {
  let binary = '';
  for (const byte of new TextEncoder().encode(text)) binary += String.fromCharCode(byte);
  return window.btoa(binary);
}

function decode(window, base64) {
  return new TextDecoder().decode(Uint8Array.from(window.atob(base64.replace(/\s/g, '')), char => char.charCodeAt(0)));
}

export function validatePageSource(source, documentId) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(source);
  if (!match) throw Error('La página requiere un bloque YAML inicial.');
  const doc = parseDocument(match[1]);
  if (doc.errors.length) throw Error('El YAML contiene errores de sintaxis.');
  const data = doc.toJS();
  if (typeof data?.title !== 'string' || !data.title.trim()) throw Error('La página requiere un título.');
  const nav = validateNavigation(data.navigation);
  if (nav.id !== documentId) throw Error('El identificador navigation.id de la página debe conservarse.');
}

export function installGitHubPageEditor(root, { input, render, onSaved }) {
  const window = root.ownerDocument.defaultView;
  const path = root.dataset.sourcePath;
  if (!path?.startsWith('src/content/docs/') || !/\.mdx?$/.test(path) || /[\\\u0000-\u001f]/.test(path) || path.split('/').some(part => !part || part === '.' || part === '..')) throw Error('Ruta de documento no válida.');
  const contents = `${api}/contents/${path.split('/').map(encodeURIComponent).join('/')}`;
  const save = root.querySelector('[data-pat-save]');
  const retry = root.querySelector('[data-pat-load]');
  const result = root.querySelector('[data-pat-result]');
  const status = root.querySelector('[data-pat-status]');
  let token = '';
  let sha;
  let baseline = input.value;
  let busy = false;

  function message(text, state = 'idle') {
    status.textContent = text;
    status.dataset.state = state;
  }
  function controls() {
    save.disabled = busy || !token || !sha;
    retry.hidden = !token || !!sha || busy;
    retry.disabled = busy;
    input.readOnly = !sha && input.value === baseline;
  }
  async function request(url, method = 'GET', body) {
    const current = token;
    const response = await githubRequest(window, current, url, method, body);
    if (token !== current) throw Error('La conexión cambió. Vuelve a abrir la página.');
    if (response.status === 401) {
      forgetToken(window);
      token = '';
      sha = undefined;
      throw Error('El token ya no es válido. Guarda uno nuevo en Configuración.');
    }
    if (response.status === 403) throw Error('GitHub rechazó la operación. Comprueba los permisos del token.');
    return response;
  }
  async function run(action) {
    if (busy) return;
    busy = true;
    controls();
    try { await action(); }
    catch (error) { message(error.message || 'No se pudo completar la operación.', 'error'); }
    finally { busy = false; controls(); }
  }
  async function open() {
    if (busy) return;
    await run(async () => {
      sha = undefined;
      result.hidden = true;
      token = readToken(window);
      controls();
      if (!token) { message('Guarda un token en Configuración para editar la página.'); return; }
      message('Cargando la versión actual de GitHub…');
      const response = await request(`${contents}?ref=${encodeURIComponent(branch)}`);
      if (!response.ok) throw Error('No se pudo recuperar la página de GitHub.');
      const data = await response.json();
      if (data.type !== 'file' || data.encoding !== 'base64' || !/^[a-f0-9]{40}$/.test(data.sha)) throw Error('GitHub devolvió un archivo inesperado.');
      const markdown = decode(window, data.content).replace(/\r\n/g, '\n');
      if (input.value !== baseline && input.value !== markdown && !window.confirm('Hay cambios sin guardar. ¿Recuperar la versión de GitHub y descartar esos cambios?')) {
        message('Conserva o descarga tus cambios antes de recuperar la revisión.'); return;
      }
      input.value = baseline = markdown;
      sha = data.sha;
      render();
      message('Página preparada para editar.', 'success');
    });
  }
  retry.addEventListener('click', () => void open());
  save.addEventListener('click', () => void run(async () => {
    if (!token || !sha) return;
    const markdown = input.value;
    if (markdown === baseline) { message('La página ya está guardada. No hay cambios nuevos.', 'success'); return; }
    if (markdown.length > 120000) throw Error('La página supera el límite de 120.000 caracteres.');
    validatePageSource(markdown, root.dataset.documentId);
    const previous = sha;
    sha = undefined;
    result.hidden = true;
    message('Guardando la página en GitHub…');
    const response = await request(contents, 'PUT', { branch, sha: previous, message: `Editar ${path.split('/').at(-1)} desde AstroXmind`, content: encode(window, markdown) });
    if (response.status === 409 || response.status === 422) throw Error('La revisión cambió o GitHub rechazó el guardado. Recupera la revisión antes de reintentar.');
    if (!response.ok) throw Error('No se pudo confirmar el guardado. Recupera la revisión antes de reintentar.');
    const data = await response.json();
    if (!/^[a-f0-9]{40}$/.test(data.content?.sha) || !/^[a-f0-9]{40}$/.test(data.commit?.sha)) throw Error('No se pudo verificar el commit. Recupera la revisión.');
    sha = data.content.sha;
    baseline = markdown;
    result.href = `https://github.com/${repository}/commit/${data.commit.sha}`;
    result.hidden = false;
    const confirmation = `Página guardada en GitHub a las ${new Date().toLocaleTimeString('es-ES')}. Commit: ${data.commit.sha}. La publicación se actualizará cuando termine GitHub Actions.`;
    message(confirmation, 'success');
    if (input.value === markdown) onSaved(confirmation, result.href);
  }));
  watchToken(window, next => {
    token = next;
    sha = undefined;
    result.hidden = true;
    controls();
    message(token ? 'La conexión cambió. Recupera la revisión.' : 'Configura un token para editar.');
  });
  controls();
  return { open, isDirty: () => input.value !== baseline, isBusy: () => busy };
}
