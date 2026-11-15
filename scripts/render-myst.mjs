import { readFileSync, writeFileSync } from 'node:fs';
import { mystParser } from 'myst-parser';
import { State, transform, mystToHast, formatHtml } from 'myst-to-html';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';

const source = new URL('../src/myst/demo.myst', import.meta.url);
const target = new URL('../src/content/docs/demo-tablas/myst-real.md', import.meta.url);
const parser = unified()
  .use(mystParser)
  .use(transform, new State())
  .use(mystToHast)
  .use(formatHtml)
  .use(rehypeStringify);
const input = readFileSync(source, 'utf8');
const html = String(parser.processSync(input).value);
const code = input.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const output = [
  '---',
  'title: "MyST real · procesador oficial"',
  'description: "Ejemplo generado por myst-parser, no HTML escrito a mano"',
  '---',
  '',
  '# MyST real · código y resultado',
  '',
  'Este ejemplo se genera durante la compilación mediante el paquete oficial `myst-parser` y `myst-to-html`. No es una simulación manual.',
  '',
  '## Código MyST original',
  '',
  '<details><summary>Mostrar código fuente</summary>',
  '<pre><code>'+code+'</code></pre>',
  '</details>',
  '',
  '## Representación producida por MyST',
  '',
  '<div class="ax-myst-result">',
  html,
  '</div>',
  '',
  '<style>',
  '.ax-myst-result{border:1px solid var(--sl-color-hairline);padding:1rem;border-radius:.6rem}',
  '.ax-myst-result .admonition{border:1px solid var(--sl-color-hairline);padding:.8rem;border-radius:.5rem;margin:1rem 0}',
  '.ax-myst-result .admonition-title{font-weight:700}',
  '</style>',
  ''
].join('\n');
writeFileSync(target, output);
console.log('MyST renderizado por myst-parser:', html.length, 'caracteres HTML');
