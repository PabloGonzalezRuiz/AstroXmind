import { parse, stringify } from 'yaml';
import { abrirModeloPrograma, previsualizarModeloPrograma } from './programa-editor-browser.mjs';
import { installEditorKeys } from './wiki-editor-keys.mjs';

const versionPattern = /^syllabus-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
export function rutasPrograma(item) {
  const p=item.datos.programaBorrador;
  if(!p || p.estado!=='BORRADOR' || !versionPattern.test(p.versionId) || p.sha256Fuente!==item.datos.pdfOficial?.sha256) throw Error('Referencia de borrador no válida.');
  const base=item.ruta.replace(/convocatoria\.yaml$/, '')+'Programa/'+p.versionId+'/';
  return {yaml:base+'programa.yaml',md:base+'programa.md',informe:base+'validacion.json'};
}

export function leerBorradorPrograma(texto,item){
  const m=parse(texto,{maxAliasCount:0}), d=item.datos, id=d.programaBorrador.versionId;
  const v=m?.versions?.find(x=>x.id===id);
  if(m?.schemaVersion!==1 || !v || v.status!=='draft' || v.oppositionId!==d.oposicionId || v.modalidad!==d.modalidad || v.source?.reference!==d.pdfOficial.referencia || v.source?.sha256!==d.pdfOficial.sha256 || !m.calls?.some(c=>c.id===d.id && c.year===d.anio && c.modalidad===d.modalidad && c.versionId===id))throw Error('El borrador no corresponde a este expediente.');
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
  return {bloques,temas,nodos:nodes.length};
}

export function mostrarBorradorPrograma(document,item,githubUrl,guardar){
  const section=document.createElement('section');section.className='paso-resumen';section.id='programa-desglosado';
  const h=document.createElement('h4');h.textContent='Paso 3 · Programa oficial desglosado';section.append(h);
  const p=document.createElement('p');
  if(!item.programaVista){p.textContent='No se ha podido cargar el borrador. El expediente permanece pendiente de revisión.';section.append(p);return section;}
  const {bloques,temas,nodos}=item.programaVista;
  p.textContent=`BORRADOR · Pendiente de revisión · ${bloques.length} bloques · ${temas} temas · ${nodos} nodos. No valida la convocatoria.`;section.append(p);
  const herramientas=document.createElement('div');
  for(const [key,label] of [['md','Markdown'],['yaml','YAML'],['informe','Informe de validación inicial']]){
    const a=document.createElement('a');a.href=githubUrl(rutasPrograma(item)[key]);a.textContent=label;a.target='_blank';a.rel='noopener noreferrer';herramientas.append(a,' · ');
  }
  section.append(herramientas);
  const laboratorio=document.createElement('a');laboratorio.href=new URL('../editor-programa/',document.defaultView.location.href).href;laboratorio.target='_blank';laboratorio.rel='noopener noreferrer';laboratorio.textContent='Abrir editor ED-03 (ejemplo ficticio)';section.append(laboratorio);
  const editar=document.createElement('button');editar.type='button';editar.textContent='Editar programa';editar.dataset.programaEditar='';
  editar.hidden=!guardar||!item.programaTexto||item.datos.faseActual!=='REVISION';
  const expandir=document.createElement('button'),plegar=document.createElement('button');
  expandir.type=plegar.type='button';expandir.textContent='Desplegar todo';plegar.textContent='Plegar todo';
  const barra=document.createElement('div');barra.className='programa-barra';barra.append(editar,expandir,plegar);section.append(barra);
  const panel=document.createElement('div');panel.className='programa-editor';
  const edicion=document.createElement('div');edicion.className='programa-edicion';edicion.hidden=true;
  const label=document.createElement('label'),area=document.createElement('textarea');area.id='programa-editor-md';area.dataset.programaMarkdown='';area.spellcheck=false;
  label.htmlFor=area.id;label.textContent='Markdown del programa';installEditorKeys(area,{continuarLista:false});
  const ayuda=document.createElement('p');ayuda.textContent='Edita títulos o mueve líneas completas, conservando los identificadores entre comentarios. Tab/Mayús+Tab: sangrar/desangrar dos espacios; Esc, Tab: navegar. Pulsa un nodo del resultado para localizar su título.';
  const estado=document.createElement('p');estado.dataset.programaEstado='';estado.setAttribute('role','status');estado.setAttribute('aria-live','polite');
  const guardarBtn=document.createElement('button'),cancelar=document.createElement('button');
  guardarBtn.type=cancelar.type='button';guardarBtn.textContent='Guardar borrador en GitHub';guardarBtn.dataset.programaGuardar='';cancelar.textContent='Cerrar editor';guardarBtn.disabled=true;
  const acciones=document.createElement('div');acciones.className='programa-barra';acciones.append(guardarBtn,cancelar);
  edicion.append(label,ayuda,area,acciones,estado);
  const resultado=document.createElement('div');resultado.className='programa-resultado';
  const arbol=document.createElement('div');arbol.className='programa-arbol';
  const tituloResultado=document.createElement('p');tituloResultado.textContent='Resultado';resultado.append(tituloResultado,arbol);
  panel.append(edicion,resultado);section.append(panel);
  const window=document.defaultView,versionId=item.datos.programaBorrador.versionId;
  let base=null,actualTexto=item.programaTexto,vista=item.programaVista,ocupado=false,timer;
  function seleccionar(n){
    if(edicion.hidden||ocupado)return;
    const lineas=area.value.split('\n');let offset=0;
    for(const linea of lineas){
      if(linea.endsWith('<!-- '+n.id+' -->')){
        const prefijo=linea.match(/^ *- \d+(?:\.\d+)* /)?.[0].length??0;
        area.focus();area.setSelectionRange(offset+prefijo,offset+linea.lastIndexOf(' <!-- '));return;
      }offset+=linea.length+1;
    }
  }
  const fila=(n,abiertos)=>{
    const etiqueta=n.code+' · '+n.title;
    if(!n.hijos.length){const leaf=document.createElement('p');leaf.textContent=etiqueta;leaf.dataset.programaNodo=n.id;leaf.addEventListener('click',()=>seleccionar(n));return leaf;}
    const d=document.createElement('details'),s=document.createElement('summary');s.textContent=etiqueta;d.dataset.programaNodo=n.id;
    d.open=abiertos?abiertos.has(n.id):n.kind==='block';s.addEventListener('click',()=>seleccionar(n));d.append(s);
    const cuerpo=document.createElement('div');for(const hijo of n.hijos)cuerpo.append(fila(hijo,abiertos));d.append(cuerpo);return d;
  };
  function representar(nueva,conservar=true){
    const abiertos=conservar?new Set([...arbol.querySelectorAll('details[open]')].map(d=>d.dataset.programaNodo)):null;
    arbol.replaceChildren(...nueva.bloques.map(b=>fila(b,abiertos)));
  }
  representar(vista,false);
  expandir.addEventListener('click',()=>arbol.querySelectorAll('details').forEach(d=>d.open=true));
  plegar.addEventListener('click',()=>arbol.querySelectorAll('details').forEach(d=>d.open=false));
  function validar(){
    window.clearTimeout(timer);
    if(!base||ocupado)return false;
    try{
      const modelo=previsualizarModeloPrograma(base,versionId,area.value);
      const previa=leerBorradorPrograma(stringify(modelo),item);
      representar(previa);
      const cambiado=area.value!==base.md;
      estado.textContent=cambiado?'Previsualización válida. Cambios sin guardar.':'Sin cambios.';
      guardarBtn.disabled=!cambiado;return cambiado;
    }catch(error){estado.textContent='No se puede guardar: '+error.message;guardarBtn.disabled=true;return false;}
  }
  editar.addEventListener('click',async()=>{
    if(ocupado||!section.isConnected)return;
    editar.disabled=true;
    try{
      base=await abrirModeloPrograma(window,actualTexto,versionId);
      if(!section.isConnected)return;
      area.value=base.md;edicion.hidden=false;panel.classList.add('programa-editor-activo');editar.hidden=true;estado.textContent='Sin cambios.';guardarBtn.disabled=true;area.focus();
      section.scrollIntoView?.({block:'start'});
    }catch(error){estado.textContent=error.message;edicion.hidden=false;area.disabled=true;guardarBtn.disabled=true;panel.classList.add('programa-editor-activo');}
    finally{editar.disabled=false;}
  });
  area.addEventListener('input',()=>{guardarBtn.disabled=true;window.clearTimeout(timer);timer=window.setTimeout(validar,180);});
  cancelar.addEventListener('click',()=>{
    if(ocupado)return;
    if(base&&area.value!==base.md&&!window.confirm('¿Cerrar sin guardar los cambios?'))return;
    window.clearTimeout(timer);edicion.hidden=true;area.disabled=false;panel.classList.remove('programa-editor-activo');editar.hidden=false;representar(vista);editar.focus();
  });
  guardarBtn.addEventListener('click',async()=>{
    if(ocupado||!section.isConnected||!validar())return;
    ocupado=true;guardarBtn.disabled=cancelar.disabled=area.disabled=true;estado.textContent='Guardando borrador…';
    try{
      const r=await guardar(area.value);
      if(!section.isConnected)return;
      actualTexto=r.yaml;base={modelo:r.modelo,huella:r.huella,md:r.md};area.value=r.md;
      vista=leerBorradorPrograma(r.yaml,item);representar(vista);
      estado.textContent='Borrador guardado en GitHub. La convocatoria sigue pendiente de revisión.';
    }catch(error){if(section.isConnected)estado.textContent='No se ha guardado: '+error.message;}
    finally{ocupado=false;cancelar.disabled=area.disabled=false;guardarBtn.disabled=!base||area.value===base.md;}
  });
  return section;
}
