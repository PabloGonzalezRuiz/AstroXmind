import { readFileSync, writeFileSync } from 'node:fs';
const source = new URL('../src/semantic/galeria-semantica.md', import.meta.url);
const target = new URL('../src/content/docs/demo-tablas/galeria-semantica.md', import.meta.url);
const escape = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const input = readFileSync(source,'utf8');
let found = 0;
const output = input.replace(/\`\`\`\{arbol\}([^\n]*)\n([\s\S]*?)\n\`\`\`/g, (_all, title, body) => {
  found++;
  const root = {name:title.trim() || 'Árbol', children:[]};
  const stack = [{depth:-1,node:root}];
  for (const line of body.split('\n')) {
    const m = /^( *)(?:- |\* )(.+)$/.exec(line);
    if (!m) {if(line.trim()) throw new Error('Línea no válida en árbol: '+line); continue;}
    const depth = m[1].length;
    while(stack.length > 1 && stack.at(-1).depth >= depth) stack.pop();
    const node={name:m[2].trim(),children:[]};
    stack.at(-1).node.children.push(node);
    stack.push({depth,node});
  }
  const render = (node,open=false) => node.children.length
    ? '<details'+(open?' open':'')+'><summary>'+escape(node.name)+'</summary><div class="ax-sem-children">'+node.children.map(n=>render(n)).join('')+'</div></details>'
    : '<div class="ax-sem-leaf">'+escape(node.name)+'</div>';
  return '<div class="ax-sem-tree">'+render(root,true)+'</div>';
});
if(!found) throw new Error('No se encontró ninguna directiva {arbol}');
writeFileSync(target, output);
console.log('Procesadas '+found+' directivas semánticas');
