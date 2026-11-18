const route = '/AstroXmind/editor-api';

export function installGitHubDraft(root, { input, status, render, saveLocal }) {
  const controls = root.querySelector('[data-editor-github]');
  if (!controls) return;
  const window = root.ownerDocument.defaultView;
  const login = controls.querySelector('[data-github-login]');
  const load = controls.querySelector('[data-github-load]');
  const save = controls.querySelector('[data-github-save]');
  const result = controls.querySelector('[data-github-result]');
  let sha;

  login.addEventListener('click', event => {
    if (!saveLocal()) event.preventDefault();
  });

  async function request(method, body) {
    const response = await window.fetch(route + '/draft', {
      method, credentials: 'same-origin', redirect: 'error', cache: 'no-store',
      ...(body ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}),
    });
    if (response.status === 401) {
      login.hidden = false;
      sha = undefined;
      throw Error('Inicia sesión con GitHub. Tu texto sigue en el editor.');
    }
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 409) sha = undefined;
      throw Error(data.error || 'No se pudo acceder al borrador en GitHub.');
    }
    return data;
  }

  async function run(action) {
    load.disabled = true;
    save.disabled = true;
    try { await action(); }
    catch (error) { status.textContent = error.message; }
    finally {
      load.disabled = false;
      save.disabled = sha === undefined;
    }
  }

  load.addEventListener('click', () => void run(async () => {
    const data = await request('GET');
    if (data.markdown !== null && data.markdown !== input.value &&
        !window.confirm('¿Cargar el borrador de GitHub en el editor? Descarga tu texto actual si quieres conservarlo.')) return;
    if (data.markdown !== null) {
      input.value = data.markdown;
      render();
    }
    sha = data.sha;
    login.hidden = true;
    result.hidden = true;
    status.textContent = data.sha ? 'Borrador de GitHub abierto.' : 'Listo para crear un borrador en GitHub.';
  }));

  save.addEventListener('click', () => void run(async () => {
    if (sha === undefined) return;
    const markdown = input.value;
    const data = await request('PUT', { markdown, sha });
    sha = data.sha;
    result.href = data.url;
    result.hidden = false;
    status.textContent = input.value === markdown
      ? 'Borrador guardado en GitHub.'
      : 'Versión anterior guardada en GitHub. Hay cambios nuevos en el editor.';
  }));
}
