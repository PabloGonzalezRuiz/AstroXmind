import test from 'node:test';
import assert from 'node:assert/strict';
import { parse, stringify } from 'yaml';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { webcrypto } from 'node:crypto';
import { generarPrograma, exportarProgramaMD } from '../scripts/generar-programa.mjs';
import { guardarBorradorPrograma, guardarEditorV2, abrirEditorV2Guardado } from '../src/lib/oposiciones.mjs';
import { abrirModeloPrograma } from '../src/lib/programa-editor-browser.mjs';
import { reglasIniciales } from '../src/lib/editor-v2.mjs';
import { instalarOposiciones, subirConvocatoriaPdf, reiniciarConvocatoria, subirCriteriosCPS } from '../src/lib/oposiciones.mjs';
import { analizarCriteriosCPS } from '../src/lib/criterios-cps.mjs';
import { prepararOposicion, guardarOposicion, listarOposiciones, leerOposicion, resolverOposicion, renombrarOposicion, actualizarOposicion, prepararConvocatoria, guardarConvocatoria, listarConvocatorias } from '../src/lib/oposiciones.mjs';

const token = 'github_pat_prueba', uuid = '12345678-1234-4234-8234-123456789abc';
const id = `op-${uuid}`, otro = 'op-aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const sha = 'a'.repeat(40), tree = 'b'.repeat(40), next = 'c'.repeat(40);
const repo = { private: true, full_name: 'PabloGonzalezRuiz/AstroXmind-Datos', owner: { id: 4293401 }, default_branch: 'main' };
function mock(responses) {
  const calls = [];
  const window = { localStorage: { getItem: () => token }, crypto: { randomUUID: () => uuid }, atob, btoa, fetch: async (url, options) => { calls.push({ url, options }); assert.ok(responses.length, `Llamada inesperada ${url}`); return responses.shift(); } };
  return { window, calls };
}
const response = (status, data) => ({ status, ok: status >= 200 && status < 300, json: async () => data });
const auth = () => [response(200, { id: 4293401 }), response(200, repo)];
function snapshot(records = []) { return [...auth(), response(200, { object: { sha } }), response(200, { tree: { sha: tree } }), records.length ? response(200, records.map(record => ({ type: 'dir', name: record.carpeta }))) : response(404), ...records.map(record => response(200, { encoding: 'base64', content: Buffer.from(record.yaml).toString('base64') }))]; }
const writes = (status = 200) => [response(201, { sha: tree }), response(201, { sha: next }), ...auth(), response(status, {})];

test('criterios CPS separados de las bases y asociados al año correcto', async()=>{
  const paginas=['CRITERIOS DE CORRECCIÓN, VALORACIÓN Y SUPERACIÓN. Técnicos Auxiliares de Informática de la Administración del Estado, Ingreso Libre. Resolución de 18 de diciembre de 2025. cuatro posibles respuestas. penalizan 1/3. igual o superior al 50 % de la puntuación. cifra de 2.532 opositores para el sistema general y 558 opositores para la norma común 13. igual o superior al 30 % de la puntuación máxima. total de 844 opositores para el sistema general y 186 opositores. igual o superior al 30% de la puntuación directa. Todos los opositores con idéntica puntuación. entre 25 y 50 proporcional. 18 de mayo de 2026'];
  const a=analizarCriteriosCPS(paginas,{},2025); assert.equal(a.perfil.primeraParte.objetivoGeneral,2532); assert.equal(a.perfil.transformacion.cortesReales,null); assert.throws(()=>analizarCriteriosCPS(paginas,{},2024));
  const op=prepararOposicion('TAI',id), record=prepararConvocatoria(op,'2025');
  const datos={...record.datos,pdfOficial:{referencia:'BOE-A-2025-26262',plazas:{general:844,discapacidad:186}}};
  const bytes=new TextEncoder().encode('%PDF-1.7\nprueba'); const archivo={name:'criterios.pdf',size:bytes.length,arrayBuffer:async()=>bytes.buffer};
  const m=mock([...snapshot([op]),response(200,{encoding:'base64',content:Buffer.from(stringify(datos)).toString('base64')}),...Array.from({length:4},()=>response(404)),response(201,{sha:next}),...writes()]);
  const saved=await subirCriteriosCPS(m.window,token,id,'2025',archivo,async()=>a);
  assert.deepEqual(saved.datos.pdfOficial,datos.pdfOficial); assert.equal(saved.datos.criteriosCPS.derivados.length,3); assert.match(saved.datos.criteriosCPS.ruta,/2026-05-18_TAI_LIBRE_CRITERIOS-CPS/);
});

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
test('convocatoria pertenece al ID inmutable y guarda ambas fases en un commit', async () => {
  const op = prepararOposicion('TAI', id);
  const { window, calls } = mock([...snapshot([op]), response(404), ...writes()]);
  const record = await guardarConvocatoria(window, token, id, '2025');
  assert.equal(record.ruta, `Oposiciones/${id}/Convocatorias/2025/convocatoria.yaml`);
  assert.equal(record.datos.oposicionId, id);
  assert.equal(record.datos.faseActual, 'F00');
  assert.equal(record.datos.modalidad, 'LIBRE');
  const files = JSON.parse(calls.find(call => call.options.method === 'POST').options.body).tree;
  assert.deepEqual(parse(files[0].content).fasesCompletadas, [1]);
  assert.equal(parse(files[1].content).anio, 2025);
  assert.throws(() => prepararConvocatoria(op, '../2025'));
});
test('convocatorias se listan por oposición y no se sobrescriben', async () => {
  const op = prepararOposicion('TAI', id);
  const entries = response(200, [{ type: 'dir', name: '2025' }, { type: 'dir', name: '2024' }]);
  const first = mock([...snapshot([op]), entries]);
  assert.deepEqual(await listarConvocatorias(first.window, token, id), ['2025', '2024']);
  const second = mock([...snapshot([op]), entries]);
  await assert.rejects(guardarConvocatoria(second.window, token, id, '2025'), /Ya existe/);
  assert.ok(second.calls.every(call => call.options.method === 'GET'));
});
test('abrir una oposición muestra tarjetas y alta separada', async () => {
  const op = prepararOposicion('Técnico auxiliar', id, new Date(), 'TAI');
  const html = readFileSync(new URL('../dist/oposiciones/index.html', import.meta.url), 'utf8');
  const dom = new JSDOM(html, { url: 'https://example.test/AstroXmind/oposiciones/?o=tai' });
  const { window } = dom;
  const convocatoria = prepararConvocatoria(op, '2025');
  const mocked = mock([...snapshot([op]), ...snapshot([op]), response(200, [{ type: 'dir', name: '2025' }]), response(200, { encoding: 'base64', content: Buffer.from(convocatoria.yaml).toString('base64') })]);
  window.fetch = mocked.window.fetch;
  window.atob = atob;
  window.localStorage.setItem('astroxmind:github-token:v1', token);
  const doc = window.document;
  doc.querySelector('[data-private-authorized]').hidden = false;
  instalarOposiciones(doc);
  assert.equal(doc.querySelector('[data-oposicion-loading]').open, true);
  assert.equal(doc.querySelector('[data-private-authorized]').getAttribute('aria-busy'), 'true');
  assert.equal(doc.documentElement.style.overflow, 'hidden');
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(doc.querySelector('[data-oposicion-loading]').open, false);
  assert.equal(doc.querySelector('[data-private-authorized]').hasAttribute('aria-busy'), false);
  assert.equal(doc.documentElement.style.overflow, '');
  assert.equal(doc.querySelector('[data-oposicion-overview]').hidden, true);
  assert.equal(doc.querySelector('[data-oposicion-workspace]').hidden, false);
  const yearField = doc.querySelector('#anio-convocatoria');
  assert.equal(yearField.value, String(new Date().getFullYear()));
  yearField.stepDown();
  assert.equal(yearField.value, String(new Date().getFullYear()-1));
  assert.equal(doc.querySelector('[data-oposicion-edit]').hidden, true);
  assert.equal(doc.querySelector('[data-oposicion-detail]').textContent, 'Técnico auxiliar');
  assert.equal(doc.querySelector('[data-resumen-nombre]').textContent, 'Técnico auxiliar');
  assert.equal(doc.querySelector('[data-resumen-corto]').textContent, 'TAI');
  assert.equal(doc.querySelector('[data-resumen-ruta]').href, `https://github.com/PabloGonzalezRuiz/AstroXmind-Datos/blob/main/${op.ruta}`);
  assert.equal(doc.querySelector('[data-resumen-convocatorias]').hidden, false);
  assert.equal(doc.querySelector('[data-convocatoria-list] a').href, 'https://example.test/AstroXmind/oposiciones/?o=tai&anio=2025');
  assert.match(doc.querySelector('[data-convocatoria-list]').textContent, /^2025/);
  assert.match(doc.querySelector('[data-convocatoria-list]').textContent, /PDF oficial pendiente/);
  assert.equal(doc.querySelector('[data-pdf-campo]').hidden, true);
  assert.equal(doc.querySelector('[data-alta-contenedor]').textContent, 'Nueva convocatoria');
  assert.equal(doc.querySelector('[data-alta-titulo]').textContent, 'Paso 1 · Crear convocatoria');
  assert.ok(doc.querySelector('[data-alta-convocatoria]').contains(doc.querySelector('[data-convocatoria-form]')));
  yearField.value = '2025'; yearField.dispatchEvent(new window.Event('input'));
  assert.equal(doc.querySelector('option[value="LIBRE"]').disabled, true);
  assert.equal(doc.querySelector('option[value="PROMOCION_INTERNA"]').disabled, false);
  doc.querySelector('[data-oposicion-edit-toggle]').click();
  assert.equal(doc.querySelector('[data-oposicion-edit]').hidden, false);
  window.close();
});
test('pantalla de carga se retira en caso de error, falta de token o revocación', async () => {
  const html = readFileSync(new URL('../dist/oposiciones/index.html', import.meta.url), 'utf8');
  for (const mode of ['error', 'sin-token', 'revocado']) {
    const { window } = new JSDOM(html, { url: 'https://example.test/AstroXmind/oposiciones/?o=tai' });
    const doc = window.document;
    if (mode !== 'sin-token') window.localStorage.setItem('astroxmind:github-token:v1', token);
    if (mode === 'error') {
      doc.querySelector('[data-private-authorized]').hidden = false;
      window.fetch = async () => { throw Error('Error simulado'); };
    }
    instalarOposiciones(doc);
    if (mode === 'revocado') {
      assert.equal(doc.querySelector('[data-oposicion-loading]').open, true);
      window.dispatchEvent(new window.Event('astroxmind:private-access-revoked'));
    }
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(doc.querySelector('[data-oposicion-loading]').open, false, mode);
    assert.equal(doc.documentElement.style.overflow, '', mode);
    if (mode === 'error') assert.match(doc.querySelector('[data-oposicion-status]').textContent, /Error simulado/);
    window.close();
  }
});
test('subida PDF original y metadatos en un commit no forzado', async () => {
  const op = prepararOposicion('TAI', id);
  const bytes = new TextEncoder().encode('%PDF-1.7\nprueba');
  const pdf = { name: 'oficial.pdf', size: bytes.length, arrayBuffer: async () => bytes.buffer };
  const base = '2025-12-22_AGE_GENERAL_CONVOCATORIA_BOE-A-2025-26262';
  const reglas = 'bloques III y IV del programa. pregunta cómo no contestada. Se calificará de 0 a 50 puntos, y será necesario obtener una calificación mínima de 25 puntos. Se calificará de 0 a 50 puntos, y será necesario obtener una calificación mínima de 25 puntos. no podrán ser inferiores al 30 por ciento. Primero: prueba. De persistir el empate, normas comunes.' .replaceAll('Se calificará', 'se calificará');
  const examen = { teoria:80, practica:20, reservas:[5,5], duracionMinutos:120, penalizacion:{numerador:1,denominador:3}, blancos:0 };
  const analizar = async () => ({ base, publicacion: '2025-12-22', referencia: 'BOE-A-2025-26262', bloques: [], plazas: '', reglas, examen, transcripcion: '', limpio: '', programa: '' });
  const { window, calls } = mock([...snapshot([op]), response(404), response(404), response(201, { sha: next }), ...Array.from({length:7},()=>response(404)), ...writes()]);
  const saved = await subirConvocatoriaPdf(window, token, id, '2025', pdf, analizar);
  assert.equal(saved.datos.pdfOficial.nombreOriginal, 'oficial.pdf');
  const blob = calls.find(call => call.url.endsWith('/git/blobs'));
  assert.equal(JSON.parse(blob.options.body).content, Buffer.from(bytes).toString('base64'));
  const treeWrite = calls.find(call => call.url.endsWith('/git/trees'));
  assert.equal(JSON.parse(treeWrite.options.body).tree[2].sha, next);
  assert.equal(JSON.parse(treeWrite.options.body).tree[2].path, `Oposiciones/${id}/Convocatorias/2025/${base}__F00-ORIGINAL.pdf`);
  assert.equal(saved.datos.faseActual, 'REVISION');
  const reset = mock([...snapshot([op]), response(200, { encoding: 'base64', content: Buffer.from(saved.yaml).toString('base64') }), response(200, [saved.datos.pdfOficial.ruta,...saved.datos.pdfOficial.derivados].map(path=>({type:'file',path}))), ...writes()]);
  await reiniciarConvocatoria(reset.window, token, id, '2025');
  const resetTree = JSON.parse(reset.calls.find(call=>call.url.endsWith('/git/trees')).options.body).tree;
  assert.equal(resetTree.filter(item=>item.sha===null).length,8);
  assert.equal(parse(resetTree[1].content).pdfOficial,undefined);
  const reglasFile = JSON.parse(treeWrite.options.body).tree.find(item=>item.path.endsWith('__F05-REGLAS-CORRECCION.yaml'));
  assert.equal(parse(reglasFile.content).calificacion.minimosDirectos,null);
  assert.equal(parse(reglasFile.content).partes[1].minimaTransformada,25);
  const reupload = mock([...snapshot([op]), response(200,[{type:'dir',name:'2025'}]), response(200,{encoding:'base64',content:Buffer.from(resetTree[1].content).toString('base64')}), response(404), response(201,{sha:next}), ...Array.from({length:7},()=>response(404)), ...writes()]);
  const again = await subirConvocatoriaPdf(reupload.window,token,id,'2025',pdf,analizar);
  assert.deepEqual(again.datos.pdfOficial.derivados,saved.datos.pdfOficial.derivados);
  assert.equal(again.datos.pdfOficial.sha256,saved.datos.pdfOficial.sha256);
});
test('PDF existente no se sobrescribe y archivo no PDF se rechaza', async () => {
  const op = prepararOposicion('TAI', id);
  const bytes = new TextEncoder().encode('%PDF-1.7');
  const pdf = { name: 'oficial.pdf', size: bytes.length, arrayBuffer: async () => bytes.buffer };
  const record = prepararConvocatoria(op, '2025');
  record.yaml = stringify({...record.datos,pdfOficial:{ruta:'convocatoria-oficial.pdf'}});
  const { window, calls } = mock([...snapshot([op]), response(200, [{ type: 'dir', name: '2025' }]), response(200, { encoding: 'base64', content: Buffer.from(record.yaml).toString('base64') }), response(200, {})]);
  await assert.rejects(subirConvocatoriaPdf(window, token, id, '2025', pdf), /Ya existe/);
  assert.ok(calls.every(call => call.options.method === 'GET'));
  await assert.rejects(subirConvocatoriaPdf(window, token, id, '2025', { ...pdf, name: 'no.txt' }), /PDF/);
});

test('expediente pendiente muestra exclusivamente su primer paso', async () => {
  const op = prepararOposicion('TAI', id);
  const convocatoria = prepararConvocatoria(op, '2025-pi');
  const html = readFileSync(new URL('../dist/oposiciones/index.html', import.meta.url), 'utf8');
  const {window} = new JSDOM(html, {url:'https://example.test/AstroXmind/oposiciones/?o=tai&anio=2025-pi'});
  const mocked = mock([...snapshot([op]), ...snapshot([op]), response(200,[{type:'dir',name:'2025-pi'}]), response(200,{encoding:'base64',content:Buffer.from(convocatoria.yaml).toString('base64')})]);
  window.fetch=mocked.window.fetch; window.atob=atob;
  window.localStorage.setItem('astroxmind:github-token:v1',token);
  const doc=window.document; doc.querySelector('[data-private-authorized]').hidden=false; instalarOposiciones(doc);
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(doc.querySelector('[data-ficha-oposicion]').hidden,true);
  assert.match(doc.querySelector('[data-ficha-convocatoria]').textContent,/2025 · Promoción interna/);
  assert.equal(doc.querySelector('[data-oposicion-detail]').textContent, 'TAI · 2025 · Promoción interna');
  assert.equal(doc.querySelector('[data-alta-titulo]').textContent,'Paso 1 · Subir convocatoria oficial');
  assert.equal(doc.querySelector('[data-pdf-campo]').hidden,false);
  assert.equal(doc.querySelector('#anio-convocatoria').disabled,true);
  assert.equal(doc.querySelector('[data-convocatoria-form] button').disabled,true);
  window.close();
});

test('convocatoria histórica sin modalidad se presenta como ingreso libre', async () => {
  const op=prepararOposicion('TAI',id);
  const convocatoria=prepararConvocatoria(op,'2025');
  const historica={...convocatoria.datos}; delete historica.modalidad;
  const html=readFileSync(new URL('../dist/oposiciones/index.html',import.meta.url),'utf8');
  const {window}=new JSDOM(html,{url:'https://example.test/AstroXmind/oposiciones/?o=tai&anio=2025'});
  const mocked=mock([...snapshot([op]),...snapshot([op]),response(200,[{type:'dir',name:'2025'}]),response(200,{encoding:'base64',content:Buffer.from(stringify(historica)).toString('base64')})]);
  window.fetch=mocked.window.fetch; window.atob=atob; window.localStorage.setItem('astroxmind:github-token:v1',token);
  const doc=window.document; doc.querySelector('[data-private-authorized]').hidden=false; instalarOposiciones(doc);
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(doc.querySelector('[data-oposicion-detail]').textContent,'TAI · 2025 · Ingreso libre');
  window.close();
});

test('programa borrador privado se recupera y se muestra plegable sólo en su expediente',async()=>{
  const op=prepararOposicion('TAI',id), record=prepararConvocatoria(op,'2025');
  const versionId='syllabus-00000000-0000-4000-8000-000000000001';
  const datos={...record.datos,faseActual:'REVISION',pdfOficial:{ruta:record.ruta.replace('convocatoria.yaml','oficial.pdf'),derivados:[],referencia:'FICTICIO',sha256:'a'.repeat(64),temas:1,bloques:[{numero:'I',titulo:'Bloque',temas:1}]},programaBorrador:{estado:'BORRADOR',versionId,sha256Fuente:'a'.repeat(64)}};
  const model={schemaVersion:1,versions:[{id:versionId,status:'draft',oppositionId:id,modalidad:'LIBRE',source:{reference:'FICTICIO',sha256:'a'.repeat(64)}}],calls:[{id:datos.id,year:2025,modalidad:'LIBRE',versionId}],nodes:[
    {id:'n1',versionId,parentId:null,order:1,kind:'block',code:'01',title:'Bloque'},
    {id:'n2',versionId,parentId:'n1',order:1,kind:'topic',code:'01.01',title:'Tema'},
    {id:'n3',versionId,parentId:'n2',order:1,kind:'section',code:'01.01.01',title:'<b>Literal seguro</b>'}
  ]};
  const html=readFileSync(new URL('../dist/oposiciones/index.html',import.meta.url),'utf8');
  const {window}=new JSDOM(html,{url:'https://example.test/AstroXmind/oposiciones/?o=tai&anio=2025#programa-desglosado'});
  const mocked=mock([...snapshot([op]),...snapshot([op]),response(200,[{type:'dir',name:'2025'}]),response(200,{encoding:'base64',content:Buffer.from(stringify(datos)).toString('base64')}),response(200,{encoding:'base64',content:Buffer.from(stringify(model)).toString('base64')})]);
  window.fetch=mocked.window.fetch;window.atob=atob;window.localStorage.setItem('astroxmind:github-token:v1',token);
  const doc=window.document;doc.querySelector('[data-private-authorized]').hidden=false;instalarOposiciones(doc);
  await new Promise(resolve=>setImmediate(resolve));
  const section=doc.querySelector('#programa-desglosado');assert.ok(section);
  assert.match(section.textContent,/BORRADOR.*1 bloques.*1 temas.*3 nodos/);
  assert.match(section.textContent,/<b>Literal seguro<\/b>/);assert.equal(section.querySelector('b'),null);
  [...section.querySelectorAll('button')].find(b=>b.textContent==='Desplegar todo').click();assert.ok([...section.querySelectorAll('details')].every(d=>d.open));
  const nav=section.querySelector('nav[aria-label="Ruta en esta convocatoria"]');
  section.querySelector('[data-programa-nodo="n3"]').click();
  assert.match(nav.textContent,/Convocatoria 2025 LIBRE.*Bloque.*Tema.*Literal seguro/);
  [...nav.querySelectorAll('button')].find(b=>b.textContent==='Bloque').click();
  assert.doesNotMatch(nav.textContent,/Literal seguro/);
  assert.match(nav.textContent,/TAI\.2025\.LBR\.BQ01/);
  [...nav.querySelectorAll('button')].find(b=>b.textContent==='Volver al nodo anterior').click();
  assert.match(nav.textContent,/Literal seguro/);
  assert.ok(mocked.calls.at(-1).url.includes('/Programa/'+versionId+'/programa.yaml?ref='+sha));
  assert.ok(mocked.calls.every(c=>c.options.method==='GET'));
  window.dispatchEvent(new window.Event('astroxmind:private-access-revoked'));assert.equal(doc.querySelector('#programa-desglosado'),null);window.close();
});

function borradorEditable(){
  const op=prepararOposicion('TAI',id), record=prepararConvocatoria(op,'2025');
  const analisis={publicacion:'2025-12-22',referencia:'FICTICIO',anexo:'V',destino:'TAI_LIBRE',programaFuente:[{numero:'I',lineas:[{texto:'I. Área',pagina:1}],temas:[{numero:1,lineas:[{texto:'1. Datos. Redes.',pagina:1}]}]}]};
  const {modelo,versionId}=generarPrograma(analisis,{oppositionId:id,year:2025,modalidad:'LIBRE',artifactId:'ficticio',sha256:'a'.repeat(64)});
  const datos={...record.datos,faseActual:'REVISION',pdfOficial:{ruta:record.ruta.replace('convocatoria.yaml','oficial.pdf'),derivados:[],referencia:'FICTICIO',sha256:'a'.repeat(64),temas:1,bloques:[{numero:'I',titulo:'Área',temas:1}]},programaBorrador:{estado:'BORRADOR',versionId,sha256Fuente:'a'.repeat(64)}};
  const enc=v=>response(200,{encoding:'base64',content:Buffer.from(stringify(v)).toString('base64')});
  return {op,record,modelo,versionId,datos,enc};
}
test('editar programa en la wiki, previsualizar, guardar derivados y conservar expediente',async()=>{
  const {op,modelo,datos,enc}=borradorEditable();
  const html=readFileSync(new URL('../dist/oposiciones/index.html',import.meta.url),'utf8');
  const {window}=new JSDOM(html,{url:'https://example.test/AstroXmind/oposiciones/?o=tai&anio=2025#programa-desglosado'});
  Object.defineProperty(window.crypto,'subtle',{value:webcrypto.subtle});
  const mocked=mock([...snapshot([op]),...snapshot([op]),response(200,[{type:'dir',name:'2025'}]),enc(datos),enc(modelo),...snapshot([op]),enc(datos),enc(modelo),...writes()]);
  window.fetch=mocked.window.fetch;window.atob=atob;window.localStorage.setItem('astroxmind:github-token:v1',token);
  const doc=window.document;doc.querySelector('[data-private-authorized]').hidden=false;instalarOposiciones(doc);
  const esperar=async pred=>{for(let i=0;i<100&&!pred();i++)await new Promise(r=>setTimeout(r,10));assert.ok(pred());};
  await esperar(()=>doc.querySelector('[data-programa-editar]'));
  doc.querySelector('[data-programa-editar]').click();
  const area=doc.querySelector('[data-programa-markdown]'), btn=doc.querySelector('[data-programa-guardar]');
  await esperar(()=>area.value.includes('Redes.'));
  area.value=area.value.replace('Redes. <!--','Redes locales <!--');area.dispatchEvent(new window.Event('input'));
  await esperar(()=>!btn.disabled);
  assert.match(doc.querySelector('.programa-arbol').textContent,/Redes locales/);
  btn.click();
  await esperar(()=>doc.querySelector('[data-programa-estado]').textContent.includes('Borrador guardado'));
  const write=mocked.calls.find(c=>c.url.endsWith('/git/trees')&&c.options.method==='POST');
  const files=JSON.parse(write.options.body).tree;
  assert.deepEqual(files.map(f=>f.path.split('/').at(-1)),['programa.yaml','programa.md']);
  const saved=parse(files[0].content);assert.deepEqual(saved.fragments,modelo.fragments);
  assert.equal(saved.versions[0].status,'draft');assert.ok(saved.nodes.some(n=>n.title==='Redes locales'&&n.titleKind==='editorial'));
  assert.match(area.value,/Redes locales/);
  window.close();
});
test('guardar programa rechaza encabezado obsoleto sin escribir',async()=>{
  const {op,modelo,versionId,datos,enc}=borradorEditable();
  const m=mock([...snapshot([op]),enc(datos),enc(modelo)]);
  m.window.crypto.subtle=webcrypto.subtle;
  const md=exportarProgramaMD(modelo,versionId).replace(/ [a-f0-9]{64} -->/,' '+'0'.repeat(64)+' -->');
  await assert.rejects(guardarBorradorPrograma(m.window,token,id,'2025',versionId,md),/obsoleto/);
  assert.ok(m.calls.every(c=>c.options.method==='GET'));
});

async function solicitudEditorFicticia(){
  const f=borradorEditable(), ns=f.modelo.nodes.filter(n=>n.versionId===f.versionId);
  const lineas=[`- TAI [Convocatoria] [id=${uuid}]`];
  function recorrer(p,d){for(const n of ns.filter(n=>n.parentId===p).sort((a,b)=>a.order-b.order)){lineas.push('  '.repeat(d)+`- ${n.title} [${{block:'Bloque',topic:'Tema',section:'Apartado'}[n.kind]}] [id=${n.id}]`);recorrer(n.id,d+1);}}
  recorrer(null,1);
  const base=await abrirModeloPrograma({crypto:webcrypto},stringify(f.modelo),f.versionId);
  const solicitud={revisionEsperada:null,huellaOficial:base.huella,plantilla:{id:'oposiciones',revision:1,reglas:reglasIniciales},markdown:lineas.join('\n'),correspondencias:ns.map((n,i)=>({nodeId:n.id,entryId:`entry-00000000-0000-4000-8000-${String(i+1).padStart(12,'0')}`}))};
  return {...f,solicitud};
}
test('ED-04B guarda todos los archivos privados en un único commit y reabre la revisión exacta',async()=>{
  const {op,modelo,versionId,datos,enc,solicitud}=await solicitudEditorFicticia();
  const previa=[...snapshot([op]),enc(datos),enc(modelo)];
  const m=mock([...previa,response(404),response(404),...writes()]);m.window.crypto.subtle=webcrypto.subtle;
  const guardado=await guardarEditorV2(m.window,token,id,'2025',versionId,solicitud);
  const treeCalls=m.calls.filter(c=>c.url.endsWith('/git/trees')&&c.options.method==='POST');assert.equal(treeCalls.length,1);
  const files=JSON.parse(treeCalls[0].options.body).tree;
  assert.ok(files.every(f=>f.path.includes(`/Programa/${versionId}/editor-v2/`)));
  assert.equal(files.filter(f=>f.path.endsWith('/actual.yaml')).length,1);
  assert.equal(files.filter(f=>f.path.includes('/entradas/')).length,solicitud.correspondencias.length);
  assert.deepEqual(JSON.parse(m.calls.at(-1).options.body),{sha:next,force:false});
  const raw=txt=>response(200,{encoding:'base64',content:Buffer.from(txt).toString('base64')});
  const pointer=files.find(f=>f.path.endsWith('/actual.yaml')),manifest=files.find(f=>f.path.endsWith('/manifiesto.yaml'));
  const lecturas=JSON.parse(manifest.content).inventario.map(f=>raw(files.find(x=>x.path.endsWith('/'+f.ruta)).content));
  const read=mock([...previa,raw(pointer.content),raw(manifest.content),...lecturas]);read.window.crypto.subtle=webcrypto.subtle;
  const reopened=await abrirEditorV2Guardado(read.window,token,id,'2025',versionId);assert.deepEqual(reopened,guardado);
  assert.ok(read.calls.every(c=>c.options.method==='GET'));
});
test('ED-04B rechaza revisión obsoleta y no fuerza el guardado si falla el avance',async()=>{
  const {op,modelo,versionId,datos,enc,solicitud}=await solicitudEditorFicticia();
  const previa=[...snapshot([op]),enc(datos),enc(modelo)];
  const stale=mock([...previa,response(404)]);stale.window.crypto.subtle=webcrypto.subtle;
  await assert.rejects(guardarEditorV2(stale.window,token,id,'2025',versionId,{...solicitud,revisionEsperada:'b'.repeat(64)}),/obsoleta/);
  assert.ok(stale.calls.every(c=>c.options.method==='GET'));
  const fallido=mock([...previa,response(404),response(404),...writes(409)]);fallido.window.crypto.subtle=webcrypto.subtle;
  await assert.rejects(guardarEditorV2(fallido.window,token,id,'2025',versionId,solicitud));
  assert.equal(fallido.calls.filter(c=>c.options.method==='PATCH').length,1);assert.deepEqual(JSON.parse(fallido.calls.at(-1).options.body),{sha:next,force:false});
});
