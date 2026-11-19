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

// A commit cannot contain its own SHA: changing its source changes its SHA.
export function stampPageRevision(source, previousBlob, revision, date) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(source);
  if (!match) throw Error('La página requiere un bloque YAML inicial.');
  const header = match[0].replace(/^# astroxmind-revision: [^\r\n]*\r?\n/gm, '');
  return header.replace(/^---\r?\n/, opening => opening + `# astroxmind-revision: ${revision} | previous-blob: ${previousBlob} | saved-at: ${date}\n`) + source.slice(match[0].length);
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
  const caption = root.querySelector('.reader-caption');
  const publishedSource = input.defaultValue;
  const storageKey = 'astroxmind:verified-save:' + path;
  function badge(text, state) {
    if (!caption) return;
    caption.textContent = text;
    caption.style.color = state === 'success' ? 'var(--sl-color-green-high, #237a42)' : state === 'error' ? 'var(--sl-color-red-high, #b42318)' : '';
  }
  const marker = publishedSource.match(/^---\r?\n# astroxmind-revision: ([a-f0-9-]{36}) \| previous-blob: [a-f0-9]{40} \| saved-at: ([^\r\n]+)/);
  if (marker) {
    badge('Revisión publicada · ' + marker[1].slice(0, 8), 'idle');
    if (caption) caption.title = 'Revisión: ' + marker[1] + ' · ' + marker[2];
  }
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(storageKey) || 'null');
    if (saved?.source === publishedSource && /^[a-f0-9]{40}$/.test(saved.commit)) {
      badge('✓ Publicación confirmada · ' + saved.commit.slice(0, 7), 'success');
      if (caption) caption.title = 'Último guardado verificado: ' + saved.commit;
    }
  } catch { /* Storage may be unavailable. */ }

  function message(text, state = 'idle') {
    status.textContent = text;
    status.dataset.state = state;
  }
  function controls() {
    save.disabled = busy || !token || !sha;
    retry.hidden = !token || !!sha || busy;
    retry.disabled = busy;
    // Local experimentation is available even without credentials. Only a
    // verified GitHub revision enables persistence.
    input.readOnly = busy;
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
    catch (error) { message(error.message || 'No se pudo completar la operación.', 'error'); badge('⚠ Operación no confirmada', 'error'); }
    finally { busy = false; controls(); }
  }
  async function open() {
    if (busy) return;
    await run(async () => {
      sha = undefined;
      result.hidden = true;
      token = readToken(window);
      controls();
      if (!token) { message('Puedes probar cambios en directo sin guardarlos. Configura el token de GitHub para guardar.'); return; }
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
      const history = await request(`${api}/commits?sha=${encodeURIComponent(branch)}&path=${encodeURIComponent(path)}&per_page=1`);
      const latest = history.ok ? (await history.json())?.[0] : null;
      const sourceMarker = markdown.match(/^---\r?\n# astroxmind-revision: ([a-f0-9-]{36}) /)?.[1];
      const matched = sourceMarker && /^[a-f0-9]{40}$/.test(latest?.sha) && latest.commit?.message?.includes('[' + sourceMarker + ']');
      if (matched) {
        const snapshot = await request(`${contents}?ref=${encodeURIComponent(latest.sha)}`);
        if (snapshot.ok) {
          const file = await snapshot.json();
          if (file.sha === sha && file.encoding === 'base64' && decode(window, file.content).replace(/\r\n/g, '\n') === markdown) {
            result.href = `https://github.com/${repository}/commit/${latest.sha}`;
            result.hidden = false;
            message('✓ Sincronizado con el repositorio. Commit: ' + latest.sha.slice(0, 7), 'success');
            badge(markdown === publishedSource ? '✓ Sincronizado · ' + latest.sha.slice(0, 7) : 'GitHub actualizado; publicación pendiente', markdown === publishedSource ? 'success' : 'idle');
            return;
          }
        }
      }
      message('✓ Contenido actualizado desde GitHub. ' + (sourceMarker ? 'La marca no corresponde al último commit; se actualizará al guardar cambios.' : 'Documento sin marca de revisión; se añadirá al guardar cambios.') + ' Archivo: ' + sha.slice(0, 7), 'success');
      badge(markdown === publishedSource ? '✓ Sincronizado con el repositorio' : 'GitHub tiene una revisión distinta de la publicación', markdown === publishedSource ? 'success' : 'idle');
    });
  }
  retry.addEventListener('click', () => void open());
  save.addEventListener('click', () => void run(async () => {
    if (!token || !sha) return;
    const draft = input.value;
    if (draft === baseline) {
      const current = await request(`${contents}?ref=${encodeURIComponent(branch)}`);
      if (!current.ok) throw Error('No se pudo comprobar la revisión actual de GitHub.');
      const file = await current.json();
      if (file.sha !== sha || file.encoding !== 'base64' || decode(window, file.content).replace(/\r\n/g, '\n') !== baseline) {
        sha = undefined;
        throw Error('El documento ya no está sincronizado. Recupera la revisión de GitHub.');
      }
      message('✓ Sincronizado con el repositorio. No hay cambios nuevos.', 'success');
      badge('✓ Sincronizado con el repositorio', 'success');
      return;
    }
    validatePageSource(draft, root.dataset.documentId);
    const previous = sha;
    const revision = window.crypto.randomUUID();
    const markdown = stampPageRevision(draft, previous, revision, new Date().toISOString());
    if (markdown.length > 120000) throw Error('La página supera el límite de 120.000 caracteres.');
    sha = undefined;
    result.hidden = true;
    message('Guardando la página en GitHub…');
    const response = await request(contents, 'PUT', { branch, sha: previous, message: `Editar ${path.split('/').at(-1)} desde AstroXmind [${revision}]`, content: encode(window, markdown) });
    if (response.status === 409 || response.status === 422) throw Error('La revisión cambió o GitHub rechazó el guardado. Recupera la revisión antes de reintentar.');
    if (!response.ok) throw Error('No se pudo confirmar el guardado. Recupera la revisión antes de reintentar.');
    const data = await response.json();
    if (!/^[a-f0-9]{40}$/.test(data.content?.sha) || !/^[a-f0-9]{40}$/.test(data.commit?.sha)) throw Error('No se pudo verificar el commit. Recupera la revisión.');
    const verification = await request(`${contents}?ref=${encodeURIComponent(data.commit.sha)}`);
    if (!verification.ok) throw Error('GitHub devolvió un commit, pero no se pudo comprobar su contenido. Recupera la revisión.');
    const verified = await verification.json();
    if (verified.type !== 'file' || verified.encoding !== 'base64' || verified.sha !== data.content.sha || decode(window, verified.content) !== markdown) throw Error('El contenido del commit no coincide con el documento. Recupera la revisión.');
    sha = data.content.sha;
    baseline = markdown;
    if (input.value === draft) input.value = markdown;
    try { window.sessionStorage.setItem(storageKey, JSON.stringify({ source: markdown, commit: data.commit.sha })); } catch { /* Saving must not depend on browser storage. */ }
    badge('✓ Guardado en GitHub · ' + data.commit.sha.slice(0, 7), 'success');
    result.href = `https://github.com/${repository}/commit/${data.commit.sha}`;
    result.hidden = false;
    const confirmation = `✓ Guardado confirmado en GitHub a las ${new Date().toLocaleTimeString('es-ES')}. Commit: ${data.commit.sha}. La publicación se actualizará cuando termine GitHub Actions.`;
    message(confirmation, 'success');
    if (input.value === markdown) onSaved(confirmation, result.href, markdown, data.commit.sha);
  }));
  watchToken(window, next => {
    token = next;
    sha = undefined;
    result.hidden = true;
    controls();
    message(token ? 'La conexión cambió. Recupera la revisión.' : 'Configura un token para editar.');
  });
  input.addEventListener('input', () => {
    if (input.value !== baseline) badge('Cambios sin guardar', 'idle');
  });
  controls();
  return { open, isDirty: () => input.value !== baseline, isBusy: () => busy };
}
