import test from 'node:test';
import assert from 'node:assert/strict';
import { parse, stringify } from 'yaml';
import { prepararOposicion, guardarOposicion, listarOposiciones, leerOposicion, resolverOposicion, renombrarOposicion, actualizarOposicion } from '../src/lib/oposiciones.mjs';

const token = 'github_pat_prueba', uuid = '12345678-1234-4234-8234-123456789abc';
const id = `op-${uuid}`, otro = 'op-aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const sha = 'a'.repeat(40), tree = 'b'.repeat(40), next = 'c'.repeat(40);
const repo = { private: true, full_name: 'PabloGonzalezRuiz/AstroXmind-Datos', owner: { id: 4293401 }, default_branch: 'main' };
function mock(responses) {
  const calls = [];
  const window = { localStorage: { getItem: () => token }, crypto: { randomUUID: () => uuid }, atob, fetch: async (url, options) => { calls.push({ url, options }); assert.ok(responses.length, `Llamada inesperada ${url}`); return responses.shift(); } };
  return { window, calls };
}
const response = (status, data) => ({ status, ok: status >= 200 && status < 300, json: async () => data });
const auth = () => [response(200, { id: 4293401 }), response(200, repo)];
function snapshot(records = []) { return [...auth(), response(200, { object: { sha } }), response(200, { tree: { sha: tree } }), records.length ? response(200, records.map(record => ({ type: 'dir', name: record.carpeta }))) : response(404), ...records.map(record => response(200, { encoding: 'base64', content: Buffer.from(record.yaml).toString('base64') }))]; }
const writes = (status = 200) => [response(201, { sha: tree }), response(201, { sha: next }), ...auth(), response(status, {})];

test('identidad permanente, nombre visible y URL corta independientes', () => {
  const record = prepararOposicion('Técnico auxiliar', id, new Date('2026-11-23T08:00:00.123Z'), 'TAI');
  assert.equal(record.ruta, `Oposiciones/${id}/oposicion.yaml`);
  assert.deepEqual(parse(record.yaml), { version: 2, id, nombre: 'Técnico auxiliar', nombreCorto: 'TAI', slug: 'tai', alias: [], fechaCreacion: '2026-11-23T08:00:00.123Z', faseActual: 2, fasesCompletadas: [1] });
  assert.throws(() => prepararOposicion('../', id));
  assert.throws(() => prepararOposicion('TAI', '../'));
});
test('alta publica un único commit no forzado en el almacén privado', async () => {
  const { window, calls } = mock([...snapshot(), ...writes()]);
  await guardarOposicion(window, token, 'TAI');
  const body = JSON.parse(calls.find(call => call.options.method === 'POST').options.body);
  assert.equal(body.base_tree, tree);
  assert.equal(body.tree[0].path, `Oposiciones/${id}/oposicion.yaml`);
  assert.equal(parse(body.tree[0].content).nombre, 'TAI');
  assert.deepEqual(JSON.parse(calls.at(-1).options.body), { sha: next, force: false });
  assert.ok(calls.at(-1).url.includes('AstroXmind-Datos/git/refs/heads/main'));
});
test('renombrar conserva ID, ruta, fecha, fases y alias anteriores', () => {
  const inicial = prepararOposicion('TAI', id);
  const nuevo = renombrarOposicion(inicial, 'Técnicos Auxiliares', 'TAI Estado');
  assert.equal(nuevo.ruta, inicial.ruta);
  assert.equal(nuevo.datos.id, id);
  assert.equal(nuevo.datos.fechaCreacion, inicial.datos.fechaCreacion);
  assert.deepEqual(nuevo.datos.fasesCompletadas, [1]);
  assert.equal(resolverOposicion([nuevo], 'tai'), nuevo);
  assert.equal(resolverOposicion([nuevo], 'tai-estado'), nuevo);
  assert.deepEqual(renombrarOposicion(nuevo, 'TAI', 'TAI').datos.alias, ['tai-estado']);
});
test('registros antiguos conservan carpeta e ID al actualizar el esquema', () => {
  const legacy = leerOposicion('TAI', stringify({ version: 1, id, nombre: 'TAI', fechaCreacion: '2026-11-23T08:00:00.123Z', faseActual: 2, fasesCompletadas: [1] }));
  assert.equal(legacy.datos.version, 2);
  assert.equal(legacy.datos.slug, 'tai');
  assert.equal(renombrarOposicion(legacy, 'TAI Estado', 'TAI Estado').ruta, 'Oposiciones/TAI/oposicion.yaml');
});
test('rechaza almacén público, identidad ajena, duplicados y permisos insuficientes', async () => {
  const existente = renombrarOposicion(prepararOposicion('TAI', otro), 'TAI Estado', 'TAI Estado');
  for (const responses of [[response(200, { id: 1 })], [response(200, { id: 4293401 }), response(200, { ...repo, private: false })], snapshot([existente]), [response(200, { id: 4293401 }), response(403)]]) {
    const { window, calls } = mock(responses);
    await assert.rejects(guardarOposicion(window, token, 'TAI'));
    assert.ok(calls.every(call => call.options.method === 'GET'));
  }
});
test('listar usa los metadatos y no la carpeta como nombre', async () => {
  const record = prepararOposicion('Técnico auxiliar', id, new Date(), 'TAI');
  const { window } = mock(snapshot([record]));
  assert.deepEqual(await listarOposiciones(window, token), [record]);
});
test('reserva de alias impide renombrar otra oposición con una URL antigua', async () => {
  const a = renombrarOposicion(prepararOposicion('TAI', id), 'TAI Estado', 'TAI Estado');
  const b = prepararOposicion('Otra', otro);
  const { window, calls } = mock(snapshot([a, b]));
  await assert.rejects(actualizarOposicion(window, token, otro, 'TAI', 'TAI'), /otra oposición/);
  assert.ok(calls.every(call => call.options.method === 'GET'));
});
test('un cambio concurrente no fuerza publicación ni sobrescribe datos', async () => {
  const { window, calls } = mock([...snapshot(), ...writes(422)]);
  await assert.rejects(guardarOposicion(window, token, 'TAI'));
  assert.equal(JSON.parse(calls.at(-1).options.body).force, false);
});
