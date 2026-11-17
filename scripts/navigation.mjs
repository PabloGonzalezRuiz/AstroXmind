import { openSync, closeSync, writeFileSync, renameSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readIssuedIds, loadNavigation } from './navigation-content.mjs';

export function reserveNavigationId(ledgerPath) {
  const lock = ledgerPath + '.lock';
  const temporary = ledgerPath + '.tmp';
  const fd = openSync(lock, 'wx');
  try {
    const issued = readIssuedIds(ledgerPath);
    const next = issued.reduce((max, id) => Math.max(max, Number(id.slice(4))), 0) + 1;
    if (next > 999999) throw new Error('Navegación: espacio de IDs agotado; ampliar el contrato antes de asignar más.');
    const id = `doc-${String(next).padStart(6, '0')}`;
    writeFileSync(temporary, JSON.stringify({ version: 1, issued: [...issued, id] }, null, 2) + '\n');
    renameSync(temporary, ledgerPath);
    return id;
  } finally {
    closeSync(fd);
    unlinkSync(lock);
  }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const root = fileURLToPath(new URL('../', import.meta.url));
    if (process.argv[2] === 'id') console.log(reserveNavigationId(resolve(root, 'navigation-ids.json')));
    else if (process.argv[2] === 'check') {
      const index = loadNavigation(root);
      for (const id of index.traversal) {
        const node = index.nodes[id];
        console.log(`${'  '.repeat(node.ancestors.length)}${id} · ${node.title}`);
      }
      console.log(`Navegación válida: ${index.traversal.length} documentos.`);
    } else throw new Error('Uso: node scripts/navigation.mjs check|id');
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
