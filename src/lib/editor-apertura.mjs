import { completarIds, markdownOficialConTipos, proyectar, plantillas } from './editor-v2.mjs';
import { reconciliarV2 } from './editor-identidad.mjs';

// Adaptar únicamente el borrador validado de la convocatoria seleccionada.
// Las correspondencias son nuevas propuestas, no equivalencias entre convocatorias.
export function prepararPrimeraApertura(bloques, contexto, generar=()=>globalThis.crypto.randomUUID()) {
  const { nombre, nombreCorto, anio, modalidad }=contexto;
  const aliasModalidad={LIBRE:'LBR',PROMOCION_INTERNA:'PI'}[modalidad];
  if(!aliasModalidad||!nombreCorto||!/^\d{4}$/.test(String(anio))) throw Error('Contexto de convocatoria inválido.');
  const plantilla={id:plantillas[0].id,revision:plantillas[0].revision,reglas:plantillas[0].reglas};
  const markdown=completarIds(plantilla.reglas,markdownOficialConTipos(bloques,{
    oposicion:nombre,aliasOposicion:nombreCorto,convocatoria:String(anio),modalidad,aliasModalidad
  }),generar);
  const correspondencias=proyectar(plantilla.reglas,markdown).slice(1).map(n=>({nodeId:n.id,entryId:'entry-'+generar()}));
  const {entradas}=reconciliarV2(plantilla.reglas,markdown,{correspondencias});
  return {plantilla,markdown,correspondencias,entradas,revision:null};
}
