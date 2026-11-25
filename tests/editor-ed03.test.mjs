import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {instalarEditorED03} from '../src/lib/editor-ed03.mjs';

test('ED-03: paneles, edición, identidad explícita y reordenación en ejemplo ficticio',()=>{
  const html=readFileSync(new URL('../dist/editor-programa/index.html',import.meta.url),'utf8');
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
