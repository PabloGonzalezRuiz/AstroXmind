import {generarVista} from './editor-programa.mjs';

// Identidad editorial estable entre convocatorias, distinta de la ocurrencia oficial PROG-01.
const idValido = /^entry-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const modos = {LIBRE:'Libre',PROMOCION_INTERNA:'Promoción interna'};
const entero = n=>Number.isSafeInteger(n)&&n>0;
const texto = s=>typeof s==='string'&&s.trim()!==''&&!/[\r\n]/.test(s);
const fallo = m=>{throw new Error(m);};

// Única fuente estructural: registros planos, sin rutas o códigos derivados.
export function validarEstructura(entradas) {
  if(!Array.isArray(entradas)||!entradas.length)fallo('Estructura vacía.');
  const mapa=new Map(), grupos=new Map();
  for(const e of entradas){
    if(!e||Object.keys(e).some(k=>!['id','parentId','order','title','aliases'].includes(k))||!idValido.test(e.id)||mapa.has(e.id)||!(e.parentId===null||idValido.test(e.parentId))||!entero(e.order)||!texto(e.title)||!Array.isArray(e.aliases)||!e.aliases.every(texto)||new Set(e.aliases).size!==e.aliases.length)fallo('Entrada inválida o ID repetido.');
    mapa.set(e.id,e);const hermanos=grupos.get(e.parentId)??[];hermanos.push(e);grupos.set(e.parentId,hermanos);
  }
  for(const e of entradas)if(e.parentId!==null&&!mapa.has(e.parentId))fallo('Padre inexistente.');
  for(const hermanos of grupos.values()){
    if(new Set(hermanos.map(e=>e.order)).size!==hermanos.length)fallo('Orden duplicado entre hermanos.');
    hermanos.sort((a,b)=>a.order-b.order);
  }
  // Cada cadena alcanza la raíz; rechazar ciclos y profundidad fuera del límite.
  for(const e of entradas){let p=e,visitados=new Set();while(p){if(visitados.has(p.id))fallo('Ciclo en la jerarquía.');visitados.add(p.id);if(visitados.size>29)fallo('Profundidad fuera de rango.');p=p.parentId===null?null:mapa.get(p.parentId);}}
  return {mapa,grupos};
}

// El usuario puede importar un Markdown anidado, pero debe resolver las identidades explícitamente.
// Un ID de otra convocatoria se admite solo si pertenece al catálogo autorizado.
export function crearEstructura(vista,{catalogoIds=[],anteriores=[],asignaciones,crearUuid=()=>globalThis.crypto.randomUUID(),bajasConfirmadas=[],versionStatus='draft'}={}){
  if(versionStatus!=='draft')fallo('Una versión aceptada necesita una revisión nueva.');
  const filas=vista.nodos.filter(n=>n.profundidad>=3);
  if(!Array.isArray(asignaciones)||asignaciones.length!==filas.length)fallo('Identidades sin resolver.');
  if(anteriores.length)validarEstructura(anteriores);
  const previo=new Map(anteriores.map(e=>[e.id,e]));
  const conocidos=new Set([...catalogoIds,...previo.keys()]);
  if([...conocidos].some(id=>!idValido.test(id)))fallo('Catálogo inválido.');
  const usados=new Set(),porFila=new Map();
  const entradas=filas.map((n,i)=>{
    const a=asignaciones[i];if(a!==null&&!conocidos.has(a))fallo('Identidad desconocida.');
    const id=a??`entry-${crearUuid()}`;
    if(!idValido.test(id)||usados.has(id)||(a===null&&conocidos.has(id)))fallo('Identidad inválida o duplicada.');
    usados.add(id);porFila.set(n.fila,id);
    return {id,parentId:porFila.get(n.padreFila)??null,order:n.orden,title:n.titulo,aliases:[...(previo.get(id)?.aliases??[])]};
  });
  if(anteriores.some(e=>!usados.has(e.id)&&!bajasConfirmadas.includes(e.id)))fallo('Baja sin confirmar.');
  validarEstructura(entradas);return entradas;
}

// La representación se calcula de nuevo con reglas independientes, sin mutar entradas.
export function representarEstructura(definicion,entradas,contexto){
  const {grupos}=validarEstructura(entradas);
  if(!texto(contexto?.oppositionTitle)||!Object.hasOwn(modos,contexto.mode))fallo('Contexto inválido.');
  const lineas=[`- ${contexto.oppositionTitle}`,`  - Convocatoria ${contexto.year}`,`    - ${modos[contexto.mode]}`],ordenados=[];
  const recorrer=(padre,nivel)=>{for(const e of grupos.get(padre)??[]){ordenados.push(e);lineas.push(`${'  '.repeat(nivel)}- ${e.title}`);recorrer(e.id,nivel+1);}};
  recorrer(null,3);
  const markdownFuente=lineas.join('\n')+'\n';
  const vista=generarVista(definicion,markdownFuente,contexto);
  const nodos=vista.nodos.filter(n=>n.profundidad>=3).map((n,i)=>({...ordenados[i],displayCode:n.displayCode,kind:n.tipo,depth:n.profundidad}));
  return {markdownFuente,markdown:vista.markdown,nodos};
}

// Cambiar padre y/o orden es la única mutación estructural; validar antes de devolver.
export function moverEntrada(entradas,id,cambio){
  validarEstructura(entradas);if(!entradas.some(e=>e.id===id))fallo('Entrada desconocida.');
  if(!cambio||Object.keys(cambio).some(k=>!['parentId','order'].includes(k)))fallo('Cambio inválido.');
  const copia=entradas.map(e=>({...e,aliases:[...e.aliases]}));
  const nodo=copia.find(e=>e.id===id);
  const padre=cambio.parentId===undefined?nodo.parentId:cambio.parentId;
  const orden=cambio.order===undefined?nodo.order:cambio.order;
  if(!entero(orden))fallo('Orden inválido.');
  const anterior=nodo.parentId, ordenAnterior=nodo.order;
  nodo.parentId=padre;nodo.order=orden;
  const hermanos=copia.filter(e=>e.id!==id&&e.parentId===padre).sort((a,b)=>a.order-b.order);
  const ocupado=hermanos.findIndex(h=>h.order===orden);
  if(ocupado>=0){
    if(anterior===padre){
      const posiciones=[ordenAnterior,...hermanos.map(h=>h.order)].sort((a,b)=>a-b);
      hermanos.splice(ocupado+(ordenAnterior<orden?1:0),0,nodo);
      hermanos.forEach((h,i)=>{h.order=posiciones[i];});
    }else{
      let siguiente=orden;
      for(const h of hermanos)if(h.order===siguiente){h.order=++siguiente;}else if(h.order>siguiente)break;
    }
  }
  validarEstructura(copia);return copia;
}

// Cada entrada es un YAML independiente; la manifestación enumera los ficheros canónicos.
// La proyección visual agregada no se persiste como fuente de identidad.
export function exportarEstructura(entradas,contexto){
  validarEstructura(entradas);
  if(!Number.isInteger(contexto?.year)||contexto.year<1900||contexto.year>2199||!Object.hasOwn(modos,contexto.mode))fallo('Contexto inválido.');
  const registros=Object.fromEntries(entradas.map(e=>[`entradas/${e.id}.yaml`,Object.entries(e).map(([k,v])=>`${k}: ${JSON.stringify(v)}`).join('\n')+'\n']));
  const manifest=`schemaVersion: 1\nyear: ${contexto.year}\nmode: ${JSON.stringify(contexto.mode)}\nentries:\n${Object.keys(registros).sort().map(p=>`  - ${JSON.stringify(p)}`).join('\n')}\n`;
  return {manifest,registros};
}
