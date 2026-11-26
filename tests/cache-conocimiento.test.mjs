import test from 'node:test';
import assert from 'node:assert/strict';
import {crearCacheConocimiento} from '../src/lib/cache-conocimiento.mjs';

test('reutiliza solo blobs idénticos y recarga los modificados',async()=>{
 const cache=crearCacheConocimiento(),llamadas=[];let datos={a:'A',b:'B'};
 const leer=async ruta=>{llamadas.push(ruta);return datos[ruta]??null;};
 let l=await cache.lector(new Map([['a','sha1'],['b','sha2']]),leer);
 assert.equal(await l.leerArchivo('a'),'A');assert.equal(await l.leerArchivo('b'),'B');l.confirmar();
 datos={a:'A',b:'B nuevo'};llamadas.length=0;
 l=await cache.lector(new Map([['a','sha1'],['b','sha3']]),leer);
 assert.equal(await l.leerArchivo('a'),'A');assert.equal(await l.leerArchivo('b'),'B nuevo');assert.deepEqual(llamadas,['b']);l.confirmar();
 cache.limpiar();llamadas.length=0;l=await cache.lector(new Map([['a','sha1']]),leer);await l.leerArchivo('a');assert.deepEqual(llamadas,['a']);
});
test('sin hash verificado consulta origen y no publica una carga incompleta',async()=>{
 const cache=crearCacheConocimiento();let llamadas=0;const leer=async()=>{llamadas++;return 'dato';};
 const l=await cache.lector(new Map([['a','sha1']]),leer);await l.leerArchivo('a');
 const otra=await cache.lector(new Map([['a','sha1']]),leer);await otra.leerArchivo('a');assert.equal(llamadas,2);otra.confirmar();
 const incompleta=await cache.lector(new Map(),leer);await incompleta.leerArchivo('a');assert.equal(llamadas,3);
});
test('una carga antigua no repuebla la caché tras limpiar la sesión',async()=>{
 const cache=crearCacheConocimiento(),hashes=new Map([['a','sha1']]);let llamadas=0;
 const leer=async()=>{llamadas++;return 'dato';};const a=await cache.lector(hashes,leer);await a.leerArchivo('a');cache.limpiar();a.confirmar();
 const b=await cache.lector(hashes,leer);await b.leerArchivo('a');assert.equal(llamadas,2);
});
