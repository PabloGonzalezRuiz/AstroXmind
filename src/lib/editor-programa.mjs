// Motor puro, compartido por navegador y Node. No escribe archivos ni modifica el programa oficial.
const tipos = ['oposicion', 'convocatoria', 'modalidad', 'bloque', 'tema'];
const modalidades = { LIBRE: 'LIB', PROMOCION_INTERNA: 'PI' };
const uuid = /^node-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const error = (linea, mensaje) => { throw new Error(`Línea ${linea}: ${mensaje}`); };

function listas(texto) {
  const filas = [];
  for (const [i, cruda] of texto.replace(/\r\n?/g, '\n').split('\n').entries()) {
    if (!cruda.trim()) continue;
    const m = /^([ \t]*)[-*+]\s+(.+?)\s*$/.exec(cruda);
    if (!m) error(i + 1, 'Se esperaba una lista Markdown.');
    const sangria = m[1];
    if (sangria.includes(' ') && sangria.includes('\t')) error(i + 1, 'No mezclar tabuladores y espacios.');
    if (sangria.includes(' ') && sangria.length % 2) error(i + 1, 'Usar dos espacios por nivel.');
    const nivel = sangria.includes('\t') ? sangria.length : sangria.length / 2;
    if (nivel >= 32 || (!filas.length && nivel !== 0) || (filas.length && nivel > filas.at(-1).nivel + 1)) error(i + 1, 'Nivel fuera de rango o salto de sangría.');
    filas.push({ nivel, texto: m[2], linea: i + 1 });
  }
  if (!filas.length) error(1, 'Lista vacía.');
  return filas;
}

export function analizarDefinicion(texto) {
  const filas = listas(texto);
  const niveles = filas.map((fila, i) => {
    if (fila.nivel !== i) error(fila.linea, 'Definir exactamente un nivel por profundidad.');
    const m = /^([a-z][a-z0-9_-]*)\s+\[([^\]]*)\]$/.exec(fila.texto);
    if (!m) error(fila.linea, 'Definición esperada: nombre [clave=valor].');
    const campos = {};
    for (const campo of m[2].trim().split(/\s+/)) {
      const par = /^(tipo|prefijo|numeracion|origen|ancho|repetir|color)=([^=]+)$/.exec(campo);
      if (!par || Object.hasOwn(campos, par[1])) error(fila.linea, `Campo desconocido, repetido o inválido: ${campo}.`);
      campos[par[1]] = par[2];
    }
    const tipo = campos.tipo ?? (m[1] === 'subtema' ? 'apartado' : m[1]);
    if (tipo !== (tipos[i] ?? 'apartado')) error(fila.linea, 'El tipo no coincide con la jerarquía del programa.');
    let numeracion = campos.numeracion;
    let origen = campos.origen ?? null;
    // Compatibilidad ED-01: modalidad es un valor del expediente, no un número.
    if (numeracion === 'modalidad') { numeracion = 'ninguna'; origen = 'modalidad'; }
    if (tipo === 'modalidad' && numeracion === 'ninguna' && origen === null) origen = 'modalidad';
    if (!['ninguna', 'anio', 'romana', 'decimal'].includes(numeracion)) error(fila.linea, 'Numeración inválida.');
    if (origen !== null && (origen !== 'modalidad' || tipo !== 'modalidad' || numeracion !== 'ninguna')) error(fila.linea, 'Origen incompatible.');
    if (tipo === 'oposicion' && numeracion !== 'ninguna' || tipo === 'convocatoria' && numeracion !== 'anio' || tipo === 'modalidad' && (numeracion !== 'ninguna' || origen !== 'modalidad') || i >= 3 && ['anio'].includes(numeracion)) error(fila.linea, 'Numeración no aplicable al tipo.');
    const prefijo = campos.prefijo ?? '';
    if (!/^[A-Z0-9]*$/.test(prefijo)) error(fila.linea, 'Prefijo inválido.');
    if (campos.ancho !== undefined && (numeracion !== 'decimal' || !/^[1-6]$/.test(campos.ancho))) error(fila.linea, 'Ancho solo decimal, de 1 a 6.');
    if (campos.repetir !== undefined && (!/^(true|false)$/.test(campos.repetir) || i !== filas.length - 1 || tipo !== 'apartado')) error(fila.linea, 'Repetir solo en el último nivel de apartados.');
    if (campos.color !== undefined && !/^#[0-9a-fA-F]{6}$/.test(campos.color)) error(fila.linea, 'Color no válido.');
    return { name: m[1], kind: tipo, numbering: numeracion, prefix: prefijo, ...(origen ? { source: origen } : {}), ...(campos.ancho ? { width: Number(campos.ancho) } : {}), ...(campos.repetir ? { repeat: campos.repetir === 'true' } : {}), ...(campos.color ? { color: campos.color } : {}) };
  });
  if (niveles.length < 5) error(1, 'Faltan niveles obligatorios.');
  return niveles;
}

function romana(n) {
  if (n < 1 || n > 3999) throw new Error('Numeración romana fuera de rango.');
  let s = '';
  for (const [valor, letra] of [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']]) while (n >= valor) { s += letra; n -= valor; }
  return s;
}

// El contexto procede del expediente; los títulos del contenido no generan sus valores.
export function generarVista(definicion, markdown, contexto) {
  const niveles = analizarDefinicion(definicion);
  if (!Number.isInteger(contexto?.year) || contexto.year < 1900 || contexto.year > 2199 || !Object.hasOwn(modalidades, contexto?.mode)) throw new Error('Contexto de convocatoria inválido.');
  const filas = listas(markdown), pila = [], nodos = [], codigos = new Set(), hermanos = new Map();
  for (const f of filas) {
    const regla = niveles[f.nivel] ?? (niveles.at(-1).repeat ? niveles.at(-1) : null);
    if (!regla) error(f.linea, 'Profundidad no definida.');
    pila.length = f.nivel;
    const padre = pila.at(-1) ?? null;
    const clave = padre?.fila ?? -1;
    const orden = (hermanos.get(clave) ?? 0) + 1;
    hermanos.set(clave, orden);
    if (f.nivel < 3 && orden !== 1) error(f.linea, 'Único contexto de oposición, convocatoria y modalidad.');
    if (f.nivel === 2 && ![contexto.mode, modalidades[contexto.mode]].includes(f.texto.normalize('NFD').replace(/\p{Diacritic}/gu,'').trim().toUpperCase().replace(/\s+/g,'_'))) error(f.linea, 'La modalidad no coincide con el expediente.');
    if (f.nivel === 1 && !new RegExp(`(?:^|\\D)${contexto.year}(?:$|\\D)`).test(f.texto)) error(f.linea, 'El año no coincide con el expediente.');
    const num = regla.source === 'modalidad' ? modalidades[contexto.mode] : regla.numbering === 'anio' ? String(contexto.year) : regla.numbering === 'romana' ? romana(orden) : regla.numbering === 'decimal' ? String(orden).padStart(regla.width ?? 1,'0') : '';
    const segmento = regla.prefix + num;
    const rutaCodigo = [padre?.rutaCodigo, segmento].filter(Boolean).join('.');
    const displayCode = segmento ? rutaCodigo : '';
    if (displayCode && codigos.has(displayCode)) error(f.linea, `Código duplicado: ${displayCode}.`);
    if (displayCode) codigos.add(displayCode);
    const nodo = { fila: nodos.length, linea: f.linea, profundidad: f.nivel, padreFila: padre?.fila ?? null, orden, tipo: regla.kind, titulo: f.texto, displayCode, rutaCodigo, ...(regla.color ? { color: regla.color } : {}) };
    nodos.push(nodo); pila.push(nodo);
  }
  if (!nodos.some(n => n.tipo === 'tema')) throw new Error('Debe existir al menos un tema.');
  for (const n of nodos.filter(n => n.profundidad < 4)) if (!nodos.some(h => h.padreFila === n.fila)) error(n.linea, 'Falta el nivel hijo obligatorio.');
  return { contexto:{year:contexto.year,mode:contexto.mode}, niveles, nodos, markdown: nodos.map(n => `${'  '.repeat(n.profundidad)}- ${n.displayCode ? `**${n.displayCode}** — ` : ''}${n.titulo}`).join('\n') + '\n' };
}

// Identidades explícitas: el controlador de filas conserva claves estables. Una fila nueva
// se declara con null; nunca se adivinan identidades a partir de títulos o posiciones.
export function reconciliarIdentidades(vista, { anteriores = [], asignaciones, bajasConfirmadas = [], versionStatus = 'draft', crearUuid = () => globalThis.crypto.randomUUID() } = {}) {
  if (versionStatus !== 'draft') throw new Error('Una versión aceptada requiere una revisión nueva.');
  const actuales = vista.nodos.filter(n => n.profundidad >= 3);
  if (!Array.isArray(asignaciones) || asignaciones.length !== actuales.length) throw new Error('Asignaciones de identidad incompletas.');
  const prev = new Map();
  for (const id of anteriores) { if (!uuid.test(id) || prev.has(id)) throw new Error('Identidad anterior inválida o repetida.'); prev.set(id,true); }
  const usados = new Set();
  const salida = actuales.map((n,i) => {
    const a = asignaciones[i];
    if (a !== null && (!uuid.test(a) || !prev.has(a))) throw new Error('Identidad desconocida o ambigua.');
    const id = a ?? `node-${crearUuid()}`;
    if (!uuid.test(id) || usados.has(id) || (a === null && prev.has(id))) throw new Error('Identidad duplicada o inválida.');
    usados.add(id); return { ...n, id };
  });
  const bajas = anteriores.filter(id => !usados.has(id));
  if (bajas.some(id => !bajasConfirmadas.includes(id))) throw new Error('Bajas pendientes de confirmación y revisión de dependencias.');
  const ids = new Map(salida.map(n => [n.fila,n.id]));
  return salida.map(n => ({ id:n.id, parentId:ids.get(n.padreFila) ?? null, displayCode:n.displayCode, title:n.titulo, kind:n.tipo, order:n.orden }));
}

// YAML de bloque legible; las cadenas se entrecomillan para evitar tipos implícitos.
// ED-04 conectará el resultado con validación oficial PROG-01 y persistencia transaccional.
export function generarIndice(vista, contexto, identidades) {
  if (vista.contexto?.year !== contexto.year || vista.contexto?.mode !== contexto.mode) throw new Error('El contexto del resultado no coincide con la convocatoria.');
  const nodes = reconciliarIdentidades(vista, identidades);
  const indice = { schemaVersion:1, year:contexto.year, mode:contexto.mode, nodes };
  const yaml = [`schemaVersion: 1`, `year: ${contexto.year}`, `mode: ${JSON.stringify(contexto.mode)}`, 'nodes:', ...nodes.flatMap(n => Object.entries(n).map(([k,v],i) => `${i === 0 ? '  - ' : '    '}${k}: ${JSON.stringify(v)}`))].join('\n')+'\n';
  return { indice, yaml, markdown:vista.markdown };
}

export function estadoPaso({ existe, estructuraValida, persistido, vigente, revisionOficialValida }) {
  if (!existe) return 'PENDIENTE';
  return estructuraValida && persistido && vigente && revisionOficialValida ? 'COMPLETADO' : 'EN_REVISION';
}
