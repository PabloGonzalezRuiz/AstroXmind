const exigir=(ok,m)=>{if(!ok)throw Error(m);};
const texto=v=>typeof v==='string'&&v.trim().length>0;

// Una proyección por convocatoria y revisión. Los archivos de contenido no se duplican.
export function crearArbolConvocatoria(documentos, convocatoriaId, versionId) {
  exigir(texto(convocatoriaId)&&texto(versionId),'Contexto obligatorio');
  const nodos=new Map(), hijos=new Map(), documentosIds=new Set(), apariciones=new Map(), posiciones=new Set();
  for(const d of documentos){
    exigir(texto(d.id)&&!documentosIds.has(d.id)&&Array.isArray(d.pertenencias),'Documento inválido o duplicado');
    documentosIds.add(d.id);
    for(const p of d.pertenencias){
      if(p.convocatoriaId!==convocatoriaId||p.versionId!==versionId)continue;
      exigir(texto(p.aparicionId)&&!nodos.has(p.aparicionId)&&(p.padreAparicionId===null||texto(p.padreAparicionId))&&Number.isSafeInteger(p.orden)&&p.orden>=0&&texto(p.alias),'Aparición inválida o duplicada');
      const n=Object.freeze({aparicionId:p.aparicionId,documentoId:d.id,padreAparicionId:p.padreAparicionId,orden:p.orden,alias:p.alias});
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
    hijos(id){nodo(id);return [...(hijos.get(id)??[])];},
    hermanos(id){return [...(hijos.get(nodo(id).padreAparicionId)??[])].filter(n=>n.aparicionId!==id);},
    apariciones(documentoId){return [...(apariciones.get(documentoId)??[])];}
  });
}

// Adaptador temporal de PROG-01: las ocurrencias oficiales ya tienen identidad.
// No crea documentos de corpus ni supone equivalencias semánticas entre convocatorias.
export function arbolProgramaOficial(bloques, contexto){
  const {convocatoriaId,versionId,titulo}=contexto;
  const raiz='raiz:'+convocatoriaId;
  const p=(aparicionId,padreAparicionId,orden,alias)=>({aparicionId,padreAparicionId,orden,alias,convocatoriaId,versionId});
  const docs=[{id:raiz,pertenencias:[p(raiz,null,0,titulo)]}];
  function visitar(ns,padre){for(const n of ns){docs.push({id:n.id,pertenencias:[p(n.id,padre,n.order,n.title)]});visitar(n.hijos??[],n.id);}}
  visitar(bloques,raiz);
  return crearArbolConvocatoria(docs,convocatoriaId,versionId);
}
