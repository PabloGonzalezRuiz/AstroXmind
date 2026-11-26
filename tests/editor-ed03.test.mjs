import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {instalarEditorED03} from '../src/lib/editor-ed03.mjs';
import {instalarContextoEditor} from '../src/lib/editor-contextual-ui.mjs';
import {prepararPrimeraApertura} from '../src/lib/editor-apertura.mjs';
import {contextoDesdeUrl,prepararSolicitudContextual} from '../src/lib/editor-contextual.mjs';

test('ED-03 (histórico): paneles, edición, identidad explícita y reordenación en fixture',()=>{
  const html=readFileSync(new URL('./fixtures/editor-ed03-retirado.html',import.meta.url),'utf8');
  const {window}=new JSDOM(html,{url:'https://example.test/AstroXmind/editor-programa/'});
  const root=window.document.querySelector('[data-editor-ed03]');instalarEditorED03(root);
  const q=s=>root.querySelector(s),md=q('[data-ed-md]'),guardar=q('[data-ed-save]');
  assert.equal(guardar.disabled,false);
  assert.match(q('[data-ed-tree]').textContent,/CNV2025.LIB.BKI.T01.SB01/);
  q('button[aria-label="Bajar Apartado A"]').click();
  assert.match(md.value,/Apartado B\n\s+- Apartado A/);
  md.value=md.value.replace('Apartado A','Apartado revisado');md.dispatchEvent(new window.Event('input'));
  assert.equal(guardar.disabled,true);assert.equal(q('[data-ed-identidades]').hidden,false);
  assert.match(q('[data-ed-tree]').textContent,/Apartado revisado/);
  const seleccion=[...q('[data-ed-mapping]').querySelectorAll('select')];
  for(const sel of seleccion){const pref=sel.parentElement.firstChild.textContent.trim().replace('Apartado revisado','Apartado A');sel.value=[...sel.options].find(o=>o.textContent.startsWith(pref+' · ')).value;}
  q('[data-ed-resolver]').click();assert.equal(guardar.disabled,false);
  md.value='texto inválido';md.dispatchEvent(new window.Event('input'));assert.equal(guardar.disabled,true);assert.match(q('[data-ed-status]').textContent,/Línea/);
  window.close();
});

test('el editor único se publica con título definitivo y ambas rutas históricas redirigen',()=>{
  const leer=ruta=>new JSDOM(readFileSync(new URL('../dist/'+ruta+'/index.html',import.meta.url),'utf8')).window.document;
  const actual=leer('editor-temario-convocatoria');
  assert.match(actual.title,/Editor de temario de convocatoria/);
  assert.ok(actual.querySelector('#v2-reglas'));
  assert.ok(actual.querySelector('#v2-md'));
  for(const id of ['v2-reglas','v2-md']){
    const panel=actual.getElementById(id).closest('.panel-editor');
    assert.equal(panel.querySelectorAll('[data-guias][aria-pressed=true]').length,1);
    assert.equal(panel.querySelectorAll('[data-espacios][aria-pressed=false]').length,1);
    assert.equal(panel.querySelectorAll('[data-canvas-sangria][aria-hidden=true]').length,1);
    assert.ok(panel.querySelector('[data-nivel-sangria]'));
  }
  assert.ok(actual.querySelector('[data-resultado]'));
  assert.ok(![...actual.querySelectorAll('a')].some(a=>a.textContent.trim()==='Editor anterior'));
  for(const ruta of ['editor-programa','editor-programa-v2']){
    const doc=leer(ruta);
    assert.match(doc.querySelector('meta[http-equiv="refresh"]').content,/editor-temario-convocatoria\/$/);
    assert.equal(doc.querySelector('[data-editor-ed03], #v2-md'),null);
  }
});

const uuid='12345678-1234-4234-8234-123456789abc',op='op-'+uuid,version='syllabus-'+uuid;
const url=`https://example.test/AstroXmind/editor-temario-convocatoria/?op=${op}&anio=2025&version=${version}`;
const estadoFicticio=()=>({...prepararPrimeraApertura([{id:'node-'+uuid,kind:'block',title:'Bloque ficticio',hijos:[]}],{nombre:'Oposición ficticia',nombreCorto:'FIC',anio:2025,modalidad:'LIBRE'}),contexto:{callId:op+'-2025',versionId:version,huellaOficial:'a'.repeat(64)},primeraApertura:true,slug:'fic'});
test('contexto explícito, protege cabecera y conserva correspondencias al editar',()=>{
 const base=estadoFicticio();assert.deepEqual(contextoDesdeUrl(url),{id:op,anio:'2025',versionId:version});assert.throws(()=>contextoDesdeUrl(url+'&anio=2026'),/inválido/);
 const s=prepararSolicitudContextual(base,base.plantilla.reglas,base.markdown.replace('Bloque ficticio','Bloque revisado'));
 assert.deepEqual(s.correspondencias,base.correspondencias);assert.equal(s.revisionEsperada,null);assert.deepEqual(s.altasConfirmadas,[]);
 assert.throws(()=>prepararSolicitudContextual(base,base.plantilla.reglas,base.markdown.replace('año=2025','año=2026')),/cabecera/);
 assert.throws(()=>prepararSolicitudContextual(base,base.plantilla.reglas,base.markdown.split('\n')[0]),/convocatoria/);
});
test('primera apertura contextual y fallo de guardado conservan el borrador y bloquean reintento',async()=>{
 const html=readFileSync(new URL('../dist/editor-temario-convocatoria/index.html',import.meta.url),'utf8');
 const {window}=new JSDOM(html,{url});const root=window.document.querySelector('.editor-v2'),q=s=>root.querySelector(s),base=estadoFicticio();
 let solicitud,token='simulado';window.confirm=()=>true;
 instalarContextoEditor(root,{cargar:async()=>base,guardar:async(_w,_t,_op,_anio,_v,s)=>{solicitud=s;throw Error('Fallo simulado');},leerToken:()=>token,render:()=>{}});
 await new Promise(r=>setTimeout(r,0));assert.equal(q('.paneles').hidden,false);assert.equal(q('[data-restaurar]').hidden,true);assert.equal(q('[data-guardar-contexto]').disabled,false);
 const md=q('#v2-md');md.value=md.value.replace('Bloque ficticio','Bloque revisado');md.dispatchEvent(new window.Event('input'));q('[data-guardar-contexto]').click();
 await new Promise(r=>setTimeout(r,0));assert.match(solicitud.markdown,/Bloque revisado/);assert.match(md.value,/Bloque revisado/);assert.equal(q('[data-guardar-contexto]').disabled,true);assert.match(q('[data-contexto-estado]').textContent,/No se ha confirmado/);
 token='';window.dispatchEvent(new window.Event('astroxmind:github-token-changed'));assert.equal(q('.paneles').hidden,true);assert.equal(md.value,'');window.close();
});
test('guardado contextual confirmado notifica al expediente y cierra sin guardar dos veces',async()=>{
 const html=readFileSync(new URL('../dist/editor-temario-convocatoria/index.html',import.meta.url),'utf8');
 const {window}=new JSDOM(html,{url}),root=window.document.querySelector('.editor-v2'),q=s=>root.querySelector(s),base=estadoFicticio();
 let llamadas=0,cerrado=false;window.confirm=()=>true;const cerrar=window.close.bind(window);window.close=()=>{cerrado=true;};Object.defineProperty(window,'closed',{get:()=>cerrado});
 instalarContextoEditor(root,{cargar:async()=>base,guardar:async(_w,_t,_op,_anio,_v,s)=>{llamadas++;return {...base,markdown:s.markdown,revision:'b'.repeat(64)};},leerToken:()=> 'simulado',render:()=>{}});
 await new Promise(r=>setTimeout(r,0));q('[data-guardar-contexto]').click();await new Promise(r=>setTimeout(r,0));
 assert.equal(llamadas,1);assert.equal(cerrado,true);assert.equal(JSON.parse(window.localStorage.getItem('astroxmind:editor-v2:revision')).revision,'b'.repeat(64));cerrar();
});
