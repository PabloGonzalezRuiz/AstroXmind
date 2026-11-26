import { crearArbolConvocatoria } from './arbol-convocatoria.mjs';

const exigir=(ok,m)=>{if(!ok)throw Error(m);};
const texto=v=>typeof v==='string'&&v.trim().length>0;
function agregar(m,k,v){if(!m.has(k))m.set(k,[]);m.get(k).push(v);}
const listaIds=(v,nombre)=>{
  exigir(Array.isArray(v)&&v.every(texto)&&new Set(v).size===v.length,`${nombre} inválidos o duplicados.`);
  return v;
};

// Índice derivado de una instantánea del catálogo, nunca fuente canónica.
// Convocatoria y versión son claves separadas (no se concatenan con separadores).
export function crearIndiceConocimiento(documentos, revision){
  exigir(Array.isArray(documentos)&&texto(revision),'Catálogo o revisión inválida.');
  const docs=new Map(),contextos=new Map(),porConvocatoria=new Map(),referencias=new Map(),conceptos=new Map();
  for(const original of documentos){
    const d=structuredClone(original);
    exigir(d&&texto(d.id)&&!docs.has(d.id)&&Array.isArray(d.pertenencias),'Documento inválido o duplicado.');
    docs.set(d.id,d);
    for(const ref of listaIds(d.referencias??[],'Referencias'))agregar(referencias,ref,d.id);
    for(const concepto of listaIds(d.conceptos??[],'Conceptos'))agregar(conceptos,concepto,d.id);
    for(const p of d.pertenencias){
      exigir(p&&texto(p.convocatoriaId)&&texto(p.versionId),'Pertenencia sin contexto.');
      if(!contextos.has(p.convocatoriaId))contextos.set(p.convocatoriaId,new Map());
      const versiones=contextos.get(p.convocatoriaId);
      if(!versiones.has(p.versionId))versiones.set(p.versionId,new Map());
      const grupo=versiones.get(p.versionId);
      agregar(grupo,d.id,p);
      if(!porConvocatoria.has(p.convocatoriaId))porConvocatoria.set(p.convocatoriaId,new Set());
      porConvocatoria.get(p.convocatoriaId).add(d.id);
    }
  }
  for(const id of referencias.keys())exigir(docs.has(id),'Referencia a documento desconocido: '+id);
  const arboles=new Map();
  // Validación global: incluso los contextos no seleccionados deben ser coherentes.
  for(const [call,versiones] of contextos){
    const arbolesVersion=new Map();arboles.set(call,arbolesVersion);
    for(const [version,grupo] of versiones){
      const seleccion=[...grupo].map(([id,pertenencias])=>({id,pertenencias}));
      arbolesVersion.set(version,crearArbolConvocatoria(seleccion,call,version));
    }
  }
  function documento(id){exigir(docs.has(id),'Documento desconocido.');return structuredClone(docs.get(id));}
  function arbol(call,version){
    const a=arboles.get(call)?.get(version);exigir(a,'Convocatoria o versión desconocida.');return a;
  }
  function planificarRetirada(call, revisionEsperada=revision){
    exigir(revisionEsperada===revision,'Índice obsoleto.');
    const afectados=porConvocatoria.get(call);exigir(afectados,'Convocatoria desconocida.');
    const cambios=[];let retiradas=0;
    for(const id of afectados){
      const d=docs.get(id),antes=d.pertenencias,retirar=antes.filter(p=>p.convocatoriaId===call),despues=antes.filter(p=>p.convocatoriaId!==call);
      retiradas+=retirar.length;
      cambios.push({id,antes:structuredClone(antes),despues:structuredClone(despues),retiradas:structuredClone(retirar),sinPertenenciasActivas:despues.length===0});
    }
    // No escribir ni borrar contenido. El consumidor debe cotejar revisión, conservar históricos y aplicar atómicamente.
    return {revisionEsperada,convocatoriaId:call,documentosAfectados:cambios.length,aparicionesRetiradas:retiradas,cambios};
  }
  return Object.freeze({revision,documento,arbol,planificarRetirada,
    totalDocumentos:docs.size,
    documentosDeConvocatoria(call){return [...(porConvocatoria.get(call)??[])];},
    versiones(call){return [...(contextos.get(call)?.keys()??[])];},
    aparicionesDeDocumento(id){exigir(docs.has(id),'Documento desconocido.');return structuredClone(docs.get(id).pertenencias);},
    referenciasEntrantes(id){return [...(referencias.get(id)??[])];},
    documentosDeConcepto(id){return [...(conceptos.get(id)??[])];}
  });
}

// Contrato de escritura: el almacén debe ejecutar un único commit condicional,
// incluyendo el archivo histórico de las relaciones retiradas. Nunca purga documentos.
// La simulación es el comportamiento por defecto; los datos reales requieren confirmación.
export async function retirarConvocatoria(indice,call,{revisionEsperada,confirmado=false,almacen}={}){
  exigir(texto(revisionEsperada),'Se requiere la revisión esperada.');
  const plan=indice.planificarRetirada(call,revisionEsperada);
  if(!confirmado)return {simulado:true,plan};
  exigir(typeof almacen?.guardarRetiradaAtomica==='function','Falta almacén transaccional.');
  const resultado=await almacen.guardarRetiradaAtomica(structuredClone(plan));
  exigir(resultado?.confirmado===true&&texto(resultado.revision)&&resultado.revision!==revisionEsperada,'Guardado no confirmado; consultar el almacén antes de reintentar.');
  return {simulado:false,plan,revision:resultado.revision};
}
