import { crearArbolConvocatoria } from './arbol-convocatoria.mjs';
import { markdownOficialConTipos, plantillas, proyectar } from './editor-v2.mjs';

// La instantánea aprobada del alta conserva los IDs de aparición del catálogo.
export function prepararVistaEditorialAceptada(plan,datos,oposicion){
  if(plan?.schemaVersion!==1||plan.convocatoriaId!==datos.id||plan.versionId!==datos.programaBorrador.versionId||!Array.isArray(plan.documentos)||plan.documentos.length>10000)throw Error('Estructura editorial incompatible.');
  const arbol=crearArbolConvocatoria(plan.documentos,datos.id,plan.versionId);
  const tipos=new Map(plan.documentos.map(d=>[d.id,d.tipo]));
  const uuid=id=>{if(!/^appearance-[0-9a-f-]{36}$/.test(id))throw Error('Identidad editorial inválida.');return id.slice(11);};
  const visitar=(n,nivel)=>{
    const kind=nivel===1?'block':nivel===2?'topic':'section';
    if(tipos.get(n.documentoId)!==kind)throw Error('Nivel editorial incompatible.');
    return {id:uuid(n.aparicionId),kind,title:n.alias,order:n.orden,hijos:arbol.hijos(n.aparicionId).map(h=>visitar(h,nivel+1))};
  };
  const bloques=arbol.hijos(arbol.raiz.aparicionId).map(n=>visitar(n,1));
  const plantilla=plantillas[0];
  const markdown=markdownOficialConTipos(bloques,{oposicion:oposicion.nombre,aliasOposicion:oposicion.nombreCorto,convocatoria:String(datos.anio),modalidad:datos.modalidad,aliasModalidad:datos.modalidad==='PROMOCION_INTERNA'?'PI':'LBR',id:uuid(arbol.raiz.aparicionId)});
  const ns=proyectar(plantilla.reglas,markdown), mapa=new Map(ns.map(n=>[n.id,n.codigo]));
  const asignar=n=>({...n,code:mapa.get(n.id),hijos:n.hijos.map(asignar)});
  if(ns.length!==plan.documentos.length||bloques.length!==datos.pdfOficial.bloques.length||bloques.some((b,i)=>b.hijos.length!==datos.pdfOficial.bloques[i].temas))throw Error('Cobertura editorial incompatible.');
  return {bloques:bloques.map(asignar),temas:datos.pdfOficial.temas,nodos:ns.length-1,plantilla,markdown,soloLecturaOficial:true};
}
