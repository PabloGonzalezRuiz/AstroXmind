# AstroXmind

Wiki técnica centrada en Astro: componentes `.astro`, clases CSS, MDX y un laboratorio editable. El temario no forma parte de las páginas publicadas.

- [Wiki AstroXmind](https://pablogonzalezruiz.github.io/AstroXmind/)
- [Guía de clases y componentes Astro](https://pablogonzalezruiz.github.io/AstroXmind/clases-astro/)
- [TreeTable y numeración XMind](https://pablogonzalezruiz.github.io/AstroXmind/componentes/tree-table/)
- [Laboratorio en vivo](https://pablogonzalezruiz.github.io/AstroXmind/laboratorio-componentes/)
- [Repositorio](https://github.com/PabloGonzalezRuiz/AstroXmind)
- [StackBlitz: proyecto Astro aislado](https://stackblitz.com/fork/github/PabloGonzalezRuiz/AstroXmind/tree/main/examples/astro-component-lab?startScript=dev)
- [PR #7 · rediseño Astro y numeración](https://github.com/PabloGonzalezRuiz/AstroXmind/pull/7)

## Estado

La wiki se publica con Astro y Starlight en GitHub Pages. La navegación contiene la portada, la guía Astro, el ejemplo TreeTable y el laboratorio. Las antiguas páginas del temario y las galerías de otras tecnologías se quitaron del artefacto de Pages; una ruta antigua del Bloque I devuelve 404.

El repositorio de GitHub sigue siendo público. Las fuentes e historial Git pueden consultarse desde GitHub, por lo que retirar una página de Pages no privatiza la información que permanezca en el repositorio o sus commits anteriores.

## Desarrollo local

Requiere Node.js 22 y npm.

```sh
npm ci
npm run dev
npm run check
npm run build
```

Las Actions de CI, Wiki Build, auditoría y despliegue se ejecutan desde la rama `main`. El despliegue no se realiza desde ramas de PR.

## Documentación del proyecto

- [Prompt maestro](docs/00-master-prompt.md)
- [Visión y alcance](docs/01-project-vision.md)
- [Arquitectura](docs/02-architecture.md)
- [Hoja de ruta](docs/03-roadmap.md)
- [Estado actual](docs/04-project-status.md)
- [Continuidad](docs/09-continuation.md)
- [Lenguaje de componentes y numeración](docs/10-declarative-language-architecture.md)

## Estado contrastado — 17-11-2026

Referencia publicada: `e7bfb8e7f41ec5637c685e62698eb12b7ab1b658`. Clases AST-017, plegado AST-025 y numeración heredable AST-026 están publicados. El siguiente cambio funcional es estado inicial AST-028; Summary/Boundary aplazados. La biblioteca AST-027 sigue al final. Estado operativo y contrato completos: [estado](docs/04-project-status.md), [contrato](docs/10-declarative-language-architecture.md) y [hoja de ruta](docs/03-roadmap.md). Las propuestas de presets/exportación o directivas heredadas no describen funcionalidad disponible del componente actual.
