import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import Ajv from 'ajv';
import { isDeepStrictEqual } from 'node:util';

const esquema = JSON.parse(readFileSync(new URL('../src/lib/programa-oficial.schema.json', import.meta.url), 'utf8'));
const comprobarForma = new Ajv({ allErrors: true }).compile(esquema);
export const huellaTexto = texto => createHash('sha256').update(texto, 'utf8').digest('hex');

// Una decisión manual explícita prevalece sobre sugerencias automáticas posteriores.
export function decisionEfectiva(history) {
  return history.findLast(r => r.origin === 'manual' && ['validated','rejected'].includes(r.status)) ?? history.at(-1);
}

export function validarPrograma(modelo) {
  if (!comprobarForma(modelo)) return comprobarForma.errors.map(e=>`Esquema ${e.instancePath}: ${e.message}`);
  const errores = [];
  const exigir = (condicion, mensaje) => { if (!condicion) errores.push(mensaje); };
  const porId = elementos => new Map(elementos.map(e=>[e.id,e]));
  const todos = ['concepts','versions','fragments','nodes','questions','questionConcepts','nodeMappings','calls'].flatMap(k=>modelo[k]);
  exigir(new Set(todos.map(e=>e.id)).size === todos.length,'Identificadores repetidos');
  const versiones=porId(modelo.versions), conceptos=porId(modelo.concepts), fragmentos=porId(modelo.fragments), nodos=porId(modelo.nodes), preguntas=porId(modelo.questions);
  const validarEvidencia = (evidencias, permitidas, contexto) => {
    for (const e of evidencias) {
      const f=fragmentos.get(e.fragmentId);
      exigir(f && permitidas.includes(f.versionId),`${contexto}: evidencia sin fragmento de versión permitida`);
      exigir(f && e.end>e.start && e.end<=f.text.length && f.text.slice(e.start,e.end)===e.quote,`${contexto}: cita no coincide con el literal`);
    }
  };
  const validarHistorial = (historia, contexto) => {
    for (let i=0;i<historia.length;i++) {
      const r=historia[i], fecha=new Date(r.at);
      exigir(!Number.isNaN(fecha.valueOf()) && fecha.toISOString()===r.at,`${contexto}: fecha inválida`);
      if(i>0) exigir(historia[i-1].at<r.at,`${contexto}: historial no cronológico`);
    }
  };
  const clavesVersion=new Set();
  for(const v of modelo.versions) {
    const k=[v.oppositionId,v.modalidad,v.revision].join(':');
    exigir(!clavesVersion.has(k),`${v.id}: revisión duplicada`); clavesVersion.add(k);
    if(v.previousVersionId) {
      const anterior=versiones.get(v.previousVersionId);
      exigir(anterior && anterior.oppositionId===v.oppositionId && anterior.modalidad===v.modalidad && anterior.revision<v.revision,`${v.id}: predecesor inválido`);
    } else exigir(v.revision===1,`${v.id}: revisión sin predecesor`);
    exigir(modelo.nodes.some(n=>n.versionId===v.id),`${v.id}: versión sin árbol`);
  }
  for(const c of modelo.calls) {
    const v=versiones.get(c.versionId);
    exigir(c.id===c.oppositionId+'-'+c.year+(c.modalidad==='PROMOCION_INTERNA'?'-pi':''),`${c.id}: identidad de convocatoria incompatible`);
    exigir(v && v.oppositionId===c.oppositionId && v.modalidad===c.modalidad,`${c.id}: versión oficial de otra oposición/modalidad`);
  }
  for(const f of modelo.fragments) {
    exigir(versiones.has(f.versionId),`${f.id}: versión desconocida`);
    exigir(f.sha256===huellaTexto(f.text),`${f.id}: huella literal incorrecta`);
  }
  const grupos=new Map(), codigos=new Set();
  for(const n of modelo.nodes) {
    exigir(versiones.has(n.versionId),`${n.id}: versión desconocida`);
    const p=n.parentId===null?null:nodos.get(n.parentId);
    exigir(n.parentId===null?n.kind==='block':p && p.versionId===n.versionId && ((n.kind==='topic'&&p.kind==='block')||(n.kind==='section'&&['topic','section'].includes(p.kind))),`${n.id}: padre/tipo/versión incompatibles`);
    const visitados=new Set([n.id]); let anc=p;
    while(anc){if(visitados.has(anc.id)){errores.push(`${n.id}: ciclo de padres`);break;}visitados.add(anc.id);anc=nodos.get(anc.parentId);}
    const g=`${n.versionId}:${n.parentId}`; if(!grupos.has(g))grupos.set(g,[]); grupos.get(g).push(n.order);
    const esperado=(p?p.code+'.':'')+String(n.order).padStart(2,'0');
    exigir(n.code===esperado,`${n.id}: código visible no coincide con su posición`);
    const ck=`${n.versionId}:${n.code}`; exigir(!codigos.has(ck),`${n.id}: código duplicado`);codigos.add(ck);
    validarEvidencia(n.evidence,[n.versionId],n.id);
    if(n.titleKind==='literal') exigir(n.evidence.some(e=>e.quote===n.title),`${n.id}: título literal sin cita exacta`);
    for(const c of n.conceptIds) exigir(conceptos.has(c),`${n.id}: concepto desconocido`);
  }
  for(const [g,orden] of grupos) exigir(orden.sort((a,b)=>a-b).every((o,i)=>o===i+1),`${g}: orden de hermanos no consecutivo`);
  for(const q of modelo.questions) exigir(versiones.has(q.historicalVersionId),`${q.id}: versión histórica desconocida`);
  const relaciones=new Set();
  for(const r of modelo.questionConcepts) {
    const q=preguntas.get(r.questionId), k=r.questionId+':'+r.conceptId;
    exigir(!relaciones.has(k),`${r.id}: pareja pregunta/concepto duplicada`); relaciones.add(k);
    exigir(q && conceptos.has(r.conceptId),`${r.id}: referencia pregunta/concepto desconocida`);
    for(const id of r.historicalNodeIds) exigir(nodos.get(id)?.versionId===q?.historicalVersionId,`${r.id}: nodo no pertenece a versión histórica`);
    validarEvidencia(r.evidence,[q?.historicalVersionId],r.id); validarHistorial(r.history,r.id);
  }
  for(const m of modelo.nodeMappings) {
    const a=versiones.get(m.fromVersionId), b=versiones.get(m.toVersionId);
    exigir(a && b && a.id!==b.id && a.oppositionId===b.oppositionId,`${m.id}: versiones de correspondencia inválidas`);
    for(const id of m.fromNodeIds) exigir(nodos.get(id)?.versionId===a?.id,`${m.id}: nodo origen incorrecto`);
    for(const id of m.toNodeIds) exigir(nodos.get(id)?.versionId===b?.id,`${m.id}: nodo destino incorrecto`);
    const x=m.fromNodeIds.length,y=m.toNodeIds.length;
    exigir(m.kind==='added'?x===0&&y>0:m.kind==='removed'?x>0&&y===0:m.kind==='split'?x===1&&y>1:m.kind==='merged'?x>1&&y===1:['equivalent','renamed','moved'].includes(m.kind)?x===1&&y===1:x>0&&y>0,`${m.id}: cardinalidad incompatible`);
    validarEvidencia(m.evidence,[a?.id,b?.id],m.id); validarHistorial(m.history,m.id);
    if(x) exigir(m.evidence.some(e=>fragmentos.get(e.fragmentId)?.versionId===a?.id),`${m.id}: falta evidencia origen`);
    if(y) exigir(m.evidence.some(e=>fragmentos.get(e.fragmentId)?.versionId===b?.id),`${m.id}: falta evidencia destino`);
  }
  return errores;
}

// Comparar snapshots canónicos: no reescribir una edición aceptada ni una decisión previa.
export function validarTransicion(anterior, siguiente) {
  const errores=[...validarPrograma(anterior),...validarPrograma(siguiente)];
  if(errores.length)return errores;
  const iguales=isDeepStrictEqual;
  for(const v of anterior.versions.filter(v=>v.status==='accepted')){
    for(const [k,elementos] of [['versions',[v]],['nodes',anterior.nodes.filter(n=>n.versionId===v.id)],['fragments',anterior.fragments.filter(f=>f.versionId===v.id)]]){
      const almacen=siguiente[k];
      for(const item of elementos)if(!iguales(item,almacen.find(i=>i.id===item.id)))errores.push(`${item.id}: edición aceptada alterada`);
      if(k!=='versions'&&almacen.filter(i=>i.versionId===v.id).length!==elementos.length)errores.push(`${v.id}: edición aceptada ampliada o recortada`);
    }
  }
  for(const k of ['concepts','questions','versions','calls'])for(const item of anterior[k])if(!siguiente[k].some(i=>i.id===item.id))errores.push(`${item.id}: identidad desaparecida`);
  for(const k of ['questionConcepts','nodeMappings'])for(const r of anterior[k]){
    const nuevo=siguiente[k].find(i=>i.id===r.id);
    if(!nuevo||!iguales(r.history,nuevo.history.slice(0,r.history.length))||!iguales({...r,history:[]},{...nuevo,history:[]}))errores.push(`${r.id}: relación o historial reescrito`);
  }
  return errores;
}
