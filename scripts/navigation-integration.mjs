import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { addDocumentGraphs } from './document-graph.mjs';
import { writeBranchExports } from './branch-export.mjs';
import { loadNavigation } from './navigation-content.mjs';
import { validateRenderedReferences } from './reference-validation.mjs';

/** @returns {import('astro').AstroIntegration} */
export default function navigationIntegration() {
  let config;
  let index;
  return {
    name: 'astroxmind-navigation',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        const moduleId = 'virtual:astroxmind/navigation';
        const resolvedId = '\0' + moduleId;
        updateConfig({ vite: { plugins: [{
          name: 'astroxmind-navigation-index',
          resolveId(id) { if (id === moduleId) return resolvedId; },
          load(id) {
            if (id !== resolvedId) return;
            // Read on each server render, so parent/order edits also work in dev.
            const loader = fileURLToPath(new URL('./navigation-content.mjs', import.meta.url));
            const options = { base: config.base, trailingSlash: config.trailingSlash, format: config.build.format };
            return `import { loadNavigation } from ${JSON.stringify(loader)}; export function getNavigationIndex() { return loadNavigation(${JSON.stringify(fileURLToPath(config.root))}, ${JSON.stringify(options)}); }`;
          },
        }] } });
      },
      'astro:config:done': ({ config: resolved }) => { config = resolved; },
      'astro:build:start': () => {
        index = loadNavigation(fileURLToPath(config.root), { base: config.base, trailingSlash: config.trailingSlash, format: config.build.format });
      },
      'astro:build:done': ({ dir, logger }) => {
        // Fail if route resolution diverges from this static, single-locale project.
        const pages = new Map();
        const files = new Map();
        for (const id of index.traversal) {
          const route = index.nodes[id].url.slice(config.base.replace(/\/$/, '').length).replace(/^\//, '');
          const decoded = decodeURIComponent(route).replace(/\/$/, '');
          const output = config.build.format === 'file' && decoded ? `${decoded}.html` : `${decoded ? decoded + '/' : ''}index.html`;
          if (!existsSync(new URL(output, dir))) throw new Error(`Navegación: falta la página generada para ${id}: ${output}.`);
          const file = new URL(output, dir);
          files.set(id, file);
          pages.set(id, readFileSync(file, 'utf8'));
        }
        const references = validateRenderedReferences(index, pages, { annotate: true });
        addDocumentGraphs(index, references.references, pages);
        for (const [id, html] of pages) writeFileSync(files.get(id), html);
        writeFileSync(new URL('references.json', dir), JSON.stringify(references, null, 2) + '\n');
        logger.info(`Referencias resueltas y verificadas: ${references.references.length}`);
        writeFileSync(new URL('navigation.json', dir), JSON.stringify(index, null, 2) + '\n');
        writeBranchExports(index, pages, dir, config.site, config.base);
        logger.info(`Ramas HTML: ${index.traversal.length} exportaciones`);
        logger.info(`Registro jerárquico: ${index.traversal.length} documentos → navigation.json`);
      },
    },
  };
}
