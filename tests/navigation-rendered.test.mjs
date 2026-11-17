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
 assert.deepEqual(links(page.querySelector('nav[aria-label="Documentos hijos"]')),context.children.map(n=>n.url));
 const reading=page.querySelector('nav[aria-label="Recorrido de lectura"]');
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
