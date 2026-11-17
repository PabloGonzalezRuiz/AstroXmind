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
 assert.equal(breadcrumbs.querySelector('[aria-current="page"]').text,context.current.title);
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
