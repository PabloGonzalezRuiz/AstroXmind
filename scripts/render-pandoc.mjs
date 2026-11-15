import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
const source = new URL('../src/pandoc/ley-ejemplo.md', import.meta.url);
const target = new URL('../src/content/docs/demo-tablas/pandoc-real.md', import.meta.url);
const input = readFileSync(source, 'utf8');
let html;
try {
  html = execFileSync('pandoc', ['--from=markdown+fenced_divs+header_attributes', '--to=html5', '--wrap=none'], { input, encoding:'utf8' });
} catch (error) {
  console.error('Pandoc es necesario para generar la demostración real. Instálalo antes de compilar.');
  throw error;
}
const page = `---
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

${html}

</div>

## Cómo se selecciona el motor

- Los archivos de \`src/content/docs/\` se renderizan normalmente mediante Astro/Starlight.
- Este ejemplo nace en \`src/pandoc/ley-ejemplo.md\` y el script \`scripts/render-pandoc.mjs\` lo convierte con **Pandoc** a HTML5.
- Astro publica el HTML ya convertido. **El navegador nunca ejecuta Pandoc**: recibe HTML y CSS.

Para futuras páginas, añadiremos un convenio de carpetas o metadatos de renderizador; por ahora solo este ejemplo pasa por Pandoc.
`;
writeFileSync(target, page);
console.log('Generada la página Pandoc real');
