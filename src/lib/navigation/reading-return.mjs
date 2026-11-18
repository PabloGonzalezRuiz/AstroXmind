const storageKey = 'astroxmind-reading-return-v1';
const limit = 12;
const linkSelector = 'a[data-doc-reference], [data-reference-relations] a[href]';
const tableTag = 'astro-xmind-tree-table';

export function installReadingReturn(document) {
  const window = document.defaultView;
  const { location } = window;
  const read = () => {
    try {
      return JSON.parse(window.sessionStorage.getItem(storageKey)) ?? { trail: [] };
    } catch {
      return { trail: [] };
    }
  };
  const write = value => {
    try {
      window.sessionStorage.setItem(storageKey, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  };
  const samePage = (first, second) => {
    const a = new URL(first, location.href);
    const b = new URL(second, location.href);
    return a.origin === b.origin && a.pathname === b.pathname && a.search === b.search;
  };
  const normalClick = event => !event.defaultPrevented && event.button === 0 &&
    !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey;
  const tables = () => [...document.querySelectorAll(tableTag)];
  const tabs = () => [...document.querySelectorAll('starlight-tabs')];
  const controls = group => [...group.querySelectorAll('[role="tab"]')]
    .filter(tab => tab.closest('starlight-tabs') === group);
  const disclosures = () => [...document.querySelectorAll('main details, [data-reference-relations] details')];
  const linkList = () => [...document.querySelectorAll(linkSelector)];

  const initial = read();
  const pending = initial.pending?.url === location.href ? initial.pending : undefined;
  if (initial.pending) write({ trail: initial.trail });

  const initialize = async () => {
    const returnLink = document.querySelector('[data-reading-return]');
    const { trail } = read();
    const previous = trail.at(-1);
    if (returnLink && previous?.target === location.href && new URL(previous.url).origin === location.origin) {
      returnLink.href = previous.url;
      returnLink.hidden = false;
      returnLink.addEventListener('click', event => {
        if (!normalClick(event)) return;
        write({ trail: trail.slice(0, -1), pending: previous });
      });
    }
    if (!pending) return;
    const treeTables = tables();
    const tabGroups = tabs();
    if (treeTables.length) await window.customElements.whenDefined(tableTag);
    if (tabGroups.length) await window.customElements.whenDefined('starlight-tabs');
    tabGroups.forEach((group, index) => {
      const tab = controls(group)[pending.tabs[index]];
      if (tab && tab.getAttribute('aria-selected') !== 'true') tab.click();
    });
    treeTables.forEach((table, index) => {
      if (pending.tables[index]) table.restoreReadingState?.(pending.tables[index]);
    });
    disclosures().forEach((element, index) => {
      if (index < pending.disclosures.length) element.open = pending.disclosures[index];
    });
    const focus = pending.focusId ? document.getElementById(pending.focusId) : linkList()[pending.focusIndex];
    focus?.focus({ preventScroll: true });
    window.scrollTo({ left: pending.x, top: pending.y, behavior: 'instant' });
  };

  document.addEventListener('click', event => {
    if (!normalClick(event)) return;
    const link = event.target.closest?.(linkSelector);
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const target = new URL(link.href);
    if (target.origin !== location.origin || samePage(target, location.href)) return;
    const { trail } = read();
    const chain = trail.at(-1)?.target === location.href ? trail : [];
    write({ trail: [...chain, {
      url: location.href,
      target: target.href,
      x: window.scrollX,
      y: window.scrollY,
      focusId: link.id,
      focusIndex: linkList().indexOf(link),
      tabs: tabs().map(group => controls(group).findIndex(tab => tab.getAttribute('aria-selected') === 'true')),
      tables: tables().map(table => table.captureReadingState?.() ?? null),
      disclosures: disclosures().map(element => element.open),
    }].slice(-limit) });
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else void initialize();
  return Boolean(pending);
}
