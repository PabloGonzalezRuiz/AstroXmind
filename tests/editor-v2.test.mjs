import {test} from 'node:test';
import assert from 'node:assert/strict';
import {proyectar,reglasIniciales,mdInicial} from '../src/lib/editor-v2.mjs';
test('tipos explícitos, hermanos y numeración gradual',()=>{
  const n=proyectar(reglasIniciales,mdInicial);
  assert.deepEqual(n.map(x=>x.codigo),['','BqI','TmI.01','StmI.01.01','I.01.1','TmI.02','I.02.1']);
});
test('sobrescritura local y niveles sin numerar',()=>{
  const n=proyectar(reglasIniciales,'- Raíz[Oposicion]\n  - B[Bloque]\n    - T[Tema heredar=0 prefijo=X ancho=3]\n      - A[Apartado heredar=1 separador=-]');
  assert.equal(n[2].codigo,'X001');
  assert.equal(n[3].codigo,'001-1');
});
test('rechaza un tipo desconocido y un salto',()=>{
  assert.throws(()=>proyectar(reglasIniciales,'- X[Otro]'));
  assert.throws(()=>proyectar(reglasIniciales,'- X[Oposicion]\n    - Y[Tema]'));
});
