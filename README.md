# AstroXmind

Wiki técnica Astro + Starlight + MDX, con TreeTable y laboratorio. El temario no forma parte del sitio público.

- [Wiki](https://pablogonzalezruiz.github.io/AstroXmind/)
- [TreeTable](https://pablogonzalezruiz.github.io/AstroXmind/componentes/tree-table/)
- [Guía](https://pablogonzalezruiz.github.io/AstroXmind/clases-astro/)
- [Laboratorio](https://pablogonzalezruiz.github.io/AstroXmind/laboratorio-componentes/)

Estado contrastado el 17-11-2026 sobre main `5f1a33ff7a846a42914f33be61782adb0e5f8452`. Esta revisión parte del SHA publicado indicado y añade NAV-01/02/03 en la rama feature/nav-01-document-tree, sin cambiar main ni publicar.

Implementado: clases por nivel/nodo, numeración heredable/start local, plegado/folded, demos con pestañas y fullscreen centrado con scroll. Próxima fase: **Navegación**, con NAV-01/02/03 implementados en rama; NAV-04 es el próximo paso a autorizar.

- [Hoja de ruta](docs/03-roadmap.md): Navegación primero, biblioteca al final.
- [Diseño y primer paso de Navegación](docs/13-navigation-phase.md).
- [Estado](docs/04-project-status.md), [continuidad](docs/09-continuation.md), [contrato](docs/10-declarative-language-architecture.md).

Desarrollo con Node.js 22: npm ci, npm run dev, npm run check y npm run build. Para reproducir un SHA usar el manual. El componente vive en examples/astro-component-lab; la wiki importa la misma fuente. StackBlitz es una copia independiente. GitHub e historial son públicos, aunque Pages solo publique las cuatro páginas autorizadas.

## Prueba de jerarquía en la rama de desarrollo

Serie y cuatro artículos, todos en [src/content/docs/pruebas-jerarquia](src/content/docs/pruebas-jerarquia/). La carpeta es plana; el árbol lógico es Serie → Artículo 1 → Artículo 2 → Artículo 3, con Artículo 4 bajo Serie. [Contrato y prueba de traslado](docs/15-contextual-navigation.md).

Para verlos localmente: cambiar a `feature/nav-01-document-tree`, ejecutar `npm ci` y `npm run dev`, y abrir `/AstroXmind/pruebas-jerarquia/serie/` en la URL anunciada por Astro. La serie aún no está publicada en Pages.

## Apartado Navegación preparado en rama

[src/content/docs/navegacion.mdx](src/content/docs/navegacion.mdx) contiene una demostración de DocumentNavigator (Resultado/Código), la serie de artículos bajo Navegación, enlaces estables a apartados y un salto a un nodo de tabla plegada. Se accede localmente en /AstroXmind/navegacion/. Aún no está publicado en Pages.

El componente detecta la página y presenta padre, hermanos, hijos y recorrido. Las migas quedan arriba y el árbol completo en el lateral; el ejemplo permite ver también el árbol dentro del componente. [Contrato de referencias NAV-03](docs/16-document-references.md). `npm run test:references:rebuild` comprueba un renombrado real entre dos builds con caché, en una copia temporal.
