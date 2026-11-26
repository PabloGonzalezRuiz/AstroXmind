import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {readFileSync} from 'node:fs';
import {crearAlmacenLaboratorio,convocatoriasDemo,instalarLaboratorioIndice} from '../src/lib/laboratorio-indice.mjs';

test('laboratorio persistente aislado: retirada, reapertura, restauración y reset',async()=>{
 const {window}=new JSDOM('',{url:'https://example.test'}),a=crearAlmacenLaboratorio(window.localStorage),call=convocatoriasDemo[0].id;
 window.localStorage.setItem('otro-dato','intacto');
 const inicial=await a.abrir();const plan=await inicial.retirar(call,{revisionEsperada:'0'});assert.equal(plan.plan.documentosAfectados,5);assert.equal((await a.abrir()).indice.revision,'0');
 await inicial.retirar(call,{revisionEsperada:'0',confirmado:true});
 const b=await crearAlmacenLaboratorio(window.localStorage).abrir();assert.equal(b.indice.totalDocumentos,6);assert.deepEqual(b.indice.documentosDeConvocatoria(call),[]);
 await b.restaurar(call,{revisionEsperada:'1',confirmado:true});const c=await a.abrir();assert.equal(c.indice.documentosDeConvocatoria(call).length,5);assert.equal(c.indice.revision,'2');
 a.reset();assert.equal((await a.abrir()).indice.revision,'0');assert.equal(window.localStorage.getItem('otro-dato'),'intacto');window.close();
});
test('interfaz publicada: simulación y confirmación no eliminan documentos',async()=>{
 const html=readFileSync(new URL('../dist/laboratorio-indice/index.html',import.meta.url),'utf8'),{window}=new JSDOM(html,{url:'https://example.test/AstroXmind/laboratorio-indice/'});
 const root=window.document.querySelector('[data-lab-indice]'),q=s=>root.querySelector(s);await instalarLaboratorioIndice(root,window.localStorage);
 assert.equal(q('[data-docs]').children.length,6);q('[data-operacion]').click();await new Promise(r=>setTimeout(r,0));assert.match(q('[data-impacto]').textContent,/0 documentos eliminados/);q('[data-confirmar]').click();await new Promise(r=>setTimeout(r,0));assert.match(q('[data-arbol]').textContent,/retirada/);assert.equal(q('[data-docs]').children.length,6);assert.match(q('[data-operacion]').textContent,/restauración/);window.close();
});
