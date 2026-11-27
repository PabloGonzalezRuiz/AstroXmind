import { parse } from 'yaml';
import { arbolProgramaOficial, codigoConvocatoria } from './arbol-convocatoria.mjs';
import { urlEditorContextual } from './editor-contextual.mjs';

const versionPattern = /^syllabus-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
export function rutasPrograma(item) {
  const p=item.datos.programaBorrador;
  if(!p || !['BORRADOR','ACEPTADO'].includes(p.estado) || !versionPattern.test(p.versionId) || p.sha256Fuente!==item.datos.pdfOficial?.sha256) throw Error('Referencia de borrador no válida.');
  const base=item.ruta.replace(/convocatoria\.yaml$/, '')+'Programa/'+p.versionId+'/';
  return {yaml:base+'programa.yaml',md:base+'programa.md',informe:base+'validacion.json'};
}

export function leerBorradorPrograma(texto,item){
  const m=parse(texto,{maxAliasCount:0}), d=item.datos, id=d.programaBorrador.versionId;
  const v=m?.versions?.find(x=>x.id===id);
  if(m?.schemaVersion!==1 || !v || v.status!==(d.programaBorrador.estado==='ACEPTADO'?'accepted':'draft') || v.oppositionId!==d.oposicionId || v.modalidad!==d.modalidad || v.source?.reference!==d.pdfOficial.referencia || v.source?.sha256!==d.pdfOficial.sha256 || !m.calls?.some(c=>c.id===d.id && c.year===d.anio && c.modalidad===d.modalidad && c.versionId===id))throw Error('El borrador no corresponde a este expediente.');
  const nodes=m.nodes?.filter(n=>n.versionId===id);
  if(!nodes?.length || nodes.length>10000 || new Set(nodes.map(n=>n.id)).size!==nodes.length)throw Error('Árbol de programa no válido.');
  const grupos=new Map();
  for(const n of nodes){
    if(typeof n.title!=='string'||!n.title.trim()||!Number.isInteger(n.order)||n.order<1||!['block','topic','section'].includes(n.kind))throw Error('Nodo de programa no válido.');
    const xs=grupos.get(n.parentId)||[];xs.push(n);grupos.set(n.parentId,xs);
  }
  const visitados=new Set();
  function construir(parent,depth){
    if(depth>32)throw Error('Profundidad del programa excesiva.');
    return (grupos.get(parent?.id??null)||[]).sort((a,b)=>a.order-b.order).map((n,i)=>{
      const codigo=(parent?parent.code+'.':'')+String(i+1).padStart(2,'0');
      if(visitados.has(n.id)||n.code!==codigo||n.order!==i+1||(!parent?n.kind!=='block':parent.kind==='block'?n.kind!=='topic':n.kind!=='section'))throw Error('Jerarquía del programa no válida.');
      visitados.add(n.id);
      return {...n,hijos:construir(n,depth+1)};
    });
  }
  const bloques=construir(null,0), temas=nodes.filter(n=>n.kind==='topic').length;
  if(visitados.size!==nodes.length || temas!==d.pdfOficial.temas || bloques.length!==d.pdfOficial.bloques?.length || bloques.some((b,i)=>b.hijos.length!==d.pdfOficial.bloques[i].temas))throw Error('La estructura del borrador no coincide con las bases.');
  return {bloques,temas,nodos:nodes.length,aceptado:v.status==='accepted'};
}

export function mostrarBorradorPrograma(document,item,githubUrl,puedeEditar,nombreCorto){
  const section=document.createElement('section');section.className='paso-resumen';section.id='programa-desglosado';
  const h=document.createElement('h4');h.textContent='Paso 3 · Programa oficial desglosado';section.append(h);
  const p=document.createElement('p');
  if(!item.programaVista){p.textContent='No se ha podido cargar el programa. Comprueba la referencia y el estado del expediente.';section.append(p);return section;}
  const oficial=item.programaVista, editorial=item.programaEditorial;
  const {bloques,temas,nodos,aceptado}=oficial;
  p.textContent=`${aceptado?'ACEPTADO · Solo lectura':'BORRADOR · Pendiente de revisión'} · ${bloques.length} bloques · ${temas} temas · ${nodos} nodos. ${aceptado?'La aceptación del programa no valida otras fases de la convocatoria.':'No valida la convocatoria.'}`;section.append(p);
  if(editorial){const e=document.createElement('p');e.textContent=`Estructura editorial · ${editorial.bloques.length} bloques · ${editorial.temas} temas · ${editorial.nodos} nodos`;section.append(e);}
  const herramientas=document.createElement('div');
  for(const [key,label] of [['md','Markdown'],['yaml','YAML'],['informe','Informe de validación inicial']]){
    const a=document.createElement('a');a.href=githubUrl(rutasPrograma(item)[key]);a.textContent=label;a.target='_blank';a.rel='noopener noreferrer';herramientas.append(a,' · ');
  }
  section.append(herramientas);
  if(puedeEditar&&(aceptado||item.datos.faseActual==='REVISION')){
    const contextual=document.createElement('a');contextual.href=urlEditorContextual(document.defaultView.location.href,item.datos);contextual.target='_blank';contextual.rel='noopener noreferrer';contextual.textContent=aceptado?'Abrir editor completo · trabajar en copia (nueva pestaña)':'Abrir editor completo (nueva pestaña)';contextual.dataset.editorContextual='';contextual.className='programa-enlace-editor';section.append(contextual);
    if(!aceptado){
    const estado=document.createElement('p');estado.dataset.revisionEditorial='';estado.textContent='Revisión editorial: abre el editor para comprobar su estado.';section.append(estado);
    const comprobar=document.createElement('button');comprobar.type='button';comprobar.dataset.comprobarRevisionEditorial='';comprobar.textContent='Comprobar revisión editorial';section.append(comprobar);
    }
  }
  const expandir=document.createElement('button'),plegar=document.createElement('button');
  expandir.type=plegar.type='button';expandir.textContent='Desplegar todo';plegar.textContent='Plegar todo';
  const barra=document.createElement('div');barra.className='programa-barra';const modo=document.createElement('button');modo.type='button';modo.textContent='Mostrar vista plegable';modo.setAttribute('aria-pressed','false');barra.append(modo,expandir,plegar);expandir.hidden=plegar.hidden=true;section.append(barra);
  const resultado=document.createElement('div');resultado.className='programa-resultado';
  const arbol=document.createElement('div');arbol.className='programa-arbol';
  const tituloResultado=document.createElement('p');tituloResultado.textContent=editorial?'Estructura editorial aprobada':'Programa oficial (solo lectura)';resultado.append(tituloResultado,arbol);
  const navegacion=document.createElement('nav');navegacion.setAttribute('aria-label','Ruta en esta convocatoria');navegacion.className='programa-barra';
  const volver=document.createElement('button');volver.type='button';volver.textContent='Volver al nodo anterior';volver.disabled=true;
  const ruta=document.createElement('span');ruta.setAttribute('aria-live','polite');
  const codigoVisible=document.createElement('small');codigoVisible.setAttribute('aria-live','polite');
  navegacion.append(volver,ruta,codigoVisible);resultado.prepend(navegacion);
  section.append(resultado);
  const versionId=item.datos.programaBorrador.versionId;
  let indice, seleccionId=null, plano=true, vistaActual=editorial??oficial;const historial=[];
  function mostrarRuta(id){
    seleccionId=id;ruta.replaceChildren();
    codigoVisible.textContent=indice.nodo(id).codigo?' · '+indice.nodo(id).codigo:'';
    for(const n of indice.ruta(id)){
      if(ruta.childNodes.length)ruta.append(' › ');
      if(n.padreAparicionId===null||n.aparicionId===id){ruta.append(n.alias);continue;}
      const b=document.createElement('button');b.type='button';b.textContent=n.alias;if(n.codigo)b.title=n.codigo;
      b.addEventListener('click',()=>navegar(n.aparicionId));ruta.append(b);
    }
    volver.disabled=historial.length===0;
  }
  function navegar(id, registrar=true){
    if(registrar&&seleccionId&&seleccionId!==id)historial.push(seleccionId);
    mostrarRuta(id);
    const destino=[...arbol.querySelectorAll('[data-programa-nodo]')].find(e=>e.dataset.programaNodo===id);
    if(destino){for(let padre=destino.parentElement;padre&&padre!==arbol;padre=padre.parentElement)if(padre.tagName==='DETAILS')padre.open=true;destino.scrollIntoView?.({block:'nearest'});}
  }
  volver.addEventListener('click',()=>{if(historial.length)navegar(historial.pop(),false);});
  function seleccionar(n){
    navegar(n.id);
  }
  // Todas las filas (hojas y desplegables) tienen exactamente las mismas columnas.
  const rotular=(el,n,desplegable)=>{
    el.className='programa-fila';el.dataset.tipoNodo=n.kind;
    const marcador=document.createElement('span');marcador.className='programa-marcador';marcador.setAttribute('aria-hidden','true');
    if(desplegable)marcador.textContent='▸';
    const etiqueta=document.createElement('span');etiqueta.className='programa-etiqueta';etiqueta.textContent=n.code+' · '+n.title;
    el.append(marcador,etiqueta);
  };
  const fila=(n,abiertos)=>{
    if(!n.hijos.length){const leaf=document.createElement('p');rotular(leaf,n,false);leaf.dataset.programaNodo=n.id;leaf.addEventListener('click',()=>seleccionar(n));return leaf;}
    const d=document.createElement('details'),s=document.createElement('summary');rotular(s,n,true);d.className='programa-rama';d.dataset.programaNodo=n.id;
    d.open=abiertos?abiertos.has(n.id):n.kind==='block';s.addEventListener('click',()=>seleccionar(n));d.append(s);
    const cuerpo=document.createElement('div');cuerpo.className='programa-hijos';for(const hijo of n.hijos)cuerpo.append(fila(hijo,abiertos));d.append(cuerpo);return d;
  };
  // Una fila de texto por nodo: la profundidad es el único origen de la sangría.
  function filasPlanas(bloques){
    const filas=[];
    function visitar(n,nivel){const p=document.createElement('p');p.className='programa-linea-plana';p.dataset.programaNodo=n.id;p.dataset.nivel=String(nivel);p.style.setProperty('--programa-nivel',String(nivel));p.textContent=n.code+' · '+n.title;p.addEventListener('click',()=>seleccionar(n));filas.push(p);for(const h of n.hijos)visitar(h,nivel+1);}
    for(const b of bloques)visitar(b,0);return filas;
  }
  function representar(nueva,conservar=true){
    vistaActual=nueva;arbol.classList.toggle('programa-plano',plano);
    const abiertos=conservar?new Set([...arbol.querySelectorAll('details[open]')].map(d=>d.dataset.programaNodo)):null;
    indice=arbolProgramaOficial(nueva.bloques,{convocatoriaId:item.datos.id,versionId,titulo:'Convocatoria '+item.datos.anio+' '+item.datos.modalidad,codigo:nombreCorto?codigoConvocatoria(nombreCorto,item.datos.anio,item.datos.modalidad??'LIBRE'):null});
    arbol.replaceChildren(...(plano?filasPlanas(nueva.bloques):nueva.bloques.map(b=>fila(b,abiertos))));
    try{mostrarRuta(seleccionId??indice.raiz.aparicionId);}catch{historial.length=0;mostrarRuta(indice.raiz.aparicionId);}
  }
  modo.addEventListener('click',()=>{plano=!plano;modo.textContent=plano?'Mostrar vista plegable':'Mostrar texto plano';modo.setAttribute('aria-pressed',String(!plano));expandir.hidden=plegar.hidden=plano;representar(vistaActual,false);});
  representar(vistaActual,false);
  if(editorial){const toggle=document.createElement('button');toggle.type='button';toggle.textContent='Mostrar programa oficial';let verOficial=false;toggle.addEventListener('click',()=>{verOficial=!verOficial;toggle.textContent=verOficial?'Mostrar estructura editorial':'Mostrar programa oficial';tituloResultado.textContent=verOficial?'Programa oficial (solo lectura)':'Estructura editorial aprobada';representar(verOficial?oficial:editorial,false);});barra.append(toggle);}
  expandir.addEventListener('click',()=>arbol.querySelectorAll('details').forEach(d=>d.open=true));
  plegar.addEventListener('click',()=>arbol.querySelectorAll('details').forEach(d=>d.open=false));
  return section;
}
