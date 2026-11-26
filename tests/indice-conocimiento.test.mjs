import test from 'node:test';
import assert from 'node:assert/strict';
import {crearIndiceConocimiento,retirarConvocatoria,restaurarConvocatoria} from '../src/lib/indice-conocimiento.mjs';
import {convocatoriasCompartidas,contextos} from './fixtures/convocatorias-compartidas.mjs';

test('consulta inversa, árbol contextual, referencias y conceptos sin duplicar contenido',()=>{
  const docs=convocatoriasCompartidas();docs.find(d=>d.id==='doc-sql').conceptos=['concept-sql'];docs.find(d=>d.id==='doc-bd').referencias=['doc-sql'];
  const i=crearIndiceConocimiento(docs,'r1');
  assert.equal(i.totalDocumentos,6);assert.deepEqual(i.referenciasEntrantes('doc-sql'),['doc-bd']);assert.deepEqual(i.documentosDeConcepto('concept-sql'),['doc-sql']);
  assert.equal(i.aparicionesDeDocumento('doc-sql').length,3);
  assert.deepEqual(i.arbol(contextos.ficA,'v1').ruta('sb').map(x=>x.documentoId),['doc-raiz','doc-desarrollo','doc-sql']);
  assert.ok(i.documentosDeConvocatoria(contextos.tai2025).includes('doc-exclusivo'));
});
test('retirada planificada visita solo afectados, no altera fuente y conserva las otras convocatorias',()=>{
  const docs=convocatoriasCompartidas(),original=structuredClone(docs),i=crearIndiceConocimiento(docs,'r1');
  for(const call of Object.values(contextos)){
    const p=i.planificarRetirada(call,'r1');assert.equal(p.documentosAfectados,i.documentosDeConvocatoria(call).length);
    const cambios=new Map(p.cambios.map(c=>[c.id,c]));
    const nuevo=docs.map(d=>cambios.has(d.id)?{...d,pertenencias:cambios.get(d.id).despues}:d);
    const j=crearIndiceConocimiento(nuevo,'r2');assert.equal(j.totalDocumentos,i.totalDocumentos);assert.deepEqual(j.documentosDeConvocatoria(call),[]);
    assert.equal(j.documento('doc-sql').cuerpo,'Contenido único SQL');
    for(const otro of Object.values(contextos).filter(c=>c!==call))assert.deepEqual(j.arbol(otro,'v1').apariciones('doc-sql'),i.arbol(otro,'v1').apariciones('doc-sql'));
    const restaurado=nuevo.map(d=>cambios.has(d.id)?{...d,pertenencias:cambios.get(d.id).antes}:d);
    assert.deepEqual(restaurado,docs);
  }
  assert.deepEqual(docs,original);assert.throws(()=>i.planificarRetirada(contextos.tai2025,'r0'),/obsoleto/);
});
test('valida todos los contextos y protege la instantánea de mutaciones externas',()=>{
  const docs=convocatoriasCompartidas(),i=crearIndiceConocimiento(docs,'r1');
  docs[0].pertenencias.length=0;const copia=i.documento('doc-raiz');copia.pertenencias.length=0;
  assert.equal(i.aparicionesDeDocumento('doc-raiz').length,3);
  assert.throws(()=>crearIndiceConocimiento(docs,'r2'),/raíz/);
  const d=convocatoriasCompartidas();d[0].referencias=['inexistente'];assert.throws(()=>crearIndiceConocimiento(d,'r2'),/Referencia/);
});
test('simulación por defecto, commit condicional y archivo histórico en almacén simulado',async()=>{
  const docs=convocatoriasCompartidas(),i=crearIndiceConocimiento(docs,'r1');let llamadas=0,estado={revision:'r1',docs:new Map(docs.map(d=>[d.id,d])),archivo:[]};
  const almacen={async guardarRetiradaAtomica(plan){
    llamadas++;if(plan.revisionEsperada!==estado.revision)throw Error('Conflicto de revisión');
    const siguiente=new Map(estado.docs);
    for(const c of plan.cambios){const d=siguiente.get(c.id);assert.deepEqual(d.pertenencias,c.antes);siguiente.set(c.id,{...d,pertenencias:c.despues});}
    estado={revision:'r2',docs:siguiente,archivo:[...estado.archivo,plan]};return {confirmado:true,revision:'r2'};
  }};
  const call=contextos.tai2025;
  assert.equal((await retirarConvocatoria(i,call,{revisionEsperada:'r1',almacen})).simulado,true);assert.equal(llamadas,0);
  const r=await retirarConvocatoria(i,call,{revisionEsperada:'r1',almacen,confirmado:true});assert.equal(r.revision,'r2');assert.equal(llamadas,1);
  assert.equal(estado.archivo.length,1);assert.equal(estado.docs.size,docs.length);assert.equal(estado.docs.get('doc-sql').cuerpo,'Contenido único SQL');
  const antes=estado;await assert.rejects(retirarConvocatoria(i,call,{revisionEsperada:'r1',almacen,confirmado:true}),/Conflicto/);assert.equal(estado,antes);
  await assert.rejects(retirarConvocatoria(i,call,{revisionEsperada:'r1',confirmado:true,almacen:{guardarRetiradaAtomica:async()=>{throw Error('Fallo simulado');}}}),/Fallo simulado/);
});

test('ED-05: ciclo completo de retirada y recreación de cada convocatoria con referencias compartidas',async()=>{
  for(const call of Object.values(contextos)){
    const docs=convocatoriasCompartidas();docs[1].referencias=['doc-sql'];docs[3].conceptos=['concept-sql'];
    let estado={revision:'r1',docs:structuredClone(docs),historial:[]};
    const escribir=(plan,tipo)=>{
      if(plan.revisionEsperada!==estado.revision)throw Error('Conflicto');
      const porId=new Map(plan.cambios.map(c=>[c.id,c]));
      const candidato=estado.docs.map(d=>{const c=porId.get(d.id);if(!c)return d;assert.deepEqual(d.pertenencias,c.antes);return {...d,pertenencias:c.despues};});
      const revision='r'+(estado.historial.length+2);crearIndiceConocimiento(candidato,revision);
      estado={revision,docs:candidato,historial:[...estado.historial,{tipo,plan:structuredClone(plan)}]};return {confirmado:true,revision};
    };
    const almacen={guardarRetiradaAtomica:async p=>escribir(p,'retirada'),guardarRestauracionAtomica:async p=>escribir(p,'restauración')};
    const inicial=crearIndiceConocimiento(estado.docs,estado.revision);
    const retirada=await retirarConvocatoria(inicial,call,{revisionEsperada:'r1',confirmado:true,almacen});
    const posterior=crearIndiceConocimiento(estado.docs,estado.revision);
    assert.equal(posterior.totalDocumentos,docs.length);assert.deepEqual(posterior.documentosDeConvocatoria(call),[]);
    assert.deepEqual(posterior.referenciasEntrantes('doc-sql'),['doc-bd']);assert.deepEqual(posterior.documentosDeConcepto('concept-sql'),['doc-sql']);
    for(const otro of Object.values(contextos).filter(k=>k!==call))assert.deepEqual(posterior.arbol(otro,'v1').apariciones('doc-sql'),inicial.arbol(otro,'v1').apariciones('doc-sql'));
    const archivo=estado.historial[0].plan;assert.deepEqual(archivo,retirada.plan);
    const antes=estado;assert.equal((await restaurarConvocatoria(posterior,archivo,{revisionEsperada:'r2',almacen})).simulado,true);assert.equal(estado,antes);
    await restaurarConvocatoria(posterior,archivo,{revisionEsperada:'r2',confirmado:true,almacen});
    assert.deepEqual(estado.docs,docs);assert.equal(estado.historial.length,2);
    assert.throws(()=>crearIndiceConocimiento(estado.docs,'r3').planificarRestauracion(archivo),/activas/);
  }
});
test('restauración no sobrescribe cambios posteriores en convocatorias supervivientes',()=>{
 const docs=convocatoriasCompartidas(),call=contextos.tai2025,archivo=crearIndiceConocimiento(docs,'r1').planificarRetirada(call);
 const actuales=docs.map(d=>({...d,pertenencias:d.pertenencias.filter(p=>p.convocatoriaId!==call)}));
 actuales.find(d=>d.id==='doc-sql').pertenencias[0].alias='SQL revisado en otra convocatoria';
 const i=crearIndiceConocimiento(actuales,'r2'),plan=i.planificarRestauracion(archivo);
 assert.equal(plan.cambios.find(c=>c.id==='doc-sql').despues[0].alias,'SQL revisado en otra convocatoria');
 assert.throws(()=>i.planificarRestauracion(archivo,'r1'),/obsoleto/);
 const corrupto=structuredClone(archivo);corrupto.cambios.pop();assert.throws(()=>i.planificarRestauracion(corrupto),/incompleto/);
});
