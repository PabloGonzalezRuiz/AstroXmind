import { parse, stringify } from 'yaml';
import { validarCobertura, aplicarProgramaMDBase, exportarProgramaMDBase } from './programa-edicion.mjs';

// Web Crypto evita dependencias de Node o evaluación dinámica en el navegador.
async function sha256(window,texto){
  const bytes=new TextEncoder().encode(texto);
  const hash=await window.crypto.subtle.digest('SHA-256',bytes);
  return Array.from(new Uint8Array(hash),x=>x.toString(16).padStart(2,'0')).join('');
}
export async function abrirModeloPrograma(window,texto,versionId){
  if(typeof texto!=='string'||texto.length>1500000)throw Error('El borrador excede el límite de edición.');
  const modelo=parse(texto,{maxAliasCount:0});
  const v=modelo?.versions?.find(x=>x.id===versionId);
  if(!v||v.status!=='draft')throw Error('El programa no está en borrador.');
  if(!Array.isArray(modelo.fragments)||!Array.isArray(modelo.nodes))throw Error('Modelo incompleto.');
  for(const f of modelo.fragments.filter(f=>f.versionId===versionId)){
    if(typeof f.text!=='string'||await sha256(window,f.text)!==f.sha256)throw Error('Evidencia literal alterada.');
  }
  const errores=validarCobertura(modelo,versionId);
  if(errores.length)throw Error(errores.join('\n'));
  const huella=await sha256(window,stringify(modelo));
  return {modelo,huella,md:exportarProgramaMDBase(modelo,versionId,huella)};
}
export function previsualizarModeloPrograma(base,versionId,md){
  if(typeof md!=='string'||md.length>500000)throw Error('El Markdown excede el límite de edición.');
  return aplicarProgramaMDBase(base.modelo,versionId,md,base.huella);
}
export async function prepararGuardadoPrograma(window,base,versionId,md){
  const modelo=previsualizarModeloPrograma(base,versionId,md);
  const huella=await sha256(window,stringify(modelo));
  return {modelo,huella,yaml:stringify(modelo),md:exportarProgramaMDBase(modelo,versionId,huella)};
}
