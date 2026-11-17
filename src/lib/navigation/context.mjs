import { getNode, getParent, getChildren, getAncestors } from './index.mjs';

/**
 * Reading order is pre-order across the entire public tree, not just siblings.
 * @param {import('./types').NavigationIndex} index
 * @param {string} id
 * @returns {import('./types').NavigationContext}
 */
export function getNavigationContext(index, id) {
  const current = getNode(index, id);
  const position = index.traversal.indexOf(id);
  return {
    index, current,
    breadcrumbs: [...getAncestors(index, id), current],
    parent: getParent(index, id),
    children: getChildren(index, id),
    previous: position > 0 ? getNode(index, index.traversal[position - 1]) : null,
    next: position + 1 < index.traversal.length ? getNode(index, index.traversal[position + 1]) : null,
  };
}
