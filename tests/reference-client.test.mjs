import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {revealReferenceTarget,installReferenceNavigation} from '../src/lib/navigation/reference-client.mjs';
import {installReadingReturn} from '../src/lib/navigation/reading-return.mjs';
import {installReferencePreview} from '../src/lib/navigation/reference-preview.mjs';

const html=readFileSync(new URL('../dist/navegacion/index.html',import.meta.url),'utf8');
const tick=()=>new Promise(resolve=>setTimeout(resolve,10));
function setup(hash='', page=html){
 const dom=new JSDOM(page,{url:'https://example.test/AstroXmind/navegacion/'+hash,runScripts:'outside-only',pretendToBeVisual:true});
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

test('a backlink lands on the citation inside a folded TreeTable cell', async () => {
  const article = readFileSync(new URL('../dist/pruebas-jerarquia/articulo-2/index.html', import.meta.url), 'utf8');
  const articleDom = new JSDOM(article);
  const links = [...articleDom.window.document.querySelectorAll('[data-reference-relations] details:last-child a')];
  const initial = new JSDOM(html);
  const citation = [...initial.window.document.querySelectorAll('astro-xmind-tree-table a[data-doc-reference]')]
    .find(anchor => anchor.textContent.includes('consultar artículo 2'));
  assert.match(citation?.id ?? '', /^ref-cita-/);
  const backlink = links.find(anchor => anchor.getAttribute('href') === '/AstroXmind/navegacion/#' + citation.id);
  assert.ok(backlink);
  assert.match(backlink.parentElement.textContent, /Medida de organización/);
  const dom = setup('#' + citation.id);
  try {
    const { document } = dom.window;
    assert.equal(document.getElementById(citation.id), null);
    installReferenceNavigation(document);
    document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
    await tick();
    assert.equal(document.activeElement.id, citation.id);
    assert.equal(document.querySelector('#ref-otra-rama .tree-toggle').getAttribute('aria-expanded'), 'false');
  } finally {
    dom.window.close();
    initial.window.close();
    articleDom.window.close();
  }
});

test('reading return restores the source citation, selected tabs, folds and scroll', async () => {
  const source = setup();
  const article = readFileSync(new URL('../dist/pruebas-jerarquia/articulo-2/index.html', import.meta.url), 'utf8');
  const destination = new JSDOM(article, {
    url: 'https://example.test/AstroXmind/pruebas-jerarquia/articulo-2/#ref-desarrollo',
  });
  const restored = setup();
  const transferSession = (from, to) => {
    for (let index = 0; index < from.sessionStorage.length; index++) {
      const key = from.sessionStorage.key(index);
      to.sessionStorage.setItem(key, from.sessionStorage.getItem(key));
    }
  };
  try {
    const {document} = source.window;
    const foldedTable = document.querySelector('#ref-grupo').closest('astro-xmind-tree-table');
    const otherTabs = [...document.querySelectorAll('starlight-tabs')].find(group => !group.contains(foldedTable));
    [...otherTabs.querySelectorAll('[role="tab"]')].find(tab => tab.textContent.trim() === 'Código').click();
    document.querySelector('#ref-grupo .tree-toggle').click();
    const link = [...foldedTable.querySelectorAll('a[data-doc-reference]')]
      .find(anchor => anchor.textContent.includes('consultar artículo 2'));
    assert.ok(link);
    Object.defineProperty(source.window, 'scrollY', { value: 713 });
    installReadingReturn(document);
    source.window.addEventListener('click', event => event.preventDefault());
    link.click();
    transferSession(source.window, destination.window);

    const target = destination.window.document;
    installReadingReturn(target);
    target.dispatchEvent(new destination.window.Event('DOMContentLoaded'));
    const back = target.querySelector('[data-reading-return]');
    assert.equal(back.hidden, false);
    assert.equal(back.href, source.window.location.href);
    destination.window.addEventListener('click', event => event.preventDefault());
    back.click();
    transferSession(destination.window, restored.window);

    let scroll;
    restored.window.scrollTo = options => { scroll = options; };
    const result = restored.window.document;
    assert.equal(installReadingReturn(result), true);
    result.dispatchEvent(new restored.window.Event('DOMContentLoaded'));
    await tick();
    assert.equal(result.activeElement.id, link.id);
    assert.equal(scroll.top, 713);
    assert.equal(result.querySelector('#ref-grupo .tree-toggle').getAttribute('aria-expanded'), 'true');
    assert.equal(result.querySelector('#ref-otra-rama .tree-toggle').getAttribute('aria-expanded'), 'false');
    const restoredOtherTabs = [...result.querySelectorAll('starlight-tabs')]
      .find(group => !group.contains(result.getElementById('ref-grupo')));
    assert.equal(restoredOtherTabs.querySelector('[aria-selected="true"]').textContent.trim(), 'Código');
    assert.equal(result.querySelector('[data-reading-return]').hidden, true);
  } finally {
    for (const dom of [source, destination, restored]) dom.window.close();
  }
});

test('preview opens a heading without navigating and moves focus back to the trigger', async () => {
  const dom = setup();
  try {
    const {window} = dom;
    const {document} = window;
    const dialog = document.querySelector('[data-reference-preview]');
    dialog.showModal = () => { dialog.open = true; };
    dialog.close = () => { dialog.open = false; dialog.dispatchEvent(new window.Event('close')); };
    const article = readFileSync(new URL('../dist/pruebas-jerarquia/articulo-2/index.html', import.meta.url), 'utf8');
    window.fetch = async url => {
      assert.equal(url.pathname, '/AstroXmind/pruebas-jerarquia/articulo-2/');
      assert.equal(url.hash, '');
      return { ok: true, text: async () => article };
    };
    installReferencePreview(document);
    const citation = [...document.querySelectorAll('a[data-doc-reference]')]
      .find(a => a.textContent.includes('Salta al apartado del Artículo 2'));
    const trigger = citation.nextElementSibling;
    trigger.click();
    await tick();
    assert.equal(dialog.open, true);
    assert.equal(dialog.querySelector('h2').textContent, 'Contenido');
    assert.match(dialog.querySelector('[data-preview-content] p').textContent, /Artículo 2 · Desarrollo/);
    assert.ok(dialog.querySelectorAll('[data-preview-content] p').length > 1);
    assert.equal(dialog.querySelector('[data-preview-open]').href, citation.href);
    assert.equal(window.location.pathname, '/AstroXmind/navegacion/');
    dialog.querySelector('[data-preview-close]').click();
    assert.equal(document.activeElement, trigger);
    document.querySelector('#ref-grupo .tree-toggle').click();
    await tick();
    const foldedCitation = [...document.querySelectorAll('astro-xmind-tree-table a[data-doc-reference]')]
      .find(anchor => anchor.textContent.includes('consultar artículo 2'));
    assert.ok(foldedCitation.nextElementSibling.hasAttribute('data-preview-trigger'));
    window.fetch = async () => ({ ok: false });
    foldedCitation.nextElementSibling.click();
    await tick();
    assert.match(dialog.querySelector('[data-preview-status]').textContent, /no disponible/);
    assert.equal(dialog.querySelector('[data-preview-open]').href, foldedCitation.href);
    let followed = false;
    foldedCitation.addEventListener('click', event => { followed = true; event.preventDefault(); });
    dialog.querySelector('[data-preview-open]').click();
    assert.equal(followed, true);
    assert.equal(dialog.open, false);
  } finally {
    dom.window.close();
  }
});

test('fullscreen control is reachable with forward Tab after a referenced tree cell', async () => {
  const dom = setup();
  try {
    const { document, Node } = dom.window;
    const cell = await revealReferenceTarget(document, 'ref-grupo');
    assert.ok(cell);
    const button = cell.closest('astro-xmind-tree-table').querySelector('.tree-fullscreen');
    assert.ok(cell.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING);
    assert.equal(button.hidden, false);
    assert.equal(button.tabIndex, 0);
  } finally {
    dom.window.close();
  }
});

test('TreeTable preserves every sublist and folds a 504-node table without losing rows', async () => {
  const page = readFileSync(new URL('../dist/componentes/tree-table/index.html', import.meta.url), 'utf8');
  const dom = setup('', page);
  try {
    const {document} = dom.window;
    const parent = document.getElementById('ref-sublistas');
    assert.equal(parent.rowSpan, 2);
    const nested = [...parent.closest('table').querySelectorAll('[data-tree-parent="0"]')];
    assert.equal(nested.length, 2);
    assert.match(nested[0].textContent, /Primer hijo/);
    assert.equal(nested[1].id, 'ref-segunda-sublista');
    assert.equal(nested[1].querySelector('.tree-number').textContent.trim(), '1.2.');

    const large = [...document.querySelectorAll('astro-xmind-tree-table')].find(table => table.querySelectorAll('td').length === 504);
    assert.ok(large);
    assert.equal(large.querySelectorAll('tr').length, 480);
    const groups = [...large.querySelectorAll('[data-tree-level="0"]')];
    assert.equal(groups.length, 24);
    const toggle = groups[0].querySelector('.tree-toggle');
    toggle.click();
    assert.equal(large.querySelectorAll('tr').length, 461);
    assert.equal(groups[23].rowSpan, 20);
    assert.equal(groups[23].querySelector('.tree-number').textContent.trim(), '24.');
    assert.match(large.textContent, /Elemento 24\.20/);
    assert.doesNotMatch(large.textContent, /Elemento 1\.20/);
    toggle.click();
    assert.equal(large.querySelectorAll('tr').length, 480);
    assert.match(large.textContent, /Elemento 1\.20/);
  } finally {
    dom.window.close();
  }
});
