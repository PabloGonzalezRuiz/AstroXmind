export const reglasIniciales = `- convocatoria [oposicion=TAI modalidad=LBR año=2025]
  - bloque [prefijo=Bq numeracion=romana]
    - tema [prefijo=Tm numeracion=decimal ancho=2 heredar=1]
      - subtema [prefijo=Stm numeracion=decimal ancho=2 repetir=true heredar=0]
        - apartado [prefijo=APT numeracion=decimal heredar=1 repetir=true]`;
export const plantillas = [{id:"oposiciones",nombre:"Oposiciones · predeterminada",reglas: reglasIniciales, importacion: ["convocatoria","bloque","tema","apartado"]}];
export const mdInicial = `- Técnicos Auxiliares de Informática [Convocatoria] [id=00000000-0000-4000-8000-000000000008]
  - Nombre bloque[Bloque] [id=00000000-0000-4000-8000-000000000002]
    - Nombre tema[Tema] [id=00000000-0000-4000-8000-000000000003]
      - Nombre subtema[Subtema] [id=00000000-0000-4000-8000-000000000004]
      - Nombre apartado[Apartado] [id=00000000-0000-4000-8000-000000000005]
    - Nombre tema[Tema] [id=00000000-0000-4000-8000-000000000006]
      - Nombre apartado[Apartado] [id=00000000-0000-4000-8000-000000000007]`;

const normalizar = s => s.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase();
function grupos(texto, fila) {
  const partes = [...texto.matchAll(/\[([^\[\]]+)\]/g)];
  const titulo = texto.replace(/\s*\[[^\[\]]+\]/g,'').trim();
  const props = Object.create(null);
  let tipo;
  for (const parte of partes) {
    const tokens = parte[1].match(/(?:[^\s"']|"[^"]*"|'[^']*')+/g) || [];
    for (const token of tokens) {
      const i = token.indexOf('=');
      if (i < 0) {
        if (tipo) throw Error('Línea '+fila+': más de un tipo.');
        tipo = normalizar(token);
      } else {
        const clave = normalizar(token.slice(0,i));
        props[clave] = token.slice(i+1).replace(/^["']|["']$/g,'');
      }
    }
  }
  if (!titulo || /[\[\]]/.test(titulo)) throw Error('Línea '+fila+': título o corchetes incorrectos.');
  return {titulo,tipo,props};
}
function lineas(texto) {
  return texto.split(/\r?\n/).flatMap((linea,i)=>{
    if (!linea.trim()) return [];
    const m = linea.match(/^( *)-\s+(.+)$/);
    if (!m || m[1].length%2) throw Error('Línea '+(i+1)+': usa guion y sangría de dos espacios.');
    return [{...grupos(m[2],i+1),nivel:m[1].length/2,fila:i+1}];
  });
}
function romano(n) {
  let resultado='';
  for (const [v,s] of [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']]) {
    while(n>=v){resultado+=s;n-=v;}
  }
  return resultado;
}
export function proyectar(reglas, markdown) {
  const estilos = new Map();
  for (const r of lineas(reglas)) {
    const tipo=normalizar(r.titulo);
    if (estilos.has(tipo)) throw Error('Tipo duplicado: '+r.titulo);
    estilos.set(tipo,r.props);
  }
  const nodos=[], pila=[], contadores=new Map(), ids=new Set();
  for (const n of lineas(markdown)) {
    if (!n.tipo || !estilos.has(n.tipo)) throw Error('Línea '+n.fila+': indica un tipo definido entre corchetes.');
    if(n.nivel>pila.length) throw Error('Línea '+n.fila+': salto de sangría.');
    pila.length=n.nivel;
    const padre=pila.at(-1);
    const p={...estilos.get(n.tipo),...n.props};
    const id=n.props.id??null;
    if(id && !/^(?:node-)?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) throw Error('ID inválido en línea '+n.fila);
    if(id && ids.has(id.toLowerCase())) throw Error('ID duplicado: '+id);
    if(id) ids.add(id.toLowerCase());
    const modo=p.numeracion||'ninguna';
    if(!['ninguna','decimal','romana'].includes(modo)) throw Error('Numeración desconocida: '+modo);
    const h=p.heredar??'0';
    if(h!=='todo'&&!/^\d+$/.test(h)) throw Error('heredar debe ser 0, un entero positivo o todo.');
    const ancho=Number(p.ancho??1);
    if(!Number.isInteger(ancho)||ancho<1||ancho>12) throw Error('ancho debe estar entre 1 y 12.');
    const clave=(padre?.fila??0)+':'+n.tipo;
    let segmento='';
    if(modo!=='ninguna'){
      const ordinal=(contadores.get(clave)||0)+1;
      contadores.set(clave,ordinal);
      segmento=modo==='romana'?romano(ordinal):String(ordinal).padStart(ancho,'0');
    }
    const anteriores=pila.map(x=>x.segmento).filter(Boolean);
    const heredados=h==='todo'?anteriores:Number(h)?anteriores.slice(-Number(h)):[];
    const numero=segmento?[...heredados,segmento].join(p.separador??'.'):'';
    const codigo=[p.prefijo||'',numero].filter(Boolean).join('');
    const nodo={...n,metaAnio:n.props.anio??n.props.ano,props:p,segmento,numero,codigo,id,padreId:padre?.id??null,padreFila:padre?.fila??null};
    nodos.push(nodo);pila.push(nodo);
  }
  return nodos;
}

// Solo asigna identidades ausentes; nunca deriva IDs del texto, ruta o posición.
export function completarIds(reglas, markdown, generar=()=>globalThis.crypto.randomUUID()) {
  const nodos=proyectar(reglas,markdown), filas=markdown.split(/\r?\n/);
  for(const n of nodos) if(!n.id) filas[n.fila-1]+=' [id='+generar()+']';
  const resultado=filas.join('\n'); proyectar(reglas,resultado); return resultado;
}
export function rutaPorId(nodos,id){
  const indice=new Map(nodos.filter(n=>n.id).map(n=>[n.id,n]));
  if(!indice.has(id)) throw Error('ID desconocido: '+id);
  const ruta=[]; for(let n=indice.get(id);n;n=indice.get(n.padreId)) ruta.unshift(n);
  return ruta;
}

// Importación inicial: la profundidad determina el tipo solo si no se indicó uno.
// Se excluye subtema de la importación oficial; los niveles adicionales son editoriales.
export function clasificarPorProfundidad(reglas,markdown,perfil=plantillas[0].importacion){
  const estilos=new Set(lineas(reglas).map(r=>normalizar(r.titulo)));
  const filas=markdown.split(/\r?\n/); let anterior=-1;
  for(const n of lineas(markdown)){
    if(n.nivel>anterior+1) throw Error('Línea '+n.fila+': salto de sangría.');
    anterior=n.nivel;
    if(n.tipo) continue;
    const tipo=perfil[n.nivel];
    if(!tipo||!estilos.has(tipo)) throw Error('Línea '+n.fila+': asigna el tipo manualmente (fuera del perfil inicial).');
    filas[n.fila-1]+=' ['+tipo+']';
  }
  const salida=filas.join('\n'); proyectar(reglas,salida); return salida;
}
// El borrador estructurado oficial ya tiene IDs: no se generan otros ni se reinterpreta el título.
export function markdownOficialConTipos(bloques, contexto){
  const {oposicion,convocatoria,modalidad,aliasOposicion,aliasModalidad,id}=contexto??{};
  if([oposicion,convocatoria,modalidad].some(x=>typeof x!=='string'||!x.trim())) throw Error('Falta contexto oficial.');
  const year=convocatoria.match(/\b(?:19|20|21)\d{2}\b/)?.[0];
  if(!year) throw Error('Falta año oficial.');
  const valor=x=>{if(/["'\[\]\r\n]/.test(x)) throw Error('Metadato incompatible con Markdown.');return '"'+x+'"';};
  const aliasModo=aliasModalidad??(normalizar(modalidad)==='libre'?'LBR':modalidad);
  const lineasMd=['- '+oposicion+' [Convocatoria oposicion='+valor(aliasOposicion??oposicion)+' modalidad='+valor(aliasModo)+' año='+year+']'+(id?' [id='+id+']':'')];
  function visitar(ns,nivel){
    const tipo=['Bloque','Tema','Apartado'][nivel-1];
    if(!tipo) throw Error('Profundidad oficial fuera del perfil inicial.');
    for(const n of ns){
      if(n.kind!==['block','topic','section'][nivel-1]||!n.id) throw Error('Nodo oficial incompatible con el perfil.');
      lineasMd.push('  '.repeat(nivel)+'- '+n.title+' ['+tipo+'] [id='+n.id+']');
      if(n.hijos?.length) visitar(n.hijos,nivel+1);
    }
  }
  visitar(bloques,1);const md=lineasMd.join('\n'); proyectar(reglasIniciales,md); return md;
}

// La identidad y la numeración de los nodos no dependen de la cabecera de presentación.
export function cabecerasConvocatoria(nodos){
  const indice=new Map(nodos.map(n=>[n.fila,n]));
  const alias=n=>n.props.alias?.trim()||n.props.prefijo?.trim()||n.titulo;
  const cabeceras=[];
  for(const n of nodos.filter(n=>n.tipo==="convocatoria"&&n.nivel===0)){
    const year=String(n.metaAnio??n.titulo.match(/\b(?:19|20|21)\d{2}\b/)?.[0]??n.props.anio??n.props.ano??"");
    const oposicion=n.props.oposicion?.trim()||n.titulo, modalidad=n.props.modalidad?.trim();
    if(modalidad&&/^\d{4}$/.test(year)) cabeceras.push({oposicionFila:n.fila,modalidadFila:null,texto:[oposicion,modalidad,year].join(".")});
  }
  for(const modalidad of nodos.filter(n=>n.tipo==='modalidad')){
    let n=indice.get(modalidad.padreFila), convocatoria, oposicion;
    while(n){if(n.tipo==='convocatoria'&&!convocatoria) convocatoria=n; if(n.tipo==='oposicion'){oposicion=n;break;}n=indice.get(n.padreFila);}
    if(!oposicion||!convocatoria) continue;
    const anio=convocatoria.props.anio??convocatoria.props.ano;
    const tituloAnio=convocatoria.titulo.match(/\b(?:19|20|21)\d{2}\b/)?.[0];
    const year=String(convocatoria.metaAnio??tituloAnio??anio??'');
    if(!/^\d{4}$/.test(year)) continue;
    cabeceras.push({oposicionFila:oposicion.fila,modalidadFila:modalidad.fila,texto:[alias(oposicion),alias(modalidad),year].join('.')});
  }
  return cabeceras;
}
