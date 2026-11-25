import { generarVista } from './editor-programa.mjs';
import { crearEstructura, representarEstructura, moverEntrada, exportarEstructura } from './editor-estructura.mjs';
import { installEditorKeys } from './wiki-editor-keys.mjs';

const contexto={year:2025,mode:'LIBRE',oppositionTitle:'Oposición ficticia'};
const reglasIniciales=`- oposicion [numeracion=ninguna]
  - convocatoria [prefijo=CNV numeracion=anio]
    - modalidad [numeracion=ninguna]
      - bloque [prefijo=BK numeracion=romana]
        - tema [prefijo=T numeracion=decimal ancho=2]
          - subtema [prefijo=SB numeracion=decimal ancho=2 repetir=true]`;
const mdInicial=`- Oposición ficticia
  - Convocatoria 2025
    - Libre
      - Bloque A
        - Tema A
          - Apartado A
          - Apartado B
        - Tema B`;

export function instalarEditorED03(root){
  if(!root)return;
  const doc=root.ownerDocument,w=doc.defaultView,q=s=>root.querySelector(s);
  const reglas=q('[data-ed-reglas]'),md=q('[data-ed-md]'),arbol=q('[data-ed-tree]'),estado=q('[data-ed-status]');
  const identidad=q('[data-ed-identidades]'),mapping=q('[data-ed-mapping]'),bajas=q('[data-ed-bajas]'),guardar=q('[data-ed-save]');
  reglas.value=reglasIniciales;md.value=mdInicial;
  installEditorKeys(reglas);installEditorKeys(md);
  const inicial=generarVista(reglas.value,md.value,contexto);
  let entradas=crearEstructura(inicial,{asignaciones:inicial.nodos.filter(n=>n.profundidad>=3).map(()=>null),crearUuid:()=>w.crypto.randomUUID()});
  let fuente=md.value,vista=null,guardado=JSON.stringify([reglas.value,md.value,entradas]);
  const dirty=()=>guardado!==JSON.stringify([reglas.value,md.value,entradas]);
  function render(){
    try{
      vista=generarVista(reglas.value,md.value,contexto);arbol.replaceChildren();
      const resuelto=md.value===fuente;
      const representacion=resuelto?representarEstructura(reglas.value,entradas,contexto):null;
      identidad.hidden=resuelto;guardar.disabled=!resuelto;
      const porFila=new Map(),lista=doc.createElement('ul');arbol.append(lista);
      for(const n of vista.nodos){
        const li=doc.createElement('li'),label=doc.createElement('span');label.textContent=(n.displayCode?n.displayCode+' · ':'')+n.titulo;li.append(label);
        const hijos=doc.createElement('ul');li.append(hijos);(porFila.get(n.padreFila)||lista).append(li);porFila.set(n.fila,hijos);
        if(resuelto&&n.profundidad>=3){
          const e=representacion.nodos[n.fila-3];
          const hermanos=entradas.filter(x=>x.parentId===e.parentId).sort((a,b)=>a.order-b.order),i=hermanos.findIndex(x=>x.id===e.id);
          for(const [texto,vecino] of [['↑',hermanos[i-1]],['↓',hermanos[i+1]]])if(vecino){const b=doc.createElement('button');b.textContent=texto;b.setAttribute('aria-label',texto==='↑'?'Subir '+e.title:'Bajar '+e.title);b.addEventListener('click',()=>{const candidato=moverEntrada(entradas,e.id,{order:vecino.order});fuente=representarEstructura(reglas.value,candidato,contexto).markdownFuente;entradas=candidato;md.value=fuente;render();});li.append(b);}
        }
      }
      mapping.replaceChildren();bajas.checked=false;
      if(!resuelto)for(const n of vista.nodos.filter(n=>n.profundidad>=3)){
        const label=doc.createElement('label'),sel=doc.createElement('select');label.textContent=n.titulo+' ';
        for(const [value,text] of [['','Sin resolver'],['nuevo','Crear ID nuevo'],...entradas.map(e=>[e.id,e.title+' · '+e.id.slice(-8)])]){const o=doc.createElement('option');o.value=value;o.textContent=text;sel.append(o);}label.append(sel);mapping.append(label);
      }
      estado.textContent=resuelto?'Vista válida. '+(dirty()?'Cambios sin guardar.':'Sin cambios.'):'Vista válida; identidades pendientes. Guardado bloqueado.';
    }catch(e){vista=null;guardar.disabled=true;identidad.hidden=true;arbol.replaceChildren();estado.textContent=e.message;}
  }
  q('[data-ed-resolver]').addEventListener('click',()=>{try{const a=[...mapping.querySelectorAll('select')].map(s=>s.value);if(a.includes(''))throw Error('Resuelve todas las identidades.');entradas=crearEstructura(vista,{anteriores:entradas,asignaciones:a.map(x=>x==='nuevo'?null:x),bajasConfirmadas:bajas.checked?entradas.map(e=>e.id):[],crearUuid:()=>w.crypto.randomUUID()});fuente=md.value;render();}catch(e){estado.textContent=e.message;}});
  reglas.addEventListener('input',render);md.addEventListener('input',render);
  q('[data-ed-copy]').addEventListener('click',async()=>{if(!vista)return;try{await w.navigator.clipboard.writeText(vista.markdown);estado.textContent='Markdown generado copiado.';}catch{estado.textContent='No se pudo copiar.';}});
  guardar.addEventListener('click',()=>{if(!vista||md.value!==fuente)return;const archivo=exportarEstructura(entradas,contexto),blob=new w.Blob([JSON.stringify({reglas:reglas.value,markdown:md.value,...archivo},null,2)],{type:'application/json'}),url=w.URL.createObjectURL(blob),a=doc.createElement('a');a.href=url;a.download='ed03-borrador-ficticio.json';a.click();w.URL.revokeObjectURL(url);guardado=JSON.stringify([reglas.value,md.value,entradas]);estado.textContent='Borrador ficticio exportado; no se ha escrito en GitHub.';});
  q('[data-ed-close]').addEventListener('click',()=>{if(!dirty()||w.confirm('¿Cerrar sin guardar los cambios?'))w.close();});
  w.addEventListener('beforeunload',e=>{if(dirty()){e.preventDefault();e.returnValue='';}});
  render();
}
