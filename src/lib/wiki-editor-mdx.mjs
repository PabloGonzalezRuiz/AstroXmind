// Only recognize published component calls; never compile or evaluate edited JS/MDX.
export function splitEditorMdx(source) {
  const imports = [];
  const parts = [];
  let markdown = [];
  let fence = '';
  const flush = () => { if (markdown.length) parts.push({ markdown: markdown.join('\n') }); markdown = []; };
  const lines = source.replace(/\r\n/g, '\n').replace(/^---\n[\s\S]*?\n---(?:\n|$)/, '').split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const marker = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length && /^ {0,3}(`+|~+)\s*$/.test(line)) fence = '';
      markdown.push(line);
      continue;
    }
    if (!fence && /^import\s+.+\s+from\s+['"][^'"]+['"];?\s*$/.test(line)) {
      imports.push(line.trim());
      continue;
    }
    if (!fence && /^<ComponentExample\b/.test(line)) {
      const end = lines.findIndex((candidate, index) => index >= i && /<\/ComponentExample>\s*$/.test(candidate));
      if (end !== -1) {
        flush();
        const block = lines.slice(i, end + 1).join('\n').trim();
        parts.push({ block, filename: block.match(/\bfilename="([^"\n]+)"/)?.[1] });
        i = end;
        continue;
      }
    }
    markdown.push(line);
  }
  flush();
  return { imports, parts };
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
  const published = splitEditorMdx(original);
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
  let sequence = 0;
  return (source, target) => {
    const { imports, parts } = splitEditorMdx(source);
    const sameImports = JSON.stringify(imports) === JSON.stringify(published.imports);
    const fragment = doc.createDocumentFragment();
    const occurrences = new Map();
    for (const part of parts) {
      if ('markdown' in part) {
        const wrapper = doc.createElement('template');
        wrapper.innerHTML = renderMarkdown(part.markdown);
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
          fragment.append(clones.get(key));
        } else {
          const message = doc.createElement('p');
          message.className = 'editor-mdx-warning';
          message.textContent = `Componente MDX ${part.filename ?? ''}: la vista previa necesita una nueva compilación para este ejemplo modificado.`;
          fragment.append(message);
        }
      }
    }
    target.replaceChildren(fragment);
  };
}
