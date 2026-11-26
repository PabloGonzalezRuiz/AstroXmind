import {test} from 'node:test';
import assert from 'node:assert/strict';
import {medirSangria,posicionSangria} from '../src/lib/guias-sangria.mjs';
test('dos espacios por nivel y detección de sangría impar',()=>{
 assert.deepEqual(medirSangria('    - Tema'),{columnas:4,espacios:4,tabs:0,nivel:2,incompleta:false});
 assert.equal(medirSangria('   - Tema').incompleta,true);
 assert.equal(medirSangria('- Raíz').nivel,0);
});
test('tabuladores importados se cuentan por columnas sin modificar el texto',()=>{
 const texto=' \t  - A';
 assert.deepEqual(medirSangria(texto),{columnas:4,espacios:3,tabs:1,nivel:2,incompleta:false});
 assert.equal(texto,' \t  - A');
});
test('la guía activa corresponde a la línea del cursor',()=>{
 const md='- raíz\n  - bloque\n    - tema\n  - segundo bloque';
 assert.equal(posicionSangria(md,md.indexOf('tema')).nivel,2);
 assert.equal(posicionSangria(md,md.indexOf('segundo')).nivel,1);
 assert.equal(posicionSangria(md,0).nivel,0);
});
test('cursor en línea vacía y final de documento',()=>{
 assert.equal(posicionSangria('- raíz\n\n  - bloque',7).nivel,0);
 assert.equal(posicionSangria('- raíz\n  ',99).nivel,1);
});
