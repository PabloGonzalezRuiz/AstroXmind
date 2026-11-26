import { proyectar } from './editor-v2.mjs';
import { validarEstructura } from './editor-estructura.mjs';

const uuid = '[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}';
const esId = (id, prefijo) => typeof id === 'string' && new RegExp(`^${prefijo}${uuid}$`).test(id);
const exigir = (condicion, mensaje) => { if (!condicion) throw Error(mensaje); };

// ED-02B sigue siendo la estructura canónica. Los IDs node- de PROG-01 nunca se convierten por sustitución de prefijo.
export function reconciliarV2(reglas, markdown, { correspondencias = [], anteriores = [], altasConfirmadas = [], bajasConfirmadas = [] } = {}) {
  if (anteriores.length) validarEstructura(anteriores);
  const previo = new Map(anteriores.map(e => [e.id, e]));
  const oficial = new Map(), usados = new Set();
  for (const {nodeId, entryId} of correspondencias) {
    exigir(esId(nodeId, 'node-') && esId(entryId, 'entry-') && !oficial.has(nodeId) && !usados.has(entryId), 'Correspondencia inválida o ambigua.');
    oficial.set(nodeId, entryId); usados.add(entryId);
  }
  const nodos = proyectar(reglas, markdown);
  exigir(nodos.length > 1 && nodos[0].tipo === 'convocatoria' && nodos[0].nivel === 0 && nodos.slice(1).every(n => n.nivel > 0 && n.tipo !== 'convocatoria'), 'Se requiere una única convocatoria raíz.');
  exigir(esId(nodos[0].id, ''), 'Identidad de cabecera inválida.');
  const porFila = new Map(), orden = new Map(), entradas = [], vinculadas = [];
  for (const n of nodos.slice(1)) {
    const id = esId(n.id, '') ? `entry-${n.id}` : oficial.get(n.id);
    exigir(id, 'ID ausente o correspondencia oficial sin confirmar.');
    exigir(!anteriores.length || previo.has(id) || altasConfirmadas.includes(id), 'Alta o identidad desconocida sin confirmar.');
    exigir(n.padreFila === nodos[0].fila || porFila.has(n.padreFila), 'Padre sin resolver.');
    const parentId = porFila.get(n.padreFila) ?? null;
    const o = (orden.get(parentId) ?? 0) + 1; orden.set(parentId, o);
    entradas.push({id, parentId, order:o, title:n.titulo, aliases:[...(previo.get(id)?.aliases ?? [])]});
    porFila.set(n.fila,id);
    if (oficial.has(n.id)) vinculadas.push({nodeId:n.id,entryId:id});
  }
  validarEstructura(entradas);
  exigir(vinculadas.length === correspondencias.length, 'Correspondencia sin entrada presente.');
  exigir(anteriores.every(e => entradas.some(n => n.id === e.id) || bajasConfirmadas.includes(e.id)), 'Baja sin confirmar.');
  return {entradas, correspondencias:vinculadas};
}

// Índice efímero sobre un modelo PROG-01 previamente validado; no copia ni persiste relaciones.
export function indexarIdentidades(programa) {
  const indice = (lista, prefijo) => {
    const mapa = new Map();
    for (const n of lista) { exigir(esId(n.id,prefijo) && !mapa.has(n.id), 'Identidad inválida o duplicada.'); mapa.set(n.id,n); }
    return mapa;
  };
  const conceptos = indice(programa.concepts,'concept-'), nodos = indice(programa.nodes,'node-'), versiones = indice(programa.versions,'syllabus-');
  const preguntas = indice(programa.questions,'question-'), hijos = new Map(), ocurrencias = new Map();
  const clave = (v,p) => `${v}:${p ?? 'raíz'}`;
  for (const n of nodos.values()) {
    exigir(versiones.has(n.versionId) && (n.parentId === null || nodos.get(n.parentId)?.versionId === n.versionId), 'Padre o versión desconocidos.');
    const grupo = hijos.get(clave(n.versionId,n.parentId)) ?? []; grupo.push(n); hijos.set(clave(n.versionId,n.parentId),grupo);
    for (const c of n.conceptIds) { exigir(conceptos.has(c),'Concepto desconocido.'); const lista = ocurrencias.get(c) ?? []; lista.push(n); ocurrencias.set(c,lista); }
  }
  for (const grupo of hijos.values()) { exigir(new Set(grupo.map(n=>n.order)).size === grupo.length,'Orden duplicado.'); grupo.sort((a,b)=>a.order-b.order); }
  function ruta(id) {
    exigir(nodos.has(id),'Ocurrencia desconocida.');
    const camino = [], vistos = new Set();
    for (let n=nodos.get(id); n; n=nodos.get(n.parentId)) { exigir(!vistos.has(n.id),'Ciclo de padres.'); vistos.add(n.id); camino.unshift(n); }
    return camino;
  }
  for (const id of nodos.keys()) ruta(id);
  const arbol = n => ({...n,hijos:(hijos.get(clave(n.versionId,n.id)) ?? []).map(arbol)});
  function reconstruir(id) {
    const n = nodos.get(id); exigir(n,'Ocurrencia desconocida.');
    return structuredClone({version:versiones.get(n.versionId),convocatorias:programa.calls.filter(c=>c.versionId===n.versionId),ruta:ruta(id),hermanos:(hijos.get(clave(n.versionId,n.parentId)) ?? []).filter(h=>h.id!==id),subarbol:arbol(n),arbolCompleto:(hijos.get(clave(n.versionId,null)) ?? []).map(arbol)});
  }
  function ficha(id) {
    exigir(conceptos.has(id) || nodos.has(id),'Identidad desconocida.');
    // Un apartado compuesto puede referirse a varios conceptos: nunca elegir arbitrariamente uno.
    const ids = conceptos.has(id) ? [id] : nodos.get(id).conceptIds;
    return ids.map(c => {
      const concepto=conceptos.get(c), ns=ocurrencias.get(c) ?? [];
      const aliasNombres=[...new Set(concepto.aliases)].filter(t=>t!==concepto.title);
      const nombresHistoricos=ns.map(n=>({nodeId:n.id,versionId:n.versionId,nombre:n.title}));
      const aliasIds=ns.map(n=>n.id);
      const qs=[...new Set(programa.questionConcepts.filter(r=>r.conceptId===c).filter(r=>{
        const efectiva=r.history.findLast(d=>d.origin==='manual'&&['validated','rejected'].includes(d.status))??r.history.at(-1);
        return efectiva?.status==='validated';
      }).map(r=>r.questionId))];
      exigir(qs.every(q=>preguntas.has(q)),'Pregunta desconocida.');
      return structuredClone({id:c,nombre:concepto.title,aliasNombres,aliasIds,nombresHistoricos,preguntas:qs,ocurrencias:ns.map(n=>reconstruir(n.id))});
    });
  }
  return {reconstruir,ficha};
}

// Una entrada editorial reutilizada puede tener varias ubicaciones; el contexto es obligatorio por revisión.
export function reconstruirEntrada(entradas,id) {
  const {mapa,grupos}=validarEstructura(entradas);
  exigir(mapa.has(id),'Entrada desconocida.');
  const n=mapa.get(id), ruta=[];
  for(let p=n;p;p=mapa.get(p.parentId)) ruta.unshift(p);
  const rama=p=>({...p,hijos:(grupos.get(p.id)??[]).map(rama)});
  return structuredClone({ruta,hermanos:(grupos.get(n.parentId)??[]).filter(p=>p.id!==id),subarbol:rama(n),arbolCompleto:(grupos.get(null)??[]).map(rama)});
}
