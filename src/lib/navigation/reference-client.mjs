const targetPattern = /^ref-[a-z][a-z0-9-]*$/;

/** Reveal only a requested stable target; normal heading links retain native behaviour. */
export async function revealReferenceTarget(document, id) {
  if (!targetPattern.test(id)) return null;
  const window = document.defaultView;
  const tables = [...document.querySelectorAll('astro-xmind-tree-table')];
  if (tables.length) await window.customElements.whenDefined('astro-xmind-tree-table');
  if (document.querySelector('starlight-tabs')) await window.customElements.whenDefined('starlight-tabs');
  let target = document.getElementById(id);
  if (!target) {
    for (const table of tables) {
      target = table.revealTarget?.(id);
      if (target) break;
    }
  } else {
    // Also covers cells whose ancestors happen to be expanded already.
    target.closest('astro-xmind-tree-table')?.revealTarget?.(id);
  }
  if (!target) return null;
  const ancestors = [];
  for (let element = target.parentElement; element; element = element.parentElement) ancestors.push(element);
  for (const element of ancestors.reverse()) {
    if (element.tagName === 'DETAILS') element.open = true;
    if (element.getAttribute('role') !== 'tabpanel') continue;
    const tabs = element.closest('starlight-tabs');
    const tab = [...(tabs?.querySelectorAll('[role="tab"]') ?? [])].find(candidate =>
      candidate.closest('starlight-tabs') === tabs && candidate.getAttribute('href') === '#' + element.id);
    if (tab?.getAttribute('aria-selected') !== 'true') tab?.click();
  }
  return target;
}

export function installReferenceNavigation(document) {
  const window = document.defaultView;
  let highlighted;
  let request = 0;
  const followHash = async () => {
    const current = ++request;
    let id;
    try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
    const target = await revealReferenceTarget(document, id);
    if (!target || current !== request) return;
    highlighted?.classList.remove('reference-destination');
    highlighted = target;
    target.classList.add('reference-destination');
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'instant' });
    target.focus({ preventScroll: true });
  };
  window.addEventListener('hashchange', followHash);
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const anchor = event.target.closest?.('a[href]');
    if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return;
    const url = new URL(anchor.href, window.location.href);
    if (url.origin === window.location.origin && url.pathname === window.location.pathname && url.search === window.location.search && url.hash === window.location.hash && url.hash.startsWith('#ref-')) {
      event.preventDefault(); void followHash();
    }
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', followHash, {once:true});
  else void followHash();
}
