import { stringify } from 'yaml';
import { readToken, tokenChangedEvent, watchToken } from './github-connection.mjs';
import { validatePrivateIdentity } from './private-access.mjs';

const repository = 'PabloGonzalezRuiz/AstroXmind-Datos';
const api = `https://api.github.com/repos/${repository}`;

export function prepararOposicion(nombre, id, fecha = new Date()) {
  nombre = nombre.trim();
  if (!nombre || nombre.length > 100 || /[\u0000-\u001f\u007f]/.test(nombre)) throw Error('Introduce un nombre válido de hasta 100 caracteres.');
  const carpeta = nombre.normalize('NFD').replace(/\p{M}/gu, '').toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (!carpeta) throw Error('El nombre debe contener letras o números.');
  const datos = { version: 1, id, nombre, fechaCreacion: fecha.toISOString(), faseActual: 2, fasesCompletadas: [1] };
  return { carpeta, datos, ruta: `Oposiciones/${carpeta}/oposicion.yaml`, yaml: stringify(datos) };
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

export async function guardarOposicion(window, token, nombre) {
  const record = prepararOposicion(nombre, `op-${window.crypto.randomUUID()}`);
  await comprobarAlmacen(window, token);
  const path = `/contents/${record.ruta}`;
  const existing = await request(window, token, `${path}?ref=main`);
  if (existing.ok) throw Error('Ya existe una oposición con ese nombre o carpeta. No se ha sobrescrito.');
  if (existing.status !== 404) throw Error('No se ha podido comprobar si la oposición existe.');
  if (token !== readToken(window)) throw Error('La sesión ha cambiado.');
  const content = window.btoa(Array.from(new TextEncoder().encode(record.yaml), byte => String.fromCharCode(byte)).join(''));
  const response = await request(window, token, path, 'PUT', { message: 'Crear oposición', content, branch: 'main' });
  if (response.status !== 201) throw Error('GitHub no ha confirmado el alta. Comprueba los permisos Contents (lectura y escritura) o si ya existe la carpeta.');
  return record;
}

export async function listarOposiciones(window, token) {
  await comprobarAlmacen(window, token);
  const response = await request(window, token, '/contents/Oposiciones?ref=main');
  if (response.status === 404) return [];
  if (!response.ok) throw Error('No se ha podido consultar las oposiciones.');
  const entries = await response.json();
  if (!Array.isArray(entries)) throw Error('La carpeta de oposiciones no es válida.');
  return entries.filter(entry => entry.type === 'dir' && /^[A-Z0-9]+(?:-[A-Z0-9]+)*$/.test(entry.name)).map(entry => entry.name).sort();
}

export function instalarOposiciones(document) {
  const window = document.defaultView;
  const form = document.querySelector('[data-oposicion-form]');
  if (!form) return;
  const panel = form.closest('[data-private-authorized]');
  const input = form.querySelector('input');
  const button = form.querySelector('button');
  const status = document.querySelector('[data-oposicion-status]');
  const list = document.querySelector('[data-oposicion-list]');
  let revision = 0;
  let tokenActivo = '';
  function limpiar() { ++revision; tokenActivo = ''; input.value = ''; status.textContent = ''; list.replaceChildren(); button.disabled = true; }
  async function cargar() {
    if (panel.hidden) return;
    const token = readToken(window);
    if (!token || token === tokenActivo) return;
    tokenActivo = token;
    const actual = ++revision;
    button.disabled = true;
    try {
      const nombres = await listarOposiciones(window, token);
      if (actual !== revision || token !== readToken(window)) return;
      list.replaceChildren(...nombres.map(nombre => { const li = document.createElement('li'); li.textContent = nombre; return li; }));
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
      const record = await guardarOposicion(window, token, input.value);
      if (actual !== revision || token !== readToken(window)) return;
      status.textContent = `Oposición creada: ${record.datos.nombre}. Ruta: ${record.ruta}. Paso 1 completado.`;
      input.value = '';
      tokenActivo = '';
      await cargar();
    } catch (error) { if (actual === revision) { status.textContent = error.message; button.disabled = false; } }
  });
  void cargar();
}
