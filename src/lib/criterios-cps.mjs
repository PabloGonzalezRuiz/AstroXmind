import { leerPaginasPdf } from './convocatoria-pdf.mjs';

export function analizarCriteriosCPS(paginas, info, anio) {
  const texto = paginas.join(' ').replace(/\s+/g, ' ').normalize('NFC');
  const fecha = texto.match(/(\d{1,2}) de (enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre) de (\d{4})\s*$/i);
  const meses = 'enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre'.split(' ');
  const resolucion = texto.match(/Resolución de 18 de diciembre de (\d{4})/i);
  const extraer = re => { const m = texto.match(re); if (!m) throw Error('Criterios incompletos o formato no reconocido.'); return Number(m[1].replace(/\./g,'')); };
  if (!fecha || !resolucion || Number(resolucion[1])!==Number(anio) || !/CRITERIOS DE CORRECCIÓN, VALORACIÓN Y SUPERACIÓN/i.test(texto) || !/Técnicos Auxiliares de Informática de la Administración del Estado,? Ingreso Libre/i.test(texto)) throw Error('El PDF no corresponde a los criterios CPS de TAI libre de este año.');
  const fechaDocumento = `${fecha[3]}-${String(meses.indexOf(fecha[2].toLowerCase())+1).padStart(2,'0')}-${fecha[1].padStart(2,'0')}`;
  const perfil = { version:1, estado:'pendiente_revision', cuerpo:'TAI', modalidad:'LIBRE', anioConvocatoria:Number(anio), fechaDocumento,
    primeraParte:{ umbralInicialPorcentaje:extraer(/igual o superior al (\d+) % de la puntuación/i), objetivoGeneral:extraer(/cifra de ([\d.]+) opositores para el sistema general/i), objetivoDiscapacidad:extraer(/y ([\d.]+) opositores para la norma común 13/i), sueloPorcentaje:extraer(/igual o superior al (\d+) % de la puntuación máxima/i) },
    segundaParte:{ objetivoGeneral:extraer(/total de ([\d.]+) opositores para el sistema general/i), objetivoDiscapacidad:extraer(/total de [\d.]+ opositores para el sistema general y ([\d.]+) opositores/i), sueloPorcentaje:extraer(/igual o superior al (\d+)% de la puntuación directa/i) },
    puntuacionDirecta:{ acierto:1, error:{numerador:-1,denominador:3}, blanco:0 }, empateEnCorte:'aprobar_todos_con_misma_puntuacion', transformacion:{ maxima:50, enCorte:25, aprobados:'lineal_entre_corte_y_maximo', cortesReales:null }, evidencia: paginas.map((texto,i)=>({pagina:i+1,texto})) };
  if (!/cuatro posibles respuestas/i.test(texto) || !/penalizan 1\/3/i.test(texto) || !/entre 25 y 50 proporcional/i.test(texto) || !/Todos los opositores con idéntica puntuación/i.test(texto)) throw Error('No se ha podido confirmar la fórmula y los criterios de desempate.');
  return { fechaDocumento, info, perfil, transcripcion: paginas.map((p,i)=>`## Página ${i+1}\n\n${p}`).join('\n\n') };
}

export async function leerCriteriosCPS(bytes, anio) { const {paginas,info}=await leerPaginasPdf(bytes); return analizarCriteriosCPS(paginas,info,anio); }
