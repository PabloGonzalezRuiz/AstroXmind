/** Check the exact saved source in the published HTML, not just a successful build. */
export function matchesPublishedSource(window, html, path, source) {
  const page = new window.DOMParser().parseFromString(html, 'text/html');
  const editor = [...page.querySelectorAll('[data-wiki-editor]')].find(candidate => candidate.dataset.sourcePath === path);
  const textarea = editor?.querySelector('textarea');
  return !!textarea && textarea.value === source.replace(/\r\n/g, '\n');
}

export async function waitForPublication(window, { path, source, commit, signal, timeout = 180000, interval = 4000 }) {
  const deadline = Date.now() + timeout;
  const url = new URL(window.location.href);
  url.hash = '';
  url.searchParams.set('_astroxmind_revision', commit);
  while (!signal.aborted && Date.now() < deadline) {
    try {
      const response = await window.fetch(url.href, { cache: 'no-store', redirect: 'error', signal: window.AbortSignal.any([signal, window.AbortSignal.timeout(Math.min(10000, Math.max(1, deadline - Date.now())))]) });
      if (response.ok && matchesPublishedSource(window, await response.text(), path, source)) return true;
    } catch { /* The CDN or network may be temporarily unavailable. */ }
    if (signal.aborted || Date.now() >= deadline) break;
    await new Promise(resolve => {
      const finish = () => { window.clearTimeout(timer); signal.removeEventListener('abort', finish); resolve(); };
      const timer = window.setTimeout(finish, Math.min(interval, Math.max(0, deadline - Date.now())));
      signal.addEventListener('abort', finish, { once: true });
      if (signal.aborted) finish();
    });
  }
  return false;
}
