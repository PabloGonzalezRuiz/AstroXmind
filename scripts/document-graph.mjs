import { parse } from 'node-html-parser';

const visualLimit = 8;
const escape = value => value.replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);

export function documentConnections(index, references) {
  const connections = new Map(index.traversal.map(id => [id, new Map()]));
  function connect(source, target, relation) {
    if (source === target) return;
    const neighbors = connections.get(source);
    if (!neighbors.has(target)) neighbors.set(target, new Set());
    neighbors.get(target).add(relation);
  }
  for (const id of index.traversal) {
    const parent = index.nodes[id].parent;
    if (!parent) continue;
    connect(id, parent, 'Padre');
    connect(parent, id, 'Hijo');
  }
  for (const { source, target } of references) {
    connect(source, target, 'Referencia saliente');
    connect(target, source, 'Referencia entrante');
  }
  return connections;
}

function diagram(neighbors) {
  const nodes = neighbors.slice(0, visualLimit).map((_, i, all) => {
    const angle = (i / all.length) * Math.PI * 2 - Math.PI / 2;
    return { label: i + 1, x: 160 + Math.cos(angle) * 115, y: 130 + Math.sin(angle) * 94 };
  });
  return `<svg viewBox="0 0 320 260" aria-hidden="true" focusable="false">
    ${nodes.map(({x,y}) => `<line x1="160" y1="130" x2="${x}" y2="${y}"/>`).join('')}
    <circle data-graph-center cx="160" cy="130" r="17"/><text data-graph-center x="160" y="130">●</text>
    ${nodes.map(({x,y,label}) => `<circle cx="${x}" cy="${y}" r="15"/><text x="${x}" y="${y}">${label}</text>`).join('')}
  </svg>`;
}

export function addDocumentGraphs(index, references, pages) {
  const connections = documentConnections(index, references);
  for (const id of index.traversal) {
    const page = parse(pages.get(id));
    const graph = page.querySelector('[data-document-graph]');
    if (!graph) throw new Error(`Grafo documental: falta el contenedor para ${id}.`);
    const neighbors = [...connections.get(id)];
    const total = neighbors.length;
    const items = neighbors.map(([neighbor, relations]) => {
      const node = index.nodes[neighbor];
      return `<li><a href="${escape(node.url)}">${escape(node.title)}</a><small>${[...relations].join(' · ')}</small></li>`;
    }).join('');
    graph.innerHTML = `<summary>Mapa de conexiones (${total})</summary>
      <p>Documento actual: <strong>${escape(index.nodes[id].title)}</strong></p>
      ${total ? `<div data-graph-layout>${diagram(neighbors)}<ol>${items}</ol></div>` : '<p>Este documento no tiene conexiones directas.</p>'}
      ${total > visualLimit ? `<p>El dibujo muestra ${visualLimit} conexiones. La lista incluye las ${total}.</p>` : ''}`;
    graph.removeAttribute('hidden');
    pages.set(id, page.toString());
  }
}
