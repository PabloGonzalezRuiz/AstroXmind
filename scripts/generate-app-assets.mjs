import { mkdirSync, writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const base = (process.env.ASTRO_BASE ?? '/AstroXmind').replace(/\/$/, '');
const out = new URL('../public/app/', import.meta.url);
mkdirSync(out, { recursive: true });
const crc32 = (bytes) => {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let k = 0; k < 8; k++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const name = Buffer.from(type);
  const length = Buffer.alloc(4); length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([length, name, data, crc]);
};
// Icono vectorial rasterizado por coordenadas: libro abierto y tres nodos.
function icon(size) {
  const rows = Buffer.alloc(size * (1 + size * 3));
  const inside = (x,y,a,b,c,d) => x>=a && x<=c && y>=b && y<=d;
  for (let y=0;y<size;y++) for (let x=0;x<size;x++) {
    const u=x/size, v=y/size;
    let color=[17,28,48];
    const book = inside(u,v,.20,.31,.47,.69)||inside(u,v,.51,.31,.78,.69);
    if(book) color=[232,241,250];
    if(inside(u,v,.25,.39,.41,.42)||inside(u,v,.25,.49,.41,.52)||inside(u,v,.57,.39,.72,.42)||inside(u,v,.57,.49,.72,.52)) color=[43,89,125];
    if(inside(u,v,.47,.30,.51,.72)) color=[49,194,183];
    for (const [cx,cy,r] of [[.24,.22,.045],[.50,.18,.045],[.76,.22,.045]]) {
      if((u-cx)**2+(v-cy)**2<r*r) color=[75,221,200];
    }
    if((inside(u,v,.28,.205,.46,.225)||inside(u,v,.54,.205,.72,.225))) color=[75,221,200];
    const pos=y*(1+size*3)+1+x*3;
    for(let i=0;i<3;i++)rows[pos+i]=color[i];
  }
  const header=Buffer.alloc(13);header.writeUInt32BE(size,0);header.writeUInt32BE(size,4);header[8]=8;header[9]=2;
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',deflateSync(rows)),chunk('IEND',Buffer.alloc(0))]);
}
for (const size of [180,192,512]) writeFileSync(new URL(`icon-${size}.png`,out),icon(size));
writeFileSync(new URL('../public/manifest.webmanifest',import.meta.url), JSON.stringify({
  id: `${base}/`, name: 'AstroXmind · Wiki TAI', short_name: 'AstroXmind',
  description: 'Tu wiki privada de estudio TAI', lang:'es', start_url:`${base}/`, scope:`${base}/`,
  display:'standalone', background_color:'#111c30', theme_color:'#111c30',
  icons:[192,512].map(size=>({src:`${base}/app/icon-${size}.png`,sizes:`${size}x${size}`,type:'image/png',purpose:'any maskable'}))
},null,2)+'\n');
console.log(`App assets generated for ${base || '/'}`);
