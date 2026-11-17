import { readFileSync, readdirSync } from 'node:fs';
import { resolve, relative, join } from 'node:path';
import { parseDocument } from 'yaml';
import { buildNavigationIndex, NAVIGATION_ID_PATTERN } from '../src/lib/navigation/index.mjs';

export function readFrontmatter(source, label) {
  const match = source.replace(/^\uFEFF/, '').match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error(`Navegación: falta frontmatter YAML en ${label}.`);
  const yaml = parseDocument(match[1], { uniqueKeys: true });
  if (yaml.errors.length) throw new Error(`Navegación: YAML inválido en ${label}: ${yaml.errors[0].message}`);
  const data = yaml.toJS();
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error(`Navegación: frontmatter inválido en ${label}.`);
  return data;
}
export function readIssuedIds(filename) {
  const ledger = JSON.parse(readFileSync(filename, 'utf8'));
  if (ledger.version !== 1 || !Array.isArray(ledger.issued) || ledger.issued.some(id => typeof id !== 'string' || !NAVIGATION_ID_PATTERN.test(id)) || new Set(ledger.issued).size !== ledger.issued.length) {
    throw new Error('Navegación: registro de IDs emitidos inválido.');
  }
  return ledger.issued;
}
function filesIn(folder) {
  return readdirSync(folder, { withFileTypes: true }).sort((a,b)=>a.name.localeCompare(b.name,'en')).flatMap(entry => {
    const path = join(folder, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Navegación: no se admiten enlaces simbólicos en contenido: ${path}.`);
    return entry.isDirectory() ? filesIn(path) : !entry.name.startsWith('_') && /\.(?:md|mdx|markdown|mdown|mkdn|mkd|mdwn)$/.test(entry.name) ? [path] : [];
  });
}
export function documentUrl(path, slug, base = '/', trailingSlash = 'ignore', format = 'directory') {
  if (slug !== undefined && typeof slug !== 'string') throw new Error(`Navegación: slug inválido en ${path}.`);
  let route = slug ?? path.replace(/\.(?:md|mdx|markdown|mdown|mkdn|mkd|mdwn)$/, '').replace(/(^|\/)index$/, '');
  if (route.startsWith('/') || route.includes('\\') || route.split('/').some(part => part === '..' || part === '.') || /[#?]/.test(route)) throw new Error(`Navegación: ruta no soportada ${route}.`);
  route = route.replace(/\/$/, '');
  const prefix = '/' + base.split('/').filter(Boolean).join('/');
  const suffix = route.split('/').filter(Boolean).map(encodeURIComponent).join('/');
  let url = prefix.replace(/\/$/, '') + '/' + suffix;
  if (suffix && (trailingSlash === 'always' || (trailingSlash === 'ignore' && format === 'directory'))) url += '/';
  return url;
}
/** Current root locale only. The scope is explicit, excluding maintenance docs and examples. */
export function loadNavigation(root, { base = '/', trailingSlash = 'ignore', format = 'directory' } = {}) {
  const content = resolve(root, 'src/content/docs');
  const issued = new Set(readIssuedIds(resolve(root, 'navigation-ids.json')));
  const entries = filesIn(content).map(file => {
    const source = relative(content, file).replaceAll('\\', '/');
    const data = readFrontmatter(readFileSync(file, 'utf8'), source);
    if (typeof data.navigation?.id === 'string' && !issued.has(data.navigation.id)) throw new Error(`Navegación: ${source}: ID no reservado; ejecutar npm run navigation:id.`);
    return { source, title: data.title, navigation: data.navigation, draft: data.draft, url: documentUrl(source, data.slug, base, trailingSlash, format) };
  });
  return buildNavigationIndex(entries);
}
