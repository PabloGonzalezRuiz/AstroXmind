import { proyectar } from './editor-v2.mjs';
import { reconciliarV2 } from './editor-identidad.mjs';

const uuid='[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}';
export const eventoRevisionEditor='astroxmind:editor-v2:revision';
export function contextoDesdeUrl(url){
  const p=new URL(url).searchParams;
  if(!['op','anio','version'].some(k=>p.has(k)))return null;
  const id=p.get('op'),anio=p.get('anio'),versionId=p.get('version');
  if(!new RegExp(`^op-${uuid}$`).test(id??'')||!/^(19|20|21)\d{2}(-pi)?$/.test(anio??'')||!new RegExp(`^syllabus-${uuid}$`).test(versionId??'')||['op','anio','version'].some(k=>p.getAll(k).length!==1))throw Error('Contexto del editor inválido.');
  return {id,anio,versionId};
}
export function urlEditorContextual(url,datos){
  const destino=new URL('../editor-temario-convocatoria/',url);
  destino.searchParams.set('op',datos.oposicionId);destino.searchParams.set('anio',String(datos.anio)+(datos.modalidad==='PROMOCION_INTERNA'?'-pi':''));destino.searchParams.set('version',datos.programaBorrador.versionId);
  contextoDesdeUrl(destino.href);return destino.href;
}
const cabecera=n=>[n?.id,n?.titulo,n?.props?.oposicion,n?.props?.modalidad,n?.metaAnio??n?.props?.año];
export function prepararSolicitudContextual(base,reglas,markdown,plantillaId=base.plantilla.id){
  const nodos=proyectar(reglas,markdown),original=proyectar(base.plantilla.reglas,base.markdown);
  if(JSON.stringify(cabecera(nodos[0]))!==JSON.stringify(cabecera(original[0])))throw Error('La cabecera de convocatoria no se puede cambiar aquí.');
  const mapa=new Map(base.correspondencias.map(c=>[c.nodeId,c.entryId]));
  const previos=new Set(base.entradas.map(e=>e.id));
  const actuales=new Set(nodos.slice(1).map(n=>mapa.get(n.id)??`entry-${n.id}`));
  const altasConfirmadas=[...actuales].filter(id=>!previos.has(id)),bajasConfirmadas=[...previos].filter(id=>!actuales.has(id));
  reconciliarV2(reglas,markdown,{correspondencias:base.correspondencias,anteriores:base.entradas,altasConfirmadas,bajasConfirmadas});
  const cambiada=reglas!==base.plantilla.reglas||plantillaId!==base.plantilla.id;
  return {revisionEsperada:base.revision,huellaOficial:base.contexto.huellaOficial,plantilla:{id:plantillaId,revision:base.plantilla.revision+(cambiada?1:0),reglas},markdown,correspondencias:base.correspondencias,altasConfirmadas,bajasConfirmadas};
}
