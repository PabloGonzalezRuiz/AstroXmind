import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse, stringify } from 'yaml';
import { validarPrograma, validarTransicion, decisionEfectiva } from '../scripts/validar-programa.mjs';

const ejemplo=()=>parse(readFileSync(new URL('./fixtures/programa-ficticio.yaml',import.meta.url),'utf8'),{maxAliasCount:0});
test('PROG-01: YAML ficticio, movimiento, división y fusión válidos',()=>{
  const m=ejemplo();
  assert.deepEqual(validarPrograma(m),[]);
  assert.deepEqual(validarPrograma(parse(stringify(m))),[]);
  assert.deepEqual(m.nodeMappings.map(x=>x.kind),['split','merged','moved']);
  const mov=m.nodeMappings[2], origen=m.nodes.find(n=>n.id===mov.fromNodeIds[0]), destino=m.nodes.find(n=>n.id===mov.toNodeIds[0]);
  assert.notEqual(origen.code,destino.code);
  assert.notEqual(origen.id,destino.id);
  assert.equal(origen.title,destino.title);
});
test('una pregunta puede vincular múltiples conceptos sin contarla dos veces',()=>{
  const m=ejemplo(), q=m.questions[0];
  const relaciones=m.questionConcepts.filter(r=>r.questionId===q.id);
  assert.equal(relaciones.length,2);
  assert.equal(new Set(relaciones.map(r=>r.questionId)).size,1);
  const d=relaciones[0];
  assert.ok(m.nodes.filter(n=>n.conceptIds.includes(d.conceptId)).length>1);
});
test('rechaza identidad duplicada y referencia inexistente',()=>{
  const m=ejemplo();m.nodes.push({...m.nodes[0],title:'Otro'});
  assert.ok(validarPrograma(m).some(e=>e.includes('Identificadores repetidos')));
  const n=ejemplo();n.nodes[2].conceptIds=['concept-00000000-0000-4000-8000-000000000999'];
  assert.ok(validarPrograma(n).some(e=>e.includes('concepto desconocido')));
});
test('rechaza ciclos, padre de otra versión y código inválido',()=>{
  const m=ejemplo();m.nodes[2].parentId=m.nodes[2].id;
  assert.ok(validarPrograma(m).some(e=>e.includes('ciclo')));
  const n=ejemplo();n.nodes[2].parentId=n.nodes[8].id;
  assert.ok(validarPrograma(n).some(e=>e.includes('padre/tipo/versión')));
  const o=ejemplo();o.nodes[2].code='01.20.01';
  assert.ok(validarPrograma(o).some(e=>e.includes('código visible')));
});
test('verifica literal, cita, offsets y huella',()=>{
  const m=ejemplo();m.nodes[2].evidence[0].quote='Cambio';
  assert.ok(validarPrograma(m).some(e=>e.includes('cita no coincide')));
  const n=ejemplo();n.fragments[0].text+=' cambio';
  assert.ok(validarPrograma(n).some(e=>e.includes('huella literal')));
  const o=ejemplo();o.nodes[2].title='Título editorial';
  assert.ok(validarPrograma(o).some(e=>e.includes('título literal')));
  o.nodes[2].titleKind='editorial';assert.deepEqual(validarPrograma(o),[]);
});
test('rechaza una correspondencia de cardinalidad incorrecta o evidencia ausente',()=>{
  const m=ejemplo();m.nodeMappings[0].toNodeIds.pop();
  assert.ok(validarPrograma(m).some(e=>e.includes('cardinalidad')));
  const n=ejemplo();n.nodeMappings[0].evidence=n.nodeMappings[0].evidence.slice(0,1);
  assert.ok(validarPrograma(n).some(e=>e.includes('falta evidencia destino')));
});
test('relación manual prevalece y su historial no puede reescribirse',()=>{
  const m=ejemplo(), n=ejemplo(), h=n.questionConcepts[0].history;
  h.push({...h[0],origin:'automatic',status:'rejected',at:'2026-01-02T00:00:00.000Z'});
  assert.deepEqual(validarTransicion(m,n),[]);
  assert.equal(decisionEfectiva(h).status,'validated');
  h[0].reason='reescrito';assert.ok(validarTransicion(m,n).some(e=>e.includes('historial reescrito')));
});
test('una versión aceptada permanece intacta; la edición se aplica al borrador',()=>{
  const m=ejemplo(), n=ejemplo();n.nodes[2].title='Nuevo título';n.nodes[2].titleKind='editorial';
  assert.ok(validarTransicion(m,n).some(e=>e.includes('edición aceptada alterada')));
  const d=ejemplo();d.nodes[11].title='Nombre editorial';d.nodes[11].titleKind='editorial';
  assert.deepEqual(validarTransicion(m,d),[]);
});
test('rechaza pregunta duplicada por concepto y versión histórica incorrecta',()=>{
  const m=ejemplo();m.questionConcepts.push({...m.questionConcepts[0],id:'qrel-00000000-0000-4000-8000-000000000003'});
  assert.ok(validarPrograma(m).some(e=>e.includes('pareja pregunta/concepto duplicada')));
  const n=ejemplo();n.questionConcepts[0].historicalNodeIds=[n.nodes[11].id];
  assert.ok(validarPrograma(n).some(e=>e.includes('versión histórica')));
});
test('convocatoria y programa se vinculan por ID, sin mezclar modalidad',()=>{
  const m=ejemplo();m.calls[1].versionId=m.calls[0].versionId;
  assert.deepEqual(validarPrograma(m),[]);
  m.calls[1].modalidad='PROMOCION_INTERNA';m.calls[1].id+='-pi';
  assert.ok(validarPrograma(m).some(e=>e.includes('otra oposición/modalidad')));
});
