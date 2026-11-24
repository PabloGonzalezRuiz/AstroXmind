// Herramienta local de desarrollo: no accede a GitHub ni modifica el expediente.
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, join, basename } from 'node:path';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import { analizarPaginasTAI } from '../src/lib/convocatoria-pdf.mjs';
import { generarPrograma, exportarProgramaMD, aplicarProgramaMD, leerPrograma, serializarPrograma, validarCobertura } from './generar-programa.mjs';

async function escribirSalida(destino,modelo,versionId,informe){
  // Crear un directorio nuevo; nunca sobrescribir artefactos ni fuentes existentes.
  const dir=resolve(destino);
  const yaml=serializarPrograma(modelo), md=exportarProgramaMD(modelo,versionId);
  await mkdir(dir);
  await Promise.all([
    writeFile(join(dir,'programa.yaml'),yaml,{flag:'wx'}),
    writeFile(join(dir,'programa.md'),md,{flag:'wx'}),
    writeFile(join(dir,'validacion.json'),JSON.stringify(informe,null,2)+'\n',{flag:'wx'})
  ]);
  console.log(JSON.stringify(informe,null,2));
}

const [modo,...args]=process.argv.slice(2);
if(modo==='generar'&&[6,7].includes(args.length)){
  const [pdf,oppositionId,year,modalidad,artifactId,destino,base]=args;
  const anterior=base?leerPrograma(await readFile(base,'utf8')):null;
  const bytes=await readFile(pdf),sha256=createHash('sha256').update(bytes).digest('hex');
  const documento=await pdfjs.getDocument({data:new Uint8Array(bytes),isEvalSupported:false,enableXfa:false,stopAtErrors:true}).promise;
  const paginas=[];
  try{
    for(let i=1;i<=documento.numPages;i++){
      const c=await (await documento.getPage(i)).getTextContent();
      paginas.push(c.items.map(x=>'str' in x?x.str+(x.hasEOL?'\n':' '):'').join(''));
    }
    const {info}=await documento.getMetadata();
    const analisis=analizarPaginasTAI(paginas,info,Number(year),modalidad);
    const {modelo,versionId}=generarPrograma(analisis,{oppositionId,year:Number(year),modalidad,artifactId,sha256,anterior});
    const errores=validarCobertura(modelo,versionId,analisis);
    if(errores.length)throw Error(errores.join('\n'));
    const md=exportarProgramaMD(modelo,versionId);
    aplicarProgramaMD(modelo,versionId,md);
    const informe={estado:'BORRADOR',fuente:basename(pdf),sha256,versionId,paginas:[...new Set(modelo.fragments.filter(f=>f.versionId===versionId).flatMap(f=>f.pages))],bloques:analisis.bloques.map(b=>({numero:b.numero,temas:b.temas.length})),nodos:modelo.nodes.filter(n=>n.versionId===versionId).length,fragmentos:modelo.fragments.filter(f=>f.versionId===versionId).length,cobertura:'completa respecto del texto extraído',reconciliacion:'correcta',aceptacionOficial:false};
    await escribirSalida(destino,modelo,versionId,informe);
  }finally{await documento.destroy();}
}else if(modo==='editar'&&args.length===4){
  const [yaml,versionId,md,destino]=args;
  const original=leerPrograma(await readFile(yaml,'utf8'));
  const modelo=aplicarProgramaMD(original,versionId,await readFile(md,'utf8'));
  await escribirSalida(destino,modelo,versionId,{estado:'BORRADOR',versionId,cobertura:'conservada',aceptacionOficial:false});
}else{
  console.error('Uso: node scripts/procesar-programa.mjs generar PDF OP_ID AÑO MODALIDAD ARTIFACT_ID DIRECTORIO_NUEVO [YAML_PREVIO]');
  console.error('     node scripts/procesar-programa.mjs editar YAML VERSION_ID MD DIRECTORIO_NUEVO');
  process.exitCode=1;
}
