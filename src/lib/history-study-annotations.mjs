// Transcripción visual de la primera página fotografiada. No altera el Markdown.
const pink = (text, occurrence = 1) => ({ text, occurrence, style: 'pink' });
const purple = text => ({ text, style: 'purple' });
const pen = text => ({ text, style: 'pen' });
const circle = text => ({ text, style: 'circle' });
const note = (text, note) => ({ text, note });

export const historyTitleAnnotations = [purple('República y Guerra Civil.')];
export const historyAnnotations = [
  { block: '1. La crisis de la Restauración.', marks: [purple('La crisis de la Restauración.')] },
  { block: 'Con la subida al trono de Alfonso XIII', marks: [
    pink('Alfonso XIII'), pink('1902,'), pink('sistema bipartidista español'),
    note('sistema bipartidista español', 'dos gobiernos se alternan el poder (turnismo)'),
    note('vigente', 'continúa aplicándose'), pink('alternancia'), pink('Partido Liberal'),
    pen('José Canalejas,'), pink('Partido Conservador'), pen('Antonio Maura.'), pen('tuvo que lidiar con lo siguiente:')
  ] },
  { block: 'España vivía inmersa', marks: [pink('caciquismo,'), pink('una persona con gran poder local controlaba el voto de las clases bajas'), circle('área de influencia.'), pink('provocaba descontentos')] },
  { block: 'Descontento por el servicio militar', marks: [pink('Descontento'), pink('servicio militar'), pink('podían librarse los ricos y no los pobres.'), note('podían librarse los ricos', 'pagando')] },
  { block: 'El denominado turnismo', marks: [pink('turnismo'), pink('dos partidos'), pink('no dejaba'), pink('nuevas ideas y propuestas.')] },
  { block: 'Por todo ello habrá grupos', marks: [pink('grupos'), pink('opongan')] },
  { block: 'Republicanos.', marks: [pink('Republicanos.'), note('Republicanos.', 'BUSCAN UNA REPÚBLICA')] },
  { block: 'Obreros:', marks: [pink('Obreros:'), note('Obreros:', 'trabajadores'), pen('afianzando'), pen('ideologías de izquierdas'), circle('socialismo, el comunismo y el anarquismo.')] },
  { block: 'Los nacionalismos:', marks: [pink('Los nacionalismos:'), note('Los nacionalismos:', 'autonomía territorios y mayor identidad')] },
  { block: 'Todo esto, unido al problema', marks: [pen('unido'), pen('problema'), pen('guerra de Marruecos,'), pink('momentos de crisis:')] },
  { block: 'En 1909 tuvo lugar', marks: [pink('1909'), pink('“Semana Trágica de Barcelona”'), pink('protestas por'), pink('soldados para la guerra.')] },
  { block: 'En 1917 hubo', marks: [pink('1917'), pink('huelgas generales'), pink('obreros')] },
  { block: 'Entre 1919 y 1923', marks: [pink('Entre 1919 y 1923'), pink('malestar'), circle('malestar'), pink('aumentando'), pink('violencia en las calles'), circle('violencia en las calles')] },
  { block: '2. La Dictadura de Primo de Rivera.', marks: [purple('Dictadura'), purple('Primo de Rivera.')] },
  { block: 'Tras el Desastre de Annual', marks: [
    pink('Desastre de Annual,'), circle('Desastre de Annual,'), pink('más de 10.000 soldados muertos en Marruecos,'),
    pink('situación política'), pink('se zarandeaba.'), pink('en 1923,'), pen('1923'), pink('el general Miguel Primo de Rivera'), pink('golpe de Estado,'), pink('apoyo'), pink('alta burguesía'), pink('políticos conservadores.'), pink('suspendió la Constitución'), pink('prohibió', 1), pink('partidos políticos y sindicatos.'), pink('suspendieron'), pink('libertades individuales'), pink('prohibió', 2), pink('uso'), pink('lengua vasca y catalana.')
  ] },
  { block: 'La dictadura emprendió', marks: [
    pink('emprendió'), pink('programa de obras públicas'), pink('reactivó la economía,'), pink('finalizó'), pink('guerra de Marruecos.'), pink('crisis económica'), circle('crisis económica'), pink('1929'), pen('1929'), pink('perder la confianza en el dictador,'), pink('cayó'), pen('cayó'), pink('sustituido por el general')
  ] }
];
