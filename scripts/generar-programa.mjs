import { randomUUID } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { parse, stringify } from 'yaml';
import { validarPrograma, validarTransicion, huellaTexto } from './validar-programa.mjs';

// La puntuación se conserva en los intervalos; no separar fechas, decimales o abreviaturas.
export function desglosarLiteral(texto, inicio=0, fin=texto.length) {
  const rangos=[]; let comienzo=inicio;
  const recortar=(a,b)=>{while(a<b&&/\s/u.test(texto[a]))a++;while(b>a&&/\s/u.test(texto[b-1]))b--;return[a,b];};
  for(let i=inicio;i<fin;i++){
    if(texto[i]!=='.')continue;
    if(i+1<fin&&!/\s/u.test(texto[i+1]))continue;
    const previo=texto.slice(comienzo,i+1);
    if(/(?:\b(?:art|arts|núm|nº|pág|etc|aprox|Sr|Sra|Dr|Dra|D|Dña|Ud|Uds|p\.ej)\.|(?:^|\s)\p{L}\.)$/iu.test(previo))continue;
    let j=i+1;while(j<fin&&/\s/u.test(texto[j]))j++;
    if(j<fin&&!/[\p{Lu}\d¿¡]/u.test(texto[j]))continue;
    const [a,b]=recortar(comienzo,i+1);if(a<b)rangos.push([a,b]);comienzo=i+1;
  }
  const [a,b]=recortar(comienzo,fin);if(a<b)rangos.push([a,b]);
  return rangos.map(([start,end])=>{
    const literal=texto.slice(start,end), colon=literal.indexOf(':');
    // Un encabezado seguido de dos puntos identifica un grupo; los puntos y coma separan sus hijos.
    const hijos=[];
    if(colon>0&&/\s/u.test(literal[colon+1]??'')&&literal.slice(colon+1).trim()){
      let cursor=start+colon+1;
      for(let i=cursor;i<=end;i++){
        if(i!==end&&texto[i]!==';')continue;
        const [a,b]=recortar(cursor,i===end?end:i+1);if(a<b)hijos.push({start:a,end:b,hijos:[]});cursor=i+1;
      }
    }
    return {start,end,hijos,headingEnd:hijos.length?start+colon+1:end};
  });
}
const comprobar=(m)=>{const e=validarPrograma(m);if(e.length)throw Error(e.join('\n'));};
const cita=(f,start=0,end=f.text.length)=>({fragmentId:f.id,start,end,quote:f.text.slice(start,end)});
const compactar=lineas=>lineas.map(l=>l.texto).join(' ');
const paginas=lineas=>[...new Set(lineas.map(l=>l.pagina))];

// Importación sólo a memoria. La misma fuente ya registrada se conserva intacta:
// no regenerar IDs ni borrar ediciones manuales. Otra fuente exige revisión explícita.
export function generarPrograma(analisis,{oppositionId,year,modalidad,artifactId,sha256,anterior=null,nuevoId=randomUUID}){
  if(!analisis.programaFuente?.length||analisis.destino!==('TAI_'+modalidad)||!analisis.referencia||!analisis.anexo)throw Error('Fuente de programa o modalidad no verificada.');
  if(Number(analisis.publicacion?.slice(0,4))!==Number(year))throw Error('Año no coincide con fuente oficial.');
  const source={reference:analisis.referencia,artifactId,sha256,annex:analisis.anexo};
  const idCall=oppositionId+'-'+year+(modalidad==='PROMOCION_INTERNA'?'-pi':'');
  const modelo=anterior?structuredClone(anterior):{schemaVersion:1,concepts:[],versions:[],fragments:[],nodes:[],questions:[],questionConcepts:[],nodeMappings:[],calls:[]};
  if(anterior)comprobar(anterior);
  const existente=modelo.calls.find(c=>c.id===idCall);
  if(existente){
    const v=modelo.versions.find(v=>v.id===existente.versionId);
    if(!isDeepStrictEqual(v.source,source))throw Error('La convocatoria ya tiene otra fuente; crear revisión explícita.');
    const errores=validarCobertura(modelo,v.id,analisis);
    if(errores.length)throw Error(errores.join('\n'));
    return {modelo,versionId:v.id};
  }
  const iguales=modelo.versions.find(v=>v.oppositionId===oppositionId&&v.modalidad===modalidad&&isDeepStrictEqual(v.source,source));
  if(iguales){
    modelo.calls.push({id:idCall,oppositionId,year,modalidad,versionId:iguales.id});
    comprobar(modelo);return {modelo,versionId:iguales.id};
  }
  const previa=modelo.versions.filter(v=>v.oppositionId===oppositionId&&v.modalidad===modalidad).sort((a,b)=>b.revision-a.revision)[0];
  const id=tipo=>tipo+'-'+nuevoId();
  const versionId=id('syllabus');
  modelo.versions.push({id:versionId,oppositionId,modalidad,revision:(previa?.revision??0)+1,previousVersionId:previa?.id??null,status:'draft',source});
  modelo.calls.push({id:idCall,oppositionId,year,modalidad,versionId});
  const fragmento=(section,lineas)=>{
    if(!Array.isArray(lineas)||!lineas.length||lineas.some(l=>!l.texto||!Number.isInteger(l.pagina)||l.pagina<1))throw Error('Líneas o páginas sin evidencia.');
    const text=compactar(lineas);const f={id:id('frag'),versionId,pages:paginas(lineas),section,text,sha256:huellaTexto(text)};modelo.fragments.push(f);return f;
  };
  const nodo=(parent,order,kind,title,titleKind,evidence)=>{
    const n={id:id('node'),versionId,parentId:parent?.id??null,order,code:(parent?parent.code+'.':'')+String(order).padStart(2,'0'),kind,title,titleKind,evidence,conceptIds:[]};
    modelo.nodes.push(n);return n;
  };
  for(const [bi,b] of analisis.programaFuente.entries()){
    const f=fragmento('Bloque '+b.numero,b.lineas);
    const raiz=nodo(null,bi+1,'block',f.text,'literal',[cita(f)]);
    for(const [ti,t] of b.temas.entries()){
      const tf=fragmento('Bloque '+b.numero+' · Tema '+t.numero,t.lineas);
      const prefijo=tf.text.match(/^\d+\.\s+/u);
      if(!prefijo||Number(prefijo[0].match(/\d+/)[0])!==t.numero)throw Error('Numeración oficial de tema no coincide.');
      const rangos=desglosarLiteral(tf.text,prefijo[0].length);
      if(!rangos.length)throw Error('Tema sin contenido.');
      const etiqueta=cita(tf,rangos[0].start,rangos[0].headingEnd);
      const tema=nodo(raiz,ti+1,'topic',etiqueta.quote,'literal',[cita(tf),etiqueta]);
      for(const [i,r] of rangos.entries()){
        const e=cita(tf,r.start,r.end), titulo=cita(tf,r.start,r.headingEnd);
        const seccion=nodo(tema,i+1,'section',titulo.quote,'literal',r.headingEnd===r.end?[e]:[e,titulo]);
        for(const [j,h] of r.hijos.entries()){const x=cita(tf,h.start,h.end);nodo(seccion,j+1,'section',x.quote,'literal',[x]);}
      }
    }
  }
  comprobar(modelo);
  const errores=validarCobertura(modelo,versionId,analisis);
  if(errores.length)throw Error(errores.join('\n'));
  if(anterior){const e=validarTransicion(anterior,modelo);if(e.length)throw Error(e.join('\n'));}
  return {modelo,versionId};
}

export function validarCobertura(modelo,versionId,analisis=null){
  const errores=[], nodos=modelo.nodes.filter(n=>n.versionId===versionId), fs=modelo.fragments.filter(f=>f.versionId===versionId), porId=new Map(fs.map(f=>[f.id,f]));
  const hijos=id=>nodos.filter(n=>n.parentId===id).sort((a,b)=>a.order-b.order);
  const raices=hijos(null), usados=new Set();
  if(analisis&&raices.length!==analisis.programaFuente.length)errores.push('Número de bloques distinto de la fuente.');
  function fuente(n,esperada){
    const e=n.evidence.find(e=>{const f=porId.get(e.fragmentId);return f&&e.start===0&&e.end===f.text.length;});
    const f=e&&porId.get(e.fragmentId);
    if(!f||usados.has(f.id)){errores.push(n.code+': fragmento completo inexistente o repetido.');return null;}
    usados.add(f.id);
    if(esperada&&(!isDeepStrictEqual(f.pages,paginas(esperada.lineas))||f.text!==compactar(esperada.lineas)))errores.push(n.code+': literal/páginas distintos de la fuente.');
    return f;
  }
  for(const [bi,b] of raices.entries()){
    const ref=analisis?.programaFuente[bi];fuente(b,ref);
    const temas=hijos(b.id);
    if(ref&&temas.length!==ref.temas.length)errores.push(b.code+': número de temas distinto de la fuente.');
    for(const [ti,t] of temas.entries()){
      const f=fuente(t,ref?.temas[ti]);if(!f)continue;
      const inicio=f.text.match(/^\d+\.\s+/u)?.[0].length;
      if(!inicio){errores.push(t.code+': falta numeración literal del tema.');continue;}
      const cobertura=new Uint8Array(f.text.length), pendientes=[...hijos(t.id)], vistos=new Set();
      while(pendientes.length){
        const n=pendientes.pop();if(vistos.has(n.id)){errores.push(t.code+': ciclo.');break;}vistos.add(n.id);
        for(const e of n.evidence){
          if(e.fragmentId!==f.id||e.start<inicio||e.end>f.text.length||f.text.slice(e.start,e.end)!==e.quote){errores.push(n.code+': evidencia ajena al tema.');continue;}
          cobertura.fill(1,e.start,e.end);
        }
        pendientes.push(...hijos(n.id));
      }
      for(let i=inicio;i<f.text.length;i++)if(!cobertura[i]&&!/\s/u.test(f.text[i])){errores.push(t.code+': texto oficial sin desglose en posición '+i+'.');break;}
    }
  }
  if(usados.size!==fs.length)errores.push('Existen fragmentos sin bloque o tema único.');
  return errores;
}

const tokenModelo=m=>huellaTexto(stringify(m));
const escapar=t=>t.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replace(/([\\`*_\[\]])/g,'\\$1');
const desescapar=t=>t.replace(/\\([\\`*_\[\]])/g,'$1').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&');
export function exportarProgramaMD(modelo,versionId){
  comprobar(modelo);
  if(!modelo.versions.some(v=>v.id===versionId))throw Error('Versión desconocida.');
  const filas=['<!-- astroxmind-programa v1 '+versionId+' '+tokenModelo(modelo)+' -->','','# Programa oficial desglosado',''];
  const nodos=modelo.nodes.filter(n=>n.versionId===versionId);
  const recorrido=(parent,depth)=>{
    for(const n of nodos.filter(n=>n.parentId===parent).sort((a,b)=>a.order-b.order)){
      if(/[\r\n]/u.test(n.title))throw Error('Título multilínea no admitido.');
      filas.push('  '.repeat(depth)+'- '+n.code+' '+escapar(n.title)+' <!-- '+n.id+' -->');
      recorrido(n.id,depth+1);
    }
  };
  recorrido(null,0);return filas.join('\n')+'\n';
}

// El MD sólo edita títulos y jerarquía de apartados, no la fuente ni IDs.
// Mantener el bloque/tema oficial y conservar cada nodo; altas/bajas explícitas quedan para otra operación.
export function aplicarProgramaMD(modelo,versionId,md){
  comprobar(modelo);
  const v=modelo.versions.find(v=>v.id===versionId);
  if(v?.status!=='draft')throw Error('Sólo se puede editar una versión en borrador.');
  const lineas=md.replace(/\r\n/g,'\n').split('\n');
  if(lineas.shift()!=='<!-- astroxmind-programa v1 '+versionId+' '+tokenModelo(modelo)+' -->')throw Error('Markdown obsoleto o de otra versión.');
  const salida=structuredClone(modelo), nodos=salida.nodes.filter(n=>n.versionId===versionId), porId=new Map(nodos.map(n=>[n.id,n])), vistos=new Set(), pila=[], contadores=new Map();
  for(const linea of lineas){
    if(!linea.trim()||linea==='# Programa oficial desglosado')continue;
    const m=linea.match(/^( *)- (\d+(?:\.\d+)*) (.+) <!-- (node-[0-9a-f-]+) -->$/u);
    if(!m||m[1].length%2)throw Error('Línea o indentación no válida.');
    const profundidad=m[1].length/2,n=porId.get(m[4]);
    if(!n||vistos.has(n.id)||profundidad>pila.length)throw Error('ID desconocido, repetido o salto de nivel.');
    const padre=profundidad?pila[profundidad-1]:null, parentId=padre?.id??null;
    const orden=(contadores.get(parentId)??0)+1;contadores.set(parentId,orden);
    if(n.kind!=='section'&&(n.parentId!==parentId||n.order!==orden))throw Error('No se puede cambiar el orden o padre de bloques y temas oficiales.');
    const titulo=desescapar(m[3]);if(!titulo.trim()||/[\r\n]/u.test(titulo))throw Error('Título no válido.');
    if(titulo!==n.title){n.title=titulo;n.titleKind=n.evidence.some(e=>e.quote===titulo)?'literal':'editorial';}
    n.parentId=parentId;n.order=orden;n.code=(padre?padre.code+'.':'')+String(orden).padStart(2,'0');
    vistos.add(n.id);pila.length=profundidad;pila.push(n);
  }
  if(vistos.size!==nodos.length)throw Error('Faltan nodos; no se permite eliminar por edición Markdown.');
  const errores=validarTransicion(modelo,salida);
  // La edición conserva la cobertura íntegra del programa generado.
  errores.push(...validarCobertura(salida,versionId));
  if(errores.length)throw Error(errores.join('\n'));
  return salida;
}
export function serializarPrograma(modelo){comprobar(modelo);return stringify(modelo);}
export function leerPrograma(yaml){const m=parse(yaml,{maxAliasCount:0});comprobar(m);return m;}
