import {test} from 'node:test';
import assert from 'node:assert/strict';
import {reconciliarV2,indexarIdentidades,reconstruirEntrada} from '../src/lib/editor-identidad.mjs';
import {reglasIniciales,mdInicial} from '../src/lib/editor-v2.mjs';
import {moverEntrada} from '../src/lib/editor-estructura.mjs';

const u = n => `00000000-0000-4000-8000-${String(n).padStart(12,'0')}`;
const id = (p,n) => `${p}-${u(n)}`;
const v = n => id('syllabus',n), no = n => id('node',n), c = n => id('concept',n), q = n => id('question',n);
const nodo = (n,version,parent,order,title,conceptIds=[])=>({id:no(n),versionId:v(version),parentId:parent===null?null:no(parent),order,title,conceptIds});
const modelo = ()=>({versions:[{id:v(1),status:'accepted'},{id:v(2),status:'draft'}],calls:[{id:'ficticia-2025',versionId:v(1)},{id:'ficticia-2026',versionId:v(2)}],concepts:[{id:c(1),title:'SQL',aliases:['Lenguaje SQL']},{id:c(2),title:'Datos',aliases:[]}],nodes:[nodo(1,1,null,1,'Bloque I'),nodo(2,1,1,1,'Tema A'),nodo(3,1,2,1,'SQL',[c(1)]),nodo(4,1,2,2,'Otro'),nodo(5,2,null,1,'Bloque II'),nodo(6,2,5,1,'Tema B'),nodo(7,2,6,1,'Consultas SQL y datos',[c(1),c(2)]),nodo(8,2,7,1,'Ejemplo')],questions:[{id:q(1)}],questionConcepts:[{questionId:q(1),conceptId:c(1),history:[{origin:'manual',status:'validated'},{origin:'auto',status:'rejected'}]},{questionId:q(1),conceptId:c(2),history:[{origin:'manual',status:'validated'}]}]});

test('v2 preserva identidades y orden estructural, sin incorporar la cabecera como nodo',()=>{
 const {entradas}=reconciliarV2(reglasIniciales,mdInicial);
 assert.equal(entradas.length,6); assert.equal(entradas[0].parentId,null);
 assert.equal(entradas[3].parentId,id('entry',3)); assert.equal(entradas[3].order,2);
 const renombrado=reconciliarV2(reglasIniciales.replace('prefijo=Apt.','prefijo=X'),mdInicial.replace('Nombre bloque','Nuevo nombre'),{anteriores:entradas}).entradas;
 assert.deepEqual(renombrado.map(e=>e.id),entradas.map(e=>e.id));
 assert.equal(renombrado[0].title,'Nuevo nombre');
});
test('traslado conserva rama e identidad; nombres iguales no fusionan',()=>{
 const {entradas}=reconciliarV2(reglasIniciales,mdInicial);
 assert.notEqual(entradas[1].id,entradas[4].id);
 const movidas=moverEntrada(entradas,id('entry',4),{parentId:id('entry',6),order:2});
 assert.equal(movidas.find(e=>e.id===id('entry',4)).parentId,id('entry',6));
 assert.equal(entradas.find(e=>e.id===id('entry',4)).parentId,id('entry',3));
});
test('nodo oficial exige correspondencia explícita, no reutiliza sufijo de UUID',()=>{
 const md=mdInicial.replace(u(2),no(2));
 assert.throws(()=>reconciliarV2(reglasIniciales,md),/sin confirmar/);
 const r=reconciliarV2(reglasIniciales,md,{correspondencias:[{nodeId:no(2),entryId:id('entry',99)}]});
 assert.equal(r.entradas[0].id,id('entry',99)); assert.deepEqual(r.correspondencias,[{nodeId:no(2),entryId:id('entry',99)}]);
});
test('rechaza duplicados, bajas, altas y múltiples raíces sin confirmación',()=>{
 const {entradas}=reconciliarV2(reglasIniciales,mdInicial);
 assert.throws(()=>reconciliarV2(reglasIniciales,mdInicial.replace(u(7),u(6))));
 assert.throws(()=>reconciliarV2(reglasIniciales,mdInicial.split('\n').slice(0,-1).join('\n'),{anteriores:entradas}),/Baja/);
 assert.throws(()=>reconciliarV2(reglasIniciales,mdInicial.replace(u(7),u(99)),{anteriores:entradas}),/Alta/);
 assert.throws(()=>reconciliarV2(reglasIniciales,mdInicial+'\n- Otra [Convocatoria] [id='+u(99)+']'),/raíz/);
});
test('desde una hoja recupera padres, hermanos, hijos y árbol completo por versión',()=>{
 const ix=indexarIdentidades(modelo()); const a=ix.reconstruir(no(3)), b=ix.reconstruir(no(8));
 assert.deepEqual(a.ruta.map(n=>n.title),['Bloque I','Tema A','SQL']);
 assert.deepEqual(a.hermanos.map(n=>n.id),[no(4)]); assert.equal(a.arbolCompleto[0].id,no(1));
 assert.deepEqual(b.ruta.map(n=>n.id),[no(5),no(6),no(7),no(8)]); assert.equal(b.convocatorias[0].id,'ficticia-2026');
 assert.equal(ix.reconstruir(no(7)).subarbol.hijos[0].id,no(8));
});
test('alias históricos y nombres resuelven al mismo concepto sin duplicar preguntas',()=>{
 const ix=indexarIdentidades(modelo()); const [f]=ix.ficha(c(1));
 assert.deepEqual(f.aliasIds,[no(3),no(7)]); assert.deepEqual(f.aliasNombres,['Lenguaje SQL']);
 assert.deepEqual(f.nombresHistoricos.map(n=>n.nombre),['SQL','Consultas SQL y datos']);
 assert.deepEqual(ix.ficha(no(3)),[f]); assert.deepEqual(f.preguntas,[q(1)]);
 assert.equal(ix.ficha(no(7)).length,2); assert.equal(f.ocurrencias.length,2);
 assert.deepEqual(ix.buscarNombre(' lenguaje SQL ').map(x=>x.id),[c(1)]);
 assert.deepEqual(ix.buscarNombre('Consultas SQL y datos').map(x=>x.id),[c(1),c(2)]);
});
test('un ID editorial recupera su ubicación independiente en cada revisión',()=>{
 const {entradas}=reconciliarV2(reglasIniciales,mdInicial);
 const segunda=moverEntrada(entradas,id('entry',4),{parentId:id('entry',6),order:2});
 assert.deepEqual(reconstruirEntrada(entradas,id('entry',4)).ruta.map(n=>n.id),[id('entry',2),id('entry',3),id('entry',4)]);
 assert.deepEqual(reconstruirEntrada(segunda,id('entry',4)).ruta.map(n=>n.id),[id('entry',2),id('entry',6),id('entry',4)]);
});
test('rechaza huérfanos, padres de otra versión, ciclos y duplicados',()=>{
 for(const modificar of [m=>{m.nodes[2].parentId=no(99)},m=>{m.nodes[2].parentId=no(6)},m=>{m.nodes[1].parentId=no(3)},m=>{m.nodes.push(m.nodes[0])}]){
 const m=modelo(); modificar(m); assert.throws(()=>indexarIdentidades(m));
 }
});
test('consultas nunca mutan el histórico; resultado independiente y reproducible',()=>{
 const m=modelo(), antes=structuredClone(m), ix=indexarIdentidades(m);
 const f=ix.ficha(c(1)); f[0].ocurrencias[0].ruta[0].title='Cambio';
 assert.deepEqual(m,antes); assert.deepEqual(ix.ficha(c(1)),indexarIdentidades(antes).ficha(c(1)));
});
