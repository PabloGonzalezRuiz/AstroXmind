import { parse } from 'node-html-parser';
import catalog from '../catalog/components.json' with { type: 'json' };

const contract = catalog.components['tree-table'];
const componentProperties = contract.properties.component;
const nodeProperties = contract.properties.node;
const nodePropertyNames = Object.keys(nodeProperties);
const reservedAssignment = new RegExp(`(?:^|[;,])\\s*(?:${nodePropertyNames.join('|')})\\s*=`);
const cssClassPattern = new RegExp(nodeProperties.class.constraints.pattern);
const levelClassPattern = new RegExp(componentProperties.levelClasses.constraints.entryPattern);
const referencePattern = new RegExp(nodeProperties.id.constraints.pattern);
const startPattern = new RegExp(nodeProperties.start.constraints.pattern);

type HtmlNode = {
  tagName?: string;
  childNodes?: unknown[];
  rawText?: string;
  text?: string;
  getAttribute?: (name: string) => string | undefined;
};
type Numbering = { enabled?: boolean; tiered?: boolean; start?: number };
type TreeNode = { referenceId?: string; labelHtml: string; children: TreeNode[]; numbering?: Numbering; numberLabel?: string; collapsible?: boolean; folded?: boolean; key?: string; parent?: string; nodeClass?: string; resolvedClass?: string };
type TableCell = { referenceId?: string; labelHtml: string; level: number; numberLabel?: string; rowspan?: number; colspan?: number; key: string; parent: string; collapsible: boolean; folded: boolean; resolvedClass?: string };
type NumberingMode = 'none' | 'siblings' | 'path';
export interface Props { numbering?: NumberingMode; collapsible?: boolean | 'true' | 'false'; folded?: boolean | 'true' | 'false'; levelClasses?: string }
export type PropertyOrigin = { kind: 'node' | 'component' | 'level' | 'default' | 'counter'; key?: string; level?: number };
export type NodeProperty = { value: string | boolean | number | null; origin: PropertyOrigin; explicit: boolean; effective: boolean; fallback?: { value: NodeProperty['value']; origin: PropertyOrigin } };
export type NodeInspection = { key: string; parent: string; level: number; label: string; hasChildren: boolean; properties: Record<string, NodeProperty> };

export function buildTreeTableRows(htmlSlot: string, props: Props = {}, inspection?: Map<string, NodeInspection>): TableCell[][] {
  const { numbering = componentProperties.numbering.default, collapsible = componentProperties.collapsible.default, folded = componentProperties.folded.default, levelClasses = componentProperties.levelClasses.default } = props;
  if (![true, false, 'true', 'false'].includes(collapsible)) {
    throw new Error('TreeTable: collapsible debe ser true o false.');
  }
  if (![true, false, 'true', 'false'].includes(folded)) {
    throw new Error('TreeTable: folded debe ser true o false.');
  }
  const defaultFolded = folded === true || folded === 'true';
  const defaultCollapsible = collapsible === true || collapsible === 'true';
  if (!componentProperties.numbering.values.includes(numbering)) {
    throw new Error('TreeTable: numbering debe ser none, siblings o path.');
  }

  // Class names remain CSS tokens, not executable style expressions.
  function validateClass(value: string): string {
    if (value !== nodeProperties.class.constraints.resetValue && !cssClassPattern.test(value)) {
      throw new Error('TreeTable: class debe ser un nombre CSS (letras, números, guion o guion bajo) o none.');
    }
    return value;
  }
  function parseLevelClasses(value: string): Map<number, string> {
    if (typeof value !== 'string') throw new Error('TreeTable: levelClasses debe ser una cadena nivel:Clase separada por punto y coma.');
    const levels = new Map<number, string>();
    if (!value.trim()) return levels;
    for (const entry of value.split(/[;,]/)) {
      const match = entry.trim().match(levelClassPattern);
      if (!match || !Number.isSafeInteger(Number(match[1]))) throw new Error('TreeTable: levelClasses debe contener niveles enteros desde 0 y nombres CSS válidos.');
      const level = Number(match[1]);
      if (levels.has(level)) throw new Error(`TreeTable: nivel duplicado en levelClasses: ${level}.`);
      levels.set(level, validateClass(match[2]));
    }
    return levels;
  }
  const configuredClasses = parseLevelClasses(levelClasses);

  function isElement(node: unknown): node is HtmlNode & { tagName: string } {
    return typeof node === 'object' && node !== null
      && typeof (node as HtmlNode).tagName === 'string';
  }
  const listTags = new Set(['UL', 'OL']);
  const inlineTags = new Set(['b', 'strong', 'i', 'em', 'code', 'kbd', 'samp', 'sub', 'sup', 'del', 'ins', 'span', 'br']);

  function escapeAttribute(value: string): string {
    return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;')
      .replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  }
  function safeHref(value: string): boolean {
    const href = value.trim();
    return /^(https?:|mailto:|#)/i.test(href)
      || href.startsWith('/') || href.startsWith('./') || href.startsWith('../');
  }

  function renderInline(node: unknown): string {
    if (!isElement(node)) {
      const textNode = node as { rawText?: string; text?: string } | null;
      if (!textNode) return '';
      return textNode.rawText ?? escapeAttribute(textNode.text ?? '');
    }
    const tag = node.tagName.toLowerCase();
    if (listTags.has(node.tagName)) return '';
    const content = (node.childNodes ?? []).map(renderInline).join('');
    if (tag === 'a') {
      const href = node.getAttribute?.('href') ?? '';
      const reference = node.getAttribute?.('data-doc-reference');
      return safeHref(href) ? `<a href="${escapeAttribute(href)}"${reference ? ` data-doc-reference="${escapeAttribute(reference)}"` : ''}>${content}</a>` : content;
    }
    if (!inlineTags.has(tag)) return content;
    if (tag === 'br') return '<br />';
    return `<${tag}>${content}</${tag}>`;
  }

  function extractAttributes(labelHtml: string): { referenceId?: string; labelHtml: string; numbering?: Numbering; collapsible?: boolean; folded?: boolean; nodeClass?: string } {
    // Only a trailing, plain-text annotation is metadata; inline code stays literal.
    const match = labelHtml.match(/(?:^|\s)\[([^<>\[\]]+)\](\s*)$/);
    if (!match) {
      const unclosed = labelHtml.match(/(?:^|\s)\[([^<>\[\]]*)$/);
      if (unclosed && reservedAssignment.test(unclosed[1])) {
        throw new Error('TreeTable: falta cerrar la anotación con ].');
      }
      return { labelHtml };
    }
    if (!reservedAssignment.test(match[1])) return { labelHtml };
    const options: Record<string, string> = {};
    for (const entry of match[1].split(/[;,]/)) {
      const option = entry.trim().match(/^([A-Za-z][\w-]*)\s*=\s*([^\s]+)$/);
      if (!option) throw new Error(`TreeTable: opción mal formada «${entry.trim()}». Usa nombre=valor.`);
      const key = option[1];
      if (!nodePropertyNames.includes(key)) {
        throw new Error(`TreeTable: propiedad desconocida «${key}».`);
      }
      if (Object.hasOwn(options, key)) throw new Error(`TreeTable: propiedad duplicada «${key}».`);
      options[option[1]] = option[2];
    }
    for (const name of ['tiered', 'collapsible', 'folded']) {
      if (options[name] !== undefined && !['true', 'false'].includes(options[name])) {
        throw new Error(`TreeTable: ${name} debe ser true o false.`);
      }
    }
    if (options.numbering !== undefined && !nodeProperties.numbering.values.includes(options.numbering)) throw new Error('TreeTable: numbering de nodo debe ser arabic o none.');
    const start = options.start === undefined ? undefined : Number(options.start);
    if (start !== undefined && (!startPattern.test(options.start) || !Number.isSafeInteger(start) || start < nodeProperties.start.constraints.minimum || start > nodeProperties.start.constraints.maximum)) {
      throw new Error('TreeTable: start de numeración debe ser un entero mayor que cero.');
    }
    if (options.id !== undefined && !referencePattern.test(options.id)) {
      throw new Error('TreeTable: id debe tener formato ref-nombre, con letras minúsculas, números y guiones.');
    }
    return {
      referenceId: options.id,
      labelHtml: labelHtml.slice(0, match.index).trimEnd(),
      numbering: options.numbering !== undefined || options.tiered !== undefined || start !== undefined
        ? { enabled: options.numbering === undefined ? undefined : options.numbering === 'arabic', tiered: options.tiered === undefined ? undefined : options.tiered === 'true', start }
        : undefined,
      collapsible: options.collapsible === undefined ? undefined : options.collapsible === 'true',
      folded: options.folded === undefined ? undefined : options.folded === 'true',
      nodeClass: options.class === undefined ? undefined : validateClass(options.class),
    };
  }

  function parseList(list: HtmlNode): TreeNode[] {
    const items = (list.childNodes ?? []).filter(
      (node): node is HtmlNode & { tagName: string } => isElement(node) && node.tagName === 'LI',
    );
    return items.map((li) => {
      const nestedLists = (li.childNodes ?? []).filter(
        (node): node is HtmlNode & { tagName: string } => isElement(node) && listTags.has(node.tagName),
      );
      const rawLabel = (li.childNodes ?? [])
        .filter((node) => !(isElement(node) && listTags.has(node.tagName)))
        .map(renderInline).join('').trim();
      let attributes;
      try {
        attributes = extractAttributes(rawLabel);
        if (!attributes.labelHtml) throw new Error('TreeTable: cada elemento debe tener contenido.');
      } catch (error) {
        const context = parse(rawLabel).text.trim().replace(/\s+/g, ' ').slice(0, 100);
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`${message} Nodo: «${context || '(sin texto)'}».`, { cause: error });
      }
      const { labelHtml, numbering: parsedNumbering, collapsible: nodeCollapsible, folded: nodeFolded, nodeClass, referenceId } = attributes;
      const children = nestedLists.flatMap(parseList);
      return { referenceId, labelHtml, children, numbering: parsedNumbering, numberLabel: undefined, collapsible: nodeCollapsible, folded: nodeFolded, nodeClass };
    });
  }


  const parsedSlot = parse(htmlSlot) as unknown as HtmlNode;
  const rootLists = (parsedSlot.childNodes ?? []).filter(
    (node): node is HtmlNode & { tagName: string } => isElement(node) && listTags.has(node.tagName),
  );
  if (rootLists.length !== 1) {
    throw new Error('TreeTable: el slot MDX debe contener exactamente una lista jerárquica.');
  }
  const tree = parseList(rootLists[0]);
  if (!tree.length) throw new Error('TreeTable: la lista debe contener al menos un nodo.');
  let nextKey = 0;
  const referenceIds = new Set<string>();
  const defaultValue = (value: NodeProperty['value'], kind: PropertyOrigin['kind'] = 'default'): NodeProperty => ({ value, origin: { kind }, explicit: false, effective: true });
  const defaults = {
    numbering: defaultValue(nodeProperties.numbering.default), tiered: defaultValue(nodeProperties.tiered.default),
    collapsible: defaultValue(defaultCollapsible, Object.hasOwn(props, 'collapsible') ? 'component' : 'default'),
    folded: defaultValue(defaultFolded, Object.hasOwn(props, 'folded') ? 'component' : 'default'), class: defaultValue(null),
  };
  function resolveNodes(nodes: TreeNode[], inherited: Record<string, NodeProperty>, parent = '', level = 0, parentPath: number[] = []): void {
    let current = 0;
    for (const node of nodes) {
      if (node.referenceId) {
        if (referenceIds.has(node.referenceId)) throw new Error(`TreeTable: id duplicado ${node.referenceId}.`);
        referenceIds.add(node.referenceId);
      }
      node.key = String(nextKey++);
      node.parent = parent;
      const resolve = (value: NodeProperty['value'] | undefined, prior: NodeProperty): NodeProperty => ({
        value: value === undefined ? prior.value : value, origin: value === undefined ? prior.origin : { kind: 'node', key: node.key },
        explicit: value !== undefined, effective: true, fallback: { value: prior.value, origin: prior.origin },
      });
      const properties: Record<string, NodeProperty> = {
        numbering: resolve(node.numbering?.enabled === undefined ? undefined : node.numbering.enabled ? 'arabic' : 'none', inherited.numbering),
        tiered: resolve(node.numbering?.tiered, inherited.tiered),
        collapsible: resolve(node.collapsible, inherited.collapsible), folded: resolve(node.folded, inherited.folded),
        class: resolve(node.nodeClass, configuredClasses.has(level) ? { ...defaultValue(configuredClasses.get(level)!, 'level'), origin: { kind: 'level', level } } : inherited.class),
        id: resolve(node.referenceId, defaultValue(null)),
      };
      const enabled = properties.numbering.value === 'arabic';
      if (!enabled && (node.numbering?.start !== undefined || node.numbering?.tiered !== undefined)) throw new Error('TreeTable: start y tiered requieren numeración activa, propia o heredada.');
      let nextPath: number[] = [];
      properties.start = resolve(node.numbering?.start, defaultValue(enabled ? current + 1 : null, 'counter'));
      if (enabled) {
        current = Number(properties.start.value);
        nextPath = [...parentPath, current];
        node.numberLabel = numbering === 'path' && properties.tiered.value ? `${nextPath.join('.')}.` : `${current}.`;
      }
      node.collapsible = Boolean(properties.collapsible.value);
      node.folded = Boolean(properties.folded.value);
      node.resolvedClass = properties.class.value === null ? undefined : String(properties.class.value);
      properties.numbering.effective = numbering !== 'none' && enabled;
      properties.tiered.effective = enabled && numbering === 'path';
      properties.start.effective = enabled;
      properties.collapsible.effective = node.children.length > 0;
      properties.folded.effective = node.collapsible && node.children.length > 0;
      inspection?.set(node.key, { key: node.key, parent, level, label: parse(node.labelHtml).text, hasChildren: node.children.length > 0, properties });
      resolveNodes(node.children, properties, node.key, level + 1, nextPath);
    }
  }
  resolveNodes(tree, defaults);

  const spans = new Map<TreeNode, number>();
  let depth = 0;
  function measure(node: TreeNode, level: number): number {
    depth = Math.max(depth, level + 1);
    const span = node.children.reduce((sum, child) => sum + measure(child, level + 1), 0) || 1;
    spans.set(node, span);
    return span;
  }
  const rowCount = tree.reduce((total, node) => total + measure(node, 0), 0);
  const rows: TableCell[][] = Array.from({ length: rowCount }, () => []);

  function place(node: TreeNode, level: number, firstRow: number): void {
    const span = spans.get(node)!;
    const isLeaf = node.children.length === 0;
    const colspan = isLeaf ? Math.max(1, depth - level) : undefined;
    rows[firstRow].push({
      labelHtml: node.labelHtml, referenceId: node.referenceId,
      key: node.key!, parent: node.parent!, collapsible: Boolean(node.collapsible && node.children.length),
      folded: Boolean(node.folded && node.collapsible && node.children.length),
      level, resolvedClass: node.resolvedClass,
      numberLabel: numbering === 'none' ? undefined : node.numberLabel,
      rowspan: span > 1 ? span : undefined,
      colspan: colspan && colspan > 1 ? colspan : undefined,
    });
    let childRow = firstRow;
    for (const child of node.children) {
      place(child, level + 1, childRow);
      childRow += spans.get(child)!;
    }
  }
  let firstRow = 0;
  for (const node of tree) {
    place(node, 0, firstRow);
    firstRow += spans.get(node)!;
  }
  return rows;
}

const escapeAttr = (value: string) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

/** Shared HTML contract for Astro SSR and the live editor. Labels come from renderInline. */
export function renderTreeTableHtml(rows: TableCell[][], idPrefix = ''): string {
  const cells = rows.map(row => `<tr>${row.map(cell => {
    const semantic = cell.resolvedClass && cell.resolvedClass !== 'none' ? cell.resolvedClass : '';
    const attrs = [
      cell.referenceId && `id="${escapeAttr(idPrefix + cell.referenceId)}"`,
      cell.folded && 'data-tree-folded="true"',
      semantic && `data-tree-class="${escapeAttr(semantic)}"`,
      `data-tree-key="${cell.key}"`, `data-tree-parent="${cell.parent}"`, `data-tree-level="${cell.level}"`,
      cell.rowspan && `rowspan="${cell.rowspan}"`, cell.colspan && `colspan="${cell.colspan}"`,
      `class="nivel-${cell.level}${semantic ? ' ' + escapeAttr(semantic) : ''}"`,
    ].filter(Boolean).join(' ');
    return `<td ${attrs}>${cell.collapsible ? '<button class="tree-toggle" type="button" aria-expanded="true" aria-label="Plegar rama" hidden><span aria-hidden="true">−</span></button>' : ''}${cell.numberLabel ? `<span class="tree-number">${escapeAttr(cell.numberLabel)}</span> ` : ''}${cell.labelHtml}</td>`;
  }).join('')}</tr>`).join('');
  return `<astro-xmind-tree-table><div class="tree-table-frame"><div class="tree-table-scroll" role="region" aria-label="Tabla jerárquica" tabindex="0"><table class="xmind-tree-table"><tbody>${cells}</tbody></table></div><div class="tree-actions-layer"><div class="tree-actions"><button class="tree-toggle-all" type="button" aria-label="Plegar todo" title="Plegar todo" hidden><span aria-hidden="true">−</span></button><button class="tree-fullscreen" type="button" aria-label="Ver tabla a pantalla completa" title="Ver tabla a pantalla completa" aria-pressed="false" hidden><svg class="fullscreen-expand" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M8 3h-5v5M16 3h5v5M3 16v5h5M16 21h5v-5" /></svg><svg class="fullscreen-contract" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 8h5V3M16 3v5h5M3 16h5v5M16 21v-5h5" /></svg></button></div></div></div></astro-xmind-tree-table>`;
}
