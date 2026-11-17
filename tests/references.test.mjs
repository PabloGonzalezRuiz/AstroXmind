import test from 'node:test';
import assert from 'node:assert/strict';
import {buildNavigationIndex} from '../src/lib/navigation/index.mjs';
import {parseDocumentReference,resolveDocumentReference} from '../src/lib/navigation/references.mjs';
import {validateRenderedReferences} from '../scripts/reference-validation.mjs';
import remarkDocumentReferences from '../scripts/remark-document-references.mjs';

const entries=[
 {title:'Root',url:'/base/',navigation:{id:'doc-000001',parent:null,order:0}},
 {title:'Article',url:'/base/old/',navigation:{id:'doc-000002',parent:'doc-000001',order:10}},
];
const makeIndex=()=>buildNavigationIndex(entries);
const pages=(source='<a href="/base/old/#ref-detail" data-doc-reference="doc:doc-000002#ref-detail">Read</a>',target='<h2 id="ref-detail">Detail</h2>')=>new Map([['doc-000001',source],['doc-000002',target]]);

test('stable document/fragment references follow current URLs after a rename',()=>{
 const reference='doc:doc-000002#ref-detail';
 assert.deepEqual(parseDocumentReference(reference),{documentId:'doc-000002',fragment:'ref-detail'});
 assert.equal(resolveDocumentReference(makeIndex(),reference).href,'/base/old/#ref-detail');
 const renamed=buildNavigationIndex(entries.map(e=>e.navigation.id==='doc-000002'?{...e,url:'/base/renamed/'}:e));
 assert.equal(resolveDocumentReference(renamed,reference).href,'/base/renamed/#ref-detail');
 assert.equal(resolveDocumentReference(makeIndex(),'doc:doc-000001').href,'/base/');
});

test('reference syntax rejects implicit heading slugs, traversal and invalid IDs',()=>{
 for(const reference of ['doc:article','doc:doc-000002#heading','doc:doc-000002#ref-UPPER','doc:doc-000002#ref-../escape','doc:doc-000002?x=1','javascript:alert(1)','doc:doc-000002#'])assert.throws(()=>parseDocumentReference(reference),/inválida/);
 assert.throws(()=>resolveDocumentReference(makeIndex(),'doc:doc-999999'),/desconocido/);
});

test('rendered validation sees actual MDX and TreeTable destinations, not escaped raw examples',()=>{
 const result=validateRenderedReferences(makeIndex(),pages(undefined,'<table><tr><td id="ref-detail">Detail</td></tr></table><code>&lt;a href="doc:doc-999999"&gt;</code>'));
 assert.deepEqual(result.references,[{source:'doc-000001',target:'doc-000002',fragment:'ref-detail',href:'/base/old/#ref-detail'}]);
});

test('missing destinations, duplicate IDs, unresolved HTML links and divergent URLs fail validation',()=>{
 assert.throws(()=>validateRenderedReferences(makeIndex(),pages(undefined,'<h2>Removed</h2>')),/destino inexistente/);
 assert.throws(()=>validateRenderedReferences(makeIndex(),pages(undefined,'<h2 id="ref-detail">A</h2><td id="ref-detail">B</td>')),/duplicado/);
 assert.throws(()=>validateRenderedReferences(makeIndex(),pages('<a href="doc:doc-000002">Unresolved</a>')),/sin resolver/);
 assert.throws(()=>validateRenderedReferences(makeIndex(),pages('<a href="/wrong/" data-doc-reference="doc:doc-000002">Wrong</a>')),/divergente/);
 assert.throws(()=>validateRenderedReferences(makeIndex(),pages(undefined,'<h2 id="ref-UPPER">A</h2>')),/inválido/);
});

test('Markdown inline/reference links resolve, while code remains literal',()=>{
 const link={type:'link',url:'doc:doc-000007#ref-desarrollo',children:[{type:'text',value:'Read'}]};
 const reference={type:'linkReference',identifier:'DETAIL',referenceType:'full',children:[{type:'text',value:'Read'}]};
 const code={type:'code',value:'[Fake](doc:doc-999999)'};
 const tree={type:'root',children:[link,reference,{type:'definition',identifier:'detail',url:'doc:doc-000008#ref-detalle'},code]};
 remarkDocumentReferences({root:process.cwd(),base:'/AstroXmind'})(tree);
 assert.equal(link.url,'/AstroXmind/pruebas-jerarquia/articulo-2/#ref-desarrollo');
 assert.equal(link.data.hProperties['data-doc-reference'],'doc:doc-000007#ref-desarrollo');
 assert.equal(reference.type,'link');assert.equal(reference.url,'/AstroXmind/pruebas-jerarquia/articulo-3/#ref-detalle');
 assert.equal(code.value,'[Fake](doc:doc-999999)');
});


test('cached Markdown URLs are resolved again at render time using stable identity',async()=>{
 const {resolveRenderedReferences}=await import('../src/lib/navigation/rendered-references.mjs');
 const {parse}=await import('node-html-parser');
 const cached='<a href="/base/old/#ref-detail" data-doc-reference="doc:doc-000002#ref-detail">Read</a><code>&lt;a href="doc:doc-999999"&gt;</code>';
 const renamed=buildNavigationIndex(entries.map(e=>e.navigation.id==='doc-000002'?{...e,url:'/base/renamed/'}:e));
 const rendered=parse(resolveRenderedReferences(cached,renamed));
 assert.equal(rendered.querySelector('a').getAttribute('href'),'/base/renamed/#ref-detail');
 assert.ok(rendered.querySelector('code').text.includes('doc:doc-999999'));
});
