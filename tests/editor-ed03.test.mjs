import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {instalarEditorED03} from '../src/lib/editor-ed03.mjs';

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
  assert.ok(actual.querySelector('[data-resultado]'));
  assert.ok(![...actual.querySelectorAll('a')].some(a=>a.textContent.trim()==='Editor anterior'));
  for(const ruta of ['editor-programa','editor-programa-v2']){
    const doc=leer(ruta);
    assert.match(doc.querySelector('meta[http-equiv="refresh"]').content,/editor-temario-convocatoria\/$/);
    assert.equal(doc.querySelector('[data-editor-ed03], #v2-md'),null);
  }
});
