import {stringify} from 'yaml';
import {abrirCatalogoConocimiento,rutaCatalogo} from './almacen-conocimiento.mjs';

const uuid=n=>`00000000-0000-4000-8000-${String(n).padStart(12,'0')}`;
const doc=n=>'doc-'+uuid(n),op='op-'+uuid(90);
export const convocatoriasDemo=[2025,2098,2099].map(anio=>({id:`${op}-${anio}`,nombre:`TAI ${anio} · FICTICIA`}));
const [a,b,c]=convocatoriasDemo.map(x=>x.id);
const p=(id,call,padre,orden,alias)=>({aparicionId:id,convocatoriaId:call,versionId:'v1',padreAparicionId:padre,orden,alias});
const datos=[
 {id:doc(1),titulo:'Oposición de prueba',pertenencias:[p('ra',a,null,0,'TAI 2025'),p('rb',b,null,0,'TAI 2098'),p('rc',c,null,0,'TAI 2099')]},
 {id:doc(2),titulo:'Bases de datos',pertenencias:[p('ba',a,'ra',1,'Bases de datos'),p('bc',c,'rc',1,'Datos')],referencias:[doc(4)]},
 {id:doc(3),titulo:'Desarrollo',pertenencias:[p('db',b,'rb',1,'Desarrollo')]},
 {id:doc(4),titulo:'SQL',pertenencias:[p('sa',a,'ba',1,'SQL'),p('sb',b,'db',1,'SQL práctico'),p('sc',c,'bc',1,'Lenguaje SQL')],conceptos:['concept-sql']},
 {id:doc(5),titulo:'Redes',pertenencias:[p('na',a,'ra',2,'Redes'),p('nb',b,'rb',2,'Comunicaciones')]},
 {id:doc(6),titulo:'Tema exclusivo 2025',pertenencias:[p('xa',a,'ra',3,'Exclusivo')]}
];
const key='astroxmind:idx-laboratorio:v1';
export function crearAlmacenLaboratorio(storage){
 const inicial=()=>({generacion:globalThis.crypto.randomUUID(),revision:0,archivos:Object.fromEntries([[rutaCatalogo,stringify({schemaVersion:1,documentos:datos.map(d=>d.id)})],...datos.map(d=>[`Conocimiento/Documentos/${d.id}/metadatos.yaml`,stringify({...d,schemaVersion:1})])])});
 const leer=()=>{const s=storage.getItem(key);if(s!==null)return JSON.parse(s);const nuevo=inicial();storage.setItem(key,JSON.stringify(nuevo));return nuevo;};
 return Object.freeze({
  reset(){storage.removeItem(key);},
  async abrir(){const s=leer();return abrirCatalogoConocimiento({revision:String(s.revision),leerArchivo:async ruta=>s.archivos[ruta]??null,generarId:()=>uuid(100+s.revision),guardar:async cambios=>{
    const actual=leer();if(actual.generacion!==s.generacion||actual.revision!==s.revision)throw Error('Otra pestaña modificó el laboratorio.');
    const archivos={...actual.archivos};for(const c of cambios)archivos[c.ruta]=c.yaml;
    storage.setItem(key,JSON.stringify({generacion:actual.generacion,revision:actual.revision+1,archivos}));return String(actual.revision+1);
  }});}
 });
}

export function instalarLaboratorioIndice(root,storage){
 const w=root.ownerDocument.defaultView,document=root.ownerDocument,q=s=>root.querySelector(s),almacen=crearAlmacenLaboratorio(storage);
 const cards=q('[data-cards]'),arbol=q('[data-arbol]'),tabla=q('[data-docs]'),estado=q('[data-estado]'),impacto=q('[data-impacto]'),confirmar=q('[data-confirmar]');
 let actual,seleccion=a,plan=null,ocupado=false;
 const nodo=(tag,txt)=>{const el=document.createElement(tag);el.textContent=txt;return el;};
 function render(){
   cards.replaceChildren();arbol.replaceChildren();tabla.replaceChildren();plan=null;confirmar.disabled=true;impacto.textContent='Selecciona una convocatoria y simula una operación.';
   const indice=actual.indice;
   for(const c of convocatoriasDemo){const n=indice.documentosDeConvocatoria(c.id).length,b=nodo('button',`${c.nombre} · ${n?`${n} documentos`:'Retirada'}`);b.type='button';b.setAttribute('aria-pressed',String(c.id===seleccion));b.addEventListener('click',()=>{if(!ocupado){seleccion=c.id;render();}});cards.append(b);}
   const ids=indice.documentosDeConvocatoria(seleccion);q('[data-operacion]').textContent=ids.length?'Simular retirada':'Simular restauración';
   q('[data-resumen]').textContent=`${indice.totalDocumentos} documentos únicos · revisión ${indice.revision}`;
   if(ids.length){const a=indice.arbol(seleccion,'v1');function rama(n){const li=nodo('li',n.alias),h=a.hijos(n.aparicionId);if(h.length){const ul=nodo('ul','');ul.append(...h.map(rama));li.append(ul);}return li;}arbol.append(rama(a.raiz));}else arbol.append(nodo('li','Convocatoria retirada; contenido conservado.'));
   for(const d of datos){const tr=nodo('tr',''),doc=indice.documento(d.id);tr.append(nodo('td',doc.titulo),nodo('td',String(doc.pertenencias.length)),nodo('td',convocatoriasDemo.filter(c=>doc.pertenencias.some(p=>p.convocatoriaId===c.id)).map(c=>c.nombre).join(', ')||'Sin pertenencia activa'),nodo('td',String(indice.referenciasEntrantes(d.id).length)));tabla.append(tr);}
 }
 async function cargar(){actual=await almacen.abrir();render();}
 async function ejecutar(fn){if(ocupado)return;ocupado=true;try{await fn();}catch(e){estado.textContent=e.message;plan=null;confirmar.disabled=true;}finally{ocupado=false;}}
 q('[data-operacion]').addEventListener('click',()=>void ejecutar(async()=>{
   const tipo=actual.indice.documentosDeConvocatoria(seleccion).length?'retirar':'restaurar';const r=await actual[tipo](seleccion,{revisionEsperada:actual.indice.revision});plan={tipo,call:seleccion,revision:actual.indice.revision};
   impacto.textContent=`${r.plan.documentosAfectados} documentos afectados · ${r.plan.aparicionesRetiradas??r.plan.aparicionesRestauradas} pertenencias · 0 documentos eliminados`;confirmar.disabled=false;estado.textContent='Simulación: no se han guardado cambios.';
 }));
 confirmar.addEventListener('click',()=>void ejecutar(async()=>{if(!plan)return;const p=plan;confirmar.disabled=true;const r=await actual[p.tipo](p.call,{revisionEsperada:p.revision,confirmado:true});await cargar();estado.textContent=`Operación confirmada en el laboratorio · revisión ${r.revision}.`;}));
 q('[data-reset]').addEventListener('click',()=>void ejecutar(async()=>{if(w.confirm('¿Reiniciar únicamente el catálogo ficticio de este navegador?')){almacen.reset();await cargar();estado.textContent='Laboratorio reiniciado.';}}));
 return ejecutar(cargar);
}
