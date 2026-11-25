import {test} from 'node:test';
import assert from 'node:assert/strict';
import {analizarDefinicion,generarVista,generarIndice,estadoPaso} from '../src/lib/editor-programa.mjs';
const d = `- oposicion [numeracion=ninguna]
  - convocatoria [prefijo=CNV numeracion=anio]
    - modalidad [numeracion=ninguna]
      - bloque [prefijo=BK numeracion=romana]
        - tema [prefijo=T numeracion=decimal ancho=2]
          - subtema [prefijo=SB numeracion=decimal ancho=2 repetir=true]`;
const m = `- Oposición ficticia
  - Convocatoria 2025
    - Libre
      - Bloque de ejemplo
        - Tema de ejemplo
          - Apartado A
          - Apartado B`;
const c = {year:2025,mode:'LIBRE'};
const vista = (texto=m,def=d,contexto=c) => generarVista(def,texto,contexto);
test('nivel sin segmento no asigna código ni pierde ruta heredada',()=>{const v=vista(m,d.replace('tema [prefijo=T numeracion=decimal ancho=2]','tema [numeracion=ninguna]'));assert.equal(v.nodos[4].displayCode,'');assert.equal(v.nodos[5].displayCode,'CNV2025.LIB.BKI.SB01');});
function uuidFactory(){let i=0;return ()=>`00000000-0000-4000-8000-${String(++i).padStart(12,'0')}`;}
const primera = ()=>generarIndice(vista(),c,{asignaciones:[null,null,null,null],crearUuid:uuidFactory()}).indice.nodes;
test('códigos, modalidad no numérica y Markdown con jerarquía',()=>{
 const v=vista();assert.equal(v.niveles[2].numbering,'ninguna');assert.equal(v.niveles[2].source,'modalidad');assert.deepEqual(v.nodos.map(n=>n.displayCode),['','CNV2025','CNV2025.LIB','CNV2025.LIB.BKI','CNV2025.LIB.BKI.T01','CNV2025.LIB.BKI.T01.SB01','CNV2025.LIB.BKI.T01.SB02']);assert.match(v.markdown,/\*\*CNV2025.LIB.BKI.T01.SB02\*\* — Apartado B/);
});
test('compatibilidad modalidad antigua y promoción interna',()=>{
 const v=vista(m.replace('Libre','Promoción interna'),d.replace('- modalidad [numeracion=ninguna]','- modalidad [numeracion=modalidad]'),{year:2025,mode:'PROMOCION_INTERNA'});assert.match(v.nodos.at(-1).displayCode,/\.PI\./);
});
test('romanos, relleno y ordinales por padre',()=>{
 const v=vista(m+'\n      - Segundo bloque\n        - Segundo tema\n          - Apartado C');assert.match(v.nodos.at(-1).displayCode,/BKII\.T01\.SB01$/);
 const sin=vista(m,d.replaceAll(' ancho=2',''));assert.match(sin.nodos.at(-1).displayCode,/T1\.SB2$/);
});
test('subniveles repetidos y tabulaciones',()=>{
 const v=vista((m+'\n            - Detalle').replace(/^ +/gm,s=>'\t'.repeat(s.length/2)));assert.match(v.nodos.at(-1).displayCode,/SB02\.SB01$/);
});
test('validación de DSL rechaza campos y niveles incorrectos',()=>{
 for(const x of [d.replace('BK','BK.'),d.replace('ancho=2','ancho=0'),d.replace('numeracion=romana','numeracion=romana ancho=2'),d.replace('BK','BK color=red'),d.replace('BK','BK inesperado=x'),d.replace('prefijo=BK','prefijo=BK prefijo=B'),d.replace('  - convocatoria','    - convocatoria')])assert.throws(()=>analizarDefinicion(x));
});
test('validación de contenido y contexto',()=>{
 for(const x of [m.replace('          - Apartado A','              - Apartado A'),m.replace('Libre','PI'),m.replace('2025','2026'),m+'\n- Otra oposición',m.replace('        - Tema de ejemplo','        título')])assert.throws(()=>vista(x));
 assert.throws(()=>vista(m,d.replace('prefijo=SB numeracion=decimal ancho=2','prefijo=SB numeracion=ninguna')),/duplicado/);
});
test('identidades estables al renombrar, mover y cambiar prefijo',()=>{
 const p=primera(),ids=p.map(n=>n.id);const v=vista(m.replace('Apartado A','Renombrado').replace('          - Renombrado\n          - Apartado B','          - Apartado B\n          - Renombrado'),d.replace('BK','BLK'));
 const out=generarIndice(v,c,{anteriores:ids,asignaciones:[ids[0],ids[1],ids[3],ids[2]]});assert.equal(out.indice.nodes.at(-1).id,ids[2]);assert.match(out.indice.nodes.at(-1).displayCode,/BLKI\.T01\.SB02$/);assert.equal(out.indice.nodes.at(-1).parentId,ids[1]);assert.match(out.yaml,/^schemaVersion: 1\nyear: 2025\nmode: "LIBRE"\nnodes:\n/);assert.ok(out.yaml.includes(`id: "${ids[2]}"`));
});
test('alta y duplicado explícito, nunca reutilizar UUID',()=>{
 const p=primera(),ids=p.map(n=>n.id),v=vista(m+'\n          - Apartado B');const out=generarIndice(v,c,{anteriores:ids,asignaciones:[...ids,null],crearUuid:()=> '00000000-0000-4000-8000-000000000005'}).indice.nodes;assert.equal(out.length,5);assert.notEqual(out[4].id,out[3].id);assert.throws(()=>generarIndice(v,c,{anteriores:ids,asignaciones:[...ids,ids[3]]}),/duplicada/);
});
test('identidad sin resolver o baja no confirmada bloquea',()=>{
 const ids=primera().map(n=>n.id);assert.throws(()=>generarIndice(vista(),c,{anteriores:ids,asignaciones:ids.slice(0,3)}),/incompletas/);assert.throws(()=>generarIndice(vista(m.replace('\n          - Apartado B','')),c,{anteriores:ids,asignaciones:ids.slice(0,3)}),/Bajas/);
 assert.throws(()=>generarIndice(vista(),c,{anteriores:ids,asignaciones:[...ids.slice(0,3),'node-00000000-0000-4000-8000-000000000099']}),/desconocida/);
});
test('nueva convocatoria genera códigos nuevos; plantilla no mutada',()=>{
 const v=vista(m.replace('2025','2026'),d,{year:2026,mode:'LIBRE'});assert.match(v.nodos.at(-1).displayCode,/^CNV2026\./);assert.equal(analizarDefinicion(d)[3].prefix,'BK');
});
test('estado exige persistencia, vigencia y evidencia oficial',()=>{
 const x={existe:true,estructuraValida:true,persistido:true,vigente:true,revisionOficialValida:true};assert.equal(estadoPaso(x),'COMPLETADO');assert.equal(estadoPaso({...x,existe:false}),'PENDIENTE');for(const k of ['estructuraValida','persistido','vigente','revisionOficialValida'])assert.equal(estadoPaso({...x,[k]:false}),'EN_REVISION');
});
test('protege versiones aceptadas y contexto incoherente',()=>{
 assert.throws(()=>generarIndice(vista(),c,{asignaciones:[null,null,null,null],versionStatus:'accepted'}),/revisión nueva/);
 assert.throws(()=>generarIndice(vista(),{...c,year:2026},{asignaciones:[null,null,null,null]}),/contexto/);
});
