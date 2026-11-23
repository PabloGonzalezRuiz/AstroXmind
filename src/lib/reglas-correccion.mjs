// Perfil de evaluación independiente del programa; los criterios CPS son otra fuente.
export function crearReglasCorreccion({ examen, reglas, referencia, paginas, modalidad = 'LIBRE' }) {
  const texto = reglas.replace(/\s+/g, ' ');
  const pi = modalidad === 'PROMOCION_INTERNA';
  const limites = [...texto.matchAll(/se calificará de 0 a (\d+) puntos, y será necesario obtener una calificación mínima de (\d+) puntos/g)];
  const umbral = texto.match(/no podrán ser inferiores al (\d+) por ciento/);
  const alternativas = /bloques III y IV del programa/i.test(texto);
  const invalidas = /pregunta cómo no contestada/i.test(texto);
  const empate = (pi ? texto.match(/4\.1\s+Personal funcionario.*?De mantenerse el empate.*?normas comunes\./i) : texto.match(/Primero:.*?De persistir el empate,.*?(?:normas comunes\.)/i))?.[0];
  if (!examen || limites.length !== 2 || !umbral || !alternativas || !invalidas || !empate) throw Error('Reglas de corrección incompletas: revisión necesaria.');
  return {
    version: 1, estado: 'pendiente_revision', fuente: { referencia, anexo: pi ? 'VI' : 'V', apartado: pi ? '3 y 4' : '2', paginas },
    modalidad, cuerpo: 'TAI', duracionMinutos: examen.duracionMinutos,
    partes: [
      { id: 'teoria', preguntas: examen.teoria, reservas: examen.reservas[0], maxima: Number(limites[0][1]), minimaTransformada: Number(limites[0][2]), eliminatoria: true },
      { id: 'practica', preguntas: examen.practica, reservas: examen.reservas[1], maxima: Number(limites[1][1]), minimaTransformada: Number(limites[1][2]), eliminatoria: true, elegirUnBloque: ['III','IV'], supuestoInvalido: 'no_corregir' }
    ],
    puntuacionDirecta: { acierto: 1, error: { numerador: -examen.penalizacion.numerador, denominador: examen.penalizacion.denominador }, blanco: examen.blancos, marcaInvalida: 'blanco', reservas: 'sustituir_anuladas_por_orden' },
    calificacion: { maximaTotal: limites.reduce((n,m)=>n+Number(m[1]),0), requiereSuperarAmbasPartes: true, evaluarPracticaSoloSiSuperaTeoria: true, minimoDirectoPorcentaje: Number(umbral[1]), minimosDirectos: null, formulaTransformacion: null, criteriosPosterioresPendientes: true },
    ...(pi ? { concurso: { maxima: 66, calificacionFinal: 'suma_oposicion_y_concurso' } } : {}),
    desempate: pi ? ['antiguedad_global_desc','calificacion_oposicion_desc','meritos_segun_colectivo','aciertos_practica_desc','aciertos_teoria_desc','errores_practica_asc','errores_teoria_asc','orden_actuacion_normas_comunes_8_1_8_2'] : ['puntuacion_directa_practica_desc','aciertos_practica_desc','aciertos_teoria_desc','errores_practica_asc','errores_teoria_asc','orden_actuacion_normas_comunes_8_1_8_2'],
    evidencia: { reglas, desempate: empate }
  };
}
