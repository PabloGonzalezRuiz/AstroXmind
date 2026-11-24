const compactar=lineas=>lineas.map(l=>l.texto).join(' ');
const paginas=lineas=>[...new Set(lineas.map(l=>l.pagina))];

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
    if(esperada&&(JSON.stringify(f.pages)!==JSON.stringify(paginas(esperada.lineas))||f.text!==compactar(esperada.lineas)))errores.push(n.code+': literal/páginas distintos de la fuente.');
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

const escapar=t=>t.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replace(/([\\`*_\[\]])/g,'\\$1');
const desescapar=t=>t.replace(/\\([\\`*_\[\]])/g,'$1').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&');
export function exportarProgramaMDBase(modelo,versionId,huella){
  if(!modelo.versions.some(v=>v.id===versionId))throw Error('Versión desconocida.');
  const filas=['<!-- astroxmind-programa v1 '+versionId+' '+huella+' -->','','# Programa oficial desglosado',''];
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
export function aplicarProgramaMDBase(modelo,versionId,md,huella){
  const v=modelo.versions.find(v=>v.id===versionId);
  if(v?.status!=='draft')throw Error('Sólo se puede editar una versión en borrador.');
  const lineas=md.replace(/\r\n/g,'\n').split('\n');
  if(lineas.shift()!=='<!-- astroxmind-programa v1 '+versionId+' '+huella+' -->')throw Error('Markdown obsoleto o de otra versión.');
  const salida=structuredClone(modelo), nodos=salida.nodes.filter(n=>n.versionId===versionId), porId=new Map(nodos.map(n=>[n.id,n])), vistos=new Set(), pila=[], contadores=new Map();
  for(const linea of lineas){
    if(!linea.trim()||linea==='# Programa oficial desglosado')continue;
    const m=linea.match(/^( *)- (\d+(?:\.\d+)*) (.+) <!-- (node-[0-9a-f-]+) -->$/u);
    if(!m||m[1].length%2)throw Error('Línea o indentación no válida.');
    const profundidad=m[1].length/2,n=porId.get(m[4]);
    if(!n||vistos.has(n.id)||profundidad>pila.length||profundidad>32)throw Error('ID desconocido, repetido o salto de nivel.');
    const padre=profundidad?pila[profundidad-1]:null, parentId=padre?.id??null;
    const orden=(contadores.get(parentId)??0)+1;contadores.set(parentId,orden);
    if(n.kind!=='section'&&(n.parentId!==parentId||n.order!==orden))throw Error('No se puede cambiar el orden o padre de bloques y temas oficiales.');
    const titulo=desescapar(m[3]);if(!titulo.trim()||titulo.length>4000||/[\r\n]/u.test(titulo))throw Error('Título no válido.');
    if(titulo!==n.title){n.title=titulo;n.titleKind=n.evidence.some(e=>e.quote===titulo)?'literal':'editorial';}
    n.parentId=parentId;n.order=orden;n.code=(padre?padre.code+'.':'')+String(orden).padStart(2,'0');
    vistos.add(n.id);pila.length=profundidad;pila.push(n);
  }
  if(vistos.size!==nodos.length)throw Error('Faltan nodos; no se permite eliminar por edición Markdown.');
  const errores=[];
  // La edición conserva la cobertura íntegra del programa generado.
  errores.push(...validarCobertura(salida,versionId));
  if(errores.length)throw Error(errores.join('\n'));
  return salida;
}
