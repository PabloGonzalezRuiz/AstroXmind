// Conversión determinista; no se envía el PDF a servicios externos.
export function analizarPaginasTAI(paginas, info, anio, modalidad = 'LIBRE') {
  if (!['LIBRE','PROMOCION_INTERNA'].includes(modalidad)) throw Error('Modalidad no válida.');
  const pi = modalidad === 'PROMOCION_INTERNA';
  const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const lineas = paginas.flatMap((pagina, i) => pagina.split(/\r?\n/).map(texto => ({ texto: texto.replace(/\s+/g, ' ').trim(), pagina: i + 1 })).filter(x => x.texto));
  const texto = lineas.map(x => x.texto).join('\n');
  const fecha = texto.match(/Núm\.\s*\d+\s+\p{L}+\s+(\d{1,2}) de (enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre) de (\d{4})\b/iu);
  const referencia = texto.match(/BOE-A-\d{4}-\d+/)?.[0];
  if (!fecha || !referencia || Number(fecha[3]) !== Number(anio)) throw Error('No se ha podido verificar la fecha oficial y la referencia BOE del año seleccionado.');
  const publicacion = `${fecha[3]}-${String(meses.indexOf(fecha[2].toLowerCase()) + 1).padStart(2,'0')}-${fecha[1].padStart(2,'0')}`;
  const inicio = lineas.findIndex(x => x.texto === (pi ? 'ANEXO VI' : 'ANEXO V'));
  const fin = lineas.findIndex((x,i) => i > inicio && x.texto === (pi ? 'ANEXO VII' : 'ANEXO VI'));
  if (inicio < 0 || fin < 0) throw Error('No se han localizado los límites del anexo V de la convocatoria general.');
  const seleccion = lineas.slice(inicio,fin).filter(x => !/^(?:BOLETÍN OFICIAL DEL ESTADO|Núm\. |Sec\. II|cve:|Verificable en)/i.test(x.texto));
  if (!(pi ? /promoción interna.*Cuerpo de Técnicos Auxiliares de Informática/i : /ingreso libre en el Cuerpo de Técnicos Auxiliares de Informática/i).test(seleccion.slice(0,10).map(x=>x.texto).join(' '))) throw Error('El anexo no corresponde a TAI de ingreso libre.');
  const indice = seleccion.findIndex(x => (pi ? /^5\.\s*Programa\.?$/i : /^3\.\s*Programa\.?$/i).test(x.texto));
  const reglasInicio = seleccion.findIndex(x => (pi ? /^3\.\s*El sistema selectivo será el de concurso-oposición/i : /^2\.\s*Proceso de selección\.?$/i).test(x.texto));
  if (indice < 0 || reglasInicio < 0 || reglasInicio >= indice) throw Error('No se han encontrado las reglas y el programa oficial.');
  const bloques = [], programaFuente = []; let tema, temaFuente;
  for (const linea of seleccion.slice(indice+1)) {
    const b = linea.texto.match(/^(I|II|III|IV)\.\s+(.+)$/);
    const t = linea.texto.match(/^(\d+)\.\s+(.+)$/);
    if (b) {
      bloques.push({ numero: b[1], titulo: b[2], temas: [] });
      programaFuente.push({ numero: b[1], lineas: [linea], temas: [] });
      tema = undefined; temaFuente = undefined;
    } else if (t && bloques.length) {
      tema = { numero: Number(t[1]), texto: t[2], pagina: linea.pagina }; bloques.at(-1).temas.push(tema);
      temaFuente = { numero: Number(t[1]), lineas: [linea] }; programaFuente.at(-1).temas.push(temaFuente);
    } else if (tema) { tema.texto += ` ${linea.texto}`; temaFuente.lineas.push(linea); }
    else throw Error('Línea del programa sin bloque o tema identificado.');
  }
  if (bloques.map(b=>b.numero).join(',') !== 'I,II,III,IV' || bloques.some(b=>!b.temas.length || b.temas.some((t,i)=>t.numero!==i+1))) throw Error('La estructura del programa extraído no es consecutiva.');
  if (Number(anio) === 2025 && bloques.map(b=>b.temas.length).join(',') !== (pi ? '5,3,8,9' : '9,5,9,10')) throw Error('El programa 2025 no coincide con la estructura esperada para esta modalidad.');
  const plazas = seleccion.slice(0,reglasInicio).map(x=>x.texto).join(' ');
  const reglas = seleccion.slice(reglasInicio,indice).map(x=>x.texto).join('\n');
  const reglasEnLinea = reglas.replace(/\s+/g,' ');
  const total = plazas.match(/será de ([\d.]+) plazas/)?.[1];
  const reserva = plazas.match(/de las que (\d+) se reservarán/)?.[1];
  const teoria = reglasEnLinea.match(/máximo de (\d+) preguntas/)?.[1];
  const practica = reglasEnLinea.match(/desglosará en (\d+) preguntas/)?.[1];
  const reservas = [...reglasEnLinea.matchAll(/(\d+) preguntas adicionales de reserva/g)].map(m=>Number(m[1]));
  const duracion = pi ? (/noventa minutos/i.test(reglasEnLinea) ? 90 : null) : (/ciento veinte minutos/i.test(reglasEnLinea) ? 120 : null);
  const penalizacion = pi ? (/un cuarto del valor de la respuesta correcta/i.test(reglasEnLinea) ? { numerador: 1, denominador: 4 } : null) : (/un tercio del valor de una respuesta correcta/i.test(reglasEnLinea) ? { numerador: 1, denominador: 3 } : null);
  const blancos = /respuestas en blanco no penalizan/i.test(reglasEnLinea) ? 0 : null;
  if (!total || !reserva || !teoria || !practica || !duracion || !penalizacion || blancos===null || reservas.length!==2) throw Error('No se han verificado las cifras y reglas esenciales del examen.');
  const plazasDatos = { total: Number(total.replace(/\./g,'')), discapacidad: Number(reserva), general: Number(total.replace(/\./g,''))-Number(reserva) };
  const examen = { teoria: Number(teoria), practica: Number(practica), reservas, duracionMinutos: duracion, penalizacion, blancos, puntuacionesDirectasMinimas: null, criteriosPosterioresPendientes: true };
  const base = `${publicacion}_AGE_GENERAL_CONVOCATORIA_${referencia}`;
  return { base, publicacion, referencia, cuerpo: 'AGE', modalidad: 'GENERAL', anexo: pi ? 'VI' : 'V', destino: pi ? 'TAI_PROMOCION_INTERNA' : 'TAI_LIBRE', paginas: [seleccion[0].pagina,seleccion.at(-1).pagina], info, bloques, programaFuente, plazas, plazasDatos, examen, reglas, transcripcion: paginas.map((p,i)=>`## Página ${i+1}\n\n${p}`).join('\n\n'), limpio: seleccion.map(x=>x.texto).join('\n'), programa: bloques.map(b=>`## ${b.numero}. ${b.titulo}\n\n${b.temas.map(t=>`${t.numero}. ${t.texto}`).join('\n')}`).join('\n\n') };
}

export async function leerPaginasPdf(bytes) {
  const pdfjs = await import('pdfjs-dist');
  const worker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
  const pdf = await pdfjs.getDocument({ data: bytes.slice(), isEvalSupported: false, enableXfa: false, stopAtErrors: true }).promise;
  try {
    const { info } = await pdf.getMetadata();
    const paginas = [];
    for (let i=1;i<=pdf.numPages;i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      paginas.push(content.items.map(item=> 'str' in item ? item.str + (item.hasEOL ? '\n' : ' ') : '').join(''));
    }
    return { paginas, info };
  } finally { await pdf.destroy(); }
}

export async function leerPdfTAI(bytes, anio, modalidad = 'LIBRE') {
  const { paginas, info } = await leerPaginasPdf(bytes);
  return analizarPaginasTAI(paginas, info, anio, modalidad);
}
