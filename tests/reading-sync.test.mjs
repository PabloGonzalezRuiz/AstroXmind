import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { readingSegments, readingIndexAt } from '../src/lib/reading-sync.mjs';

test('solo marcas en orden, sin duplicación ni notas, preservando el texto', () => {
  const root = new JSDOM('<main><h2>1. <span class="study-purple">Visión general</span></h2><p><span class="study-pink study-pen">Primera</span> <span class="study-pink">frase.</span> Texto omitido. <span class="study-circle">Segunda frase.</span><button data-reading-ignore>Nota omitida</button></p><details><p class="study-pink">Respuesta oculta.</p></details><p>No narrar</p></main>').window.document.querySelector('main');
  const original = root.textContent;
  const plain = readingSegments(root).map(s => s.text);
  const marked = readingSegments(root, true);
  assert.deepEqual(plain, ['Visión general', 'Primera frase.', 'Segunda frase.']);
  assert.deepEqual(marked.map(s => s.text), plain);
  assert.equal(root.textContent, original);
  assert.equal(marked[1].parts.length, 2);
  assert.equal(root.querySelector('.study-pen .reading-fragment').textContent, 'Primera');
  assert.equal(root.querySelector('details .reading-fragment'), null);
});

test('localización temporal exacta y saltos de frase', () => {
  const cues = [{start:0,end:2},{start:2,end:5},{start:5,end:8}];
  assert.equal(readingIndexAt(cues, 0), 0);
  assert.equal(readingIndexAt(cues, 1.99), 0);
  assert.equal(readingIndexAt(cues, 2), 1);
  assert.equal(readingIndexAt(cues, 7.9), 2);
  assert.equal(readingIndexAt(cues, 20), 2);
});

test('el audio publicado corresponde al documento compilado y a sus marcas', () => {
  const root = new JSDOM(readFileSync('dist/republica-y-guerra-civil/index.html', 'utf8')).window.document;
  const scope = root.querySelector('[data-reading-scope]');
  assert.ok(scope?.querySelector('reading-sync'));
  const marks = JSON.parse(readFileSync('dist/audio/republica-y-guerra-civil/marcas.json', 'utf8'));
  const segments = readingSegments(scope.querySelector('.sl-markdown-content'));
  assert.equal(marks.length, segments.length);
  assert.deepEqual(marks.map(x => x.text), segments.map(x => x.text));
  assert.ok(marks.every((cue,i) => cue.end > cue.start && (i === 0 ? cue.start === 0 : cue.start === marks[i-1].end)));
  assert.ok(readFileSync('dist/audio/republica-y-guerra-civil/narracion.mp3').length > 1000000);
  const other = readFileSync('dist/clases-astro/index.html', 'utf8');
  assert.ok(!other.includes('<reading-sync '));
});
