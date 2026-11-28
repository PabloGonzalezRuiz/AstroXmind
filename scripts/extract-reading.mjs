import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { readingSegments } from '../src/lib/reading-sync.mjs';

const html = readFileSync(process.argv[2], 'utf8');
const root = new JSDOM(html).window.document.querySelector('.sl-markdown-content');
if (!root) throw new Error('Documento no encontrado');
process.stdout.write(JSON.stringify(readingSegments(root).map(({ text }) => text)));
