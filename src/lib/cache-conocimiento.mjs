// Caché efímera por ruta y SHA de blob. No almacena credenciales ni escribe en disco.
// El inventario de hashes debe proceder de la misma instantánea Git validada.
export function crearCacheConocimiento(){
 let entradas=new Map(),generacion=0;
 return Object.freeze({
  limpiar(){entradas=new Map();generacion++;},
  async lector(hashes,leer){
   const anterior=entradas,nuevo=new Map(),g=++generacion;
   return {
    async leerArchivo(ruta){
      const sha=hashes.get(ruta);
      if(!sha)return leer(ruta);
      const previo=anterior.get(ruta);
      const texto=previo?.sha===sha?previo.texto:await leer(ruta);
      if(typeof texto==='string')nuevo.set(ruta,{sha,texto});
      return texto;
    },
    confirmar(){if(g===generacion)entradas=nuevo;}
   };
  }
 });
}
