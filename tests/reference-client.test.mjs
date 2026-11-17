import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {revealReferenceTarget,installReferenceNavigation} from '../src/lib/navigation/reference-client.mjs';

const html=readFileSync(new URL('../dist/navegacion/index.html',import.meta.url),'utf8');
const tick=()=>new Promise(resolve=>setTimeout(resolve,10));
function setup(hash=''){
 const dom=new JSDOM(html,{url:'https://example.test/AstroXmind/navegacion/'+hash,runScripts:'outside-only',pretendToBeVisual:true});
 const {window}=dom;window.scrollTo=()=>{};
 window.HTMLElement.prototype.scrollIntoView=function(){this.dataset.didScroll='true';};
 const scripts=[...window.document.querySelectorAll('script[type="module"]')].map(script=>script.textContent);
 const tabs=scripts.find(script=>script.includes('customElements.define("starlight-tabs"'));
 const tree=scripts.find(script=>script.includes('customElements.define("astro-xmind-tree-table"'));
 assert.ok(tabs,'actual Starlight tabs bundle present');assert.ok(tree,'actual TreeTable bundle present');
 window.eval(tabs);window.eval(tree);
 return dom;
}

test('detached folded destination opens only its ancestors and preserves unrelated fold state',async()=>{
 const dom=setup();try{
  const {document}=dom.window;
  assert.equal(document.getElementById('ref-medida-detalle'),null);
  const target=await revealReferenceTarget(document,'ref-medida-detalle');
  assert.equal(target.id,'ref-medida-detalle');assert.ok(target.isConnected);
  assert.equal(document.querySelector('#ref-grupo .tree-toggle').getAttribute('aria-expanded'),'true');
  assert.equal(document.querySelector('#ref-medida .tree-toggle').getAttribute('aria-expanded'),'true');
  assert.equal(document.querySelector('#ref-otra-rama .tree-toggle').getAttribute('aria-expanded'),'false');
  assert.equal(await revealReferenceTarget(document,'ref-missing'),null);
  assert.equal(await revealReferenceTarget(document,'heading'),null);
 }finally{dom.window.close();}
});

test('direct fragment and repeated same-fragment click select Resultado, focus and reveal the destination',async()=>{
 const dom=setup('#ref-medida-detalle');try{
  const {document}=dom.window;
  const tree=document.querySelector('astro-xmind-tree-table');
  const tabs=tree.closest('starlight-tabs');
  const controls=[...tabs.querySelectorAll('[role="tab"]')];
  controls.find(tab=>tab.textContent.trim()==='Código').click();
  assert.ok(tree.closest('[role="tabpanel"]').hidden);
  installReferenceNavigation(document);document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));await tick();
  let target=document.getElementById('ref-medida-detalle');
  assert.ok(target?.isConnected);assert.equal(document.activeElement,target);
  assert.equal(tree.closest('[role="tabpanel"]').hidden,false);
  assert.ok(target.classList.contains('reference-destination'));assert.equal(target.dataset.didScroll,'true');
  document.querySelector('#ref-grupo .tree-toggle').click();
  assert.equal(document.getElementById('ref-medida-detalle'),null);
  document.querySelector('a[data-doc-reference="doc:doc-000010#ref-medida-detalle"]').click();await tick();
  target=document.getElementById('ref-medida-detalle');assert.ok(target?.isConnected);assert.equal(document.activeElement,target);
 }finally{dom.window.close();}
});

test('ordinary explicit heading destinations receive focus and malformed hashes do not throw',async()=>{
 const dom=setup('#ref-componente');try{
  const {document}=dom.window;installReferenceNavigation(document);document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));await tick();
  assert.equal(document.activeElement.id,'ref-componente');
  dom.window.location.hash='#ref%broken';await tick();
  assert.equal(document.activeElement.id,'ref-componente');
 }finally{dom.window.close();}
});
