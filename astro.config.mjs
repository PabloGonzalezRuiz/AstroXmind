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
      routeMiddleware: './src/navigation-middleware.ts',
      components: {
        PageTitle: './src/components/navigation/PageTitle.astro',
        Hero: './src/components/navigation/Hero.astro',
        Sidebar: './src/components/navigation/Sidebar.astro',
        Pagination: './src/components/navigation/Pagination.astro',
      },
    }),
    mdx({ extendMarkdownConfig: false }),
  ],
});
