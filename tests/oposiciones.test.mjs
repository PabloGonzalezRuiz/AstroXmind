import test from 'node:test';
import assert from 'node:assert/strict';
import { parse } from 'yaml';
import { prepararOposicion, guardarOposicion, listarOposiciones } from '../src/lib/oposiciones.mjs';

const token = 'github_pat_prueba';
const repo = { private: true, full_name: 'PabloGonzalezRuiz/AstroXmind-Datos', owner: { id: 4293401 }, default_branch: 'main' };
function mock(responses) {
  const calls = [];
  const window = { localStorage: { getItem: () => token }, crypto: { randomUUID: () => 'uuid' }, btoa, fetch: async (url, options) => { calls.push({ url, options }); return responses.shift(); } };
  return { window, calls };
}
const response = (status, data) => ({ status, ok: status >= 200 && status < 300, json: async () => data });
test('YAML conserva nombre, fecha con milisegundos y fase completada', () => {
  const record = prepararOposicion('Técnico auxiliar', 'op-1', new Date('2026-11-23T08:00:00.123Z'));
  assert.equal(record.ruta, 'Oposiciones/TECNICO-AUXILIAR/oposicion.yaml');
  assert.deepEqual(parse(record.yaml), { version: 1, id: 'op-1', nombre: 'Técnico auxiliar', fechaCreacion: '2026-11-23T08:00:00.123Z', faseActual: 2, fasesCompletadas: [1] });
  assert.throws(() => prepararOposicion('../', 'op-1'));
});
test('alta crea únicamente en almacén privado, sin SHA de actualización', async () => {
  const { window, calls } = mock([response(200, { id: 4293401 }), response(200, repo), response(404), response(201)]);
  await guardarOposicion(window, token, 'TAI');
  const last = calls.at(-1);
  assert.equal(last.url, 'https://api.github.com/repos/PabloGonzalezRuiz/AstroXmind-Datos/contents/Oposiciones/TAI/oposicion.yaml');
  assert.equal(last.options.method, 'PUT');
  const body = JSON.parse(last.options.body);
  assert.equal(body.sha, undefined);
  assert.equal(parse(Buffer.from(body.content, 'base64').toString()).nombre, 'TAI');
});
test('rechaza almacén público, identidad ajena, duplicados y permisos insuficientes', async () => {
  for (const responses of [[response(200, { id: 1 })], [response(200, { id: 4293401 }), response(200, { ...repo, private: false })], [response(200, { id: 4293401 }), response(200, repo), response(200)], [response(200, { id: 4293401 }), response(403)]]) {
    const { window, calls } = mock(responses);
    await assert.rejects(guardarOposicion(window, token, 'TAI'));
    assert.ok(calls.every(call => call.options.method === 'GET'));
  }
});
test('lista carpetas válidas de oposiciones privadas', async () => {
  const { window } = mock([response(200, { id: 4293401 }), response(200, repo), response(200, [{ type: 'dir', name: 'TAI' }, { type: 'file', name: 'README.md' }])]);
  assert.deepEqual(await listarOposiciones(window, token), ['TAI']);
});
