const repository = 'PabloGonzalezRuiz/AstroXmind';
const branch = 'editor/drafts';
const path = 'editor-drafts/preview.md';
const api = `https://api.github.com/repos/${repository}`;
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

export function installGitHubPatDraft(root, { input, status, render }) {
  const controls = root.querySelector('[data-editor-pat]');
  if (!controls) return;
  const window = root.ownerDocument.defaultView;
  const field = controls.querySelector('[data-pat-token]');
  const load = controls.querySelector('[data-pat-load]');
  const save = controls.querySelector('[data-pat-save]');
  const disconnect = controls.querySelector('[data-pat-disconnect]');
  const result = controls.querySelector('[data-pat-result]');
  let token = '';
  let sha;

  function forget() {
    token = '';
    sha = undefined;
    field.value = '';
    field.disabled = false;
    save.disabled = true;
    disconnect.disabled = true;
    result.hidden = true;
  }

  async function request(url, method = 'GET', body) {
    const response = await window.fetch(url, {
      method, redirect: 'error', credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json',
        ...(body ? { 'Content-Type': 'application/json' } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (response.status === 401 || response.status === 403) {
      forget();
      throw Error('GitHub rechazó el acceso. Comprueba el token y los permisos de Contents.');
    }
    return response;
  }

  async function run(action) {
    load.disabled = save.disabled = disconnect.disabled = field.disabled = true;
    try { await action(); }
    catch (error) { status.textContent = error.message; }
    finally {
      load.disabled = false;
      field.disabled = !!token;
      disconnect.disabled = !token;
      save.disabled = !token || sha === undefined;
    }
  }

  disconnect.addEventListener('click', () => {
    forget();
    status.textContent = 'Sesión de GitHub desconectada. Tu texto sigue en el editor.';
  });
  window.addEventListener('pagehide', forget);

  load.addEventListener('click', () => void run(async () => {
    const entered = field.value.trim();
    field.value = '';
    sha = undefined;
    result.hidden = true;
    if (entered) {
      token = '';
      if (!/^github_pat_[\w]+$/.test(entered)) throw Error('Introduce un token de acceso personal fine-grained de GitHub.');
      token = entered;
    }
    if (!token) throw Error('Introduce el token de GitHub para abrir el borrador.');
    const ref = await request(`${api}/git/ref/heads/${branch}`);
    if (!ref.ok) throw Error('No se puede abrir la rama de borradores. Comprueba el acceso o la existencia de la rama.');
    const response = await request(`${contents}?ref=${encodeURIComponent(branch)}`);
    if (response.status === 404) {
      sha = null;
      status.textContent = 'Conectado. Listo para crear el borrador de prueba.';
      return;
    }
    if (!response.ok) throw Error('No se pudo recuperar el borrador de GitHub.');
    const data = await response.json();
    if (data.type !== 'file' || data.encoding !== 'base64' || !/^[a-f0-9]{40}$/.test(data.sha)) throw Error('GitHub devolvió un borrador inesperado.');
    const markdown = decode(window, data.content);
    if (markdown !== input.value && !window.confirm('¿Cargar el borrador de GitHub? Descarga tu texto actual si quieres conservarlo.')) return;
    input.value = markdown;
    render();
    sha = data.sha;
    status.textContent = 'Borrador de GitHub abierto.';
  }));

  save.addEventListener('click', () => void run(async () => {
    if (!token || sha === undefined) return;
    const markdown = input.value;
    if (markdown.length > 120000) throw Error('El borrador supera el límite de 120.000 caracteres.');
    const previous = sha;
    // A missing response may still mean GitHub committed the change. Require reloading before retrying.
    sha = undefined;
    result.hidden = true;
    const response = await request(contents, 'PUT', { branch, message: 'Guardar borrador de AstroXmind',
      content: encode(window, markdown), ...(previous ? { sha: previous } : {}) });
    if (response.status === 409 || response.status === 422) throw Error('El borrador cambió o GitHub rechazó la escritura. Vuelve a abrirlo antes de guardar.');
    if (!response.ok) throw Error('No se pudo confirmar el guardado. Vuelve a abrir el borrador antes de reintentar.');
    const data = await response.json();
    if (!/^[a-f0-9]{40}$/.test(data.content?.sha) || !/^[a-f0-9]{40}$/.test(data.commit?.sha)) throw Error('No se pudo verificar el commit. Vuelve a abrir el borrador.');
    sha = data.content.sha;
    result.href = `https://github.com/${repository}/commit/${data.commit.sha}`;
    result.hidden = false;
    status.textContent = input.value === markdown ? 'Borrador guardado en GitHub.' : 'Versión anterior guardada en GitHub. Hay cambios nuevos en el editor.';
  }));
}
