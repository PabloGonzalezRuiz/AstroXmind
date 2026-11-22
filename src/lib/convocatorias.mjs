const months = 'enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre'.split(' ');

export function identify(pages, info = {}) {
  const first = pages[0] || '';
  const all = pages.join('\n');
  const date = first.match(new RegExp('Núm\\.\\s*\\d+[^\\n]*?(\\d{1,2}) de (' + months.join('|') + ') de (\\d{4})', 'i'));
  const refs = new Set(all.match(/BOE-A-\d{4}-\d+/g) || []);
  const ref = /^BOE-A-\d{4}-\d+$/.test(info.Subject || '') ? info.Subject : refs.size === 1 ? [...refs][0] : null;
  if (!date || !ref || !refs.has(ref) || ref.split('-')[2] !== date[3] || !/convocan\s+procesos\s+selectivos/i.test(first) || !/Técnicos\s+Auxiliares\s+de\s+Informática/i.test(all) || !/Cuerpos\s+(?:y\s+Escalas\s+)?de\s+la\s+Administración\s+General\s+del\s+Estado/i.test(first)) throw new Error('Identidad no demostrada. No se renombra: conserva el PDF para revisión.');
  const publication = `${date[3]}-${String(months.indexOf(date[2].toLowerCase())+1).padStart(2,'0')}-${date[1].padStart(2,'0')}`;
  return {identidad:`${publication}_AGE_GENERAL_CONVOCATORIA_${ref}`, fecha_publicacion:publication, referencia:ref, cuerpo:'AGE', modalidad:'GENERAL', url_boe:`https://www.boe.es/buscar/doc.php?id=${ref}`, url_inap:null, evidencia:{fecha:'cabecera página 1',referencia:'texto y PDF Info si existe',alcance:'título resolución multicuerpo'}, verificacion_externa:false};
}

export function markdown(meta, pages) {
  const id = meta.identidad;
  const card = [`> **Metadatos del documento**`, '>', `> - Publicación: ${meta.fecha_publicacion}`, `> - Referencia: ${meta.referencia}`, `> - Cuerpo/modalidad: ${meta.cuerpo} / ${meta.modalidad}`, `> - Fase: F01 — transcripción textual`, `> - Páginas: ${pages.length}`, '> - Verificación externa: pendiente', `> - [Ficha YAML](${id}__METADATOS.yaml) · [PDF](${id}__F00-ORIGINAL.pdf) · [BOE](${meta.url_boe})`, '', '---', ''].join('\n');
  return card + '\n' + pages.map((page,i)=>`## Página ${i+1}\n\n` + page.split('\n').map(line=>'    '+line).join('\n')).join('\n\n');
}

export function pageText(items) {
  let text = '', y;
  for (const item of items) {
    if (typeof item.str !== 'string') continue;
    const next = item.transform[5];
    if (y !== undefined && Math.abs(y-next)>3 && !text.endsWith('\n')) text += '\n';
    text += item.str + (item.hasEOL?'\n':' ');
    y=next;
  }
  return text;
}
