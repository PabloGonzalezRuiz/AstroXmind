import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const appBase = (process.env.ASTRO_BASE ?? '/AstroXmind').replace(/\/$/, '');

export default defineConfig({
  site: process.env.ASTRO_SITE ?? 'https://pablogonzalezruiz.github.io',
  base: appBase || '/',
  integrations: [
    starlight({
      title: 'AstroXmind · Temario TAI',
      head: [
        { tag: 'link', attrs: { rel: 'manifest', href: `${appBase}/manifest.webmanifest`, crossorigin: 'use-credentials' } },
        { tag: 'link', attrs: { rel: 'apple-touch-icon', sizes: '180x180', href: `${appBase}/app/icon-180.png` } },
        { tag: 'meta', attrs: { name: 'apple-mobile-web-app-capable', content: 'yes' } },
        { tag: 'meta', attrs: { name: 'apple-mobile-web-app-title', content: 'AstroXmind' } },
        { tag: 'meta', attrs: { name: 'theme-color', content: '#111c30' } },
      ],
      defaultLocale: 'root',
      locales: { root: { label: 'Español', lang: 'es' } },
      sidebar: [
        { label: 'Introducción', items: [{ label: 'Inicio', link: '/' }, { label: 'Cómo estudiar', link: '/guia-estudio/' }] },
        { label: 'Prácticos TAI', autogenerate: { directory: 'practicos' } },
        { label: 'Bloque I · Organización del Estado', autogenerate: { directory: 'bloque-1' } },
        { label: 'Bloque II · Tecnología básica', autogenerate: { directory: 'bloque-2' } },
        { label: 'Bloque III · Desarrollo de sistemas', autogenerate: { directory: 'bloque-3' } },
        { label: 'Bloque IV · Sistemas y comunicaciones', autogenerate: { directory: 'bloque-4' } },
      ],
    }),
  ],
});
