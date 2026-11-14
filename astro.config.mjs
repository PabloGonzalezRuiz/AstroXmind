import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://pablogonzalezruiz.github.io',
  base: '/AstroXmind',
  integrations: [
    starlight({
      title: 'AstroXmind · Temario TAI',
      defaultLocale: 'root',
      locales: { root: { label: 'Español', lang: 'es' } },
      sidebar: [
        { label: 'Introducción', items: [{ label: 'Inicio', link: '/' }, { label: 'Cómo estudiar', link: '/guia-estudio/' }] },
        { label: 'Bloque I · Organización del Estado', autogenerate: { directory: 'bloque-1' } },
        { label: 'Bloque II · Tecnología básica', autogenerate: { directory: 'bloque-2' } },
        { label: 'Bloque III · Desarrollo de sistemas', autogenerate: { directory: 'bloque-3' } },
        { label: 'Bloque IV · Sistemas y comunicaciones', autogenerate: { directory: 'bloque-4' } },
      ],
    }),
  ],
});
