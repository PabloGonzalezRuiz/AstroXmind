const isTreeTable = (node) => node.type === 'element'
  && node.tagName === 'table'
  && Array.isArray(node.properties?.className)
  && node.properties.className.includes('ax-tree-table');

const hasText = (node) => {
  if (node.type === 'text') return Boolean(node.value.trim());
  if (node.type === 'element' && ['br', 'img', 'input', 'svg'].includes(node.tagName)) return true;
  return (node.children || []).some(hasText);
};

function visit(node) {
  if (isTreeTable(node)) {
    const removeEmptyCells = (row) => {
      row.children = (row.children || []).filter((cell) => {
        if (cell.type !== 'element' || !['td', 'th'].includes(cell.tagName)) return true;
        if (cell.properties?.dataAxTreeCell) return true;
        return hasText(cell);
      });
    };

    for (const section of node.children || []) {
      if (section.type !== 'element') continue;
      if (section.tagName === 'tr') removeEmptyCells(section);
      else if (['thead', 'tbody', 'tfoot'].includes(section.tagName)) {
        for (const row of section.children || []) if (row.tagName === 'tr') removeEmptyCells(row);
      }
    }
  }

  for (const child of node.children || []) visit(child);
}

export default function rehypeTreeTable() {
  return (tree) => visit(tree);
}
