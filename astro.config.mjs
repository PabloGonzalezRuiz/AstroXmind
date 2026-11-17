import { defineConfig } from 'astro/config';
import navigation from './scripts/navigation-integration.mjs';
import mdx from '@astrojs/mdx';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://pablogonzalezruiz.github.io',
  base: '/AstroXmind',
  integrations: [
    navigation(),
    starlight({
      title: 'AstroXmind · Componentes Astro',
      editLink: {
        baseUrl: 'https://github.com/PabloGonzalezRuiz/AstroXmind/edit/main/',
      },
      defaultLocale: 'root',
      locales: { root: { label: 'Español', lang: 'es' } },
      sidebar: [
        { label: 'Inicio', items: [{ label: 'AstroXmind', link: '/' }] },
        { label: 'Astro', items: [{ label: 'Clases y componentes', link: '/clases-astro/' }] },
        {
          label: 'Componentes',
          items: [
            { label: 'TreeTable', link: '/componentes/tree-table/' },
            { label: 'Laboratorio', link: '/laboratorio-componentes/' },
          ],
        },
      ],
    }),
    mdx({ extendMarkdownConfig: false }),
  ],
});
