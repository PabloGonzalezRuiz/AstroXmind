import { contextoDesdeUrl, prepararSolicitudContextual, eventoRevisionEditor } from './editor-contextual.mjs';

// El laboratorio permanece independiente. Los datos privados solo se muestran tras una carga autorizada.
export function instalarContextoEditor(root,{cargar,guardar,leerToken,render}){
  const w=root.ownerDocument.defaultView,q=s=>root.querySelector(s);
  const reglas=q('#v2-reglas'),md=q('#v2-md'),selector=q('#v2-plantilla'),panel=q('.paneles'),barra=q('.barra');
  const estado=q('[data-contexto-estado]'),save=q('[data-guardar-contexto]'),close=q('[data-cerrar-contexto]');
  let ctx;
  try{ctx=contextoDesdeUrl(w.location.href);}catch(e){panel.hidden=barra.hidden=true;estado.textContent=e.message;return;}
  if(!ctx)return;
  panel.hidden=barra.hidden=true;reglas.value=md.value='';save.hidden=close.hidden=false;save.disabled=true;
  q('[data-restaurar]').hidden=true;q('[data-laboratorio]').hidden=true;
  estado.textContent='Cargando la convocatoria y su revisión editorial…';
  let base=null,token=leerToken(w),ocupado=false,cerrando=false,incierto=false;
  const vigente=()=>!!token&&token===leerToken(w);
  const sucio=()=>!!base&&(base.primeraApertura||reglas.value!==base.plantilla.reglas||md.value!==base.markdown||selector.value!==base.plantilla.id);
  const validar=()=>{if(!base||base.soloLecturaOficial||!vigente()||ocupado||incierto){save.disabled=true;return;}try{prepararSolicitudContextual(base,reglas.value,md.value,selector.value);save.disabled=!sucio();}catch{save.disabled=true;}};
  const bloquear=()=>{base=null;reglas.value=md.value='';q('[data-resultado]').replaceChildren();panel.hidden=barra.hidden=true;save.disabled=true;estado.textContent='La sesión ha cambiado. Vuelve a abrir la convocatoria.';};
  w.addEventListener('storage',()=>{if(!vigente())bloquear();});
  w.addEventListener('astroxmind:github-token-changed',()=>{if(!vigente())bloquear();});
  w.addEventListener('beforeunload',e=>{if(!cerrando&&sucio()){e.preventDefault();e.returnValue='';}});
  const salir=()=>{cerrando=true;const ruta=new URL('../oposiciones/',w.location.href);if(base?.slug){ruta.searchParams.set('o',base.slug);ruta.searchParams.set('anio',ctx.anio);ruta.hash='programa-desglosado';}w.close();if(!w.closed)w.location.assign(ruta.href);};
  close.addEventListener('click',()=>{if(ocupado)return;if(!sucio()||w.confirm('¿Cerrar y descartar los cambios no guardados?'))salir();});
  for(const el of [reglas,md,selector]){el.addEventListener('input',validar);el.addEventListener('change',validar);}
  for(const s of ['[data-ids]','[data-tipos]','[data-plantilla]','[data-copiar]','[data-exportar]'])q(s).addEventListener('click',validar);
  save.addEventListener('click',async()=>{
    if(!base||base.soloLecturaOficial||ocupado||incierto||!vigente())return;
    let solicitud;
    try{solicitud=prepararSolicitudContextual(base,reglas.value,md.value,selector.value);}catch(e){estado.textContent=e.message;return;}
    const cambios=`${solicitud.altasConfirmadas.length} altas y ${solicitud.bajasConfirmadas.length} bajas editoriales`;
    if(!w.confirm(`¿Guardar esta revisión (${cambios})? Se conservarán los nodos oficiales y el histórico.`))return;
    const botones=[...panel.querySelectorAll('button')];ocupado=true;save.disabled=close.disabled=true;reglas.disabled=md.disabled=selector.disabled=true;for(const b of botones)b.disabled=true;barra.hidden=true;estado.textContent='Guardando revisión…';
    try{
      const r=await guardar(w,token,ctx.id,ctx.anio,ctx.versionId,solicitud);
      if(!vigente()){bloquear();return;}
      base={...base,...r,primeraApertura:false};estado.textContent='Revisión guardada y verificada: '+r.revision;
      try{w.localStorage.setItem(eventoRevisionEditor,JSON.stringify({...ctx,revision:r.revision}));}catch{/* El guardado ya fue confirmado. */}
      salir();
    }catch(e){incierto=true;if(vigente())estado.textContent='No se ha confirmado el guardado. Exporta el borrador, comprueba la revisión en el expediente y vuelve a abrir el editor antes de reintentar. '+e.message;else bloquear();}
    finally{ocupado=false;close.disabled=false;reglas.disabled=md.disabled=selector.disabled=false;for(const b of botones)b.disabled=false;if(base){barra.hidden=false;validar();}}
  });
  void (async()=>{try{
    if(!vigente())throw Error('Configura el acceso privado antes de editar.');
    const b=await cargar(w,token,ctx.id,ctx.anio,ctx.versionId);if(!vigente()){bloquear();return;}
    base=b;reglas.value=b.plantilla.reglas;md.value=b.markdown;
    if(![...selector.options].some(o=>o.value===b.plantilla.id)){const o=root.ownerDocument.createElement('option');o.value=b.plantilla.id;o.textContent=b.plantilla.id;selector.append(o);}
    selector.value=b.plantilla.id;panel.hidden=barra.hidden=false;save.hidden=!!b.soloLecturaOficial;estado.textContent=b.soloLecturaOficial?'Programa aceptado · copia editorial editable y exportable; el original y el catálogo no se modifican.':b.primeraApertura?'Primera apertura · Confirma las correspondencias al guardar.':'Revisión recuperada: '+b.revision;render();validar();
  }catch(e){estado.textContent=e.message;save.disabled=true;}})();
}
