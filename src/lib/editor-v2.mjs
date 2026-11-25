export const reglasIniciales = `- oposicion
  - convocatoria [año=2025]
    - modalidad [turno=Libre] [prefijo=Lbr]
      - bloque [prefijo=Bq numeracion=romana]
        - tema [prefijo=Tm numeracion=decimal ancho=2 heredar=1]
          - subtema [prefijo=Stm numeracion=decimal ancho=2 repetir=true heredar=todo]
            - apartado [numeracion=decimal heredar=todo]`;
export const mdInicial = `- Nombre Oposición[Oposicion]
  - Nombre bloque[Bloque]
    - Nombre tema[Tema]
      - Nombre subtema[Subtema]
      - Nombre apartado[Apartado]
    - Nombre tema[Tema]
      - Nombre apartado[Apartado]`;

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
  const nodos=[], pila=[], contadores=new Map();
  for (const n of lineas(markdown)) {
    if (!n.tipo || !estilos.has(n.tipo)) throw Error('Línea '+n.fila+': indica un tipo definido entre corchetes.');
    if(n.nivel>pila.length) throw Error('Línea '+n.fila+': salto de sangría.');
    pila.length=n.nivel;
    const padre=pila.at(-1);
    const p={...estilos.get(n.tipo),...n.props};
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
    const nodo={...n,props:p,segmento,numero,codigo,padreFila:padre?.fila??null};
    nodos.push(nodo);pila.push(nodo);
  }
  return nodos;
}
