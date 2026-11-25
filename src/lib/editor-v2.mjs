export const reglasIniciales = `- oposicion
  - convocatoria [año=2025]
    - modalidad [turno=Libre] [prefijo=Lbr]
      - bloque [prefijo=Bq numeracion=romana]
        - tema [prefijo=Tm numeracion=decimal ancho=2 heredar=1]
          - subtema [prefijo=Stm numeracion=decimal ancho=2 repetir=true heredar=todo]
            - apartado [prefijo=APT numeracion=decimal heredar=todo repetir=true]`;
export const plantillas = [{id:"oposiciones",nombre:"Oposiciones · predeterminada",reglas: reglasIniciales}];
export const mdInicial = `- Nombre Oposición[Oposicion] [id=00000000-0000-4000-8000-000000000001]
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
    if(id && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) throw Error('ID inválido en línea '+n.fila);
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
    const nodo={...n,props:p,segmento,numero,codigo,id,padreId:padre?.id??null,padreFila:padre?.fila??null};
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
