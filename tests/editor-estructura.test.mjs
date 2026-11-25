import {test} from 'node:test';
import assert from 'node:assert/strict';
import {generarVista} from '../src/lib/editor-programa.mjs';
import {crearEstructura,validarEstructura,representarEstructura,moverEntrada,exportarEstructura} from '../src/lib/editor-estructura.mjs';
const d=`- oposicion [numeracion=ninguna]
  - convocatoria [prefijo=CNV numeracion=anio]
    - modalidad [numeracion=ninguna]
      - bloque [prefijo=BK numeracion=romana]
        - tema [prefijo=T numeracion=decimal ancho=2]
          - subtema [prefijo=SB numeracion=decimal ancho=2 repetir=true]`;
const c={year:2025,mode:'LIBRE',oppositionTitle:'Oposición ficticia'};
const m=`- Oposición ficticia
  - Convocatoria 2025
    - Libre
      - Bloque A
        - Tema A
          - Apartado A
      - Bloque B
        - Tema B`;
const nueva=()=>{let i=0;return crearEstructura(generarVista(d,m,c),{asignaciones:[null,null,null,null,null],crearUuid:()=>`00000000-0000-4000-8000-${String(++i).padStart(12,'0')}`});};
test('estructura plana sin códigos, representación reversible',()=>{const e=nueva();assert.equal(e.length,5);assert.deepEqual(Object.keys(e[0]),['id','parentId','order','title','aliases']);assert.equal(representarEstructura(d,e,c).markdownFuente.trim(),m);});
test('mover tema con hijos recalcula códigos conservando IDs',()=>{const e=nueva();e.push({id:'entry-00000000-0000-4000-8000-000000000006',parentId:e[0].id,order:2,title:'Tema restante',aliases:[]});const antes=representarEstructura(d,e,c);const x=moverEntrada(e,e[1].id,{parentId:e[3].id,order:2});const despues=representarEstructura(d,x,c);assert.equal(antes.nodos.find(n=>n.id===e[2].id).displayCode,'CNV2025.LIB.BKI.T01.SB01');assert.equal(despues.nodos.find(n=>n.id===e[2].id).displayCode,'CNV2025.LIB.BKII.T02.SB01');assert.equal(x[2].parentId,e[1].id);assert.equal(e[1].parentId,e[0].id);});
test('cambiar orden disperso usa posición relativa, sin alterar IDs',()=>{const e=nueva();const x=moverEntrada(e,e[0].id,{parentId:null,order:30});const v=representarEstructura(d,x,c);assert.equal(v.nodos.find(n=>n.id===e[0].id).displayCode,'CNV2025.LIB.BKII');assert.equal(x[0].order,30);});
test('renombrar y añadir alias no altera identidad ni código',()=>{const e=nueva();const x=e.map((n,i)=>i===1?{...n,title:'Otro nombre',aliases:[n.title]}:n);const v=representarEstructura(d,x,c);assert.equal(v.nodos[1].id,e[1].id);assert.equal(v.nodos[1].displayCode,'CNV2025.LIB.BKI.T01');assert.deepEqual(v.nodos[1].aliases,['Tema A']);});
test('reglas de representación independientes de estructura',()=>{const e=nueva(),antes=JSON.stringify(e);assert.match(representarEstructura(d.replace('BK','BLK'),e,c).markdown,/BLKI/);assert.equal(JSON.stringify(e),antes);});
test('reutilizar IDs explícitamente en convocatoria nueva sin mutar histórico',()=>{const e=nueva();const c2={...c,year:2026};const x=crearEstructura(generarVista(d,m.replace('2025','2026'),c2),{catalogoIds:e.map(n=>n.id),asignaciones:e.map(n=>n.id)});assert.deepEqual(x.map(n=>n.id),e.map(n=>n.id));assert.match(representarEstructura(d,x,c2).markdown,/CNV2026/);assert.match(representarEstructura(d,e,c).markdown,/CNV2025/);});
test('rechaza ciclos, huérfanos, orden duplicado e identidad desconocida',()=>{const e=nueva();assert.throws(()=>moverEntrada(e,e[0].id,{parentId:e[2].id,order:1}),/Ciclo/);assert.throws(()=>validarEstructura(e.slice(1)),/Padre inexistente/);assert.throws(()=>crearEstructura(generarVista(d,m,c),{asignaciones:e.map(n=>n.id)}),/desconocida/);});
test('exportación de un documento por entrada sin códigos derivados',()=>{const e=nueva(),out=exportarEstructura(e,c);assert.equal(Object.keys(out.registros).length,5);assert.ok(out.manifest.includes(e[1].id));assert.match(out.registros[`entradas/${e[1].id}.yaml`],/parentId:/);assert.doesNotMatch(JSON.stringify(out),/displayCode/);});
test('reordenar a posición ocupada conserva hermanos e IDs en ambos sentidos',()=>{const e=nueva();const x=moverEntrada(e,e[0].id,{order:2});assert.equal(x[0].order,2);assert.equal(x[3].order,1);const y=moverEntrada(x,e[0].id,{order:1});assert.deepEqual(y,e);assert.equal(e[0].order,1);});
test('mover a otro padre ocupado desplaza hermanos sin tocar descendientes',()=>{const e=nueva();const x=moverEntrada(e,e[1].id,{parentId:e[3].id,order:1});assert.equal(x[4].order,2);assert.equal(x[2].parentId,e[1].id);assert.equal(x[1].id,e[1].id);});
