// Only recognize published component calls; never compile or evaluate edited JS/MDX.
import { annotateMarkdown, markSourceRange } from './wiki-editor-sync.mjs';
import { buildTreeTableRows, renderTreeTableHtml } from '../../examples/astro-component-lab/src/components/tree-table-model.ts';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { gfm } from 'micromark-extension-gfm';
import catalog from '../../examples/astro-component-lab/src/catalog/components.json' with { type: 'json' };
import { catalogComponentAliases } from './wiki-editor-transform.mjs';

export function splitEditorMdx(source, path) {
  const imports = [];
  const parts = [];
  let markdown = [];
  let fence = '';
  let start = 0;
  const flush = () => { if (markdown.length) parts.push({ markdown: markdown.join('\n'), start }); markdown = []; };
  const normalized = source.replace(/\r\n/g, '\n');
  const treeNames = new Set(['TreeTable', ...catalogComponentAliases(normalized, path)]);
  const frontmatter = normalized.match(/^---\n[\s\S]*?\n---(?:\n|$)/)?.[0].length ?? 0;
  const lines = normalized.slice(frontmatter).split('\n');
  let offset = frontmatter;
  const offsets = lines.map(line => { const current = offset; offset += line.length + 1; return current; });
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!markdown.length) start = offsets[i];
    const marker = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length && /^ {0,3}(`+|~+)\s*$/.test(line)) fence = '';
      markdown.push(line);
      continue;
    }
    if (!fence && /^import\s+.+\s+from\s+['"][^'"]+['"];?\s*$/.test(line)) {
      flush();
      imports.push(line.trim());
      continue;
    }
    if (!fence && /^<ComponentExample\b/.test(line)) {
      const end = lines.findIndex((candidate, index) => index >= i && /<\/ComponentExample>\s*$/.test(candidate));
      if (end !== -1) {
        flush();
        const block = lines.slice(i, end + 1).join('\n').trim();
        parts.push({ block, filename: block.match(/\bfilename="([^"\n]+)"/)?.[1], start: offsets[i], end: offsets[end] + lines[end].length });
        i = end;
        continue;
      }
    }
    const tag = !fence && line.match(/^<([A-Z][\w$]*)(?=\s|>)/)?.[1];
    if (tag && treeNames.has(tag)) {
      const end = lines.findIndex((candidate, index) => index > i && candidate.trimEnd() === `</${tag}>`);
      if (end !== -1) {
        flush();
        parts.push({ tree: true, opening: line, markdown: lines.slice(i + 1, end).join('\n'), start: offsets[i], bodyStart: offsets[i + 1], end: offsets[end] + lines[end].length });
        i = end;
        continue;
      }
      flush();
      parts.push({ tree: true, opening: line, markdown: '', start: offsets[i], bodyStart: offsets[i], end: offsets[i] + line.length, unclosed: true });
      continue;
    }
    markdown.push(line);
  }
  flush();
  return { imports, parts };
}

function treeProperties(opening) {
  const match = opening.match(/^<[A-Z][\w$]*(?=\s|>)(.*)>\s*$/);
  if (!match) throw Error('TreeTable: la etiqueta de apertura debe ocupar una línea.');
  const props = {};
  let rest = match[1].trim();
  while (rest) {
    const attr = rest.match(/^([A-Za-z][\w-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')(?:\s+|$)/);
    if (!attr || !Object.hasOwn(catalog.components['tree-table'].properties.component, attr[1]) || Object.hasOwn(props, attr[1])) throw Error('TreeTable: utiliza propiedades conocidas, sin duplicados, con valores entre comillas.');
    props[attr[1]] = attr[2] ?? attr[3];
    rest = rest.slice(attr[0].length).trim();
  }
  return props;
}

function renderLiveTree(doc, part, renderMarkdown) {
  if (part.unclosed) throw Error('TreeTable: falta la etiqueta de cierre </TreeTable>.');
  const props = treeProperties(part.opening);
  const rows = buildTreeTableRows(renderMarkdown(part.markdown), props);
  const template = doc.createElement('template');
  template.innerHTML = renderTreeTableHtml(rows, `editor-live-${part.start}-`);
  const element = template.content.firstElementChild;
  markSourceRange(element, part.start, part.end);
  // Map pre-order keys to exact list-item label ranges (not their descendants).
  let key = 0;
  const ast = fromMarkdown(part.markdown, { extensions: [gfm()], mdastExtensions: [gfmFromMarkdown()] });
  function visit(list) {
    for (const item of list.children) {
      const labels = item.children.filter(child => child.type !== 'list');
      const cell = element.querySelector(`[data-tree-key="${key++}"]`);
      if (cell && labels.length) markSourceRange(cell, part.bodyStart + item.position.start.offset, part.bodyStart + labels.at(-1).position.end.offset);
      for (const child of item.children.filter(child => child.type === 'list')) visit(child);
    }
  }
  for (const list of ast.children.filter(node => node.type === 'list')) visit(list);
  return element;
}

function namespaceIds(element, prefix) {
  const ids = new Map([...element.querySelectorAll('[id]')].map(node => [node.id, prefix + node.id]));
  for (const node of element.querySelectorAll('[id]')) node.id = ids.get(node.id);
  for (const node of element.querySelectorAll('[href], [aria-labelledby], [aria-controls], [aria-describedby]')) {
    const href = node.getAttribute('href');
    if (href?.startsWith('#') && ids.has(href.slice(1))) node.setAttribute('href', '#' + ids.get(href.slice(1)));
    for (const attr of ['aria-labelledby', 'aria-controls', 'aria-describedby']) {
      if (node.hasAttribute(attr)) node.setAttribute(attr, node.getAttribute(attr).split(/\s+/).map(id => ids.get(id) ?? id).join(' '));
    }
  }
}

export function createMdxPreview(root, original, renderMarkdown) {
  const doc = root.ownerDocument;
  const published = splitEditorMdx(original, root.dataset.sourcePath);
  const template = doc.createElement('template');
  template.innerHTML = root.querySelector('[data-editor-examples]')?.dataset.editorExamples ?? '';
  const templates = template.content;
  const snapshots = new Map();
  for (const part of published.parts) {
    if (!part.filename || snapshots.has(part.block)) continue;
    const matches = [...(templates?.querySelectorAll('[data-example-file]') ?? [])].filter(node => node.dataset.exampleFile === part.filename);
    if (matches.length === 1) snapshots.set(part.block, matches[0]);
  }
  // Import into a detached template first, so custom elements upgrade only once
  // the complete subtree is attached. Cache clones to retain folding and tabs.
  const clones = new Map();
  let liveTrees = new Map();
  let sequence = 0;
  return (source, target) => {
    const { imports, parts } = splitEditorMdx(source, root.dataset.sourcePath);
    // A newly inserted catalog import does not invalidate the existing examples.
    const sameImports = published.imports.every(line => imports.includes(line));
    const fragment = doc.createDocumentFragment();
    const occurrences = new Map();
    const nextLiveTrees = new Map();
    for (const part of parts) {
      if (part.tree) {
        try {
          const key = JSON.stringify([part.start, part.opening, part.markdown, part.unclosed]);
          const element = liveTrees.get(key) ?? renderLiveTree(doc, part, renderMarkdown);
          nextLiveTrees.set(key, element);
          fragment.append(element);
        } catch (error) {
          const warning = doc.createElement('p');
          warning.className = 'editor-mdx-warning';
          warning.textContent = error instanceof Error ? error.message : String(error);
          markSourceRange(warning, part.start, part.end);
          fragment.append(warning);
        }
      } else if ('markdown' in part) {
        const wrapper = doc.createElement('template');
        wrapper.innerHTML = renderMarkdown(part.markdown);
        annotateMarkdown(wrapper.content, part.markdown, part.start);
        fragment.append(wrapper.content);
      } else {
        const snapshot = sameImports && snapshots.get(part.block);
        if (snapshot) {
          const count = occurrences.get(part.block) ?? 0;
          occurrences.set(part.block, count + 1);
          const key = `${part.block}\n${count}`;
          if (!clones.has(key)) {
            const clone = snapshot.cloneNode(true);
            namespaceIds(clone, `editor-example-${++sequence}-`);
            clones.set(key, clone);
          }
          const clone = clones.get(key);
          markSourceRange(clone, part.start, part.end);
          fragment.append(clone);
        } else {
          const message = doc.createElement('p');
          message.className = 'editor-mdx-warning';
          message.textContent = `Componente MDX ${part.filename ?? ''}: la vista previa necesita una nueva compilación para este ejemplo modificado.`;
          markSourceRange(message, part.start, part.end);
          fragment.append(message);
        }
      }
    }
    liveTrees = nextLiveTrees;
    target.replaceChildren(fragment);
  };
}
