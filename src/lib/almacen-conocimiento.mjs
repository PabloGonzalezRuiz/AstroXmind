import {parse,stringify} from 'yaml';
import {crearIndiceConocimiento} from './indice-conocimiento.mjs';

const exigir=(ok,m)=>{if(!ok)throw Error(m);};
const uuid='[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}';
const docPat=new RegExp(`^doc-${uuid}$`),callPat=new RegExp(`^op-${uuid}-(19|20|21)\\d{2}(-pi)?$`),eventoPat=new RegExp(`^${uuid}$`);
export const rutaCatalogo='Conocimiento/catalogo.yaml';
const rutaDocumento=id=>`Conocimiento/Documentos/${id}/metadatos.yaml`;
const rutaEvento=id=>`Conocimiento/Historial/${id}.yaml`;
const rutaEstado=call=>`Conocimiento/Retiradas/${call}.yaml`;
const leer=s=>parse(s,{maxAliasCount:0});
const archivo=(ruta,datos)=>({ruta,yaml:stringify(datos)});

// El inventario solo enumera IDs; las pertenencias se editan exclusivamente en los metadatos canónicos.
// leerArchivo debe leer siempre el mismo HEAD y guardar debe hacer un avance no forzado desde él.
export async function abrirCatalogoConocimiento({revision,leerArchivo,guardar,generarId=()=>globalThis.crypto.randomUUID()}){
  const texto=await leerArchivo(rutaCatalogo);
  exigir(typeof texto==='string','Catálogo de conocimiento aún no inicializado.');
  const catalogo=leer(texto), ids=catalogo?.documentos;
  exigir(catalogo?.schemaVersion===1&&Array.isArray(ids)&&ids.every(id=>typeof id==='string'&&docPat.test(id))&&new Set(ids).size===ids.length,'Inventario de conocimiento inválido.');
  const documentos=[];
  for(let i=0;i<ids.length;i+=8){
    documentos.push(...await Promise.all(ids.slice(i,i+8).map(async id=>{
      const t=await leerArchivo(rutaDocumento(id));exigir(typeof t==='string','Metadatos ausentes: '+id);
      const d=leer(t);exigir(d?.id===id&&d.schemaVersion===1&&Array.isArray(d.pertenencias)&&d.pertenencias.every(p=>callPat.test(p?.convocatoriaId??'')),'Metadatos inválidos: '+id);return d;
    })));
  }
  const indice=crearIndiceConocimiento(documentos,revision),mapa=new Map(documentos.map(d=>[d.id,d]));
  let consumido=false;
  async function estado(call){const t=await leerArchivo(rutaEstado(call));if(t===null)return null;const e=leer(t);exigir(e?.schemaVersion===1&&e.convocatoriaId===call&&eventoPat.test(e.evento)&&['retirada','restauración'].includes(e.tipo),'Estado histórico inválido.');return e;}
  async function persistir(call,tipo,plan,anterior){
    exigir(!consumido,'Instantánea ya utilizada; vuelve a abrir el catálogo.');
    const id=generarId();exigir(eventoPat.test(id),'ID de operación inválido.');
    exigir(await leerArchivo(rutaEvento(id))===null,'El ID de operación ya existe.');
    exigir(!consumido,'Instantánea ya utilizada; vuelve a abrir el catálogo.');
    const evento={schemaVersion:1,id,tipo,convocatoriaId:call,anterior:anterior?.evento??null,plan};
    const cambios=plan.cambios.map(c=>archivo(rutaDocumento(c.id),{...mapa.get(c.id),pertenencias:c.despues}));
    cambios.push(archivo(rutaEvento(id),evento),archivo(rutaEstado(call),{schemaVersion:1,convocatoriaId:call,tipo,evento:id}));
    consumido=true; // Tras cualquier intento, incluso incierto, se exige nueva lectura.
    const nueva=await guardar(cambios,`Conocimiento: ${tipo} ${call}`);
    exigir(typeof nueva==='string'&&nueva!==revision,'Guardado no confirmado; consulta el catálogo antes de reintentar.');
    return {simulado:false,revision:nueva,evento:id,plan};
  }
  return Object.freeze({indice,
    async retirar(call,{revisionEsperada,confirmado=false}={}){
      exigir(callPat.test(call??'')&&revisionEsperada===revision,'Convocatoria o revisión inválida.');
      const previo=await estado(call);exigir(previo?.tipo!=='retirada','La convocatoria ya está retirada.');
      const plan=indice.planificarRetirada(call,revisionEsperada);
      return confirmado?persistir(call,'retirada',plan,previo):{simulado:true,plan};
    },
    async restaurar(call,{revisionEsperada,confirmado=false}={}){
      exigir(callPat.test(call??'')&&revisionEsperada===revision,'Convocatoria o revisión inválida.');
      const previo=await estado(call);exigir(previo?.tipo==='retirada','No existe una retirada vigente para restaurar.');
      const texto=await leerArchivo(rutaEvento(previo.evento));exigir(typeof texto==='string','Histórico ausente.');
      const e=leer(texto);exigir(e?.schemaVersion===1&&e.id===previo.evento&&e.tipo==='retirada'&&e.convocatoriaId===call&&e.plan?.convocatoriaId===call,'Histórico incoherente.');
      const plan=indice.planificarRestauracion(e.plan,revisionEsperada);
      return confirmado?persistir(call,'restauración',plan,previo):{simulado:true,plan};
    }
  });
}
