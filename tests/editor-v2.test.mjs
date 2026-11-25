import {test} from 'node:test';
import assert from 'node:assert/strict';
import {proyectar,reglasIniciales,mdInicial,completarIds,rutaPorId,plantillas} from '../src/lib/editor-v2.mjs';
test('tipos explícitos, hermanos y numeración gradual',()=>{
  const n=proyectar(reglasIniciales,mdInicial);
  assert.deepEqual(n.map(x=>x.codigo),['','BqI','TmI.01','StmI.01.01','APTI.01.1','TmI.02','APTI.02.1']);
});
test('sobrescritura local y niveles sin numerar',()=>{
  const n=proyectar(reglasIniciales,'- Raíz[Oposicion]\n  - B[Bloque]\n    - T[Tema heredar=0 prefijo=X ancho=3]\n      - A[Apartado heredar=1 separador=-]');
  assert.equal(n[2].codigo,'X001');
  assert.equal(n[3].codigo,'APT001-1');
});
test('rechaza un tipo desconocido y un salto',()=>{
  assert.throws(()=>proyectar(reglasIniciales,'- X[Otro]'));
  assert.throws(()=>proyectar(reglasIniciales,'- X[Oposicion]\n    - Y[Tema]'));
});

test('IDs estables, apartado anidado y ruta recalculada',()=>{
 let i=0; const generar=()=> '00000000-0000-4000-8000-'+String(++i).padStart(12,'0');
 const md=completarIds(reglasIniciales,'- Raíz[Oposicion]\n  - A[Tema]\n    - SQL[Apartado]\n      - SELECT[Apartado]\n  - B[Tema]',generar);
 const n=proyectar(reglasIniciales,md); const id=n[3].id;
 assert.deepEqual(rutaPorId(n,id).map(x=>x.titulo),['Raíz','A','SQL','SELECT']);
 const filas=md.split('\n'); const movido=[filas[0],filas[1],filas[4],filas[2],filas[3]].join('\n');
 const m=proyectar(reglasIniciales,movido);
 assert.deepEqual(rutaPorId(m,id).map(x=>x.titulo),['Raíz','B','SQL','SELECT']);
 assert.equal(completarIds(reglasIniciales,movido,()=>{throw Error('No debe regenerar');}),movido);
 assert.equal(plantillas[0].reglas,reglasIniciales);
});
