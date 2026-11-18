import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from 'node-html-parser';
import { getNavigationContext } from '../src/lib/navigation/context.mjs';

const index=JSON.parse(readFileSync(new URL('../dist/navigation.json',import.meta.url),'utf8'));
const base='/AstroXmind/';
const readPage=url=>parse(readFileSync(new URL(`../dist/${decodeURIComponent(url.slice(base.length))}index.html`,import.meta.url),'utf8'));
const links=element=>element?.querySelectorAll('a').map(a=>a.getAttribute('href')) ?? [];

for(const id of index.traversal) test(`rendered contextual navigation: ${id}`,()=>{
 const context=getNavigationContext(index,id);
 const page=readPage(context.current.url);
 const breadcrumbs=page.querySelector('nav[aria-label="Ruta de ubicación"]');
 assert.ok(breadcrumbs);
 assert.deepEqual(links(breadcrumbs.querySelector('ol')),context.breadcrumbs.slice(0,-1).map(n=>n.url));
 assert.equal(breadcrumbs.querySelector('[aria-current="page"] .navigation-title').text,context.current.title);
 assert.equal(breadcrumbs.querySelector('.parent')?.getAttribute('href')??null,context.parent?.url??null);
 const tree=page.querySelector('nav[aria-label="Árbol de documentos"]');
 assert.deepEqual(links(tree),index.traversal.map(key=>index.nodes[key].url));
 assert.equal(tree.querySelectorAll('[aria-current="page"]').length,1);
 assert.equal(tree.querySelector('[aria-current="page"]').getAttribute('href'),context.current.url);
 for(const anchor of tree.querySelectorAll('a')){
  const node=Object.values(index.nodes).find(n=>n.url===anchor.getAttribute('href'));
  const parentLi=anchor.parentNode.parentNode.parentNode;
  const parentLink=parentLi.tagName==='LI'?parentLi.childNodes.find(child=>child.tagName==='A'):null;
  assert.equal(parentLink?.getAttribute('href')??null,node.parent?index.nodes[node.parent].url:null);
 }
 assert.deepEqual(links(page.querySelector('[data-document-footer] nav[aria-label="Documentos hijos"]')),context.children.map(n=>n.url));
 const siblings=context.parent ? context.parent.children.filter(key=>key!==id).map(key=>index.nodes[key].url) : [];
 assert.deepEqual(links(page.querySelector('[data-document-footer] nav[aria-label="Documentos hermanos"]')),siblings);
 assert.equal(page.querySelector('[data-document-footer] [rel="up"]')?.getAttribute('href')??null,context.parent?.url??null);
 const footer=page.querySelector('[data-document-footer]');
 const reading=footer?.querySelector('nav[aria-label="Recorrido de lectura"]');
 assert.equal(reading?.querySelector('[rel="prev"]')?.getAttribute('href')??null,context.previous?.url??null);
 assert.equal(reading?.querySelector('[rel="next"]')?.getAttribute('href')??null,context.next?.url??null);
 // Exactly one contextual region per document, including the splash home.
 assert.equal(page.querySelectorAll('nav[aria-label="Ruta de ubicación"]').length,1);
 for(const label of page.querySelectorAll('[data-navigation-id]')){
  const node=index.nodes[label.getAttribute('data-navigation-id')];
  assert.equal(label.querySelector('.navigation-title').text,node.title);
  assert.equal(label.getAttribute('data-navigation-number')??null,node.numberLabel);
  assert.equal(Boolean(label.querySelector('.navigation-pending')),node.pendingOrder);
  assert.equal(label.querySelector('.navigation-number')?.text.trim()??null,node.numberLabel===null?null:node.numberLabel+'.');
 }
});

test('404 has no misleading document context',()=>{
 const page=parse(readFileSync(new URL('../dist/404.html',import.meta.url),'utf8'));
 assert.equal(page.querySelector('nav[aria-label="Ruta de ubicación"]'),null);
 assert.equal(page.querySelector('nav[aria-label="Recorrido de lectura"]'),null);
});


test('Navegación demonstrates an automatic component, stable MDX/Markdown links and unique explicit node IDs',()=>{
 const page=readPage(index.nodes['doc-000010'].url);
 assert.equal(page.querySelectorAll('[data-document-navigator]').length,2);
 assert.equal(page.querySelectorAll('.component-example').length,3);
 const tree=page.querySelector('astro-xmind-tree-table');
 assert.ok(tree.querySelector('#ref-medida-detalle'));
 assert.equal(tree.querySelectorAll('td[id]').length,4);
 assert.equal(tree.querySelectorAll('td:not([id])').length,1);
 const references=JSON.parse(readFileSync(new URL('../dist/references.json',import.meta.url),'utf8')).references;
 assert.ok(references.some(r=>r.source==='doc-000010' && r.target==='doc-000007' && r.fragment==='ref-desarrollo'));
 assert.ok(references.some(r=>r.source==='doc-000008' && r.target==='doc-000010' && r.fragment==='ref-medida-detalle'));
});


test('sidebar numbering matches the intended book hierarchy rather than YAML order values',()=>{
 const tree=readPage(index.nodes['doc-000003'].url).querySelector('nav[aria-label="Árbol de documentos"]');
 for(const [id,label] of Object.entries({'doc-000002':'1','doc-000003':'1.1','doc-000004':'2','doc-000010':'3','doc-000005':'3.1'})){
  assert.equal(tree.querySelector(`[data-navigation-id="${id}"]`).getAttribute('data-navigation-number'),label);
 }
});

test('standalone branch preserves reading order and links without fetching the wiki', () => {
 const branchId = 'doc-000010';
 const branch = parse(readFileSync(new URL(`../dist/rama/${branchId}.html`, import.meta.url), 'utf8'));
 assert.ok(links(readPage(index.nodes[branchId].url)).includes(`/AstroXmind/rama/${branchId}.html`));
 assert.deepEqual(branch.querySelectorAll('[data-export-document]').map(el => el.id), [
  'doc-000010', 'doc-000005', 'doc-000006', 'doc-000007', 'doc-000008', 'doc-000009',
 ]);
 const ids = branch.querySelectorAll('[id]').map(el => el.id);
 assert.equal(new Set(ids).size, ids.length);
 const hashes = links(branch).filter(href => href?.startsWith('#'));
 assert.ok(hashes.includes('#doc-000007--ref-desarrollo'));
 assert.ok(hashes.some(href => href.startsWith('#doc-000010--ref-cita-')));
 for (const hash of hashes) assert.ok(ids.includes(decodeURIComponent(hash.slice(1))), hash);
 assert.ok(ids.includes('doc-000010--ref-medida-detalle'));
 assert.equal(branch.querySelectorAll('script[src], link[href], iframe, img:not([src^="data:"]), .tree-toggle').length, 0);
 assert.ok(links(branch).includes('https://pablogonzalezruiz.github.io/AstroXmind/componentes/tree-table/'));
 assert.ok(branch.querySelector('a[download]'));
});
