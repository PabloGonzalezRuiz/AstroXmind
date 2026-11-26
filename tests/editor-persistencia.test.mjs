import {test} from 'node:test';
import assert from 'node:assert/strict';
import {prepararRevisionEditor,abrirRevisionEditor,leerPuntero} from '../src/lib/editor-persistencia.mjs';
import {reglasIniciales,mdInicial} from '../src/lib/editor-v2.mjs';

const uuid=n=>`00000000-0000-4000-8000-${String(n).padStart(12,'0')}`;
const idsOficiales=[2,3,4,5,6,7].map(n=>'node-'+uuid(n));
const contexto={callId:'ficticia-2025',versionId:'syllabus-'+uuid(1),huellaOficial:'a'.repeat(64)};
const plantilla={id:'oposiciones',revision:1,reglas:reglasIniciales};
const correspondencias=idsOficiales.map((nodeId,i)=>({nodeId,entryId:'entry-'+uuid(i+20)}));
const markdown=mdInicial.replace(/id=(00000000-0000-4000-8000-00000000000[2-7])/g,'id=node-$1');
const datos={contexto,plantilla,markdown,correspondencias,idsOficiales};
const abrir=c=>abrirRevisionEditor(c.revision,async ruta=>c.archivos[ruta],{contexto,idsOficiales});

test('guarda y recupera los tres paneles, entradas y correspondencias',async()=>{
 const c=await prepararRevisionEditor(datos), r=await abrir(c);
 assert.equal(leerPuntero(c.puntero),c.revision);assert.deepEqual(r.plantilla,plantilla);assert.equal(r.markdown,markdown);
 assert.deepEqual(r.correspondencias,correspondencias);assert.equal(r.entradas.length,6);
 assert.equal(r.indice[3].codigo,'APT01.1');assert.equal(r.indice[3].ruta.length,3);
 assert.equal(r.entradas[0].id,correspondencias[0].entryId);
 assert.deepEqual(await prepararRevisionEditor(datos),c);
});
test('la revisión nueva conserva identidad, original, historial y reglas anteriores',async()=>{
 const a=await prepararRevisionEditor(datos), anterior=await abrir(a);
 const b=await prepararRevisionEditor({...datos,anterior,plantilla:{...plantilla,revision:2,reglas:plantilla.reglas.replace('prefijo=APT','prefijo=X')},markdown:markdown.replace('Nombre bloque','Nombre nuevo')});
 const despues=await abrir(b);assert.equal(despues.anterior,a.revision);assert.notEqual(b.revision,a.revision);
 assert.deepEqual(despues.entradas.map(x=>x.id),anterior.entradas.map(x=>x.id));assert.equal(despues.indice[3].codigo,'X01.1');
 assert.equal((await abrir(a)).entradas[0].title,'Nombre bloque');assert.equal(plantilla.revision,1);
});
test('rechaza inventario oficial incompleto, reasignación y fuente obsoleta',async()=>{
 const anterior=await abrir(await prepararRevisionEditor(datos));
 await assert.rejects(prepararRevisionEditor({...datos,correspondencias:correspondencias.slice(1)}),/inventario oficial/);
 const cambiadas=correspondencias.map((x,i)=>i===0?{...x,entryId:'entry-'+uuid(99)}:x);
 await assert.rejects(prepararRevisionEditor({...datos,anterior,correspondencias:cambiadas}),/reasignar/);
 await assert.rejects(prepararRevisionEditor({...datos,anterior,contexto:{...contexto,huellaOficial:'b'.repeat(64)}}),/oficial ha cambiado/);
 await assert.rejects(prepararRevisionEditor({...datos,anterior,markdown:markdown.replace('Técnicos Auxiliares de Informática','Otra oposición')}),/identidad de cabecera/);
});
test('reapertura bloquea corrupción y archivos ausentes, incluida la proyección derivada',async()=>{
 const c=await prepararRevisionEditor(datos);
 for(const ruta of ['autor.md','indice.yaml','manifiesto.yaml',`entradas/${correspondencias[0].entryId}.yaml`]){
  await assert.rejects(abrir({...c,archivos:{...c.archivos,[ruta]:'alterado'}}),/alterado/);
 }
 await assert.rejects(abrir({...c,archivos:{...c.archivos,'autor.md':undefined}}),/ausente/);
 assert.throws(()=>leerPuntero('{"schemaVersion":1,"revision":"../"}'),/Puntero/);
});
test('un guardado interrumpido no modifica la revisión previa; la propuesta se puede regenerar',async()=>{
 const a=await prepararRevisionEditor(datos), anterior=await abrir(a);
 const cambios={...datos,anterior,markdown:markdown.replace('Nombre bloque','Nuevo')};
 const b=await prepararRevisionEditor(cambios);
 // Simula el commit preparado pero nunca publicado: el puntero anterior no cambia.
 assert.equal(leerPuntero(a.puntero),a.revision);assert.equal((await abrir(a)).markdown,markdown);
 assert.deepEqual(await prepararRevisionEditor(cambios),b);
});
