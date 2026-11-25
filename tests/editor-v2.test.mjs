import {test} from 'node:test';
import assert from 'node:assert/strict';
import {proyectar,reglasIniciales,mdInicial,completarIds,rutaPorId,plantillas,clasificarPorProfundidad,markdownOficialConTipos,cabecerasConvocatoria} from '../src/lib/editor-v2.mjs';
test('tipos explícitos, hermanos y numeración gradual',()=>{
  const n=proyectar(reglasIniciales,mdInicial);
  assert.deepEqual(n.map(x=>x.codigo),['TAI','','LBR','BqI','TmI.01','StmI.01.01','APTI.01.1','TmI.02','APTI.02.1']);
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

test('clasificación inicial determinista, sin inferir subapartados ni alterar tipos explícitos',()=>{
 const texto='- TAI\n  - 2025\n    - Libre\n      - B\n        - T\n          - SQL';
 const md=clasificarPorProfundidad(reglasIniciales,texto);
 assert.deepEqual(proyectar(reglasIniciales,md).map(n=>n.tipo),['oposicion','convocatoria','modalidad','bloque','tema','apartado']);
 assert.equal(clasificarPorProfundidad(reglasIniciales,md),md);
 assert.throws(()=>clasificarPorProfundidad(reglasIniciales,texto+'\n            - SELECT'));
 assert.match(clasificarPorProfundidad(reglasIniciales,md+'\n            - SELECT[Apartado]'),/SELECT\[Apartado\]/);
});
test('conversión del árbol oficial conserva IDs existentes',()=>{
 const id='node-00000000-0000-4000-8000-000000000001';
 const md=markdownOficialConTipos([{kind:'block',id,title:'Bloque',hijos:[]}],{oposicion:'TAI',convocatoria:'2025',modalidad:'Libre'});
 assert.equal(proyectar(reglasIniciales,md).at(-1).id,id);
});

test('cabecera usa alias, modalidad y año sin afectar los IDs',()=>{
 const n=proyectar(reglasIniciales,mdInicial);
 assert.equal(cabecerasConvocatoria(n)[0].texto,'TAI.LBR.2025');
 const mod=mdInicial.replace('Convocatoria 2025','Convocatoria 2026').replace('[Oposicion]','[Oposicion alias=OTRA]').replace('[Modalidad]','[Modalidad alias=PI]');
 const m=proyectar(reglasIniciales,mod);
 assert.equal(cabecerasConvocatoria(m)[0].texto,'OTRA.PI.2026');
 assert.deepEqual(m.map(x=>x.id),n.map(x=>x.id));
});
