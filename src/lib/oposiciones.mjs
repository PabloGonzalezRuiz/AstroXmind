import { parse, stringify } from 'yaml';
import { readToken, tokenChangedEvent, watchToken } from './github-connection.mjs';
import { validatePrivateIdentity } from './private-access.mjs';

const repository = 'PabloGonzalezRuiz/AstroXmind-Datos';
const api = `https://api.github.com/repos/${repository}`;

const idPattern = /^op-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const folderPattern = /^(?:[A-Z0-9]+(?:-[A-Z0-9]+)*|op-[0-9a-f-]+)$/;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function nombreValido(nombre) {
  nombre = nombre.trim();
  if (!nombre || nombre.length > 100 || /[\u0000-\u001f\u007f]/.test(nombre)) throw Error('Introduce un nombre válido de hasta 100 caracteres.');
  return nombre;
}

export function slugDe(nombre) {
  const slug = nombreValido(nombre).normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (!slug) throw Error('El nombre corto debe contener letras o números.');
  return slug;
}

function registro(carpeta, datos) { return { carpeta, datos, ruta: `Oposiciones/${carpeta}/oposicion.yaml`, yaml: stringify(datos) }; }

export function prepararOposicion(nombre, id, fecha = new Date(), nombreCorto = nombre) {
  if (!idPattern.test(id)) throw Error('Identificador de oposición no válido.');
  nombre = nombreValido(nombre);
  nombreCorto = nombreValido(nombreCorto);
  return registro(id, { version: 2, id, nombre, nombreCorto, slug: slugDe(nombreCorto), alias: [], fechaCreacion: fecha.toISOString(), faseActual: 2, fasesCompletadas: [1] });
}

export function leerOposicion(carpeta, yaml) {
  const datos = parse(yaml, { maxAliasCount: 0 });
  if (!folderPattern.test(carpeta) || !datos || !idPattern.test(datos.id) || typeof datos.nombre !== 'string') throw Error('Metadatos de oposición no válidos.');
  if (datos.version === 1) return registro(carpeta, { ...datos, version: 2, nombreCorto: datos.nombre, slug: slugDe(datos.nombre), alias: [] });
  if (datos.version !== 2 || typeof datos.nombreCorto !== 'string' || !slugPattern.test(datos.slug) || datos.slug !== slugDe(datos.nombreCorto) || !Array.isArray(datos.alias) || datos.alias.some(alias => typeof alias !== 'string' || !slugPattern.test(alias))) throw Error('Metadatos de navegación no válidos.');
  return registro(carpeta, datos);
}

export function resolverOposicion(registros, slug) {
  return registros.find(({ datos }) => datos.slug === slug || datos.alias.includes(slug));
}

export function renombrarOposicion(record, nombre, nombreCorto) {
  nombre = nombreValido(nombre);
  nombreCorto = nombreValido(nombreCorto);
  const slug = slugDe(nombreCorto);
  const alias = [...new Set([...record.datos.alias, record.datos.slug])].filter(value => value !== slug);
  return registro(record.carpeta, { ...record.datos, nombre, nombreCorto, slug, alias });
}

async function request(window, token, path = '', method = 'GET', body) {
  return window.fetch(`${api}${path}`, {
    method, redirect: 'error', credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', ...(body ? { 'Content-Type': 'application/json' } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}

async function comprobarAlmacen(window, token) {
  const identity = await validatePrivateIdentity(window, token);
  if (!identity.authorized) throw Error(identity.message);
  const response = await request(window, token);
  if (!response.ok) throw Error('No se puede acceder a AstroXmind-Datos. Comprueba que tu token incluye este repositorio privado.');
  const repo = await response.json();
  if (repo.private !== true || repo.full_name !== repository || repo.owner?.id !== 4293401 || repo.default_branch !== 'main') throw Error('El almacén no cumple los requisitos de privacidad. Operación cancelada.');
  if (token !== readToken(window)) throw Error('La sesión ha cambiado.');
}

function vigente(window, token) { if (token !== readToken(window)) throw Error('La sesión ha cambiado.'); }

async function obtener(window, token, path, method = 'GET', body) {
  vigente(window, token);
  const response = await request(window, token, path, method, body);
  if (!response.ok) throw Error('GitHub no ha confirmado la operación. Comprueba los permisos y vuelve a intentarlo.');
  return response.json();
}

async function instantanea(window, token) {
  await comprobarAlmacen(window, token);
  const ref = await obtener(window, token, '/git/ref/heads/main');
  const head = ref.object?.sha;
  if (!/^[a-f0-9]{40}$/.test(head)) throw Error('Rama de datos no válida.');
  const commit = await obtener(window, token, `/git/commits/${head}`);
  const tree = commit.tree?.sha;
  if (!/^[a-f0-9]{40}$/.test(tree)) throw Error('Árbol de datos no válido.');
  const response = await request(window, token, `/contents/Oposiciones?ref=${head}`);
  if (response.status === 404) return { head, tree, registros: [] };
  if (!response.ok) throw Error('No se ha podido consultar las oposiciones.');
  const entries = await response.json();
  if (!Array.isArray(entries) || entries.length >= 1000) throw Error('La carpeta de oposiciones no es válida o supera el límite de consulta.');
  const registros = await Promise.all(entries.filter(entry => entry.type === 'dir').map(async entry => {
    if (!folderPattern.test(entry.name)) throw Error('Carpeta de oposición no válida.');
    const file = await obtener(window, token, `/contents/Oposiciones/${entry.name}/oposicion.yaml?ref=${head}`);
    if (file.encoding !== 'base64' || typeof file.content !== 'string') throw Error('Metadatos de oposición ilegibles.');
    const yaml = new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(window.atob(file.content), char => char.charCodeAt(0)));
    return leerOposicion(entry.name, yaml);
  }));
  const ids = new Set(), slugs = new Set();
  for (const { datos } of registros) {
    if (ids.has(datos.id)) throw Error('Identificador de oposición duplicado.');
    ids.add(datos.id);
    for (const slug of [datos.slug, ...datos.alias]) { if (slugs.has(slug)) throw Error('URL de oposición duplicada.'); slugs.add(slug); }
  }
  return { head, tree, registros };
}

async function persistir(window, token, snapshot, record, mensaje) {
  // El commit parte de la misma instantánea que se validó. Un cambio concurrente
  // impide el avance no forzado de main: nunca se pisan cambios ni reservas de URL.
  const tree = await obtener(window, token, '/git/trees', 'POST', { base_tree: snapshot.tree, tree: [{ path: record.ruta, mode: '100644', type: 'blob', content: record.yaml }] });
  const commit = await obtener(window, token, '/git/commits', 'POST', { message: mensaje, tree: tree.sha, parents: [snapshot.head] });
  await comprobarAlmacen(window, token);
  await obtener(window, token, '/git/refs/heads/main', 'PATCH', { sha: commit.sha, force: false });
  return record;
}

export async function guardarOposicion(window, token, nombre, nombreCorto = nombre) {
  const record = prepararOposicion(nombre, `op-${window.crypto.randomUUID()}`, new Date(), nombreCorto);
  const snapshot = await instantanea(window, token);
  if (resolverOposicion(snapshot.registros, record.datos.slug) || snapshot.registros.some(item => item.datos.id === record.datos.id || item.carpeta === record.carpeta)) throw Error('Ya existe una oposición con ese identificador o URL.');
  return persistir(window, token, snapshot, record, 'Crear oposición');
}

export async function actualizarOposicion(window, token, id, nombre, nombreCorto) {
  const snapshot = await instantanea(window, token);
  const previous = snapshot.registros.find(record => record.datos.id === id);
  if (!previous) throw Error('No se encuentra la oposición.');
  const record = renombrarOposicion(previous, nombre, nombreCorto);
  if (resolverOposicion(snapshot.registros.filter(item => item.datos.id !== id), record.datos.slug)) throw Error('La URL ya pertenece a otra oposición.');
  return persistir(window, token, snapshot, record, 'Actualizar nombre de oposición');
}

export async function listarOposiciones(window, token) {
  return (await instantanea(window, token)).registros.sort((a, b) => a.datos.nombre.localeCompare(b.datos.nombre, 'es'));
}

export function instalarOposiciones(document) {
  const window = document.defaultView;
  const form = document.querySelector('[data-oposicion-form]');
  if (!form) return;
  const panel = form.closest('[data-private-authorized]');
  const input = form.querySelector('input');
  const corto = form.querySelector('[name="nombreCorto"]');
  const button = form.querySelector('button');
  const status = document.querySelector('[data-oposicion-status]');
  const list = document.querySelector('[data-oposicion-list]');
  const edit = document.querySelector('[data-oposicion-edit]');
  const editNombre = edit.querySelector('[name="nombre"]');
  const editCorto = edit.querySelector('[name="nombreCorto"]');
  const editButton = edit.querySelector('button');
  const detail = document.querySelector('[data-oposicion-detail]');
  const linkBase = form.dataset.oposicionUrl;
  let revision = 0;
  let tokenActivo = '';
  let seleccionado;
  function url(slug) { return `${linkBase}?o=${encodeURIComponent(slug)}`; }
  function limpiar() { ++revision; tokenActivo = ''; seleccionado = undefined; input.value = ''; corto.value = ''; editNombre.value = ''; editCorto.value = ''; edit.hidden = true; detail.textContent = ''; status.textContent = ''; list.replaceChildren(); button.disabled = true; editButton.disabled = true; }
  function mostrar(registros) {
    list.replaceChildren(...registros.map(({datos}) => { const li = document.createElement('li'); const a = document.createElement('a'); a.textContent = `${datos.nombre} (${datos.nombreCorto})`; a.href = url(datos.slug); li.append(a); return li; }));
    const slug = new URL(window.location.href).searchParams.get('o');
    seleccionado = slug ? resolverOposicion(registros, slug) : undefined;
    edit.hidden = !seleccionado;
    editButton.disabled = !seleccionado;
    detail.textContent = slug && !seleccionado ? 'No se encuentra esta oposición.' : '';
    if (seleccionado) {
      const datos = seleccionado.datos;
      editNombre.value = datos.nombre; editCorto.value = datos.nombreCorto;
      detail.textContent = `Oposición seleccionada: ${datos.nombre} · ${datos.id}`;
      if (slug !== datos.slug) window.history.replaceState(null, '', url(datos.slug));
    }
  }
  async function cargar() {
    if (panel.hidden) return;
    const token = readToken(window);
    if (!token || token === tokenActivo) return;
    tokenActivo = token;
    const actual = ++revision;
    button.disabled = true;
    try {
      const registros = await listarOposiciones(window, token);
      if (actual !== revision || token !== readToken(window)) return;
      mostrar(registros);
      button.disabled = false;
    } catch (error) { if (actual === revision) { tokenActivo = ''; status.textContent = error.message; } }
  }
  new window.MutationObserver(() => { if (!panel.hidden) void cargar(); }).observe(panel, { attributes: true, attributeFilter: ['hidden'] });
  watchToken(window, limpiar);
  window.addEventListener(tokenChangedEvent, limpiar);
  window.addEventListener('astroxmind:private-access-revoked', limpiar);
  window.addEventListener('pagehide', limpiar);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (button.disabled || panel.hidden) return;
    const token = readToken(window);
    const actual = ++revision;
    button.disabled = true;
    status.textContent = 'Guardando oposición…';
    try {
      const record = await guardarOposicion(window, token, input.value, corto.value.trim() || input.value);
      if (actual !== revision || token !== readToken(window)) return;
      status.textContent = `Oposición creada: ${record.datos.nombre}. Ruta: ${record.ruta}. Paso 1 completado.`;
      input.value = ''; corto.value = '';
      tokenActivo = '';
      await cargar();
    } catch (error) { if (actual === revision) { status.textContent = error.message; button.disabled = false; } }
  });
  edit.addEventListener('submit', async event => {
    event.preventDefault();
    if (editButton.disabled || button.disabled || panel.hidden || !seleccionado) return;
    const token = readToken(window), actual = ++revision;
    button.disabled = true; editButton.disabled = true;
    status.textContent = 'Actualizando nombre…';
    try {
      const record = await actualizarOposicion(window, token, seleccionado.datos.id, editNombre.value, editCorto.value);
      if (actual !== revision || token !== readToken(window)) return;
      window.history.replaceState(null, '', url(record.datos.slug));
      status.textContent = 'Nombre actualizado. El identificador y los enlaces antiguos se conservan.';
      tokenActivo = '';
      await cargar();
    } catch (error) { if (actual === revision) { status.textContent = error.message; button.disabled = false; editButton.disabled = false; } }
  });
  void cargar();
}
