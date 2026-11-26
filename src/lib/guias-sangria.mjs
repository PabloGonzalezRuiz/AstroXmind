// Ayudas visuales de sangría. No introducen ningún carácter en el textarea.
export function medirSangria(linea, ancho=2){
  let columnas=0, espacios=0, tabs=0;
  for(const c of linea){
    if(c===' '){columnas++;espacios++;}
    else if(c==='\t'){columnas+=ancho-columnas%ancho;tabs++;}
    else break;
  }
  return {columnas,espacios,tabs,nivel:Math.floor(columnas/ancho),incompleta:columnas%ancho!==0};
}
export function posicionSangria(texto,indice){
  const pos=Math.max(0,Math.min(texto.length,indice??0));
  const inicio=pos===0?0:texto.lastIndexOf('\n',pos-1)+1;
  const fin=texto.indexOf('\n',pos);
  const linea=texto.slice(inicio,fin<0?texto.length:fin);
  return medirSangria(linea);
}
export function instalarGuiasSangria(textarea,canvas,botonGuias,botonEspacios,estado){
  const win=textarea.ownerDocument.defaultView;
  const ctx=canvas.getContext('2d');
  if(!win||!ctx)return {actualizar(){}};
  let guias=true,puntos=false,pendiente=false,valor=null,lineas=[];
  function actualizar(){
    if(pendiente)return;
    pendiente=true;win.requestAnimationFrame(dibujar);
  }
  function dibujar(){
    pendiente=false;
    const contenido=textarea.value;
    if(valor!==contenido){valor=contenido;lineas=contenido.split('\n');}
    const actual=posicionSangria(contenido,textarea.selectionStart);
    const etiqueta='Nivel '+actual.nivel+' · '+actual.espacios+' espacios'+(actual.tabs?' · '+actual.tabs+' tabuladores':'')+(actual.incompleta?' · sangría impar':'');
    if(estado.textContent!==etiqueta)estado.textContent=etiqueta;
    const estilo=win.getComputedStyle(textarea),w=textarea.clientWidth,h=textarea.clientHeight,dpr=win.devicePixelRatio||1;
    canvas.style.left=textarea.clientLeft+'px';canvas.style.top=textarea.clientTop+'px';
    canvas.style.width=w+'px';canvas.style.height=h+'px';
    const pw=Math.round(w*dpr),ph=Math.round(h*dpr);
    if(canvas.width!==pw||canvas.height!==ph){canvas.width=pw;canvas.height=ph;}
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
    if(!guias&&!puntos||!w||!h)return;
    const alto=parseFloat(estilo.lineHeight),padX=parseFloat(estilo.paddingLeft),padY=parseFloat(estilo.paddingTop);
    if(!Number.isFinite(alto)||alto<=0)return;
    ctx.font=estilo.fontSize+' '+estilo.fontFamily;
    const ancho=ctx.measureText(' ').width;
    if(!ancho)return;
    const ox=padX-textarea.scrollLeft,oy=padY-textarea.scrollTop;
    const primera=Math.max(0,Math.floor(-oy/alto)),ultima=Math.min(lineas.length-1,Math.ceil((h-oy)/alto));
    // Solo se dibujan filas visibles; el textarea conserva cursor, selección y edición nativa.
    for(let i=primera;i<=ultima;i++){
      const y=oy+i*alto,{columnas,nivel}=medirSangria(lineas[i]);
      if(guias){
        for(let k=1;k<=nivel;k++){
          const x=ox+(k*2-.18)*ancho;
          if(x<0||x>w)continue;
          ctx.beginPath();ctx.strokeStyle=k===actual.nivel?'#1764aa':'rgba(92,114,139,.46)';
          ctx.lineWidth=k===actual.nivel?1.8:1;ctx.moveTo(x,y);ctx.lineTo(x,y+alto);ctx.stroke();
        }
      }
      if(puntos){
        ctx.fillStyle='#64748b';
        for(let k=0;k<columnas;k++){
          const x=ox+(k+.45)*ancho;if(x<0||x>w)continue;
          ctx.beginPath();ctx.arc(x,y+alto/2,1.35,0,Math.PI*2);ctx.fill();
        }
      }
    }
  }
  function alternar(boton,activo){boton.setAttribute('aria-pressed',String(activo));actualizar();}
  botonGuias.addEventListener('click',()=>{guias=!guias;alternar(botonGuias,guias);});
  botonEspacios.addEventListener('click',()=>{puntos=!puntos;alternar(botonEspacios,puntos);});
  for(const evento of ['input','scroll','keyup','click','select','focus','pointerup','selectionchange'])textarea.addEventListener(evento,actualizar);
  textarea.ownerDocument.addEventListener('selectionchange',()=>{if(textarea.ownerDocument.activeElement===textarea)actualizar();});
  win.addEventListener('resize',actualizar);
  if(win.ResizeObserver)new win.ResizeObserver(actualizar).observe(textarea);
  textarea.ownerDocument.fonts?.ready?.then(actualizar);
  actualizar();
  return {actualizar};
}
