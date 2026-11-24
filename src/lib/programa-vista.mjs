import { parse } from 'yaml';

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

export function mostrarBorradorPrograma(document,item,githubUrl){
  const section=document.createElement('section');section.className='paso-resumen';section.id='programa-desglosado';
  const h=document.createElement('h4');h.textContent='Paso 3 · Programa oficial desglosado';section.append(h);
  const p=document.createElement('p');
  if(!item.programaVista){p.textContent='No se ha podido cargar el borrador. El expediente permanece pendiente de revisión.';section.append(p);return section;}
  const {bloques,temas,nodos}=item.programaVista;
  p.textContent=`BORRADOR · Pendiente de revisión · ${bloques.length} bloques · ${temas} temas · ${nodos} nodos. No valida la convocatoria.`;section.append(p);
  const herramientas=document.createElement('div');
  for(const [key,label] of [['md','Markdown'],['yaml','YAML'],['informe','Informe de validación']]){
    const a=document.createElement('a');a.href=githubUrl(rutasPrograma(item)[key]);a.textContent=label;a.target='_blank';a.rel='noopener noreferrer';herramientas.append(a,' · ');
  }
  section.append(herramientas);
  const expandir=document.createElement('button'),plegar=document.createElement('button');
  expandir.type=plegar.type='button';expandir.textContent='Desplegar todo';plegar.textContent='Plegar todo';
  section.append(expandir,' ',plegar);
  const arbol=document.createElement('div');arbol.className='programa-arbol';
  const fila=n=>{
    const etiqueta=n.code+' · '+n.title;
    if(!n.hijos.length){const leaf=document.createElement('p');leaf.textContent=etiqueta;return leaf;}
    const d=document.createElement('details'),s=document.createElement('summary');s.textContent=etiqueta;d.open=n.kind==='block';d.append(s);
    const cuerpo=document.createElement('div');for(const hijo of n.hijos)cuerpo.append(fila(hijo));d.append(cuerpo);return d;
  };
  for(const b of bloques)arbol.append(fila(b));section.append(arbol);
  expandir.addEventListener('click',()=>arbol.querySelectorAll('details').forEach(d=>d.open=true));
  plegar.addEventListener('click',()=>arbol.querySelectorAll('details').forEach(d=>d.open=false));
  return section;
}
