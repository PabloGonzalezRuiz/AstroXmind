import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
import {crearIndiceConocimiento} from '../src/lib/indice-conocimiento.mjs';

const p=(aparicionId,convocatoriaId,padreAparicionId,orden)=>({aparicionId,convocatoriaId,versionId:'v1',padreAparicionId,orden,alias:aparicionId});
for(const n of [10_000,100_000]){
  const documentos=[{id:'raiz',pertenencias:[p('ra','a',null,0),p('rb','b',null,0)]}];
  for(let k=1;k<n;k++)documentos.push({id:`doc-${k}`,pertenencias:[p(`b-${k}`,'b','rb',k),...(k%100===0?[p(`a-${k}`,'a','ra',k)]:[])]});
  let t=performance.now();const indice=crearIndiceConocimiento(documentos,'r1');const construccion=performance.now()-t;
  t=performance.now();const ids=indice.documentosDeConvocatoria('a');const consulta=performance.now()-t;
  t=performance.now();const plan=indice.planificarRetirada('a');const retirada=performance.now()-t;
  t=performance.now();const hijos=indice.arbol('b','v1').hijos('rb');const arbol=performance.now()-t;
  assert.equal(ids.length,Math.floor((n-1)/100)+1);assert.equal(plan.documentosAfectados,ids.length);assert.equal(hijos.length,n-1);
  console.log(JSON.stringify({documentos:n,afectados:ids.length,construccion_ms:+construccion.toFixed(2),consulta_ms:+consulta.toFixed(3),plan_retirada_ms:+retirada.toFixed(2),consulta_arbol_ms:+arbol.toFixed(2)}));
}
