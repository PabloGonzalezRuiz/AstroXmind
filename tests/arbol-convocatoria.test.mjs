import test from 'node:test';
import assert from 'node:assert/strict';
import { crearArbolConvocatoria, arbolProgramaOficial } from '../src/lib/arbol-convocatoria.mjs';
const p=(aparicionId,convocatoriaId,padreAparicionId,orden,alias,versionId='v1')=>({aparicionId,convocatoriaId,versionId,padreAparicionId,orden,alias});
const docs=()=>[
 {id:'tai',pertenencias:[p('ra','a',null,0,'A'),p('rb','b',null,0,'B')]},
 {id:'bd',pertenencias:[p('ba','a','ra',1,'BD')]},
 {id:'dev',pertenencias:[p('da','a','ra',2,'Desarrollo'),p('db','b','rb',1,'Desarrollo')]},
 {id:'sql',cuerpo:'SQL único',pertenencias:[p('sa','a','ba',1,'SQL'),p('sa2','a','da',1,'SQL práctico'),p('sb','b','db',1,'Lenguaje SQL')]}
];
test('reconstruye rutas por aparición, incluso con dos apariciones del mismo documento',()=>{
 const a=crearArbolConvocatoria(docs(),'a','v1'),b=crearArbolConvocatoria(docs(),'b','v1');
 assert.deepEqual(a.ruta('sa').map(n=>n.documentoId),['tai','bd','sql']);
 assert.deepEqual(a.ruta('sa2').map(n=>n.documentoId),['tai','dev','sql']);
 assert.deepEqual(b.ruta('sb').map(n=>n.documentoId),['tai','dev','sql']);
 assert.equal(a.apariciones('sql').length,2);assert.equal(b.apariciones('sql').length,1);
 assert.throws(()=>a.ruta('sb'),/fuera/);
});
test('navega padres, hijos y hermanos ordenados',()=>{
 const a=crearArbolConvocatoria(docs(),'a','v1');
 assert.equal(a.padre('sa').aparicionId,'ba');assert.equal(a.padre('ra'),null);
 assert.deepEqual(a.hijos('ra').map(n=>n.aparicionId),['ba','da']);assert.deepEqual(a.hermanos('ba').map(n=>n.aparicionId),['da']);
});
test('retirar pertenencias A preserva contenido y árbol B',()=>{
 const original=docs(),nuevo=original.map(d=>({...d,pertenencias:d.pertenencias.filter(p=>p.convocatoriaId!=='a')}));
 assert.deepEqual(crearArbolConvocatoria(nuevo,'b','v1').ruta('sb'),crearArbolConvocatoria(original,'b','v1').ruta('sb'));
 assert.equal(nuevo.find(d=>d.id==='sql').cuerpo,'SQL único');assert.throws(()=>crearArbolConvocatoria(nuevo,'a','v1'),/raíz/);
});
test('rechaza referencias a padres ajenos, ciclos, apariciones y órdenes duplicados',()=>{
 for(const cambiar of [d=>d[3].pertenencias[0].padreAparicionId='db',d=>d[1].pertenencias[0].padreAparicionId='sa',d=>d[3].pertenencias.push(d[3].pertenencias[0]),d=>d[2].pertenencias[0].orden=1]){
  const d=docs();cambiar(d);assert.throws(()=>crearArbolConvocatoria(d,'a','v1'));
 }
});
test('revisión independiente conserva árbol anterior',()=>{
 const d=docs();d[0].pertenencias.push(p('ra','a',null,0,'A2','v2'));d[3].pertenencias.push(p('sa','a','ra',1,'SQL nuevo','v2'));
 assert.equal(crearArbolConvocatoria(d,'a','v2').ruta('sa').length,2);assert.equal(crearArbolConvocatoria(d,'a','v1').ruta('sa').length,3);
});
test('adaptador del programa oficial conserva identidades y no modifica el árbol fuente',()=>{
 const bloques=[{id:'node-b',order:1,title:'Bases',hijos:[{id:'node-t',order:1,title:'SQL',hijos:[]}]}];
 const copia=structuredClone(bloques),a=arbolProgramaOficial(bloques,{convocatoriaId:'a',versionId:'v1',titulo:'Convocatoria A'});
 assert.deepEqual(a.ruta('node-t').map(n=>n.aparicionId),['raiz:a','node-b','node-t']);
 assert.deepEqual(bloques,copia);
});
