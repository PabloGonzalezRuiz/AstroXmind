# AstroXmind

Wiki técnica Astro + Starlight + MDX, con TreeTable y laboratorio. El temario no forma parte del sitio público.

- [Wiki](https://pablogonzalezruiz.github.io/AstroXmind/)
- [TreeTable](https://pablogonzalezruiz.github.io/AstroXmind/componentes/tree-table/)
- [Guía](https://pablogonzalezruiz.github.io/AstroXmind/clases-astro/)
- [Laboratorio](https://pablogonzalezruiz.github.io/AstroXmind/laboratorio-componentes/)

Estado contrastado el 17-11-2026 sobre main `5f1a33ff7a846a42914f33be61782adb0e5f8452`. Esta revisión parte del SHA publicado indicado y añade NAV-01 en rama de desarrollo, sin cambiar main.

Implementado: clases por nivel/nodo, numeración heredable/start local, plegado/folded, demos con pestañas y fullscreen centrado con scroll. Próxima fase: **Navegación**, con NAV-01 implementado en rama y el resto pendiente.

- [Hoja de ruta](docs/03-roadmap.md): Navegación primero, biblioteca al final.
- [Diseño y primer paso de Navegación](docs/13-navigation-phase.md).
- [Estado](docs/04-project-status.md), [continuidad](docs/09-continuation.md), [contrato](docs/10-declarative-language-architecture.md).

Desarrollo con Node.js 22: npm ci, npm run dev, npm run check y npm run build. Para reproducir un SHA usar el manual. El componente vive en examples/astro-component-lab; la wiki importa la misma fuente. StackBlitz es una copia independiente. GitHub e historial son públicos, aunque Pages solo publique las cuatro páginas autorizadas.
