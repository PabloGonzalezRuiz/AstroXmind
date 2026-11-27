import {test} from 'node:test';
import assert from 'node:assert/strict';
import {proyectar,reglasIniciales,mdInicial,completarIds,rutaPorId,plantillas,clasificarPorProfundidad,markdownOficialConTipos,cabecerasConvocatoria} from '../src/lib/editor-v2.mjs';
test('tipos explícitos, hermanos y numeración gradual',()=>{
  const n=proyectar(reglasIniciales,mdInicial);
  assert.deepEqual(n.map(x=>x.codigo),['','Blq.I','Blq.I.Tm.01','Stm01','Tm.01.Apt.01','Blq.I.Tm.02','Tm.02.Apt.01']);
});
test('sobrescritura local y niveles sin numerar',()=>{
  const n=proyectar(reglasIniciales,'- Raíz[Convocatoria]\n  - B[Bloque]\n    - T[Tema heredar=0 prefijo=X ancho=3]\n      - A[Apartado heredar=1 separador=-]');
  assert.equal(n[2].codigo,'X001');
  assert.equal(n[3].codigo,'Apt.001-01');
});
test('rechaza un tipo desconocido y un salto',()=>{
  assert.throws(()=>proyectar(reglasIniciales,'- X[Otro]'));
  assert.throws(()=>proyectar(reglasIniciales,'- X[Convocatoria]\n    - Y[Tema]'));
});

test('IDs estables, apartado anidado y ruta recalculada',()=>{
 let i=0; const generar=()=> '00000000-0000-4000-8000-'+String(++i).padStart(12,'0');
 const md=completarIds(reglasIniciales,'- Raíz[Convocatoria]\n  - A[Tema]\n    - SQL[Apartado]\n      - SELECT[Apartado]\n  - B[Tema]',generar);
 const n=proyectar(reglasIniciales,md); const id=n[3].id;
 assert.deepEqual(rutaPorId(n,id).map(x=>x.titulo),['Raíz','A','SQL','SELECT']);
 const filas=md.split('\n'); const movido=[filas[0],filas[1],filas[4],filas[2],filas[3]].join('\n');
 const m=proyectar(reglasIniciales,movido);
 assert.deepEqual(rutaPorId(m,id).map(x=>x.titulo),['Raíz','B','SQL','SELECT']);
 assert.equal(completarIds(reglasIniciales,movido,()=>{throw Error('No debe regenerar');}),movido);
 assert.equal(plantillas[0].reglas,reglasIniciales);
});

test('clasificación inicial determinista, sin inferir subapartados ni alterar tipos explícitos',()=>{
 const texto='- TAI\n  - B\n    - T\n      - SQL';
 const md=clasificarPorProfundidad(reglasIniciales,texto);
 assert.deepEqual(proyectar(reglasIniciales,md).map(n=>n.tipo),['convocatoria','bloque','tema','apartado']);
 assert.equal(clasificarPorProfundidad(reglasIniciales,md),md);
 assert.throws(()=>clasificarPorProfundidad(reglasIniciales,texto+'\n        - SELECT'));
 assert.match(clasificarPorProfundidad(reglasIniciales,md+'\n        - SELECT[Apartado]'),/SELECT\[Apartado\]/);
});
test('conversión del árbol oficial conserva IDs existentes',()=>{
 const id='node-00000000-0000-4000-8000-000000000001';
 const md=markdownOficialConTipos([{kind:'block',id,title:'Bloque',hijos:[]}],{oposicion:'TAI',convocatoria:'2025',modalidad:'Libre'});
 assert.equal(proyectar(reglasIniciales,md).at(-1).id,id);
});

test('cabecera usa alias, modalidad y año sin afectar los IDs',()=>{
 const n=proyectar(reglasIniciales,mdInicial);
 assert.equal(cabecerasConvocatoria(n)[0].texto,'TAI.LBR.2025');
 const mod=mdInicial.replace('[Convocatoria]','[Convocatoria oposicion=OTRA modalidad=PI año=2026]');
 const m=proyectar(reglasIniciales,mod);
 assert.equal(cabecerasConvocatoria(m)[0].texto,'OTRA.PI.2026');
 assert.deepEqual(m.map(x=>x.id),n.map(x=>x.id));
});

test('bloques cuelgan directamente de la convocatoria compacta',()=>{
 const n=proyectar(reglasIniciales,mdInicial);
 assert.equal(n[0].tipo,'convocatoria');
 assert.equal(n[1].tipo,'bloque');
 assert.equal(n[1].padreId,n[0].id);
 assert.equal(n[1].nivel,1);
});

test('subtema tiene numeración propia y los apartados se numeran por tema',()=>{
 const md='- Convocatoria[Convocatoria]\n  - Bloque[Bloque]\n    - Tema[Tema]\n      - Subtema[Subtema]\n        - Apartado anidado[Apartado]\n      - Apartado directo[Apartado]';
 const n=proyectar(reglasIniciales,md);
 assert.deepEqual(n.map(x=>x.codigo),['','Blq.I','Blq.I.Tm.01','Stm01','Tm.01.Apt.01','Tm.01.Apt.02']);
 assert.equal(n[4].padreFila,n[3].fila);
 assert.equal(n[5].padreFila,n[2].fila);
});
test('temas heredan el código completo del bloque',()=>{
 const md='- TAI[Convocatoria]\n  - Primero[Bloque]\n    - Uno[Tema]\n    - Dos[Tema]\n  - Segundo[Bloque]\n    - Tres[Tema]';
 assert.deepEqual(proyectar(reglasIniciales,md).map(n=>n.codigo),['','Blq.I','Blq.I.Tm.01','Blq.I.Tm.02','Blq.II','Blq.II.Tm.01']);
});

test('herencia de código completo es optativa y conserva la herencia numérica histórica',()=>{
 const md='- TAI[Convocatoria]\n  - Bloque[Bloque]\n    - Tema[Tema]\n      - Apartado[Apartado heredar=codigo]';
 const n=proyectar(reglasIniciales,md);
 assert.equal(n[2].numero,'I.01');
 assert.equal(n[3].codigo,'Blq.I.Tm.01.Apt.01');
 const anterior=reglasIniciales.replace('heredar=codigo','heredar=1');
 assert.equal(proyectar(anterior,md)[2].codigo,'Tm.I.01');
 const sinAncestro=proyectar(reglasIniciales,'- TAI[Convocatoria]\n  - Tema[Tema]');
 assert.equal(sinAncestro[1].codigo,'Tm.01');
 assert.equal(plantillas[0].revision,6);
});


test('apartado hereda solo prefijo y ordinal del tema, reinicia por tema y conserva la plantilla anterior',()=>{
 const md='- Raíz[Convocatoria]\n  - B[Bloque]\n    - T[Tema]\n      - A[Apartado]\n        - AA[Apartado]\n      - B[Apartado]\n    - U[Tema]\n      - C[Apartado]';
 const n=proyectar(reglasIniciales,md);
 assert.deepEqual(n.map(x=>x.codigo),['','Blq.I','Blq.I.Tm.01','Tm.01.Apt.01','Tm.01.Apt.01.01','Tm.01.Apt.02','Blq.I.Tm.02','Tm.02.Apt.01']);
 const v4=reglasIniciales.replace('prefijo=Apt. numeracion=decimal ancho=2 heredar=tema-ruta','prefijo=APT numeracion=decimal heredar=1');
 assert.equal(proyectar(v4,md)[3].codigo,'APT01.1');
 const v5=reglasIniciales.replace('heredar=tema-ruta','heredar=tema');assert.equal(proyectar(v5,md)[4].codigo,'Tm.01.Apt.02');
});


test('la numeración sigue la estructura real: hijos no consumen ordinales de hermanos',()=>{
 const md='- Raíz[Convocatoria]\n  - Bloque[Bloque]\n    - Constitución[Tema]\n      - Constitución[Apartado]\n      - Derechos[Apartado]\n        - Garantía[Apartado]\n      - Corona[Apartado]\n      - Funciones[Apartado]\n    - Cortes[Tema]\n      - Atribuciones[Apartado]\n        - Congreso[Apartado]\n        - Senado[Apartado]\n      - Tribunal[Apartado]\n        - Composición[Apartado]\n      - Defensor[Apartado]';
 const n=proyectar(reglasIniciales,md);
 assert.deepEqual(n.map(x=>x.codigo),['','Blq.I','Blq.I.Tm.01','Tm.01.Apt.01','Tm.01.Apt.02','Tm.01.Apt.02.01','Tm.01.Apt.03','Tm.01.Apt.04','Blq.I.Tm.02','Tm.02.Apt.01','Tm.02.Apt.01.01','Tm.02.Apt.01.02','Tm.02.Apt.02','Tm.02.Apt.02.01','Tm.02.Apt.03']);
});
