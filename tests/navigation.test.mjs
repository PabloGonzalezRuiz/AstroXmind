import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildNavigationIndex, getParent, getChildren, getAncestors, getDescendants } from '../src/lib/navigation/index.mjs';
import { documentUrl, loadNavigation, readFrontmatter } from '../scripts/navigation-content.mjs';
import { reserveNavigationId } from '../scripts/navigation.mjs';

const id = n => `doc-${String(n).padStart(6,'0')}`;
const doc = (n, parent, order = 0, extra = {}) => ({ title: `Documento ${n}`, url: `/documento-${n}/`, navigation: { id: id(n), parent: parent === null ? null : id(parent), order }, ...extra });
const flatTree = () => [doc(1,null),doc(2,1,10),doc(3,2,10),doc(4,1,20),doc(5,3,10)];

test('flat files reconstruct the hierarchy with deterministic sibling order and navigation queries', () => {
  const index = buildNavigationIndex(flatTree().reverse());
  assert.equal(index.rootId,id(1));
  assert.deepEqual(index.traversal,[id(1),id(2),id(3),id(5),id(4)]);
  assert.equal(getParent(index,id(3)).id,id(2));
  assert.equal(getParent(index,id(1)),null);
  assert.deepEqual(getChildren(index,id(1)).map(n=>n.id),[id(2),id(4)]);
  assert.deepEqual(getAncestors(index,id(5)).map(n=>n.id),[id(1),id(2),id(3)]);
  assert.deepEqual(getDescendants(index,id(2)).map(n=>n.id),[id(3),id(5)]);
  assert.deepEqual(getDescendants(index,id(2),{includeSelf:true}).map(n=>n.id),[id(2),id(3),id(5)]);
  assert.throws(()=>getParent(index,id(900)),/desconocido/);
  assert.throws(()=>index.nodes[id(2)].children.push(id(99)),TypeError);
});

test('changing only a branch root parent moves every descendant, with stable IDs and URLs', () => {
  const entries=flatTree();const before=buildNavigationIndex(entries);
  entries[1].navigation.parent=id(4);
  const after=buildNavigationIndex(entries);
  assert.deepEqual(getAncestors(after,id(5)).map(n=>n.id),[id(1),id(4),id(2),id(3)]);
  assert.deepEqual(getDescendants(after,id(4)).map(n=>n.id),[id(2),id(3),id(5)]);
  for(const n of [2,3,5])assert.equal(before.nodes[id(n)].url,after.nodes[id(n)].url);
  assert.equal(after.nodes[id(3)].parent,before.nodes[id(3)].parent);
});

test('renaming/moving a file URL cannot change identity or logical membership', () => {
  const entries=flatTree();const before=buildNavigationIndex(entries);entries[2].url='/todos-en-la-misma-carpeta/nuevo-nombre/';
  const after=buildNavigationIndex(entries);assert.deepEqual(before.traversal,after.traversal);assert.equal(getParent(after,id(3)).id,id(2));assert.notEqual(after.nodes[id(3)].url,before.nodes[id(3)].url);
});

test('equal sibling order is resolved by stable ID, not title/file order', () => {
  const entries=[doc(3,1,10),doc(1,null),doc(2,1,10)];assert.deepEqual(buildNavigationIndex(entries).nodes[id(1)].children,[id(2),id(3)]);
});

for(const [name,change,message] of [
 ['duplicate ID',a=>a.push(doc(2,1)),/duplicado/],
 ['missing parent',a=>a[1].navigation.parent=id(99),/inexistente/],
 ['self parent',a=>a[1].navigation.parent=id(2),/autociclo/],
 ['disconnected cycle',a=>a[1].navigation.parent=id(5),/ciclo/],
 ['moving into own descendant',a=>a[1].navigation.parent=id(3),/ciclo/],
 ['multiple roots',a=>a[1].navigation.parent=null,/una sola raíz/],
 ['missing metadata',a=>delete a[1].navigation,/falta el bloque/],
 ['noncanonical ID',a=>a[1].navigation.id='derechos',/formato/],
 ['negative order',a=>a[1].navigation.order=-1,/order/],
 ['fractional order',a=>a[1].navigation.order=1.5,/order/],
 ['unknown YAML key',a=>a[1].navigation.parentId=id(1),/desconocida/],
 ['duplicate route',a=>a[1].url=a[0].url,/ruta duplicada/],
 ['public child of draft',a=>a[1].draft=true,/borrador/],
 ['draft root',a=>a.forEach(n=>n.draft=true),/raíz no puede/],
]) test(`rejects ${name}`,()=>{const entries=flatTree();change(entries);assert.throws(()=>buildNavigationIndex(entries),message);});

test('valid draft subtree is omitted from the public registry',()=>{
 const entries=flatTree();for(const n of [2,3,5])entries.find(d=>d.navigation.id===id(n)).draft=true;
 const index=buildNavigationIndex(entries);assert.deepEqual(index.traversal,[id(1),id(4)]);assert.equal(index.nodes[id(2)],undefined);assert(!JSON.stringify(index).includes('Documento 2'));
});

test('ID allocator reserves and never reuses issued IDs, including IDs with no active page',()=>{
 const dir=mkdtempSync(join(tmpdir(),'astro-nav-id-'));try{const ledger=join(dir,'navigation-ids.json');writeFileSync(ledger,JSON.stringify({version:1,issued:[id(1),id(42)]}));assert.equal(reserveNavigationId(ledger),id(43));assert.equal(reserveNavigationId(ledger),id(44));assert.deepEqual(JSON.parse(readFileSync(ledger)).issued,[id(1),id(42),id(43),id(44)]);}finally{rmSync(dir,{recursive:true,force:true});}
});

test('loader constructs an identical tree from a flat folder and rejects unreserved or invalid metadata',()=>{
 const dir=mkdtempSync(join(tmpdir(),'astro-nav-flat-'));try{
  const folder=join(dir,'src/content/docs');mkdirSync(folder,{recursive:true});writeFileSync(join(dir,'navigation-ids.json'),JSON.stringify({version:1,issued:[id(1),id(2),id(3)]}));
  const page=(n,parent)=>`---\ntitle: Documento ${n}\nnavigation:\n  id: ${id(n)}\n  parent: ${parent===null?'null':id(parent)}\n  order: ${n}\n---\nTexto\n`;
  writeFileSync(join(folder,'index.mdx'),page(1,null));writeFileSync(join(folder,'a.mdx'),page(2,1));writeFileSync(join(folder,'b.md'),page(3,2));
  const index=loadNavigation(dir,{base:'/AstroXmind'});assert.equal(index.nodes[id(3)].parent,id(2));assert.equal(index.nodes[id(3)].url,'/AstroXmind/b/');
  writeFileSync(join(folder,'b.md'),page(4,2));assert.throws(()=>loadNavigation(dir),/no reservado/);
  writeFileSync(join(folder,'b.md'),page(3,2).replace('order: 3','order: -1'));assert.throws(()=>loadNavigation(dir),/order/);
 }finally{rmSync(dir,{recursive:true,force:true});}
});

test('editing just one parent in flat YAML moves the whole on-disk branch',()=>{
 const dir=mkdtempSync(join(tmpdir(),'astro-nav-move-'));try{
  const folder=join(dir,'src/content/docs');mkdirSync(folder,{recursive:true});
  writeFileSync(join(dir,'navigation-ids.json'),JSON.stringify({version:1,issued:[1,2,3,4].map(id)}));
  const source=(n,parent)=>`---\ntitle: Documento ${n}\nnavigation:\n  id: ${id(n)}\n  parent: ${parent===null?'null':id(parent)}\n  order: ${n}\n---\nTexto\n`;
  for(const [name,n,parent] of [['index.md',1,null],['rama.md',2,1],['hijo.md',3,2],['destino.md',4,1]])writeFileSync(join(folder,name),source(n,parent));
  writeFileSync(join(folder,'_fragmento.md'),'Sin frontmatter: no es una página de Starlight.');
  const before=loadNavigation(dir);const branch=join(folder,'rama.md');
  writeFileSync(branch,readFileSync(branch,'utf8').replace(`parent: ${id(1)}`,`parent: ${id(4)}`));
  const after=loadNavigation(dir);
  assert.deepEqual(getDescendants(after,id(4)).map(n=>n.id),[id(2),id(3)]);
  assert.equal(after.nodes[id(3)].parent,id(2));
  assert.equal(after.nodes[id(3)].url,before.nodes[id(3)].url);
  assert.equal(after.traversal.length,4);
 }finally{rmSync(dir,{recursive:true,force:true});}
});

test('URLs honor base, index, slugs and directory/file trailing-slash modes',()=>{
 assert.equal(documentUrl('index.mdx',undefined,'/AstroXmind'),'/AstroXmind/');
 assert.equal(documentUrl('nested/index.md',undefined,'/AstroXmind'),'/AstroXmind/nested/');
 assert.equal(documentUrl('old.md','nuevo', '/AstroXmind','never'),'/AstroXmind/nuevo');
 assert.equal(documentUrl('old.md',undefined,'/','ignore','file'),'/old');
 assert.throws(()=>documentUrl('old.md','../escape'),/no soportada/);
});

test('frontmatter rejects duplicate YAML keys and handles CRLF',()=>{
 assert.throws(()=>readFrontmatter('---\ntitle: A\ntitle: B\n---\n','demo'),/YAML inválido/);
 assert.equal(readFrontmatter('---\r\ntitle: A\r\n---\r\n','demo').title,'A');
});
