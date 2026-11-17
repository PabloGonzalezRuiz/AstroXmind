export interface NavigationNode {
  id: string;
  parent: string | null;
  order: number;
  title: string;
  url: string;
  children: readonly string[];
  ancestors: readonly string[];
}
export interface NavigationIndex {
  schemaVersion: number;
  rootId: string;
  nodes: Readonly<Record<string, NavigationNode>>;
  traversal: readonly string[];
}
export interface NavigationContext {
  index: NavigationIndex;
  current: NavigationNode;
  breadcrumbs: NavigationNode[];
  parent: NavigationNode | null;
  children: NavigationNode[];
  previous: NavigationNode | null;
  next: NavigationNode | null;
}
