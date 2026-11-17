import test from 'node:test';
import assert from 'node:assert/strict';
import {cpSync,mkdtempSync,readFileSync,renameSync,rmSync,symlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

// Separate integration command: two genuine Astro builds with a persistent Content Layer cache.
test('renaming only the destination file updates cached references after rebuilding',()=>{
 const root=fileURLToPath(new URL('../',import.meta.url));
 const fixture=mkdtempSync(join(tmpdir(),'astroxmind-reference-rebuild-'));
 try{
  for(const folder of ['src','scripts','examples'])cpSync(join(root,folder),join(fixture,folder),{recursive:true,filter:path=>!path.split(/[\\/]/).some(part=>['node_modules','dist','.astro'].includes(part))});
  for(const file of ['astro.config.mjs','package.json','tsconfig.json','navigation-ids.json'])cpSync(join(root,file),join(fixture,file));
  symlinkSync(join(root,'node_modules'),join(fixture,'node_modules'),process.platform==='win32'?'junction':'dir');
  const build=()=>{
   const result=spawnSync(process.execPath,[resolve(root,'node_modules/astro/astro.js'),'build'],{cwd:fixture,encoding:'utf8',maxBuffer:10*1024*1024,env:{...process.env,ASTRO_TELEMETRY_DISABLED:'1'}});
   assert.equal(result.status,0,(result.stdout??'')+(result.stderr??''));
  };
  build();
  const references=()=>JSON.parse(readFileSync(join(fixture,'dist/references.json'),'utf8')).references.filter(ref=>ref.target==='doc-000007');
  assert.ok(references().length>0);
  assert.ok(references().every(ref=>ref.href.includes('/articulo-2/')));
  renameSync(join(fixture,'src/content/docs/pruebas-jerarquia/articulo-2.md'),join(fixture,'src/content/docs/pruebas-jerarquia/desarrollo-renombrado.md'));
  build();
  assert.ok(references().every(ref=>ref.href.includes('/desarrollo-renombrado/')));
  const index=JSON.parse(readFileSync(join(fixture,'dist/navigation.json'),'utf8'));
  assert.equal(index.nodes['doc-000007'].parent,'doc-000006');
  assert.equal(index.nodes['doc-000007'].url,'/AstroXmind/pruebas-jerarquia/desarrollo-renombrado/');
 }finally{rmSync(fixture,{recursive:true,force:true});}
});
