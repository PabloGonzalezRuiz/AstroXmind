import { crearArbolConvocatoria } from './arbol-convocatoria.mjs';

const exigir=(ok,m)=>{if(!ok)throw Error(m);};
const texto=v=>typeof v==='string'&&v.trim().length>0;
const igual=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
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
  function planificarRestauracion(archivo,revisionEsperada=revision){
    exigir(revisionEsperada===revision,'Índice obsoleto.');
    const call=archivo?.convocatoriaId;
    exigir(texto(call)&&texto(archivo.revisionEsperada)&&Array.isArray(archivo.cambios)&&archivo.cambios.length>0,'Archivo histórico inválido.');
    exigir(!porConvocatoria.has(call),'La convocatoria ya tiene pertenencias activas.');
    const vistos=new Set(),cambios=[];let restauradas=0;
    for(const c of archivo.cambios){
      exigir(c&&docs.has(c.id)&&!vistos.has(c.id)&&Array.isArray(c.antes)&&Array.isArray(c.despues)&&Array.isArray(c.retiradas)&&c.retiradas.length>0,'Cambio histórico inválido.');
      vistos.add(c.id);
      exigir(c.antes.every(p=>p&&texto(p.convocatoriaId))&&igual(c.antes.filter(p=>p.convocatoriaId===call),c.retiradas)&&igual(c.antes.filter(p=>p.convocatoriaId!==call),c.despues),'Archivo histórico incoherente.');
      const antes=docs.get(c.id).pertenencias;
      // Si otras convocatorias evolucionaron, conservar su estado actual, no su copia antigua.
      const despues=igual(antes,c.despues)?c.antes:[...antes,...c.retiradas];
      cambios.push({id:c.id,antes:structuredClone(antes),despues:structuredClone(despues),restauradas:structuredClone(c.retiradas)});restauradas+=c.retiradas.length;
    }
    exigir(archivo.documentosAfectados===cambios.length&&archivo.aparicionesRetiradas===restauradas,'Inventario histórico incompleto.');
    const porId=new Map(cambios.map(c=>[c.id,c]));
    // Verificar toda la proyección candidata antes de devolver un plan de escritura.
    crearIndiceConocimiento([...docs.values()].map(d=>porId.has(d.id)?{...d,pertenencias:porId.get(d.id).despues}:d),revision);
    return {revisionEsperada,convocatoriaId:call,documentosAfectados:cambios.length,aparicionesRestauradas:restauradas,cambios};
  }
  return Object.freeze({revision,documento,arbol,planificarRetirada,planificarRestauracion,
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

// El archivo debe proceder del historial confirmado del almacén, no de una fuente externa.
export async function restaurarConvocatoria(indice,archivo,{revisionEsperada,confirmado=false,almacen}={}){
  exigir(texto(revisionEsperada),'Se requiere la revisión esperada.');
  const plan=indice.planificarRestauracion(archivo,revisionEsperada);
  if(!confirmado)return {simulado:true,plan};
  exigir(typeof almacen?.guardarRestauracionAtomica==='function','Falta almacén transaccional.');
  const resultado=await almacen.guardarRestauracionAtomica(structuredClone(plan));
  exigir(resultado?.confirmado===true&&texto(resultado.revision)&&resultado.revision!==revisionEsperada,'Guardado no confirmado; consultar el almacén antes de reintentar.');
  return {simulado:false,plan,revision:resultado.revision};
}
