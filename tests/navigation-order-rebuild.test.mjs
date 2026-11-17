import test from 'node:test';
import assert from 'node:assert/strict';
import {cpSync,mkdtempSync,readFileSync,writeFileSync,rmSync,symlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {parse} from 'node-html-parser';

test('real build accepts missing order, orders by persistent creation and renders shared numbers/pending labels',()=>{
 const root=fileURLToPath(new URL('../',import.meta.url));
 const fixture=mkdtempSync(join(tmpdir(),'astroxmind-order-build-'));
 try{
  for(const folder of ['src','scripts','examples'])cpSync(join(root,folder),join(fixture,folder),{recursive:true,filter:path=>!path.split(/[\\/]/).some(part=>['node_modules','dist','.astro'].includes(part))});
  for(const file of ['astro.config.mjs','package.json','tsconfig.json','navigation-ids.json'])cpSync(join(root,file),join(fixture,file));
  symlinkSync(join(root,'node_modules'),join(fixture,'node_modules'),process.platform==='win32'?'junction':'dir');
  const modify=(name,fn)=>{const path=join(fixture,'src/content/docs/pruebas-jerarquia/'+name+'.md');writeFileSync(path,fn(readFileSync(path,'utf8')));};
  modify('articulo-1',s=>s.replace('  order: 10','  order: 10\n  created: 2026-02-02T12:00:00.002Z'));
  modify('articulo-4',s=>s.replace('  order: 20','  order: 10\n  created: 2026-02-02T12:00:00.001Z'));
  modify('articulo-2',s=>s.replace('  parent: doc-000006','  parent: doc-000005').replace('  order: 10\n','  created: 2026-01-01T12:00:00.002Z\n'));
  modify('articulo-3',s=>s.replace('  parent: doc-000007','  parent: doc-000005').replace('  order: 10\n','  modified: 2026-01-01T12:00:00.001Z\n'));
  const result=spawnSync(process.execPath,[resolve(root,'node_modules/astro/astro.js'),'build'],{cwd:fixture,encoding:'utf8',maxBuffer:10*1024*1024,env:{...process.env,ASTRO_TELEMETRY_DISABLED:'1'}});
  assert.equal(result.status,0,(result.stdout??'')+(result.stderr??''));
  const index=JSON.parse(readFileSync(join(fixture,'dist/navigation.json'),'utf8'));
  assert.deepEqual(index.nodes['doc-000005'].children,['doc-000009','doc-000006','doc-000008','doc-000007']);
  assert.equal(index.nodes['doc-000009'].numberLabel,'3.1.1');
  assert.equal(index.nodes['doc-000006'].numberLabel,index.nodes['doc-000009'].numberLabel);
  const page=parse(readFileSync(join(fixture,'dist/pruebas-jerarquia/serie/index.html'),'utf8'));
  const children=page.querySelector('[data-document-footer] nav[aria-label="Documentos hijos"]');
  assert.deepEqual(children.querySelectorAll('[data-navigation-id]').map(label=>label.getAttribute('data-navigation-id')),index.nodes['doc-000005'].children);
  for(const key of ['doc-000007','doc-000008']){
   const label=children.querySelector(`[data-navigation-id="${key}"]`);
   assert.equal(label.getAttribute('data-navigation-number'),undefined);
   assert.equal(label.getAttribute('data-navigation-pending'),'true');
   assert.equal(label.querySelector('.navigation-pending').text.trim(),'Pendiente de ordenar');
  }
  const tree=page.querySelector('nav[aria-label="Árbol de documentos"]');
  assert.equal(tree.querySelector('[data-navigation-id="doc-000009"]').getAttribute('data-navigation-number'),'3.1.1');
  assert.equal(index.nodes['doc-000007'].order,null);
  const references=JSON.parse(readFileSync(join(fixture,'dist/references.json'),'utf8')).references;
  assert.ok(references.some(r=>r.target==='doc-000007'&&r.fragment==='ref-desarrollo'));
 }finally{rmSync(fixture,{recursive:true,force:true});}
});
