"""Deterministic first-stage BOE importer; does not publish or change input files."""
import argparse
import hashlib
import json
import re
import subprocess
import tempfile
from pathlib import Path

MONTHS = 'enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre'.split()


def extract(path, root):
    raw = path.read_bytes()
    digest = hashlib.sha256(raw).hexdigest()
    if not raw.startswith(b'%PDF-'):
        raise ValueError('No es un PDF')
    info = subprocess.check_output(['pdfinfo', str(path)], text=True, timeout=30)
    text = subprocess.check_output(['pdftotext', '-layout', str(path), '-'], text=True, timeout=120)
    first = text.split('\f')[0]
    dates = re.findall(r'Núm\.\s*\d+[^\n]*?(\d{1,2}) de (' + '|'.join(MONTHS) + r') de (\d{4})', first, re.I)
    refs = set(re.findall(r'BOE-A-\d{4}-\d+', info + '\n' + text))
    subject = re.search(r'^Subject:\s*(BOE-A-\d{4}-\d+)\s*$', info, re.M)
    ref = subject.group(1) if subject else (next(iter(refs)) if len(refs) == 1 else None)
    if not dates or not ref or not re.search(r'convocan procesos selectivos', first, re.I) or not re.search(r'Técnicos Auxiliares de Informática', text, re.I):
        raise ValueError('Revisión necesaria: identidad o alcance no demostrado; no se usa el nombre recibido')
    day, month, year = dates[0]
    date = f'{year}-{MONTHS.index(month.lower())+1:02d}-{int(day):02d}'
    if ref.split('-')[2] != year or ref not in text:
        raise ValueError('Revisión necesaria: referencia contradictoria')
    if not re.search(r'Cuerpos\s+(?:y\s+Escalas\s+)?de\s+la\s+Administración\s+General\s+del\s+Estado', first, re.I):
        raise ValueError('Revisión necesaria: alcance multicuerpo no demostrado')
    identity = f'{date}_AGE_GENERAL_CONVOCATORIA_{ref}'
    dest = root / identity
    if dest.exists():
        meta = json.loads((dest / f'{identity}__METADATOS.yaml').read_text(encoding='utf-8'))
        if meta['sha256'] != digest:
            raise ValueError('Revisión necesaria: misma identidad, contenido diferente')
        return dest
    root.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(dir=root) as tmp:
        staged = Path(tmp) / identity
        staged.mkdir()
        source = staged / '00-fuente'
        source.mkdir()
        safe = re.sub(r'[^\w. -]', '_', path.name)
        (source / safe).write_bytes(raw)
        (staged / f'{identity}__F00-ORIGINAL.pdf').write_bytes(raw)
        pages = text.split('\f')
        if pages and not pages[-1].strip():
            pages.pop()
        # Keep layout and all text, including headers; no semantic cleanup in F01.
        md = '\n\n'.join(f'## Página {i}\n\n' + ''.join('    '+line+'\n' for line in page.rstrip().splitlines()) for i, page in enumerate(pages, 1))
        meta = dict(identidad=identity, fecha_publicacion=date, referencia=ref, cuerpo='AGE', modalidad='GENERAL', nombre_recibido=path.name, fuente_archivada=f'00-fuente/{safe}', sha256=digest, inmutable=True, indexar_fuente=False, paginas=len(pages), url_boe=f'https://www.boe.es/buscar/doc.php?id={ref}', url_inap=None, verificacion_externa=False, evidencia={'fecha': 'cabecera página 1', 'referencia': 'PDF Info y texto', 'alcance': 'título de resolución'}, fase='F01', limitaciones=['Extracción textual sin OCR ni verificación visual de tablas'])
        (staged / f'{identity}__METADATOS.yaml').write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding='utf-8')
        card = '\n'.join([
            '> **Metadatos del documento**', '>',
            f'> - Publicación: {meta["fecha_publicacion"]}',
            f'> - Referencia: {meta["referencia"]}',
            f'> - Cuerpo y modalidad: {meta["cuerpo"]} / {meta["modalidad"]}',
            f'> - Fase: {meta["fase"]} — transcripción textual',
            f'> - Páginas: {meta["paginas"]}',
            '> - Fuente externa: pendiente de verificar',
            f'> - [Ficha YAML completa]({identity}__METADATOS.yaml) · [PDF original normalizado]({identity}__F00-ORIGINAL.pdf) · [Referencia BOE]({meta["url_boe"]})',
            '', '---', '',
        ])
        (staged / f'{identity}__F01-TRANSCRIPCION.md').write_text(card + '\n' + md, encoding='utf-8')
        staged.rename(dest)
    return dest


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('pdf', type=Path)
    parser.add_argument('--salida', type=Path, required=True)
    args = parser.parse_args()
    try:
        print(extract(args.pdf, args.salida))
    except (ValueError, subprocess.SubprocessError) as e:
        parser.exit(2, f'{e}\n')
