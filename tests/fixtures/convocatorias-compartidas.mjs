// Datos exclusivamente ficticios; no contienen documentos ni IDs del expediente real.
export const contextos={tai2025:'TAI.2025.LBR-PRUEBA',ficA:'TAI.2098.LBR-FICTICIA',ficB:'TAI.2099.LBR-FICTICIA'};
const p=(aparicionId,convocatoriaId,padreAparicionId,orden,alias)=>({aparicionId,convocatoriaId,versionId:'v1',padreAparicionId,orden,alias});
export function convocatoriasCompartidas(){
 const {tai2025:a,ficA:b,ficB:c}=contextos;
 return [
  {id:'doc-raiz',cuerpo:'Oposición ficticia',pertenencias:[p('ra',a,null,0,'TAI 2025 (copia de prueba)'),p('rb',b,null,0,'TAI 2098 ficticia'),p('rc',c,null,0,'TAI 2099 ficticia')]},
  {id:'doc-bd',cuerpo:'Bases de datos',pertenencias:[p('ba',a,'ra',1,'Bases de datos'),p('bc',c,'rc',1,'Datos')]},
  {id:'doc-desarrollo',cuerpo:'Desarrollo',pertenencias:[p('db',b,'rb',1,'Desarrollo')]},
  {id:'doc-sql',cuerpo:'Contenido único SQL',pertenencias:[p('sa',a,'ba',1,'SQL'),p('sb',b,'db',1,'SQL práctico'),p('sc',c,'bc',1,'Lenguaje SQL')]},
  {id:'doc-redes',cuerpo:'Redes compartidas A y B',pertenencias:[p('na',a,'ra',2,'Redes'),p('nb',b,'rb',2,'Comunicaciones')]},
  {id:'doc-exclusivo',cuerpo:'Solo convocatoria 2025 de prueba',pertenencias:[p('xa',a,'ra',3,'Exclusivo')]}];
}
