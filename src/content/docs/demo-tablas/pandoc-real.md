---
title: "Pandoc real · legislación"
description: "Markdown convertido a HTML por Pandoc durante la compilación."
---

# Pandoc real · legislación

**Esta página sí está generada por Pandoc.** El archivo fuente es Markdown con clases declarativas y el proceso de compilación convierte su contenido a HTML5 antes de que Astro publique la página. No hay interacción añadida ni conversión a XMind todavía.

[Ver el Markdown original](https://github.com/PabloGonzalezRuiz/AstroXmind/blob/main/src/pandoc/ley-ejemplo.md)

<style>
.ley-demo { border: 1px solid #9bb9d7; border-radius: 12px; padding: 1rem; background: #f5f9ff; color: #17314c; }
.ley-demo h1 { color: #124e86; }
.ley-demo h2 { border-bottom: 2px solid #a9c9e8; padding-bottom: .3rem; }
.ley-demo h3 { color: #215c8b; }
.ley-demo .nota-estudio { padding: .75rem 1rem; background: #e0efff; border-left: 4px solid #236aab; border-radius: 4px; }
.ley-demo table { display: block; max-width: 100%; overflow-x: auto; }
</style>

<div class="pandoc-output">

<div id="ley-ejemplo" class="ley-demo" data-theme="juridico-azul">
<h1 id="ley-de-ejemplo">Ley de ejemplo</h1>
<p>Este texto es <strong>ficticio</strong>, diseñado para comprobar el renderizado real de Pandoc.</p>
<h2 id="título-preliminar">Título preliminar</h2>
<h3 id="artículo-1.-objeto">Artículo 1. Objeto</h3>
<ol type="1">
<li>Esta disposición establece las bases del ejemplo.</li>
<li>Su contenido se utiliza únicamente con fines de demostración.</li>
</ol>
<h3 id="artículo-2.-ámbito">Artículo 2. Ámbito</h3>
<ul>
<li>Administración</li>
<li>Procedimientos</li>
<li>Garantías</li>
</ul>
<h2 id="título-i.-organización">Título I. Organización</h2>
<table>
<thead>
<tr class="header">
<th style="text-align: left;">Sección</th>
<th style="text-align: left;">Materia</th>
<th style="text-align: right;">Referencia</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td style="text-align: left;">Primera</td>
<td style="text-align: left;">Principios</td>
<td style="text-align: right;">1</td>
</tr>
<tr class="even">
<td style="text-align: left;">Segunda</td>
<td style="text-align: left;">Organización</td>
<td style="text-align: right;">2</td>
</tr>
</tbody>
</table>
<h2 id="notas-de-estudio">Notas de estudio</h2>
<div class="nota-estudio">
<p><strong>Atención:</strong> este bloque tiene una clase declarativa Pandoc y se estiliza mediante CSS, sin cambiar el contenido.</p>
</div>
<h2 id="referencias">Referencias</h2>
<p>Consulta la <a href="https://pandoc.org/MANUAL.html#divs-and-spans">documentación oficial de Pandoc</a>.</p>
</div>


</div>

## Cómo se selecciona el motor

- Los archivos de `src/content/docs/` se renderizan normalmente mediante Astro/Starlight.
- Este ejemplo nace en `src/pandoc/ley-ejemplo.md` y el script `scripts/render-pandoc.mjs` lo convierte con **Pandoc** a HTML5.
- Astro publica el HTML ya convertido. **El navegador nunca ejecuta Pandoc**: recibe HTML y CSS.

Para futuras páginas, añadiremos un convenio de carpetas o metadatos de renderizador; por ahora solo este ejemplo pasa por Pandoc.
