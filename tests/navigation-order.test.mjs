import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,utimesSync,rmSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {buildNavigationIndex,normalizeNavigationDate} from '../src/lib/navigation/index.mjs';
import {loadNavigation} from '../scripts/navigation-content.mjs';

const id=n=>'doc-'+String(n).padStart(6,'0');
const doc=(n,parent,order,created)=>({title:'Documento '+n,url:'/doc-'+n+'/',navigation:{id:id(n),parent:parent===null?null:id(parent),...(order===undefined?{}:{order}),...(created===undefined?{}:{created})}});

test('unordered siblings come last, oldest first; equal explicit orders use creation time',()=>{
 const index=buildNavigationIndex([
  doc(1,null),doc(2,1,2,'2026-01-10T00:00:00.000Z'),doc(3,1,2,'2026-01-01T00:00:00.000Z'),
  doc(4,1,undefined,'2025-01-01T00:00:00.000Z'),doc(5,1,undefined,'2024-01-01T00:00:00.000Z'),doc(6,1,1,'2026-12-01T00:00:00.000Z'),
 ]);
 assert.deepEqual(index.nodes[id(1)].children,[6,3,2,5,4].map(id));
 assert.equal(index.nodes[id(2)].numberLabel,'2');assert.equal(index.nodes[id(3)].numberLabel,'2');
 assert.equal(index.nodes[id(4)].numberLabel,null);assert.equal(index.nodes[id(4)].pendingOrder,true);
 assert.equal(index.nodes[id(5)].pendingOrder,true);
});

test('numbers inherit explicit values; unordered parent breaks the path, unique root is a container',()=>{
 const index=buildNavigationIndex([doc(1,null,0),doc(2,1,10),doc(3,2,2),doc(4,2),doc(5,4,3),doc(6,4,3)]);
 assert.equal(index.schemaVersion,2);
 assert.equal(index.nodes[id(1)].numberLabel,null);assert.equal(index.nodes[id(1)].pendingOrder,false);
 assert.equal(index.nodes[id(3)].numberLabel,'10.2');assert.equal(index.nodes[id(4)].numberLabel,null);
 assert.equal(index.nodes[id(5)].numberLabel,'3');assert.equal(index.nodes[id(6)].numberLabel,'3');
 assert.throws(()=>index.nodes[id(3)].numberPath.push(9),TypeError);
});

test('creation ties/missing dates use ID only as a final deterministic tie-breaker',()=>{
 const index=buildNavigationIndex([doc(1,null),doc(4,1),doc(3,1,undefined,'2026-01-01T00:00:00.000Z'),doc(2,1,undefined,'2026-01-01T00:00:00.000Z'),doc(5,1)]);
 assert.deepEqual(index.nodes[id(1)].children,[2,3,4,5].map(id));
 assert.equal(index.nodes[id(4)].created,null);
});

test('creation dates normalize time zones and reject invalid calendar/local-time values',()=>{
 assert.equal(normalizeNavigationDate('2026-11-17T00:00:00.000Z'),'2026-11-17T00:00:00.000Z');
 assert.equal(normalizeNavigationDate('2026-11-17T13:00:00.000+01:00'),'2026-11-17T12:00:00.000Z');
 assert.equal(normalizeNavigationDate('2024-02-29T00:00:00.000Z'),'2024-02-29T00:00:00.000Z');
 for(const date of ['2026-02-30T00:00:00.000Z','2025-02-29T00:00:00.000Z','2026-13-01T00:00:00.000Z','2026-11-17T12:00:00.000','2026-11-17T24:00:00.000Z',null,123])assert.throws(()=>normalizeNavigationDate(date),/fecha/);
 const index=buildNavigationIndex([doc(1,null),doc(2,1,1,'2026-11-17T13:00:00.000+01:00'),doc(3,1,1,'2026-11-17T11:30:00.000Z')]);
 assert.deepEqual(index.nodes[id(1)].children,[id(3),id(2)]);
});

test('omitting order does not permit invalid explicit values, parents or cycles',()=>{
 for(const order of [null,-1,1.5,'2',NaN])assert.throws(()=>buildNavigationIndex([doc(1,null),doc(2,1,order)]),/order/);
 assert.throws(()=>buildNavigationIndex([doc(1,null),doc(2,99)]),/inexistente/);
 assert.throws(()=>buildNavigationIndex([doc(1,null),doc(2,3),doc(3,2)]),/ciclo/);
});

test('renaming/moving a branch preserves dates/identity and recomputes inherited numbering',()=>{
 const entries=[doc(1,null),doc(2,1,10,'2026-01-01T00:00:00.000Z'),doc(3,1,20),doc(4,2,2,'2026-01-02T00:00:00.000Z')];
 const before=buildNavigationIndex(entries);entries[1].navigation.parent=id(3);entries[1].url='/renamed/';
 const after=buildNavigationIndex(entries);
 assert.equal(after.nodes[id(4)].numberLabel,'20.10.2');assert.equal(after.nodes[id(4)].created,before.nodes[id(4)].created);
 assert.equal(after.nodes[id(2)].created,before.nodes[id(2)].created);
});

test('only YAML dates affect ordering, including milliseconds and modified fallback',()=>{
 const a=doc(2,1,undefined,'2026-01-01T12:00:00.002Z');
 const b=doc(3,1,undefined,'2026-01-01T12:00:00.001Z');
 const c=doc(4,1);c.navigation.modified='2026-01-01T12:00:00.000Z';
 const d=doc(5,1);
 const index=buildNavigationIndex([doc(1,null),a,b,c,d]);
 assert.deepEqual(index.nodes[id(1)].children,[4,3,2,5].map(id));
 assert.equal(index.nodes[id(4)].sortDate,c.navigation.modified);
 a.navigation.modified='2020-01-01T00:00:00.000Z';
 assert.equal(buildNavigationIndex([doc(1,null),a]).nodes[id(2)].sortDate,a.navigation.created);
});

test('filesystem rewrites and ledger metadata cannot supply creation dates',()=>{
 const root=mkdtempSync(join(tmpdir(),'astro-nav-yaml-date-'));try{
  const folder=join(root,'src/content/docs');mkdirSync(folder,{recursive:true});
  // Extra, unsupported date metadata in a ledger is deliberately never used for sorting.
  writeFileSync(join(root,'navigation-ids.json'),JSON.stringify({version:1,issued:[1,2,3,4].map(id),created:{[id(2)]:'2020-01-01T00:00:00.000Z'}}));
  const page=(n,parent,dateLine='')=>`---\ntitle: Documento ${n}\nnavigation:\n  id: ${id(n)}\n  parent: ${parent===null?'null':id(parent)}\n${dateLine}---\nTexto\n`;
  writeFileSync(join(folder,'index.md'),page(1,null));
  writeFileSync(join(folder,'2.md'),page(2,1));
  writeFileSync(join(folder,'3.md'),page(3,1,'  created: "2026-01-01T12:00:00.002Z"\n'));
  writeFileSync(join(folder,'4.md'),page(4,1,'  modified: "2026-01-01T12:00:00.001Z"\n'));
  const first=loadNavigation(root);assert.deepEqual(first.nodes[id(1)].children,[4,3,2].map(id));
  assert.equal(first.nodes[id(2)].created,null);assert.equal(first.nodes[id(2)].sortDate,null);
  writeFileSync(join(folder,'3.md'),page(3,1,'  created: "2026-01-01T12:00:00.002Z"\n'));
  utimesSync(join(folder,'3.md'),new Date('2040-01-01T00:00:00.000Z'),new Date('2040-01-01T00:00:00.000Z'));
  assert.deepEqual(loadNavigation(root),first);
 }finally{rmSync(root,{recursive:true,force:true});}
});

test('timestamps require explicit milliseconds and timezone in authored YAML',()=>{
 for(const value of ['2026-01-01','2026-01-01T00:00:00Z','2026-01-01T00:00:00.1Z','2026-01-01T00:00:00.000'])assert.throws(()=>normalizeNavigationDate(value),/milisegundos/);
 assert.throws(()=>buildNavigationIndex([doc(1,null),{...doc(2,1),navigation:{id:id(2),parent:id(1),modified:'2026-01-01T00:00:00Z'}}]),/modified/);
});
