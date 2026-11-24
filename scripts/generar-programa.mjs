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

export { validarCobertura } from '../src/lib/programa-edicion.mjs';
import { validarCobertura, exportarProgramaMDBase, aplicarProgramaMDBase } from '../src/lib/programa-edicion.mjs';

export function exportarProgramaMD(modelo,versionId){
  comprobar(modelo);
  return exportarProgramaMDBase(modelo,versionId,huellaTexto(stringify(modelo)));
}
export function aplicarProgramaMD(modelo,versionId,md){
  comprobar(modelo);
  const salida=aplicarProgramaMDBase(modelo,versionId,md,huellaTexto(stringify(modelo)));
  const errores=validarTransicion(modelo,salida);
  if(errores.length)throw Error(errores.join('\n'));
  return salida;
}
export function serializarPrograma(modelo){comprobar(modelo);return stringify(modelo);}
export function leerPrograma(yaml){const m=parse(yaml,{maxAliasCount:0});comprobar(m);return m;}
