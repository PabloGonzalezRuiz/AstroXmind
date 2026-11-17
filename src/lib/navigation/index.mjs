/** Navigation identity is editorial metadata, never inferred from folders or URLs. */
export const NAVIGATION_ID_PATTERN = /^doc-[0-9]{6}$/;
const fail = message => { throw new Error(`Navegación: ${message}`); };

/** Explicit YAML timestamp, with milliseconds and timezone; no filesystem/Git defaults. */
export function normalizeNavigationDate(value, context = 'fecha') {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(?:Z|[+-]\d{2}:\d{2})$/.test(value)) fail(`${context}: fecha debe ser ISO con tres cifras de milisegundos y zona horaria.`);
  const date = value.slice(0, 10);
  const calendar = new Date(date + 'T00:00:00.000Z');
  const instant = new Date(value);
  if (!Number.isFinite(calendar.getTime()) || calendar.toISOString().slice(0, 10) !== date || !Number.isFinite(instant.getTime()) || Number(value.slice(11, 13)) > 23) fail(`${context}: fecha inválida.`);
  const normalized = instant.toISOString();
  if (!/^\d{4}-/.test(normalized)) fail(`${context}: fecha fuera del rango UTC admitido.`);
  return normalized;
}

/** Explicit orders first; creation resolves equal orders and all unordered siblings. */
function compareNodes(a, b) {
  if (a.order !== null && b.order === null) return -1;
  if (a.order === null && b.order !== null) return 1;
  if (a.order !== b.order) return a.order - b.order;
  if (a.sortDate !== null && b.sortDate === null) return -1;
  if (a.sortDate === null && b.sortDate !== null) return 1;
  return (a.sortDate ?? '').localeCompare(b.sortDate ?? '', 'en') || a.id.localeCompare(b.id, 'en');
}

export function validateNavigation(value, context = 'documento') {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(`${context}: falta el bloque navigation.`);
  if (Object.keys(value).some(key => !['id', 'parent', 'order', 'created', 'modified'].includes(key))) fail(`${context}: propiedad navigation desconocida.`);
  if (!NAVIGATION_ID_PATTERN.test(value.id ?? '')) fail(`${context}: id debe tener formato doc-000001.`);
  if (value.parent !== null && (typeof value.parent !== 'string' || !NAVIGATION_ID_PATTERN.test(value.parent))) fail(`${value.id}: parent debe ser otro ID o null.`);
  if (value.order !== undefined && (!Number.isSafeInteger(value.order) || value.order < 0)) fail(`${value.id}: order debe ser entero no negativo.`);
  return { id: value.id, parent: value.parent, order: value.order ?? null, created: value.created === undefined ? null : normalizeNavigationDate(value.created, value.id + '.created'), modified: value.modified === undefined ? null : normalizeNavigationDate(value.modified, value.id + '.modified') };
}

/** Build a deterministic public tree. Drafts are validated but never exported. */
export function buildNavigationIndex(entries) {
  const all = new Map();
  for (const entry of entries) {
    const nav = validateNavigation(entry.navigation, entry.source ?? entry.title);
    if (all.has(nav.id)) fail(`id duplicado: ${nav.id}.`);
    if (typeof entry.title !== 'string' || !entry.title.trim()) fail(`${nav.id}: título vacío.`);
    if (typeof entry.url !== 'string' || !entry.url.startsWith('/')) fail(`${nav.id}: URL interna inválida.`);
    if (entry.draft !== undefined && typeof entry.draft !== 'boolean') fail(`${nav.id}: draft debe ser booleano.`);
    all.set(nav.id, { ...nav, sortDate: nav.created ?? nav.modified, title: entry.title, url: entry.url, draft: entry.draft === true });
  }
  if (!all.size) fail('no hay documentos.');
  for (const node of all.values()) {
    if (node.parent === node.id) fail(`autociclo en ${node.id}.`);
    if (node.parent !== null && !all.has(node.parent)) fail(`${node.id}: padre inexistente ${node.parent}.`);
    if (!node.draft && node.parent !== null && all.get(node.parent).draft) fail(`${node.id}: padre borrador no publicable ${node.parent}.`);
  }
  const visited = new Set();
  // Iterative ancestry walk detects cycles, including disconnected cycles.
  for (const node of all.values()) {
    let current = node;
    const path = new Set();
    while (current && !visited.has(current.id)) {
      if (path.has(current.id)) fail(`ciclo en ${current.id}.`);
      path.add(current.id);
      current = current.parent === null ? undefined : all.get(current.parent);
    }
    for (const id of path) visited.add(id);
  }
  const roots = [...all.values()].filter(node => node.parent === null);
  if (roots.length !== 1) fail(`se requiere una sola raíz; encontradas ${roots.length}.`);
  if (roots[0].draft) fail('la raíz no puede ser borrador.');
  const published = [...all.values()].filter(node => !node.draft);
  const urls = new Set();
  const nodes = Object.create(null);
  for (const node of published) {
    if (urls.has(node.url)) fail(`ruta duplicada: ${node.url}.`);
    urls.add(node.url);
    const { draft, ...data } = node;
    nodes[node.id] = { ...data, children: [], ancestors: [], numberPath: [], numberLabel: null, pendingOrder: node.parent !== null && node.order === null };
  }
  for (const node of Object.values(nodes)) if (node.parent !== null) nodes[node.parent].children.push(node.id);
  for (const node of Object.values(nodes)) node.children.sort((a, b) => compareNodes(nodes[a], nodes[b]));
  const traversal = [];
  const stack = [{ id: roots[0].id, ancestors: [] }];
  while (stack.length) {
    const { id, ancestors } = stack.pop();
    const node = nodes[id];
    node.ancestors = Object.freeze(ancestors);
    // The unique root is a container; an unordered parent breaks the numeric path.
    node.numberPath = Object.freeze(node.parent === null || node.order === null ? [] : [...nodes[node.parent].numberPath, node.order]);
    node.numberLabel = node.numberPath.length ? node.numberPath.join('.') : null;
    traversal.push(id);
    for (const child of [...node.children].reverse()) stack.push({ id: child, ancestors: [...ancestors, id] });
    Object.freeze(node.children);
    Object.freeze(node);
  }
  if (traversal.length !== published.length) fail('hay documentos desconectados de la raíz.');
  return Object.freeze({ schemaVersion: 2, rootId: roots[0].id, nodes: Object.freeze(nodes), traversal: Object.freeze(traversal) });
}

export function getNode(index, id) {
  const node = index.nodes[id];
  if (!node) fail(`documento no publicado o desconocido: ${id}.`);
  return node;
}
export function getParent(index, id) {
  const parent = getNode(index, id).parent;
  return parent === null ? null : getNode(index, parent);
}
export function getChildren(index, id) { return getNode(index, id).children.map(child => getNode(index, child)); }
export function getAncestors(index, id) { return getNode(index, id).ancestors.map(parent => getNode(index, parent)); }
export function getDescendants(index, id, { includeSelf = false } = {}) {
  getNode(index, id);
  const start = index.traversal.indexOf(id);
  const result = includeSelf ? [getNode(index, id)] : [];
  for (let i = start + 1; i < index.traversal.length; i++) {
    const node = getNode(index, index.traversal[i]);
    if (!node.ancestors.includes(id)) break;
    result.push(node);
  }
  return result;
}
