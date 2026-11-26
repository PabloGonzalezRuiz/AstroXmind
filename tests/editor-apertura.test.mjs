import test from 'node:test';
import assert from 'node:assert/strict';
import { prepararPrimeraApertura } from '../src/lib/editor-apertura.mjs';
import { prepararRevisionEditor, abrirRevisionEditor } from '../src/lib/editor-persistencia.mjs';

const uuid=n=>`00000000-0000-4000-8000-${String(n).padStart(12,'0')}`;
const nodo=(n,kind,title,hijos=[])=>({id:'node-'+uuid(n),kind,title,hijos});
const bloques=[nodo(1,'block','Bloque',[nodo(2,'topic','Tema',[nodo(3,'section','Apartado',[nodo(4,'section','Subapartado')])])])];
const ctx={nombre:'Oposición ficticia',nombreCorto:'FIC',anio:2027,modalidad:'PROMOCION_INTERNA'};
test('primera apertura conserva el inventario y admite apartados anidados',async()=>{
  const a=prepararPrimeraApertura(bloques,ctx);
  assert.match(a.markdown,/oposicion="FIC" modalidad="PI" año=2027/);
  const idsOficiales=[1,2,3,4].map(n=>'node-'+uuid(n));
  assert.deepEqual(a.correspondencias.map(c=>c.nodeId),idsOficiales);
  assert.equal(a.entradas[3].parentId,a.entradas[2].id);
  const contexto={callId:'ficticia',versionId:'syllabus-'+uuid(10),huellaOficial:'a'.repeat(64)};
  const r=await prepararRevisionEditor({...a,contexto,idsOficiales});
  const recuperada=await abrirRevisionEditor(r.revision,async ruta=>r.archivos[ruta],{contexto,idsOficiales});
  assert.equal(recuperada.markdown,a.markdown);
  assert.deepEqual(recuperada.correspondencias,a.correspondencias);
});
test('dos aperturas no comparten identidades editoriales implícitamente',()=>{
  const a=prepararPrimeraApertura(bloques,ctx),b=prepararPrimeraApertura(bloques,{...ctx,anio:2028});
  assert.ok(b.entradas.every(e=>!a.entradas.some(o=>o.id===e.id)));
});
test('rechaza un título que la DSL no puede representar sin pérdida',()=>{
  assert.throws(()=>prepararPrimeraApertura([nodo(1,'block','B [literal]')],ctx),/Título oficial incompatible/);
});
