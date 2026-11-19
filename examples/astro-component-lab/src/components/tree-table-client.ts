interface TreeReadingState { folded: string[]; x: number; y: number }
class AstroXmindTreeTable extends HTMLElement {
  captureReadingState?: () => TreeReadingState;
  restoreReadingState?: (state: TreeReadingState) => void;
  private findAndReveal?: (id: string) => HTMLElement | null;
  revealTarget(id: string): HTMLElement | null { return this.findAndReveal?.(id) ?? null; }
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = 'true';
    const frame = this.querySelector<HTMLElement>('.tree-table-frame')!;
    const fullscreenButton = this.querySelector<HTMLButtonElement>('.tree-fullscreen')!;
    let previousOverflow = '';
    let previousFocus: HTMLElement | null = null;
    let pendingFullscreen = false;
    const isFullscreen = () => document.fullscreenElement === frame || frame.classList.contains('is-fullscreen');
    const updateFullscreen = () => {
      const active = isFullscreen();
      const label = active ? 'Salir de pantalla completa (Escape)' : 'Ver tabla a pantalla completa';
      fullscreenButton.setAttribute('aria-pressed', String(active));
      fullscreenButton.setAttribute('aria-label', label);
      fullscreenButton.title = label;
      if (active) fullscreenButton.focus({ preventScroll: true });
      else if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
    const exitFallback = () => {
      frame.classList.remove('is-fullscreen');
      frame.removeAttribute('role');
      frame.removeAttribute('aria-modal');
      frame.removeAttribute('aria-label');
      document.body.style.overflow = previousOverflow;
      updateFullscreen();
    };
    fullscreenButton.hidden = false;
    fullscreenButton.addEventListener('click', async () => {
      if (pendingFullscreen) return;
      pendingFullscreen = true;
      try {
        if (frame.classList.contains('is-fullscreen')) { exitFallback(); return; }
        if (document.fullscreenElement === frame) { await document.exitFullscreen(); return; }
        previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : fullscreenButton;
        if (document.fullscreenEnabled && frame.requestFullscreen) {
          try { await frame.requestFullscreen(); updateFullscreen(); return; }
          catch { /* Browser policy may reject fullscreen; expand within the viewport instead. */ }
        }
        previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        frame.classList.add('is-fullscreen');
        frame.setAttribute('role', 'dialog');
        frame.setAttribute('aria-modal', 'true');
        frame.setAttribute('aria-label', 'Tabla a pantalla completa');
        updateFullscreen();
      } finally { pendingFullscreen = false; }
    });
    frame.addEventListener('fullscreenchange', updateFullscreen);
    frame.addEventListener('keydown', (event) => {
      if (!frame.classList.contains('is-fullscreen')) return;
      if (event.key === 'Escape') { event.preventDefault(); exitFallback(); }
      if (event.key === 'Tab') {
        const focusable = Array.from(frame.querySelectorAll<HTMLElement>('button:not([hidden]), a[href], [tabindex="0"]'))
          .filter(element => !element.closest('[hidden]'));
        const first = focusable[0], last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    });
    const body = this.querySelector('tbody')!;
    const cells = Array.from(body.querySelectorAll<HTMLTableCellElement>('td[data-tree-key]'));
    const children = new Map<string, HTMLTableCellElement[]>();
    const toggleAll = this.querySelector<HTMLButtonElement>('.tree-toggle-all')!;
    const foldableKeys = cells.filter(cell => cell.querySelector('.tree-toggle')).map(cell => cell.dataset.treeKey!);
    const collapsed = new Set(cells.filter(cell => cell.dataset.treeFolded === 'true').map(cell => cell.dataset.treeKey!));
    let depth = 0;
    for (const cell of cells) {
      const parent = cell.dataset.treeParent!;
      let siblings = children.get(parent);
      if (!siblings) {
        siblings = [];
        children.set(parent, siblings);
      }
      siblings.push(cell);
      depth = Math.max(depth, Number(cell.dataset.treeLevel) + 1);
    }
    const allCollapsed = () => foldableKeys.every(key => collapsed.has(key));
    const syncToggleAll = () => {
      const expand = allCollapsed();
      const label = expand ? 'Desplegar todo' : 'Plegar todo';
      toggleAll.setAttribute('aria-label', label);
      toggleAll.title = label;
      toggleAll.querySelector('span')!.textContent = expand ? '+' : '−';
    };
    const redraw = () => {
      const rows: HTMLTableCellElement[][] = [];
      const place = (cell: HTMLTableCellElement, firstRow: number): number => {
        const key = cell.dataset.treeKey!;
        const descendants = collapsed.has(key) ? [] : (children.get(key) ?? []);
        (rows[firstRow] ??= []).push(cell);
        let span = 0;
        for (const child of descendants) span += place(child, firstRow + span);
        span = Math.max(1, span);
        cell.rowSpan = span;
        cell.colSpan = descendants.length ? 1 : depth - Number(cell.dataset.treeLevel);
        return span;
      };
      let row = 0;
      for (const root of children.get('') ?? []) row += place(root, row);
      body.replaceChildren(...rows.map(cells => {
        const tr = document.createElement('tr');
        tr.append(...cells);
        return tr;
      }));
      syncToggleAll();
    };
    const scroller = this.querySelector<HTMLElement>('.tree-table-scroll')!;
    const syncToggle = (cell: HTMLTableCellElement) => {
      const button = cell.querySelector<HTMLButtonElement>('.tree-toggle');
      if (!button) return;
      const expanded = !collapsed.has(cell.dataset.treeKey!);
      button.setAttribute('aria-expanded', String(expanded));
      button.setAttribute('aria-label', expanded ? 'Plegar rama' : 'Desplegar rama');
      button.querySelector('span')!.textContent = expanded ? '−' : '+';
    };
    this.captureReadingState = () => ({ folded: [...collapsed], x: scroller.scrollLeft, y: scroller.scrollTop });
    this.restoreReadingState = ({ folded, x, y }) => {
      collapsed.clear();
      const foldedKeys = new Set(folded);
      for (const cell of cells) {
        if (foldedKeys.has(cell.dataset.treeKey!)) collapsed.add(cell.dataset.treeKey!);
        syncToggle(cell);
      }
      redraw();
      scroller.scrollLeft = x;
      scroller.scrollTop = y;
    };
    for (const cell of cells) {
      const button = cell.querySelector<HTMLButtonElement>('.tree-toggle');
      if (!button) continue;
      button.hidden = false;
      syncToggle(cell);
      button.addEventListener('click', () => {
        const key = cell.dataset.treeKey!;
        if (collapsed.has(key)) collapsed.delete(key); else collapsed.add(key);
        syncToggle(cell);
        const hadFocus = document.activeElement === button;
        redraw();
        if (hadFocus) button.focus({ preventScroll: true });
      });
    }
    if (foldableKeys.length) {
      toggleAll.hidden = false;
      syncToggleAll();
      toggleAll.addEventListener('click', () => {
        this.restoreReadingState?.({
          folded: allCollapsed() ? [] : foldableKeys,
          x: scroller.scrollLeft,
          y: scroller.scrollTop,
        });
      });
    }
    this.findAndReveal = (id) => {
      // Folded cells are detached from the DOM but remain in this instance's map.
      let target: HTMLElement | undefined;
      const cell = cells.find(candidate => {
        target = candidate.id === id ? candidate : Array.from(candidate.querySelectorAll<HTMLElement>('[id]'))
          .find(element => element.id === id);
        return target !== undefined;
      });
      if (!cell) return null;
      const byKey = new Map(cells.map(cell => [cell.dataset.treeKey!, cell]));
      let parent = cell.dataset.treeParent;
      while (parent) {
        collapsed.delete(parent);
        const ancestor = byKey.get(parent)!;
        syncToggle(ancestor);
        parent = ancestor.dataset.treeParent;
      }
      redraw();
      return target ?? null;
    };
    if (collapsed.size) redraw();
  }
}
if (!customElements.get('astro-xmind-tree-table')) customElements.define('astro-xmind-tree-table', AstroXmindTreeTable);
