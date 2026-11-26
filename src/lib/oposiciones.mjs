import { parse, stringify } from 'yaml';
import { readToken, tokenChangedEvent, watchToken } from './github-connection.mjs';
import { validatePrivateIdentity } from './private-access.mjs';
import { leerPdfTAI } from './convocatoria-pdf.mjs';
import { crearReglasCorreccion } from './reglas-correccion.mjs';
import { leerCriteriosCPS } from './criterios-cps.mjs';
import { rutasPrograma, leerBorradorPrograma, mostrarBorradorPrograma } from './programa-vista.mjs';
import { prepararPrimeraApertura } from './editor-apertura.mjs';
import { eventoRevisionEditor } from './editor-contextual.mjs';
import { abrirModeloPrograma, prepararGuardadoPrograma } from './programa-editor-browser.mjs';
import { prepararRevisionEditor, abrirRevisionEditor, leerPuntero } from './editor-persistencia.mjs';
import { abrirCatalogoConocimiento, rutaCatalogo } from './almacen-conocimiento.mjs';
import { crearCacheConocimiento } from './cache-conocimiento.mjs';

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

async function persistirArchivos(window, token, snapshot, archivos, mensaje) {
  // El commit parte de la misma instantánea que se validó. Un cambio concurrente
  // impide el avance no forzado de main: nunca se pisan cambios ni reservas de URL.
  const tree = await obtener(window, token, '/git/trees', 'POST', { base_tree: snapshot.tree, tree: archivos.map(item => ({ path: item.ruta, mode: '100644', type: 'blob', ...(item.eliminar ? { sha: null } : item.sha ? { sha: item.sha } : { content: item.yaml }) })) });
  const commit = await obtener(window, token, '/git/commits', 'POST', { message: mensaje, tree: tree.sha, parents: [snapshot.head] });
  await comprobarAlmacen(window, token);
  await obtener(window, token, '/git/refs/heads/main', 'PATCH', { sha: commit.sha, force: false });
  return commit.sha;
}
async function persistir(window, token, snapshot, record, mensaje, adicionales = []) {
  await persistirArchivos(window,token,snapshot,[record,...adicionales],mensaje);return record;
}

/** @param {Window} window @param {string} token @param {{cache?: ReturnType<typeof crearCacheConocimiento> | null}} [opciones] */
export async function abrirAlmacenConocimiento(window,token,{cache=null}={}){
  const snapshot=await instantanea(window,token);
  async function leerArchivo(ruta){
    vigente(window,token);const r=await request(window,token,`/contents/${ruta}?ref=${snapshot.head}`);
    if(r.status===404)return null;if(!r.ok)throw Error('No se ha podido consultar el catálogo privado.');
    const a=await r.json();if(a.encoding!=='base64'||typeof a.content!=='string'||a.content.length>2000000)throw Error('Archivo de conocimiento ilegible.');
    return new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(window.atob(a.content),c=>c.charCodeAt(0)));
  }
  let lector=null;
  if(cache){
    const t=await obtener(window,token,`/git/trees/${snapshot.tree}?recursive=1`);
    if(t.truncated===false&&Array.isArray(t.tree)){
      const hashes=new Map();for(const x of t.tree)if(x.type==='blob'&&typeof x.path==='string'&&/^Conocimiento\/(?:catalogo\.yaml|Documentos\/doc-[0-9a-f-]+\/metadatos\.yaml)$/.test(x.path)&&/^[a-f0-9]{40}$/.test(x.sha))hashes.set(x.path,x.sha);
      lector=await cache.lector(hashes,leerArchivo);
    }else cache.limpiar();
  }
  const almacen=await abrirCatalogoConocimiento({revision:snapshot.head,leerArchivo:lector?.leerArchivo??leerArchivo,guardar:(archivos,mensaje)=>persistirArchivos(window,token,snapshot,archivos,mensaje),generarId:()=>window.crypto.randomUUID()});
  vigente(window,token);lector?.confirmar();return almacen;
}

// Cada sesión de interfaz crea su propia caché y la descarta al cerrar o cambiar de sesión.
export {crearCacheConocimiento};

// Inicialización explícita, sin sobrescribir un catálogo ni un árbol parcial existente.
export async function inicializarCatalogoConocimiento(window,token,confirmado=false){
  if(confirmado!==true)throw Error('Confirma la creación del catálogo vacío.');
  const snapshot=await instantanea(window,token);
  const r=await request(window,token,`/contents/Conocimiento?ref=${snapshot.head}`);
  if(r.ok)throw Error('Ya existe la carpeta Conocimiento. No se ha sobrescrito nada; comprueba el catálogo.');
  if(r.status!==404)throw Error('No se ha podido comprobar la ausencia del catálogo.');
  vigente(window,token);
  const revision=await persistirArchivos(window,token,snapshot,[{ruta:rutaCatalogo,yaml:stringify({schemaVersion:1,documentos:[]})}],'Inicializar catálogo de conocimiento vacío');
  return {revision};
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

export function prepararConvocatoria(oposicion, anio, fecha = new Date()) {
  const clave = String(anio);
  const pi = clave.endsWith('-pi');
  anio = pi ? clave.slice(0,-3) : clave;
  if (!/^(19|20|21)\d{2}$/.test(anio)) throw Error('Introduce un año válido de cuatro cifras.');
  const datos = { version: 1, id: `${oposicion.datos.id}-${clave}`, modalidad: pi ? 'PROMOCION_INTERNA' : 'LIBRE', oposicionId: oposicion.datos.id, anio: Number(anio), fechaCreacion: fecha.toISOString(), faseActual: 'F00', fasesCompletadas: [] };
  return { datos, ruta: `Oposiciones/${oposicion.carpeta}/Convocatorias/${clave}/convocatoria.yaml`, yaml: stringify(datos) };
}

async function convocatorias(window, token, snapshot, record) {
  vigente(window, token);
  const response = await request(window, token, `/contents/Oposiciones/${record.carpeta}/Convocatorias?ref=${snapshot.head}`);
  if (response.status === 404) return [];
  if (!response.ok) throw Error('No se han podido consultar las convocatorias.');
  const entries = await response.json();
  if (!Array.isArray(entries) || entries.length >= 1000) throw Error('Listado de convocatorias no válido.');
  return entries.filter(entry => entry.type === 'dir' && /^(19|20|21)\d{2}(?:-pi)?$/.test(entry.name)).map(entry => entry.name).sort().reverse();
}

export async function listarConvocatorias(window, token, id) {
  const snapshot = await instantanea(window, token);
  const record = snapshot.registros.find(item => item.datos.id === id);
  if (!record) throw Error('No se encuentra la oposición.');
  return convocatorias(window, token, snapshot, record);
}

async function leerConvocatoria(window, token, snapshot, record, anio) {
  const base = prepararConvocatoria(record, anio);
  const file = await obtener(window, token, `/contents/${base.ruta}?ref=${snapshot.head}`);
  if (file.encoding !== 'base64' || typeof file.content !== 'string') throw Error('Metadatos de convocatoria ilegibles.');
  const datos = parse(new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(window.atob(file.content), char => char.charCodeAt(0))), { maxAliasCount: 0 });
  if (datos?.id !== base.datos.id || datos.oposicionId !== record.datos.id || datos.anio !== base.datos.anio || (datos.modalidad ?? 'LIBRE') !== (base.datos.modalidad ?? 'LIBRE')) throw Error('Identidad de convocatoria no válida.');
  const normalizados = { ...datos, modalidad: datos.modalidad ?? 'LIBRE' };
  return { ...base, datos: normalizados, yaml: stringify(normalizados) };
}

export async function listarDetallesConvocatorias(window, token, id, anioSeleccionado = null) {
  const snapshot = await instantanea(window, token);
  const record = snapshot.registros.find(item => item.datos.id === id);
  if (!record) throw Error('No se encuentra la oposición.');
  const anios = await convocatorias(window, token, snapshot, record);
  return Promise.all(anios.map(async anio => {
    const item = await leerConvocatoria(window, token, snapshot, record, anio);
    if (anio !== anioSeleccionado) return item;
    const prefix = item.ruta.replace(/convocatoria\.yaml$/, '');
    const path = item.datos.pdfOficial?.derivados?.find(p => p.startsWith(prefix) && /^[^/]+__F05-REGLAS-CORRECCION\.yaml$/.test(p.slice(prefix.length)));
    if (item.datos.programaBorrador) {
      try {
        const ruta = rutasPrograma(item).yaml;
        const archivo = await obtener(window, token, `/contents/${ruta}?ref=${snapshot.head}`);
        if (archivo.encoding !== 'base64' || typeof archivo.content !== 'string' || archivo.content.length > 2000000) throw Error('Borrador ilegible.');
        vigente(window, token);
        const texto = new TextDecoder('utf-8', {fatal:true}).decode(Uint8Array.from(window.atob(archivo.content), c=>c.charCodeAt(0)));
        item.programaVista=leerBorradorPrograma(texto,item);
        item.programaTexto=texto;
      } catch { /* No mostrar datos si la referencia no es válida. */ }
    }
    if (!path) return item;
    try {
      const file = await obtener(window, token, `/contents/${path}?ref=${snapshot.head}`);
      if (file.encoding !== 'base64' || typeof file.content !== 'string') return item;
      const perfil = parse(new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(window.atob(file.content), char => char.charCodeAt(0))), { maxAliasCount: 0 });
      if (perfil?.fuente?.referencia === item.datos.pdfOficial.referencia && (perfil.modalidad ?? 'LIBRE') === (item.datos.modalidad ?? 'LIBRE')) item.reglasCorreccion = perfil;
    } catch { /* La ficha conserva los metadatos y señala los detalles no disponibles. */ }
    return item;
  }));
}

// Guardar únicamente los dos derivados editoriales, desde una instantánea autorizada.
// El encabezado del Markdown debe corresponder al YAML actual; no se pisan ediciones concurrentes.
export async function guardarBorradorPrograma(window,token,id,anio,versionId,md){
  const snapshot=await instantanea(window,token);
  const op=snapshot.registros.find(r=>r.datos.id===id);
  if(!op)throw Error('No se encuentra la oposición.');
  const item=await leerConvocatoria(window,token,snapshot,op,anio);
  if(item.datos.faseActual!=='REVISION'||item.datos.programaBorrador?.versionId!==versionId)throw Error('El expediente no admite edición de este borrador.');
  const rutas=rutasPrograma(item);
  const archivo=await obtener(window,token,`/contents/${rutas.yaml}?ref=${snapshot.head}`);
  if(archivo.encoding!=='base64'||typeof archivo.content!=='string'||archivo.content.length>2000000)throw Error('Borrador ilegible.');
  const texto=new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(window.atob(archivo.content),c=>c.charCodeAt(0)));
  leerBorradorPrograma(texto,item);
  const base=await abrirModeloPrograma(window,texto,versionId);
  const candidato=await prepararGuardadoPrograma(window,base,versionId,md);
  leerBorradorPrograma(candidato.yaml,item);
  vigente(window,token);
  await persistir(window,token,snapshot,{ruta:rutas.yaml,yaml:candidato.yaml},'Guardar edición del programa en borrador',[{ruta:rutas.md,yaml:candidato.md}]);
  return candidato;
}

// ED-04B: almacenamiento editorial independiente del YAML oficial. No se cambia el expediente ni el paso de revisión.
async function contextoEditorV2(window,token,id,anio,versionId){
  const snapshot=await instantanea(window,token), op=snapshot.registros.find(r=>r.datos.id===id);
  if(!op)throw Error('No se encuentra la oposición.');
  const item=await leerConvocatoria(window,token,snapshot,op,anio);
  if(item.datos.faseActual!=='REVISION'||item.datos.programaBorrador?.versionId!==versionId)throw Error('El expediente no admite edición de este borrador.');
  const rutas=rutasPrograma(item), prefijo=rutas.yaml.replace(/programa\.yaml$/,'editor-v2/');
  async function leerArchivo(ruta,opcional=false){
    vigente(window,token);const r=await request(window,token,`/contents/${ruta}?ref=${snapshot.head}`);
    if(opcional&&r.status===404)return null;
    if(!r.ok)throw Error('No se ha podido leer la revisión editorial.');
    const a=await r.json();if(a.encoding!=='base64'||typeof a.content!=='string'||a.content.length>2000000)throw Error('Archivo editorial ilegible.');
    return new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(window.atob(a.content),c=>c.charCodeAt(0)));
  }
  const texto=await leerArchivo(rutas.yaml), vista=leerBorradorPrograma(texto,item);
  const base=await abrirModeloPrograma(window,texto,versionId);
  const contexto={callId:item.datos.id,versionId,huellaOficial:base.huella};
  const idsOficiales=base.modelo.nodes.filter(n=>n.versionId===versionId).map(n=>n.id);
  const puntero=await leerArchivo(prefijo+'actual.yaml',true);
  const revision=puntero===null?null:leerPuntero(puntero);
  const abrir=revision=>abrirRevisionEditor(revision,ruta=>leerArchivo(prefijo+'revisiones/'+revision+'/'+ruta),{contexto,idsOficiales});
  return {snapshot,prefijo,contexto,idsOficiales,revision,abrir,leerArchivo,vista,datos:item.datos,oposicion:op.datos};
}
// Una sola lectura coherente del expediente y puntero; en la primera apertura no escribe.
export async function cargarEditorV2(window,token,id,anio,versionId){
  const c=await contextoEditorV2(window,token,id,anio,versionId);
  const estado=c.revision===null
    ? prepararPrimeraApertura(c.vista.bloques,{nombre:c.oposicion.nombre,nombreCorto:c.oposicion.nombreCorto,anio:c.datos.anio,modalidad:c.datos.modalidad},()=>window.crypto.randomUUID())
    : await c.abrir(c.revision);
  vigente(window,token);
  return {...estado,contexto:c.contexto,idsOficiales:c.idsOficiales,primeraApertura:c.revision===null,slug:c.oposicion.slug};
}
export async function abrirEditorV2Guardado(window,token,id,anio,versionId,revisionSolicitada=null){
  const c=await contextoEditorV2(window,token,id,anio,versionId);
  const revision=revisionSolicitada??c.revision;
  if(revision===null)return null;
  const resultado=await c.abrir(revision);vigente(window,token);return resultado;
}
export async function guardarEditorV2(window,token,id,anio,versionId,solicitud){
  const c=await contextoEditorV2(window,token,id,anio,versionId);
  if(solicitud.revisionEsperada!==c.revision)throw Error('Revisión editorial obsoleta; vuelve a abrir el editor.');
  if(solicitud.huellaOficial!==c.contexto.huellaOficial)throw Error('El programa oficial ha cambiado; vuelve a abrir el editor.');
  const anterior=c.revision===null?null:await c.abrir(c.revision);
  const candidato=await prepararRevisionEditor({contexto:c.contexto,idsOficiales:c.idsOficiales,anterior,plantilla:solicitud.plantilla,markdown:solicitud.markdown,correspondencias:solicitud.correspondencias,altasConfirmadas:solicitud.altasConfirmadas,bajasConfirmadas:solicitud.bajasConfirmadas});
  // Verificar lo que se va a guardar antes de publicar; nunca sobreescribir una revisión existente.
  if(await c.leerArchivo(c.prefijo+'revisiones/'+candidato.revision+'/manifiesto.yaml',true)!==null)throw Error('La revisión ya existe; vuelve a consultar el historial.');
  const salida=await abrirRevisionEditor(candidato.revision,ruta=>Promise.resolve(candidato.archivos[ruta]),{contexto:c.contexto,idsOficiales:c.idsOficiales});
  const archivos=Object.entries(candidato.archivos).map(([ruta,yaml])=>({ruta:c.prefijo+'revisiones/'+candidato.revision+'/'+ruta,yaml}));
  vigente(window,token);
  await persistir(window,token,c.snapshot,{ruta:c.prefijo+'actual.yaml',yaml:candidato.puntero},'Guardar revisión editorial v2',archivos);
  return salida;
}

export async function subirConvocatoriaPdf(window, token, id, anio, archivo, analizar = leerPdfTAI, progreso = () => {}) {
  if (!archivo || !/\.pdf$/i.test(archivo.name) || archivo.size < 5 || archivo.size > 20 * 1024 * 1024) throw Error('Selecciona un PDF de hasta 20 MB.');
  const bytes = new Uint8Array(await archivo.arrayBuffer());
  if (new TextDecoder().decode(bytes.subarray(0, 5)) !== '%PDF-') throw Error('El archivo no tiene formato PDF.');
  const snapshot = await instantanea(window, token);
  const op = snapshot.registros.find(item => item.datos.id === id);
  if (!op) throw Error('No se encuentra la oposición.');
  let record = prepararConvocatoria(op, anio);
  if ((await convocatorias(window, token, snapshot, op)).includes(String(anio))) record = await leerConvocatoria(window, token, snapshot, op, anio);
  if (record.datos.pdfOficial) throw Error('Ya existe un PDF oficial para este año y modalidad. No se ha sobrescrito.');
  progreso('Analizando PDF, metadatos, programa y reglas del examen…');
  const analisis = await analizar(bytes, record.datos.anio, record.datos.modalidad ?? 'LIBRE');
  if (record.datos.modalidad === 'PROMOCION_INTERNA' && (record.datos.anio !== 2025 || analisis.destino !== 'TAI_PROMOCION_INTERNA')) throw Error('El PDF no se ha procesado como promoción interna.');
  vigente(window, token);
  progreso('Guardando original y documentos generados en GitHub…');
  const prefijo = record.ruta.replace(/convocatoria\.yaml$/, '');
  const ruta = `${prefijo}${analisis.base}__F00-ORIGINAL.pdf`;
  const existe = await request(window, token, `/contents/${ruta}?ref=${snapshot.head}`);
  if (existe.ok) throw Error('Ya existe un PDF oficial para este año y modalidad. No se ha sobrescrito.');
  if (existe.status !== 404) throw Error('No se ha podido comprobar el PDF existente.');
  let binario = '';
  for (let i = 0; i < bytes.length; i += 8192) binario += String.fromCharCode(...bytes.subarray(i, i + 8192));
  const blob = await obtener(window, token, '/git/blobs', 'POST', { content: window.btoa(binario), encoding: 'base64' });
  if (!/^[a-f0-9]{40}$/.test(blob.sha)) throw Error('GitHub no ha confirmado el PDF.');
  const hash = Array.from(new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256', bytes)), b=>b.toString(16).padStart(2,'0')).join('');
  const { base, transcripcion, limpio, programa, bloques, reglas, plazas, plazasDatos, examen, ...metadatos } = analisis;
  const archivos = [
    ['METADATOS.yaml', stringify({ ...metadatos, nombreOriginal: archivo.name, sha256: hash, nombreCanonico: `${base}__F00-ORIGINAL.pdf` })],
    ['F01-TRANSCRIPCION.md', transcripcion], ['F02-LIMPIO.md', limpio],
    ['F03-SELECCION.md', `# Plazas\n\n${plazas}\n\n# Reglas\n\n${reglas}\n\n# Programa\n\n${programa}`],
    ['F05-ESTRUCTURADO.yaml', stringify({ bloques, plazasDatos, examen, plazas, reglas, referencia: metadatos.referencia, paginas: metadatos.paginas })],
    ['F05-REGLAS-CORRECCION.yaml', stringify(crearReglasCorreccion({ examen, reglas, referencia: metadatos.referencia, paginas: metadatos.paginas, modalidad: record.datos.modalidad ?? 'LIBRE' }))],
    ['F05-PROGRAMA.md', programa]
  ].map(([nombre, yaml])=>({ ruta: `${prefijo}${base}__${nombre}`, yaml }));
  for (const item of archivos) {
    const resp = await request(window, token, `/contents/${item.ruta}?ref=${snapshot.head}`);
    if (resp.status !== 404) throw Error('Ya existe un derivado o no se puede verificar. No se ha sobrescrito.');
  }
  const datos = { ...record.datos, faseActual: 'REVISION', fasesCompletadas: ['F00','F01','F02','F03','F05'], pdfOficial: { ruta, derivados: archivos.map(x=>x.ruta), sha256: hash, nombreOriginal: archivo.name, bytes: bytes.length, fechaSubida: new Date().toISOString(), publicacion: metadatos.publicacion, referencia: metadatos.referencia, temas: bloques.reduce((n,b)=>n+b.temas.length,0), bloques: bloques.map(b=>({ numero:b.numero, titulo:b.titulo, temas:b.temas.length })), plazas: plazasDatos, examen } };
  record = { ...record, datos, yaml: stringify(datos) };
  const actualizada = registro(op.carpeta, { ...op.datos, faseActual: 2, fasesCompletadas: op.datos.fasesCompletadas.filter(fase=>fase!==2) });
  await persistir(window, token, snapshot, actualizada, 'Procesar convocatoria oficial en PDF', [record, { ruta, sha: blob.sha }, ...archivos]);
  return record;
}

export async function guardarConvocatoria(window, token, id, anio) {
  const snapshot = await instantanea(window, token);
  const record = snapshot.registros.find(item => item.datos.id === id);
  if (!record) throw Error('No se encuentra la oposición.');
  const nueva = prepararConvocatoria(record, anio);
  if ((await convocatorias(window, token, snapshot, record)).includes(String(anio))) throw Error('Ya existe una convocatoria para ese año y modalidad.');
  const actualizada = registro(record.carpeta, { ...record.datos, faseActual: 2, fasesCompletadas: record.datos.fasesCompletadas.filter(fase=>fase!==2) });
  await persistir(window, token, snapshot, actualizada, 'Añadir convocatoria', [nueva]);
  return nueva;
}

export async function subirCriteriosCPS(window, token, id, anio, archivo, analizar=leerCriteriosCPS) {
  if (!archivo || !/\.pdf$/i.test(archivo.name) || archivo.size < 5 || archivo.size > 20*1024*1024) throw Error('Selecciona un PDF de hasta 20 MB.');
  const bytes = new Uint8Array(await archivo.arrayBuffer());
  if (new TextDecoder().decode(bytes.subarray(0,5)) !== '%PDF-') throw Error('El archivo no tiene formato PDF.');
  const snapshot = await instantanea(window, token);
  const op = snapshot.registros.find(item=>item.datos.id===id);
  if (!op) throw Error('No se encuentra la oposición.');
  const record = await leerConvocatoria(window, token, snapshot, op, anio);
  if (record.datos.modalidad === 'PROMOCION_INTERNA') throw Error('El analizador de criterios CPS de promoción interna está pendiente de validación.');
  if (!record.datos.pdfOficial?.referencia) throw Error('Primero procesa la convocatoria oficial.');
  if (record.datos.criteriosCPS) throw Error('Ya existen criterios registrados. No se han sobrescrito.');
  const a = await analizar(bytes,anio);
  if (a.perfil.segundaParte.objetivoGeneral !== record.datos.pdfOficial.plazas.general || a.perfil.segundaParte.objetivoDiscapacidad !== record.datos.pdfOficial.plazas.discapacidad) throw Error('Las cifras no coinciden con la convocatoria.');
  const prefix = record.ruta.replace(/convocatoria\.yaml$/, '');
  const base = `${prefix}${a.fechaDocumento}_TAI_LIBRE_CRITERIOS-CPS_${record.datos.pdfOficial.referencia}`;
  const ruta = `${base}__F00-ORIGINAL.pdf`;
  const hash = Array.from(new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');
  const derivados = [ {ruta:`${base}__METADATOS.yaml`,yaml:stringify({fechaDocumento:a.fechaDocumento, fechaPublicacion:null, nombreOriginal:archivo.name, sha256:hash, referenciaConvocatoria:record.datos.pdfOficial.referencia, info:a.info})}, {ruta:`${base}__F01-TRANSCRIPCION.md`,yaml:a.transcripcion}, {ruta:`${base}__F05-CRITERIOS-CPS.yaml`,yaml:stringify({...a.perfil, referenciaConvocatoria:record.datos.pdfOficial.referencia, sha256:hash})} ];
  for (const path of [ruta,...derivados.map(d=>d.ruta)]) {const resp=await request(window,token,`/contents/${path}?ref=${snapshot.head}`);if(resp.status!==404) throw Error('Existe un documento o no se puede verificar su ausencia.');}
  let binario=''; for(let i=0;i<bytes.length;i+=8192) binario+=String.fromCharCode(...bytes.subarray(i,i+8192));
  const blob=await obtener(window,token,'/git/blobs','POST',{content:window.btoa(binario),encoding:'base64'});
  if (!/^[a-f0-9]{40}$/.test(blob.sha)) throw Error('GitHub no ha confirmado el PDF.');
  const datos={...record.datos,criteriosCPS:{ruta,derivados:derivados.map(d=>d.ruta),sha256:hash,fechaDocumento:a.fechaDocumento,estado:'pendiente_revision',primeraParte:a.perfil.primeraParte,segundaParte:a.perfil.segundaParte}};
  const nueva={...record,datos,yaml:stringify(datos)};
  await persistir(window,token,snapshot,nueva,'Incorporar criterios oficiales CPS',[{ruta,sha:blob.sha},...derivados]);
  return nueva;
}

export async function reiniciarConvocatoria(window, token, id, anio) {
  const snapshot = await instantanea(window, token);
  const op = snapshot.registros.find(item => item.datos.id === id);
  if (!op) throw Error('No se encuentra la oposición.');
  const record = await leerConvocatoria(window, token, snapshot, op, anio);
  const prefix = record.ruta.replace(/convocatoria\.yaml$/, '');
  if (!record.datos.pdfOficial) throw Error('No hay PDF que reiniciar.');
  if (record.datos.criteriosCPS || record.datos.programaBorrador) throw Error('Existen criterios CPS o un programa vinculados; conserva la convocatoria para evitar desvincularlos.');
  const rutas = [record.datos.pdfOficial.ruta, ...(record.datos.pdfOficial.derivados || [])];
  const nombres = /^(?:convocatoria-oficial\.pdf|[0-9]{4}-[0-9]{2}-[0-9]{2}_[A-Z0-9_-]+__(?:F00-ORIGINAL\.pdf|METADATOS\.yaml|F0[1-5]-[A-Z-]+\.(?:md|yaml)))$/;
  if (rutas.some(ruta => typeof ruta !== 'string' || !ruta.startsWith(prefix) || !nombres.test(ruta.slice(prefix.length)))) throw Error('El expediente incluye rutas no reconocidas. No se ha eliminado nada.');
  const entradas = await obtener(window, token, `/contents/${prefix.slice(0, -1)}?ref=${snapshot.head}`);
  if (!Array.isArray(entradas) || entradas.length >= 1000) throw Error('No se puede verificar el expediente.');
  const existentes = new Set(entradas.filter(item => item.type === 'file').map(item => item.path));
  if (rutas.some(ruta => !existentes.has(ruta))) throw Error('El expediente no coincide con sus metadatos. No se ha eliminado nada.');
  const limpia = { ...record.datos, faseActual: 'F00', fasesCompletadas: [] };
  delete limpia.pdfOficial;
  const actualizada = registro(op.carpeta, { ...op.datos, faseActual: 2, fasesCompletadas: op.datos.fasesCompletadas.filter(fase => fase !== 2) });
  await persistir(window, token, snapshot, actualizada, `Reiniciar convocatoria ${anio}`, [{ ...record, datos: limpia, yaml: stringify(limpia) }, ...[...new Set(rutas)].map(ruta => ({ ruta, eliminar: true }))]);
}

// El registro F00 se puede completar; un PDF registrado nunca se vuelve a ofrecer.
export function disponibilidadConvocatoria(items, anio, modalidad) {
  if (!/^(19|20|21)\d{2}$/.test(String(anio)) || !['LIBRE','PROMOCION_INTERNA'].includes(modalidad)) return 'invalida';
  const item = items.find(({datos}) => datos.anio === Number(anio) && (datos.modalidad ?? 'LIBRE') === modalidad);
  return !item ? 'nueva' : item.datos.pdfOficial ? 'ocupada' : 'pendiente';
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
  const overview = document.querySelector('[data-oposicion-overview]');
  const workspace = document.querySelector('[data-oposicion-workspace]');
  const yearForm = document.querySelector('[data-convocatoria-form]');
  const year = yearForm.querySelector('input');
  const inicializarAnio = () => { year.value = String(new Date().getFullYear()); };
  inicializarAnio();
  const pdf = yearForm.querySelector('[name="pdf"]');
  const modalidad = yearForm.querySelector('[name="modalidad"]');
  const claveAnual = datos => String(datos.anio) + (datos.modalidad === 'PROMOCION_INTERNA' ? '-pi' : '');
  const nombreModalidad = datos => datos.modalidad === 'PROMOCION_INTERNA' ? 'Promoción interna' : 'Ingreso libre';
  const yearButton = yearForm.querySelector('button');
  const disponibilidad = document.querySelector('[data-disponibilidad-convocatoria]');
  const expediente = document.querySelector('[data-expediente-convocatoria]');
  const alta = document.querySelector('[data-alta-convocatoria]');
  const fichaOposicion = document.querySelector('[data-ficha-oposicion]');
  const pdfCampo = document.querySelector('[data-pdf-campo]');
  const tituloAlta = document.querySelector('[data-alta-titulo]');
  const descripcionAlta = document.querySelector('[data-alta-descripcion]');
  let expedienteActivo = null;
  let inventarioConvocatorias = null;
  function bloquearConvocatorias() { inventarioConvocatorias = null; yearButton.disabled = true; }
  function actualizarDisponibilidad() {
    if (!inventarioConvocatorias) { yearButton.disabled = true; return; }
    if (anioSeleccionado()) { yearButton.disabled = !expedienteActivo || !!expedienteActivo.datos.pdfOficial || !pdf.files.length; return; }
    if (!modalidad) { yearButton.disabled = true; return; }
    const estados = ['LIBRE','PROMOCION_INTERNA'].map(tipo => ({ tipo, estado: disponibilidadConvocatoria(inventarioConvocatorias, year.value, tipo) }));
    for (const {tipo, estado} of estados) {
      const opt = Array.from(modalidad.options).find(o => o.value === tipo);
      if (!opt) continue;
      const nombre = tipo === 'LIBRE' ? 'Ingreso libre' : 'Promoción interna';
      opt.disabled = estado !== 'nueva';
      opt.textContent = nombre + (estado === 'ocupada' ? ' — ya registrada' : estado === 'pendiente' ? ' — ya registrada (PDF pendiente)' : '');
    }
    const elegido = estados.find(e => e.tipo === modalidad.value);
    if (elegido && elegido.estado !== 'nueva') modalidad.value = '';
    const actual = estados.find(e => e.tipo === modalidad.value);
    yearButton.disabled = !actual || actual.estado !== 'nueva';
    if (disponibilidad) disponibilidad.textContent = estados.every(e => ['ocupada','pendiente'].includes(e.estado))
      ? 'Las dos modalidades de este año ya están registradas. Elige otro año.'
      : estados.every(e => e.estado === 'invalida') ? 'Introduce un año válido.'
      : estados.some(e => ['ocupada','pendiente'].includes(e.estado)) ? 'La modalidad ya registrada no se puede seleccionar.'
      : 'Selecciona una modalidad disponible.';
  }
  year.addEventListener('input', actualizarDisponibilidad);
  pdf.addEventListener('change', actualizarDisponibilidad);
  modalidad?.addEventListener('change', actualizarDisponibilidad);
  function destacarProcesar() {
    if (panel.hidden || workspace.hidden) return;
    const reducir = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    yearButton.scrollIntoView?.({ behavior: reducir ? 'instant' : 'smooth', block: 'center' });
    yearButton.classList.remove('destacar-procesar');
    void yearButton.offsetWidth;
    yearButton.classList.add('destacar-procesar');
    window.setTimeout(() => yearButton.classList.remove('destacar-procesar'), 2800);
  }
  const years = document.querySelector('[data-convocatoria-list]');
  const ficha = document.querySelector('[data-ficha-convocatoria]');
  const anioSeleccionado = () => new URL(window.location.href).searchParams.get('anio');
  const resumenNombre = document.querySelector('[data-resumen-nombre]');
  const resumenCorto = document.querySelector('[data-resumen-corto]');
  const resumenRuta = document.querySelector('[data-resumen-ruta]');
  const resumenConvocatorias = document.querySelector('[data-resumen-convocatorias]');
  function githubUrl(ruta) { return `https://github.com/${repository}/blob/main/${ruta.split('/').map(encodeURIComponent).join('/')}`; }
  const editToggle = document.querySelector('[data-oposicion-edit-toggle]');
  const linkBase = form.dataset.oposicionUrl;
  const loading = document.querySelector('[data-oposicion-loading]');
  const loadingText = loading.querySelector('p');
  const authStatus = document.querySelector('[data-private-status]');
  let loadingTimer;
  let loadingScroll;
  let modalOpened = false;
  function finalizarCarga() {
    window.clearTimeout(loadingTimer);
    if (typeof loading.close === 'function' && loading.open) loading.close();
    else loading.removeAttribute('open');
    modalOpened = false;
    if (loadingScroll !== undefined) { document.documentElement.style.overflow = loadingScroll; loadingScroll = undefined; }
    panel.removeAttribute('aria-busy');
  }
  function iniciarCarga(texto, limite = true) {
    loadingText.textContent = texto;
    if (loadingScroll === undefined) { loadingScroll = document.documentElement.style.overflow; document.documentElement.style.overflow = 'hidden'; }
    panel.setAttribute('aria-busy', 'true');
    if (typeof loading.showModal === 'function') {
      if (!modalOpened) { loading.removeAttribute('open'); loading.showModal(); modalOpened = true; }
    } else loading.setAttribute('open', '');
    window.clearTimeout(loadingTimer);
    if (limite) loadingTimer = window.setTimeout(() => {
      limpiar();
      const mensaje = 'La carga está tardando demasiado. Recarga la página para volver a intentarlo.';
      if (panel.hidden) authStatus.textContent = mensaje;
      else status.textContent = mensaje;
    }, 45000);
  }
  loading.addEventListener('cancel', event => event.preventDefault());
  let revision = 0;
  let tokenActivo = '';
  let seleccionado;
  function url(slug, anio = null) { return `${linkBase}?o=${encodeURIComponent(slug)}${anio ? '&anio=' + encodeURIComponent(anio) : ''}`; }
  function mostrarFicha(item) {
    if (!ficha) return;
    ficha.replaceChildren();
    ficha.hidden = !anioSeleccionado();
    if (ficha.hidden) return;
    const h = document.createElement('h3'); h.textContent = item ? `Resumen de convocatoria · ${item.datos.anio} · ${nombreModalidad(item.datos)}` : 'Resumen de convocatoria · ' + anioSeleccionado(); ficha.append(h);
    const volver = document.createElement('a'); volver.href = url(seleccionado.datos.slug); volver.textContent = '← Todas las convocatorias'; ficha.append(volver);
    if (!item) { const p = document.createElement('p'); p.textContent = 'No se encuentra una convocatoria registrada para este año.'; ficha.append(p); return; }
    const {datos, reglasCorreccion: r} = item, o = datos.pdfOficial, c = datos.criteriosCPS;
    if (!o) { const p = document.createElement('p'); p.textContent = 'Pendiente de procesar el PDF oficial.'; ficha.append(p); return; }
    const e = o.examen, p = o.plazas, dl = document.createElement('dl');
    const campo = (titulo, valor) => {
      const div = document.createElement('div'), dt = document.createElement('dt'), dd = document.createElement('dd');
      dt.textContent = titulo; dd.textContent = valor ?? 'No consta'; div.append(dt, dd); dl.append(div);
    };
    campo('Modalidad', nombreModalidad(datos));
    campo('Publicación oficial', o.publicacion);
    campo('Plazas', p && `${p.total} totales · ${p.general} generales · ${p.discapacidad} discapacidad`);
    campo('Temario', `${o.bloques?.length ?? '—'} bloques · ${o.temas ?? '—'} temas`);
    for (const b of o.bloques || []) campo(`Bloque ${b.numero} · ${b.titulo}`, `${b.temas} temas`);
    campo('Duración total', e && `${e.duracionMinutos} minutos`);
    campo('Preguntas teóricas', e && `Hasta ${e.teoria} + ${e.reservas?.[0] ?? '—'} de reserva`);
    campo('Preguntas prácticas', e && `${e.practica} + ${e.reservas?.[1] ?? '—'} de reserva`);
    const directa = e?.penalizacion && `Acierto +1 · Error −${e.penalizacion.numerador}/${e.penalizacion.denominador} · Blanco ${e.blancos ?? 'no consta'}`;
    campo('Teoría · puntuación directa por pregunta (bloques I–IV)', directa);
    campo('Práctica · puntuación directa por pregunta (bloque III o IV)', directa);
    if (r?.partes?.length === 2) {
      const [t, pr] = r.partes;
      const texto = r.evidencia?.reglas?.replace(/\s+/g, ' ') || '';
      campo('Organización del examen', /ejercicio único.*realizarán conjuntamente/i.test(texto) ? 'Ejercicio único: las dos partes se realizan conjuntamente; ambas obligatorias y eliminatorias.' : 'Consultar las bases oficiales.');
      campo('Elección del supuesto', pr.elegirUnBloque?.join(' o ') ? `Elegir un único bloque: ${pr.elegirUnBloque.join(' o ')}. Si no se elige correctamente, no se corrige.` : null);
      campo('Calificación fase de oposición', `Teoría: 0–${t.maxima}; práctica: 0–${pr.maxima}. Total: hasta ${r.calificacion?.maximaTotal} puntos.`);
      if (r.concurso) campo('Concurso de méritos', `Hasta ${r.concurso.maxima} puntos adicionales. Nota final = oposición + concurso.`);
      const formato = n => n.toLocaleString('es-ES', { maximumFractionDigits: 3 });
      if (e?.penalizacion?.denominador > 0 && t.preguntas > 0 && pr.preguntas > 0 && t.maxima > 0 && pr.maxima > 0) {
        const pesoT = t.maxima / t.preguntas, pesoP = pr.maxima / pr.preguntas;
        const penal = e.penalizacion.numerador / e.penalizacion.denominador;
        const nominal = peso => `Acierto +${formato(peso)} · Error −${formato(peso * penal)} · Blanco ${e.blancos === 0 ? '0' : 'consultar bases'} (referencia media, no nota oficial)`;
        campo('Teoría · peso medio en la fase de oposición', nominal(pesoT));
        campo('Práctica · peso medio en la fase de oposición', nominal(pesoP));
        campo('Importancia relativa del supuesto práctico', `Peso medio ${formato(pesoP / pesoT)} veces el de una pregunta teórica. Los valores definitivos dependen de la transformación oficial y de los cortes reales.`);
      }
      campo('Mínimos transformados', `${t.minimaTransformada} en teoría y ${pr.minimaTransformada} en práctica; superar ambas. La práctica solo se evalúa si se supera la teoría.`);
      campo('Mínimo directo legal', `${r.calificacion?.minimoDirectoPorcentaje}% de la puntuación directa máxima de cada parte; no equivale necesariamente al corte real.`);
      campo('Reservas y marcas inválidas', 'Las reservas sustituyen las anuladas por orden; las marcas inválidas se consideran en blanco.');
      campo('Desempate final', datos.modalidad === 'PROMOCION_INTERNA' ? 'Antigüedad global, nota de oposición y méritos según colectivo; consultar anexo VI, apartado 4.' : 'Mayor puntuación directa práctica; más aciertos en práctica, luego en teoría; menos errores en práctica, luego en teoría; finalmente orden de actuación.');
    } else campo('Reglas detalladas', 'Perfil de corrección no disponible. Consultar el BOE.');
    if (c?.primeraParte && c?.segundaParte) {
      campo('Criterios CPS', `Documento de ${c.fechaDocumento} · Pendiente de revisión`);
      campo('Teoría · selección CPS', `Umbral inicial: ${c.primeraParte.umbralInicialPorcentaje}%. Objetivo: ${c.primeraParte.objetivoGeneral} generales y ${c.primeraParte.objetivoDiscapacidad} discapacidad. Suelo: ${c.primeraParte.sueloPorcentaje}%.`);
      campo('Práctica · selección CPS', `Objetivo: ${c.segundaParte.objetivoGeneral} generales y ${c.segundaParte.objetivoDiscapacidad} discapacidad. Suelo: ${c.segundaParte.sueloPorcentaje}%.`);
      campo('Transformación CPS', 'El corte equivale a 25 puntos; el máximo a 50. Las puntuaciones aprobadas se transforman proporcionalmente. Empates en el corte: pasan todos.');
      campo('Cortes reales', 'No incorporados al expediente; no confundir con mínimos legales.');
    } else campo('Criterios CPS', 'Pendientes de incorporar al expediente.');
    ficha.append(dl);
    const fuente = document.createElement('a'); fuente.href = githubUrl(o.ruta); fuente.textContent = 'Consultar PDF oficial · ' + o.referencia; fuente.target = '_blank'; fuente.rel = 'noopener noreferrer'; ficha.append(fuente);
  }
  function limpiar() { expedienteActivo = null; expediente.hidden = true; bloquearConvocatorias(); if (disponibilidad) disponibilidad.textContent = ''; if (modalidad) modalidad.value = ''; if (ficha) { ficha.replaceChildren(); ficha.hidden = true; } finalizarCarga(); ++revision; tokenActivo = ''; seleccionado = undefined; input.value = ''; corto.value = ''; editNombre.value = ''; editCorto.value = ''; edit.hidden = true; workspace.hidden = true; overview.hidden = true; inicializarAnio(); pdf.value = ''; years.replaceChildren(); resumenConvocatorias.hidden = true; resumenNombre.textContent = ''; resumenCorto.textContent = ''; resumenRuta.textContent = ''; resumenRuta.removeAttribute('href'); yearButton.disabled = true; detail.textContent = ''; status.textContent = ''; list.replaceChildren(); button.disabled = true; editButton.disabled = true; }
  function mostrar(registros) {
    list.replaceChildren(...registros.map(({datos}) => { const li = document.createElement('li'); const a = document.createElement('a'); a.textContent = `${datos.nombre} (${datos.nombreCorto})`; a.href = url(datos.slug); li.append(a); return li; }));
    const slug = new URL(window.location.href).searchParams.get('o');
    seleccionado = slug ? resolverOposicion(registros, slug) : undefined;
    overview.hidden = Boolean(seleccionado);
    workspace.hidden = !seleccionado;
    edit.hidden = true;
    editToggle.setAttribute('aria-expanded', 'false');
    editButton.disabled = !seleccionado;
    detail.textContent = '';
    if (slug && !seleccionado) status.textContent = 'No se encuentra esta oposición.';
    if (seleccionado) {
      const datos = seleccionado.datos;
      editNombre.value = datos.nombre; editCorto.value = datos.nombreCorto;
      detail.textContent = datos.nombre;
      resumenNombre.textContent = datos.nombre;
      resumenCorto.textContent = datos.nombreCorto;
      resumenRuta.textContent = seleccionado.ruta;
      resumenRuta.href = githubUrl(seleccionado.ruta);
      if (slug !== datos.slug) window.history.replaceState(null, '', url(datos.slug, anioSeleccionado()));
    }
  }
  async function cargarConvocatorias(token, actual) {
    if (!seleccionado) return;
    bloquearConvocatorias();
    const items = await listarDetallesConvocatorias(window, token, seleccionado.datos.id, anioSeleccionado());
    if (actual !== revision || token !== readToken(window)) return;
    inventarioConvocatorias = items;
    const seleccionadoAnual = items.find(item => claveAnual(item.datos) === anioSeleccionado());
    expedienteActivo = seleccionadoAnual;
    if (seleccionadoAnual) detail.textContent = `${seleccionado.datos.nombre} · ${seleccionadoAnual.datos.anio} · ${nombreModalidad(seleccionadoAnual.datos)}`;
    const esDetalle = Boolean(anioSeleccionado());
    expediente.hidden = false;
    fichaOposicion.hidden = esDetalle;
    mostrarFicha(seleccionadoAnual);
    document.querySelector('[data-convocatorias-titulo]').textContent = esDetalle ? 'Pasos del expediente' : 'Convocatorias registradas';
    alta.hidden = esDetalle && (!seleccionadoAnual || !!seleccionadoAnual.datos.pdfOficial);
    document.querySelector('[data-alta-contenedor]').textContent = esDetalle ? 'Procesamiento de la convocatoria' : 'Nueva convocatoria';
    tituloAlta.textContent = esDetalle ? 'Paso 1 · Subir convocatoria oficial' : 'Paso 1 · Crear convocatoria';
    descripcionAlta.textContent = esDetalle ? 'Selecciona el PDF oficial completo. Se conservará el original y se generarán los documentos de revisión.' : 'Selecciona el año y la modalidad para iniciar un expediente independiente.';
    yearButton.textContent = esDetalle ? 'Procesar y guardar en GitHub' : 'Crear convocatoria';
    for (const campo of [year, modalidad]) {
      campo.hidden = esDetalle; campo.disabled = esDetalle;
      document.querySelector('label[for="' + campo.id + '"]').hidden = esDetalle;
    }
    disponibilidad.hidden = esDetalle;
    pdfCampo.hidden = !esDetalle;
    pdf.required = esDetalle && !alta.hidden;
    pdf.disabled = !pdf.required;
    const visibles = anioSeleccionado() ? items.filter(item => claveAnual(item.datos) === anioSeleccionado()) : items;
    years.replaceChildren(...visibles.map(itemConvocatoria => {
      const {datos,ruta}=itemConvocatoria;
      const li = document.createElement('li');
      const a = document.createElement('a'); a.textContent = ruta; a.href = githubUrl(ruta); a.target = '_blank'; a.rel = 'noopener noreferrer';
      const anual = document.createElement('a'); anual.href = url(seleccionado.datos.slug, claveAnual(datos)); anual.textContent = `${datos.anio} · ${nombreModalidad(datos)}`;
      const titulo = document.createElement('h4');
      titulo.append(anual); li.append(titulo);
      if (!esDetalle) {
        const resumen = document.createElement('p');
        resumen.textContent = datos.pdfOficial ? `PDF registrado · ${datos.pdfOficial.plazas?.total ?? '—'} plazas · ${datos.pdfOficial.temas ?? '—'} temas · ${datos.criteriosCPS ? 'Criterios CPS incorporados' : 'Criterios CPS pendientes'} · Pendiente de revisión` : 'Paso 1 pendiente · PDF oficial pendiente de subir';
        li.append(resumen);
        const abrir = document.createElement('a'); abrir.href = anual.href; abrir.textContent = 'Abrir / continuar convocatoria'; li.append(abrir);
        return li;
      }
      titulo.textContent = 'Paso 1 · Convocatoria oficial';
      li.append(a);
      if (datos.pdfOficial?.ruta?.startsWith(ruta.replace(/convocatoria\.yaml$/, ''))) {
        const link = document.createElement('a'); link.textContent = 'Ver PDF oficial'; link.href = githubUrl(datos.pdfOficial.ruta); link.target = '_blank'; link.rel = 'noopener noreferrer'; li.append(' · PDF registrado · ', link);
        const reset = document.createElement('button'); reset.type = 'button'; reset.textContent = 'Eliminar PDF y reiniciar';
        reset.addEventListener('click', async () => {
          if (panel.hidden || !seleccionado || !window.confirm(`¿Eliminar el PDF y sus derivados de ${datos.anio} (${nombreModalidad(datos)})? Se conservará el registro anual y podrás subirlo otra vez. GitHub conserva el historial.`)) return;
          const token = readToken(window), actual = ++revision;
          reset.disabled = true; yearButton.disabled = true; editButton.disabled = true;
          iniciarCarga('Reiniciando la convocatoria…', false);
          try {
            await reiniciarConvocatoria(window, token, seleccionado.datos.id, claveAnual(datos));
            if (actual !== revision || token !== readToken(window)) return;
            status.textContent = `Convocatoria ${datos.anio} lista para volver a subir.`; tokenActivo = ''; await cargar();
          } catch (error) { if (actual === revision) { status.textContent = error.message; reset.disabled = false; actualizarDisponibilidad(); editButton.disabled = false; finalizarCarga(); } }
        });
        li.append(' · ', reset);
        if (datos.pdfOficial.derivados) {
          li.append(` · ${datos.pdfOficial.publicacion} · ${datos.pdfOficial.referencia} · ${datos.pdfOficial.temas} temas · Pendiente de revisión`);
          const resumen = document.createElement('p');
          const p = datos.pdfOficial.plazas, e = datos.pdfOficial.examen;
          resumen.textContent = [p && `Plazas: ${p.total} (general: ${p.general}; discapacidad: ${p.discapacidad})`, e && `Examen: ${e.teoria} preguntas teóricas, ${e.practica} prácticas, ${e.duracionMinutos} min; penalización ${e.penalizacion.numerador}/${e.penalizacion.denominador}`, ...(datos.pdfOficial.bloques || []).map(b=>`${b.numero}. ${b.titulo}: ${b.temas} temas`)].filter(Boolean).join(' · ');
          li.append(resumen);
          const derivados = document.createElement('ul');
          for (const path of datos.pdfOficial.derivados) { const item = document.createElement('li'), a = document.createElement('a'); a.href = githubUrl(path); a.textContent = path.split('/').at(-1); a.target = '_blank'; a.rel = 'noopener noreferrer'; item.append(a); derivados.append(item); }
          li.append(derivados);
          const paso3=document.createElement('section'); paso3.className='paso-resumen';
          const heading=document.createElement('h4'); heading.textContent=`Paso 2 · Criterios oficiales de corrección (${datos.anio})`; paso3.append(heading);
          if(datos.modalidad === 'PROMOCION_INTERNA') {
            const aviso = document.createElement('p'); aviso.textContent = 'Pendiente de adaptar y validar el analizador CPS de promoción interna. No se mezclan los criterios de ingreso libre.'; paso3.append(aviso);
          } else if(datos.criteriosCPS){
            const c=datos.criteriosCPS, resumen=document.createElement('p'); resumen.textContent=`Documento de ${c.fechaDocumento} · Pendiente de revisión · Umbral teórico inicial: ${c.primeraParte.umbralInicialPorcentaje}% · Suelo: ${c.primeraParte.sueloPorcentaje}% · Cortes reales pendientes.`; paso3.append(resumen);
            const archivos=document.createElement('ul'); for(const path of [c.ruta,...c.derivados]){const item=document.createElement('li'), a=document.createElement('a'); a.href=githubUrl(path); a.textContent=path.split('/').at(-1); a.target='_blank'; a.rel='noopener noreferrer'; item.append(a); archivos.append(item);} paso3.append(archivos);
          }else{
            const p=document.createElement('p'); p.textContent='Sube el PDF publicado por la CPS para completar las reglas de evaluación. No sustituye las bases de la convocatoria.'; paso3.append(p);
            const f=document.createElement('form'), archivo=document.createElement('input'), guardar=document.createElement('button'); archivo.type='file'; archivo.accept='application/pdf,.pdf'; archivo.required=true; archivo.setAttribute('aria-label','PDF oficial de criterios de corrección'); guardar.type='submit'; guardar.textContent='Procesar criterios y guardar en GitHub'; f.append(archivo,guardar); paso3.append(f);
            f.addEventListener('submit',async event=>{event.preventDefault(); if(panel.hidden||!seleccionado||guardar.disabled)return; const token=readToken(window), actual=++revision; guardar.disabled=true; iniciarCarga('Procesando criterios oficiales de corrección…',false); try{await subirCriteriosCPS(window,token,seleccionado.datos.id,claveAnual(datos),archivo.files[0]); if(actual!==revision||token!==readToken(window))return; status.textContent='Criterios CPS guardados. Pendientes de revisión.';tokenActivo='';await cargar();}catch(error){if(actual===revision){status.textContent=error.message;guardar.disabled=false;finalizarCarga();}}});
          }
          li.append(paso3);
          if(datos.programaBorrador) li.append(mostrarBorradorPrograma(document,itemConvocatoria,githubUrl,true,seleccionado.datos.nombreCorto));
        }
      } else li.append(' · PDF pendiente de subir');
      return li;
    }));
    resumenConvocatorias.hidden = visibles.length === 0 || (esDetalle && !seleccionadoAnual?.datos.pdfOficial);
    actualizarDisponibilidad();
    if (window.location.hash === '#programa-desglosado') document.getElementById('programa-desglosado')?.scrollIntoView?.({block:'start'});
  }
  async function cargar() {
    if (panel.hidden) return;
    const token = readToken(window);
    if (!token || token === tokenActivo) return;
    tokenActivo = token;
    const actual = ++revision;
    button.disabled = true;
    iniciarCarga('Cargando los datos y pasos de la oposición…');
    try {
      const registros = await listarOposiciones(window, token);
      if (actual !== revision || token !== readToken(window)) return;
      mostrar(registros);
      await cargarConvocatorias(token, actual);
      if (actual !== revision || token !== readToken(window)) return;
      button.disabled = false;
    } catch (error) { if (actual === revision) { tokenActivo = ''; status.textContent = error.message; } }
    finally { if (actual === revision) finalizarCarga(); }
  }
  new window.MutationObserver(() => { if (!panel.hidden) void cargar(); }).observe(panel, { attributes: true, attributeFilter: ['hidden'] });
  watchToken(window, limpiar);
  async function comprobarRevisionEditorial(){
    const destino=document.querySelector('[data-revision-editorial]'), datos=expedienteActivo?.datos;
    if(!destino||!datos?.programaBorrador||panel.hidden||!seleccionado)return;
    const token=readToken(window),actual=revision;
    if(!token)return;
    destino.textContent='Comprobando revisión editorial…';
    try{
      const r=await abrirEditorV2Guardado(window,token,seleccionado.datos.id,claveAnual(datos),datos.programaBorrador.versionId);
      if(actual!==revision||token!==readToken(window)||panel.hidden||!destino.isConnected)return;
      destino.textContent=r?'COMPLETADO técnicamente · Revisión editorial vigente: '+r.revision+' · Expediente en REVISION.':'PENDIENTE · Sin revisión editorial guardada.';
    }catch(e){if(actual===revision&&token===readToken(window)&&destino.isConnected)destino.textContent='EN_REVISION · '+e.message;}
  }
  window.addEventListener('storage',e=>{if(e.key===eventoRevisionEditor)void comprobarRevisionEditorial();});
  document.addEventListener('click',e=>{if(e.target?.closest?.('[data-comprobar-revision-editorial]'))void comprobarRevisionEditorial();});
  window.addEventListener(tokenChangedEvent, limpiar);
  window.addEventListener('astroxmind:private-access-revoked', limpiar);
  window.addEventListener('astroxmind:private-access-checking', () => { if (!tokenActivo && readToken(window)) iniciarCarga('Comprobando acceso a GitHub…'); });
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
  editToggle.addEventListener('click', () => { edit.hidden = !edit.hidden; editToggle.setAttribute('aria-expanded', String(!edit.hidden)); });
  yearForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (yearButton.disabled || panel.hidden || !seleccionado) return;
    const esDetalle = Boolean(anioSeleccionado());
    if (!esDetalle && (!inventarioConvocatorias || disponibilidadConvocatoria(inventarioConvocatorias, year.value, modalidad.value) !== 'nueva')) { status.textContent = 'Selecciona una modalidad disponible. La convocatoria ya registrada no se duplicará.'; actualizarDisponibilidad(); return; }
    const token = readToken(window), actual = ++revision;
    yearButton.disabled = true; editButton.disabled = true; button.disabled = true;
    status.textContent = esDetalle ? 'Procesando convocatoria oficial…' : 'Creando convocatoria…';
    iniciarCarga(esDetalle ? 'Preparando convocatoria oficial…' : 'Guardando nuevo expediente…', false);
    try {
      const record = esDetalle
        ? await subirConvocatoriaPdf(window, token, seleccionado.datos.id, anioSeleccionado(), pdf.files[0], leerPdfTAI, texto => { if (actual === revision && token === readToken(window)) iniciarCarga(texto, false); })
        : await guardarConvocatoria(window, token, seleccionado.datos.id, year.value + (modalidad.value === 'PROMOCION_INTERNA' ? '-pi' : ''));
      if (actual !== revision || token !== readToken(window)) return;
      window.history.replaceState(null, '', url(seleccionado.datos.slug, claveAnual(record.datos)));
      status.textContent = esDetalle ? `PDF oficial de ${record.datos.anio} procesado. Revisa los documentos generados.` : 'Convocatoria creada. Comienza por subir el PDF oficial.';
      inicializarAnio(); if (modalidad) modalidad.value = ''; pdf.value = ''; tokenActivo = ''; await cargar();
      if (!esDetalle && revision === actual + 1 && token === readToken(window)) destacarProcesar();
    } catch (error) { if (actual === revision) { status.textContent = error.message; actualizarDisponibilidad(); editButton.disabled = false; button.disabled = false; finalizarCarga(); if (error.message.includes('Ya existe')) { tokenActivo = ''; await cargar(); } } }
  });
  edit.addEventListener('submit', async event => {
    event.preventDefault();
    if (editButton.disabled || button.disabled || panel.hidden || !seleccionado) return;
    const token = readToken(window), actual = ++revision;
    button.disabled = true; editButton.disabled = true;
    yearButton.disabled = true;
    status.textContent = 'Actualizando nombre…';
    try {
      const record = await actualizarOposicion(window, token, seleccionado.datos.id, editNombre.value, editCorto.value);
      if (actual !== revision || token !== readToken(window)) return;
      window.history.replaceState(null, '', url(record.datos.slug, anioSeleccionado()));
      status.textContent = 'Nombre actualizado. El identificador y los enlaces antiguos se conservan.';
      tokenActivo = '';
      await cargar();
    } catch (error) { if (actual === revision) { status.textContent = error.message; button.disabled = false; editButton.disabled = false; actualizarDisponibilidad(); } }
  });
  if (panel.hidden && readToken(window) && (authStatus.textContent.includes('Comprobando') || authStatus.textContent.includes('Comprueba la conexión'))) iniciarCarga('Comprobando acceso a GitHub…');
  else if (panel.hidden) finalizarCarga();
  void cargar();
}
