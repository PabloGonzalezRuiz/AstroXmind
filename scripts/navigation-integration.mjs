import { writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { loadNavigation } from './navigation-content.mjs';

/** @returns {import('astro').AstroIntegration} */
export default function navigationIntegration() {
  let config;
  let index;
  return {
    name: 'astroxmind-navigation',
    hooks: {
      'astro:config:done': ({ config: resolved }) => { config = resolved; },
      'astro:build:start': () => {
        index = loadNavigation(fileURLToPath(config.root), { base: config.base, trailingSlash: config.trailingSlash, format: config.build.format });
      },
      'astro:build:done': ({ dir, logger }) => {
        // Fail if route resolution diverges from this static, single-locale project.
        for (const id of index.traversal) {
          const route = index.nodes[id].url.slice(config.base.replace(/\/$/, '').length).replace(/^\//, '');
          const decoded = decodeURIComponent(route).replace(/\/$/, '');
          const output = config.build.format === 'file' && decoded ? `${decoded}.html` : `${decoded ? decoded + '/' : ''}index.html`;
          if (!existsSync(new URL(output, dir))) throw new Error(`Navegación: falta la página generada para ${id}: ${output}.`);
        }
        writeFileSync(new URL('navigation.json', dir), JSON.stringify(index, null, 2) + '\n');
        logger.info(`Registro jerárquico: ${index.traversal.length} documentos → navigation.json`);
      },
    },
  };
}
