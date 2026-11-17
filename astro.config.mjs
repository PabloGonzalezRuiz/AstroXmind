import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import remarkDocumentReferences from './scripts/remark-document-references.mjs';
import navigation from './scripts/navigation-integration.mjs';
import mdx from '@astrojs/mdx';
import starlight from '@astrojs/starlight';

const base = '/AstroXmind';
const referenceOptions = { root: fileURLToPath(new URL('.', import.meta.url)), base };
const remarkPlugins = [[remarkDocumentReferences, referenceOptions]];

export default defineConfig({
  site: 'https://pablogonzalezruiz.github.io',
  base,
  markdown: { remarkPlugins },
  integrations: [
    navigation(),
    starlight({
      title: 'AstroXmind · Componentes Astro',
      editLink: {
        baseUrl: 'https://github.com/PabloGonzalezRuiz/AstroXmind/edit/main/',
      },
      defaultLocale: 'root',
      locales: { root: { label: 'Español', lang: 'es' } },
      routeMiddleware: './src/navigation-middleware.ts',
      components: {
        Head: './src/components/navigation/Head.astro',
        MarkdownContent: './src/components/navigation/MarkdownContent.astro',
        PageTitle: './src/components/navigation/PageTitle.astro',
        Hero: './src/components/navigation/Hero.astro',
        Sidebar: './src/components/navigation/Sidebar.astro',
        Pagination: './src/components/navigation/Pagination.astro',
      },
    }),
    mdx({ extendMarkdownConfig: false, remarkPlugins }),
  ],
});
