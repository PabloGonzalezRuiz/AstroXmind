const exigir=(ok,m)=>{if(!ok)throw Error(m);};
const texto=v=>typeof v==='string'&&v.trim().length>0;

export function codigoConvocatoria(nombreCorto,anio,modalidad){
  exigir(texto(nombreCorto),'Falta nombre corto de oposición');
  const nombre=String(nombreCorto).normalize('NFD').replace(/\p{M}/gu,'').toUpperCase().replace(/[^A-Z0-9]+/g,'-').replace(/^-|-$/g,'');
  const modo={LIBRE:'LBR',PROMOCION_INTERNA:'PI'}[modalidad];
  exigir(nombre&&/^\d{4}$/.test(String(anio))&&modo,'Código de convocatoria inválido');
  return `${nombre}.${anio}.${modo}`;
}

// Una proyección por convocatoria y revisión. Los archivos de contenido no se duplican.
export function crearArbolConvocatoria(documentos, convocatoriaId, versionId) {
  exigir(texto(convocatoriaId)&&texto(versionId),'Contexto obligatorio');
  const nodos=new Map(), hijos=new Map(), documentosIds=new Set(), apariciones=new Map(), posiciones=new Set(), codigos=new Map();
  for(const d of documentos){
    exigir(texto(d.id)&&!documentosIds.has(d.id)&&Array.isArray(d.pertenencias),'Documento inválido o duplicado');
    documentosIds.add(d.id);
    for(const p of d.pertenencias){
      if(p.convocatoriaId!==convocatoriaId||p.versionId!==versionId)continue;
      exigir(texto(p.aparicionId)&&!nodos.has(p.aparicionId)&&(p.padreAparicionId===null||texto(p.padreAparicionId))&&Number.isSafeInteger(p.orden)&&p.orden>=0&&texto(p.alias),'Aparición inválida o duplicada');
      const codigo=p.codigo??null;
      exigir(codigo===null||(/^[A-Z0-9-]+(?:\.[A-Z0-9-]+)+$/.test(codigo)&&!codigos.has(codigo)),'Código inválido o ambiguo');
      const n=Object.freeze({aparicionId:p.aparicionId,documentoId:d.id,padreAparicionId:p.padreAparicionId,orden:p.orden,alias:p.alias,codigo});
      if(codigo!==null)codigos.set(codigo,n);
      nodos.set(n.aparicionId,n);
      const pos=JSON.stringify([n.padreAparicionId,n.orden]);
      exigir(!posiciones.has(pos),'Orden duplicado');posiciones.add(pos);
      if(!hijos.has(n.padreAparicionId))hijos.set(n.padreAparicionId,[]);
      hijos.get(n.padreAparicionId).push(n);
      if(!apariciones.has(d.id))apariciones.set(d.id,[]);
      apariciones.get(d.id).push(n);
    }
  }
  exigir(hijos.get(null)?.length===1,'Se requiere una raíz única');
  for(const lista of hijos.values())lista.sort((a,b)=>a.orden-b.orden);
  const nodo=id=>{exigir(nodos.has(id),'Aparición fuera del contexto');return nodos.get(id);};
  const padre=id=>{const p=nodo(id).padreAparicionId;return p===null?null:nodo(p);};
  const ruta=id=>{const vistos=new Set(),r=[];for(let n=nodo(id);n!==null;n=padre(n.aparicionId)){exigir(!vistos.has(n.aparicionId),'Ciclo');vistos.add(n.aparicionId);r.unshift(n);}return r;};
  for(const id of nodos.keys())ruta(id);
  return Object.freeze({convocatoriaId,versionId,raiz:hijos.get(null)[0],nodo,padre,ruta,
    resolverCodigo(codigo){exigir(codigos.has(codigo),'Código desconocido en este contexto');return codigos.get(codigo);},
    hijos(id){nodo(id);return [...(hijos.get(id)??[])];},
    hermanos(id){return [...(hijos.get(nodo(id).padreAparicionId)??[])].filter(n=>n.aparicionId!==id);},
    apariciones(documentoId){return [...(apariciones.get(documentoId)??[])];}
  });
}

// Adaptador temporal de PROG-01: las ocurrencias oficiales ya tienen identidad.
// No crea documentos de corpus ni supone equivalencias semánticas entre convocatorias.
export function arbolProgramaOficial(bloques, contexto){
  const {convocatoriaId,versionId,titulo,codigo=null}=contexto;
  const raiz='raiz:'+convocatoriaId;
  const p=(aparicionId,padreAparicionId,orden,alias,codigo)=>({aparicionId,padreAparicionId,orden,alias,convocatoriaId,versionId,codigo});
  const docs=[{id:raiz,pertenencias:[p(raiz,null,0,titulo,codigo)]}];
  function visitar(ns,padre,prefijo,nivel){for(const n of ns){const c=prefijo&&nivel<=2?`${prefijo}.${nivel===1?'BQ':'TM'}${String(n.order).padStart(2,'0')}`:null;docs.push({id:n.id,pertenencias:[p(n.id,padre,n.order,n.title,c)]});visitar(n.hijos??[],n.id,c,nivel+1);}}
  visitar(bloques,raiz,codigo,1);
  return crearArbolConvocatoria(docs,convocatoriaId,versionId);
}
