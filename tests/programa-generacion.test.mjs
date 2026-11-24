import test from 'node:test';
import assert from 'node:assert/strict';
import { analizarPaginasTAI } from '../src/lib/convocatoria-pdf.mjs';
import { generarPrograma, desglosarLiteral, validarCobertura, exportarProgramaMD, aplicarProgramaMD, serializarPrograma, leerPrograma } from '../scripts/generar-programa.mjs';

const opciones={oppositionId:'op-00000000-0000-4000-8000-000000000001',year:2025,modalidad:'LIBRE',artifactId:'ficticio',sha256:'a'.repeat(64)};
const fuente=()=>({publicacion:'2025-12-22',referencia:'FICTICIO-1',anexo:'V',destino:'TAI_LIBRE',programaFuente:[
 {numero:'I',lineas:[{texto:'I. Área ficticia',pagina:1}],temas:[
   {numero:1,lineas:[{texto:'1. Diseño y gestión. Normas: Ley 19/2013, de 9 de diciembre;',pagina:1},{texto:'derechos y deberes. España. La organización. Siguiente.',pagina:2}]},
   {numero:2,lineas:[{texto:'2. Datos. Redes.',pagina:2}]}
 ]},
 {numero:'II',lineas:[{texto:'II. Otro bloque',pagina:2}],temas:[{numero:1,lineas:[{texto:'1. Dato 2.5. Art. 3. Texto final.',pagina:2}]}]}
]});
const crear=()=>generarPrograma(fuente(),opciones);
test('PROG-02: generación conserva páginas, 2 bloques, 3 temas y todo el literal',()=>{
  const {modelo,versionId}=crear();
  assert.equal(modelo.nodes.filter(n=>n.kind==='block').length,2);
  assert.equal(modelo.nodes.filter(n=>n.kind==='topic').length,3);
  assert.deepEqual(modelo.fragments.find(f=>f.section==='Bloque I · Tema 1').pages,[1,2]);
  assert.deepEqual(validarCobertura(modelo,versionId,fuente()),[]);
  assert.ok(modelo.nodes.some(n=>n.kind==='section'&&n.code.split('.').length===4));
  assert.deepEqual(leerPrograma(serializarPrograma(modelo)),modelo);
});
test('segmentación conserva abreviaturas, cifras, fechas y términos con ñ y acentos',()=>{
  const t='España. La organización. D. Ejemplo. Valor 2.5. Art. 3. Ley 19/2013, de 9 de diciembre. plataforma.NET.';
  const r=desglosarLiteral(t).map(x=>t.slice(x.start,x.end));
  assert.equal(r[0],'España.');assert.equal(r[1],'La organización.');
  assert.ok(r.includes('D. Ejemplo.'));assert.ok(r.includes('Valor 2.5.'));
  assert.ok(r.some(s=>s.includes('Art. 3.')));
  assert.ok(r.some(s=>s.includes('Ley 19/2013, de 9 de diciembre.')));
});
test('reprocesamiento idéntico conserva IDs y cambios editoriales, fuente distinta rechazada',()=>{
  const {modelo,versionId}=crear();const md=exportarProgramaMD(modelo,versionId);
  const n=aplicarProgramaMD(modelo,versionId,md.replace('Diseño y gestión. <!--','Diseño editorial <!--'));
  const r=generarPrograma(fuente(),{...opciones,anterior:n});
  assert.deepEqual(r.modelo,n);assert.equal(r.versionId,versionId);
  assert.throws(()=>generarPrograma(fuente(),{...opciones,sha256:'b'.repeat(64),anterior:n}),/otra fuente/);
});
test('Markdown ida y vuelta conserva modelo completo y escapa títulos',()=>{
  const {modelo,versionId}=crear();
  const n=modelo.nodes.find(n=>n.kind==='section');
  n.title='A <B> & C * [D] \\ prueba';n.titleKind='editorial';
  const md=exportarProgramaMD(modelo,versionId);
  assert.match(md,/&lt;B&gt;/);
  assert.deepEqual(aplicarProgramaMD(modelo,versionId,md),modelo);
});
test('Markdown reordena apartados recalculando código sin alterar identidad ni fuente',()=>{
  const {modelo,versionId}=crear();const tema=modelo.nodes.find(n=>n.kind==='topic'&&n.title==='Datos.');
  const hijos=modelo.nodes.filter(n=>n.parentId===tema.id);
  const filas=exportarProgramaMD(modelo,versionId).split('\n');
  const a=filas.findIndex(l=>l.includes(hijos[0].id)),b=filas.findIndex(l=>l.includes(hijos[1].id));
  [filas[a],filas[b]]=[filas[b],filas[a]];
  const n=aplicarProgramaMD(modelo,versionId,filas.join('\n'));
  assert.equal(n.nodes.find(x=>x.id===hijos[0].id).order,2);
  assert.deepEqual(n.fragments,modelo.fragments);
  assert.deepEqual(validarCobertura(n,versionId,fuente()),[]);
});
test('Markdown rechaza ID faltante, repetido, inventado, base obsoleta y edición aceptada',()=>{
  const {modelo,versionId}=crear();const md=exportarProgramaMD(modelo,versionId);
  const linea=md.split('\n').find(l=>l.includes('<!-- node-'));
  assert.throws(()=>aplicarProgramaMD(modelo,versionId,md.replace(linea,'')));
  assert.throws(()=>aplicarProgramaMD(modelo,versionId,md+linea),/repetido/);
  assert.throws(()=>aplicarProgramaMD(modelo,versionId,md.replace(/node-[0-9a-f-]+/,'node-00000000-0000-4000-8000-000000000999')),/desconocido/);
  assert.throws(()=>aplicarProgramaMD(modelo,versionId,md.replace(/ [a-f0-9]{64} -->/,' '+'0'.repeat(64)+' -->')),/obsoleto/);
  modelo.versions[0].status='accepted';
  assert.throws(()=>aplicarProgramaMD(modelo,versionId,md),/borrador/);
});
test('cobertura detecta pérdida de sección y discrepancia con fuente',()=>{
  const {modelo,versionId}=crear();const n=modelo.nodes.find(n=>n.kind==='section'&&n.title==='Siguiente.');
  modelo.nodes=modelo.nodes.filter(x=>x.id!==n.id);
  assert.ok(validarCobertura(modelo,versionId,fuente()).some(e=>e.includes('sin desglose')));
  const otro=fuente();otro.programaFuente[0].temas[0].lineas[0].texto+=' diferencia';
  assert.ok(validarCobertura(modelo,versionId,otro).some(e=>e.includes('distintos')));
});
test('parser conserva líneas y páginas exactas, sin cabeceras ni pie de BOE',()=>{
  const p=[
    'Núm. 306 Lunes 22 de diciembre de 2024\nBOE-A-2024-123\nANEXO V\ningreso libre en el Cuerpo de Técnicos Auxiliares de Informática\nserá de 100 plazas de las que 10 se reservarán\n2. Proceso de selección.\nmáximo de 80 preguntas; desglosará en 20 preguntas; 5 preguntas adicionales de reserva; 5 preguntas adicionales de reserva; ciento veinte minutos; un tercio del valor de una respuesta correcta; respuestas en blanco no penalizan\n3. Programa.\nI. Bloque uno\n1. Primer fragmento.',
    'BOLETÍN OFICIAL DEL ESTADO\nNúm. 306 Lunes 22 de diciembre de 2024\nSec. II.B. Pág. 3\nSegundo fragmento.\nII. Bloque dos\n1. Tema.\nIII. Bloque tres\n1. Tema.\nIV. Bloque cuatro\n1. Tema.\ncve: BOE-A-2024-123\nVerificable en https://www.boe.es\nANEXO VI'
  ];
  const a=analizarPaginasTAI(p,{},2024);
  assert.deepEqual(a.programaFuente[0].temas[0].lineas.map(l=>l.pagina),[1,2]);
  assert.equal(a.programaFuente[0].temas[0].lineas.map(l=>l.texto).join(' '),'1. Primer fragmento. Segundo fragmento.');
  const {modelo,versionId}=generarPrograma(a,{...opciones,year:2024});
  assert.deepEqual(validarCobertura(modelo,versionId,a),[]);
});
