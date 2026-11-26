import { proyectar } from './editor-v2.mjs';
import { reconciliarV2 } from './editor-identidad.mjs';
import { validarEstructura } from './editor-estructura.mjs';

const exigir=(ok,m)=>{if(!ok)throw Error(m);};
const hashPat=/^[a-f0-9]{64}$/;
const uuid='[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}';
const entradaPat=new RegExp(`^entry-${uuid}$`);
const versionPat=new RegExp(`^syllabus-${uuid}$`);
// JSON estricto es un subconjunto de YAML 1.2; escritura determinista y sin alias de YAML ejecutables.
const yaml=v=>JSON.stringify(v,null,2)+'\n';
const leer=s=>JSON.parse(s);
const sha=async texto=>Array.from(new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256',new TextEncoder().encode(texto))),x=>x.toString(16).padStart(2,'0')).join('');
const fijos=['plantilla.yaml','autor.md','correspondencias.yaml','indice.yaml'];
const nombreEntrada=id=>`entradas/${id}.yaml`;
function validarContexto(c){
 exigir(c&&typeof c.callId==='string'&&c.callId.length>0&&versionPat.test(c.versionId)&&hashPat.test(c.huellaOficial),'Contexto oficial inválido.');
 return {callId:c.callId,versionId:c.versionId,huellaOficial:c.huellaOficial};
}
function plantilla(p){
 exigir(p&&typeof p.id==='string'&&/^[a-z0-9-]{1,100}$/.test(p.id)&&Number.isSafeInteger(p.revision)&&p.revision>0&&typeof p.reglas==='string'&&p.reglas.length>0&&p.reglas.length<=50000,'Plantilla inválida.');
 return {id:p.id,revision:p.revision,reglas:p.reglas};
}
function derivar(p,md,entradas){
 const {grupos}=validarEstructura(entradas), ns=proyectar(p.reglas,md).slice(1), mapa=new Map();
 return ns.map((n,i)=>{const e=entradas[i];mapa.set(e.id,e);const ruta=[];for(let a=e;a;a=mapa.get(a.parentId))ruta.unshift(a.id);return {id:e.id,padre:e.parentId,hijos:(grupos.get(e.id)??[]).map(h=>h.id),ruta,codigo:n.codigo,tipo:n.tipo};});
}
function validarCorrespondencias(correspondencias,idsOficiales){
 exigir(Array.isArray(idsOficiales)&&idsOficiales.length>0&&new Set(idsOficiales).size===idsOficiales.length,'Inventario oficial inválido.');
 const ids=new Set(correspondencias.map(x=>x.nodeId));
 exigir(ids.size===idsOficiales.length&&idsOficiales.every(id=>ids.has(id)),'La correspondencia no cubre exactamente el inventario oficial.');
}
export async function prepararRevisionEditor({contexto,plantilla:config,markdown,correspondencias,idsOficiales,anterior=null,altasConfirmadas=[],bajasConfirmadas=[]}){
 const c=validarContexto(contexto), p=plantilla(config);
 exigir(typeof markdown==='string'&&markdown.length<=500000,'Markdown inválido.');
 exigir(!anterior||yaml(anterior.contexto)===yaml(c),'El programa oficial ha cambiado; revisar antes de editar.');
 validarCorrespondencias(correspondencias,idsOficiales);
 if(anterior){
   const prev=new Map(anterior.correspondencias.map(x=>[x.nodeId,x.entryId]));
   exigir(correspondencias.every(x=>prev.get(x.nodeId)===x.entryId),'No se puede reasignar una ocurrencia oficial en una revisión editorial.');
 }
 const datos=reconciliarV2(p.reglas,markdown,{correspondencias,anteriores:anterior?.entradas??[],altasConfirmadas,bajasConfirmadas});
 const archivos={'plantilla.yaml':yaml(p),'autor.md':markdown,'correspondencias.yaml':yaml(datos.correspondencias),'indice.yaml':yaml(derivar(p,markdown,datos.entradas))};
 exigir(datos.entradas.length<=10000,'Demasiadas entradas.');
 for(const e of datos.entradas)archivos[nombreEntrada(e.id)]=yaml(e);
 const inventario=await Promise.all(Object.keys(archivos).sort().map(async ruta=>({ruta,sha256:await sha(archivos[ruta])})));
 const manifiesto={schemaVersion:1,contexto:c,anterior:anterior?.revision??null,entradas:datos.entradas.map(e=>e.id),inventario};
 const contenido=yaml(manifiesto),revision=await sha(contenido);
 return {revision,archivos:{...archivos,'manifiesto.yaml':contenido},puntero:yaml({schemaVersion:1,revision})};
}
export function leerPuntero(texto){
 const p=leer(texto);exigir(p?.schemaVersion===1&&hashPat.test(p.revision)&&Object.keys(p).length===2,'Puntero inválido.');return p.revision;
}
export async function abrirRevisionEditor(revision,obtener,{contexto,idsOficiales}){
 const c=validarContexto(contexto);exigir(hashPat.test(revision),'Revisión inválida.');
 const contenido=await obtener('manifiesto.yaml');exigir(typeof contenido==='string'&&await sha(contenido)===revision,'Manifiesto alterado.');
 const m=leer(contenido);exigir(m.schemaVersion===1&&yaml(m.contexto)===yaml(c)&&(m.anterior===null||hashPat.test(m.anterior))&&Array.isArray(m.entradas)&&m.entradas.length>0&&m.entradas.length<=10000&&m.entradas.every(id=>entradaPat.test(id))&&new Set(m.entradas).size===m.entradas.length,'Manifiesto incompatible.');
 const rutas=[...fijos,...m.entradas.map(nombreEntrada)].sort();
 exigir(Array.isArray(m.inventario)&&m.inventario.length===rutas.length&&m.inventario.every((f,i)=>f.ruta===rutas[i]&&hashPat.test(f.sha256)),'Inventario no válido.');
 const archivos={};for(let i=0;i<m.inventario.length;i+=8)await Promise.all(m.inventario.slice(i,i+8).map(async f=>{const t=await obtener(f.ruta);exigir(typeof t==='string'&&await sha(t)===f.sha256,'Archivo ausente o alterado: '+f.ruta);archivos[f.ruta]=t;}));
 const p=plantilla(leer(archivos['plantilla.yaml'])),markdown=archivos['autor.md'],correspondencias=leer(archivos['correspondencias.yaml']);
 const entradas=m.entradas.map(id=>leer(archivos[nombreEntrada(id)]));validarEstructura(entradas);validarCorrespondencias(correspondencias,idsOficiales);
 const reconciliado=reconciliarV2(p.reglas,markdown,{correspondencias,anteriores:entradas});
 exigir(yaml(reconciliado.entradas)===yaml(entradas)&&yaml(reconciliado.correspondencias)===yaml(correspondencias),'Autoría y estructura no coinciden.');
 const indice=derivar(p,markdown,entradas);exigir(yaml(indice)===archivos['indice.yaml'],'Índice derivado divergente.');
 return {revision,anterior:m.anterior,contexto:c,plantilla:p,markdown,correspondencias,entradas,indice};
}
