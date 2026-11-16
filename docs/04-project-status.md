# Estado actual del proyecto

Fecha de verificación: 16-11-2026.

## Repositorio y despliegue

- Repositorio público: [PabloGonzalezRuiz/AstroXmind](https://github.com/PabloGonzalezRuiz/AstroXmind).
- Rama por defecto: `main`.
- SHA actual verificado: `5dd5273c03ed8efd10155420f44a04f8a254d67f`.
- Wiki publicada: https://pablogonzalezruiz.github.io/AstroXmind/.
- La página de prueba TreeTable MDX está publicada en https://pablogonzalezruiz.github.io/AstroXmind/demo-tablas/tabla-arbol-mdx/.

## Implementación en main

- Astro 5.16 y Starlight 0.36.
- El pipeline Markdown mantiene `remark-directive`, el plugin semántico local y `rehypeTreeTable`.
- AST-019 está integrada: el componente `TreeTable.astro` analiza una lista MDX en el servidor y emite una tabla HTML estática con spans calculados.
- La página AST-019 enlaza al componente fuente y al MDX completo, y muestra bajo el resultado el MD base.
- Se corrigió el ajuste para evitar que palabras largas se partan dentro de las celdas.
- El laboratorio aislado está en `examples/astro-component-lab`; StackBlitz ofrece preview Vite y terminal. Editar la copia no cambia el repositorio.
- La fuente de la prueba está en `src/content/docs/demo-tablas/tabla-arbol-mdx.mdx`.

## Validaciones observadas

Para `5dd5273c03ed8efd10155420f44a04f8a254d67f`:
- AstroXmind · CI: [éxito](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43877354252).
- Wiki · Build: [éxito](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43877354293).
- GitHub Pages Deploy: [éxito](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43877354242).

## Capacidad y límites

El proyecto renderiza tablas árbol web y conserva declaraciones de propiedades XMind durante el procesamiento. Todavía no existe un conversor funcional a `.xmind` ni un catálogo completo de presets con herencia. La compatibilidad de propiedades sigue siendo parcial.

## Trabajo siguiente: AST-020

El PR #7 borrador desde `feature/ast-020-mdx-source-access` añade enlaces al componente y al MDX, muestra el MD base y explica cómo editar la fuente manualmente. CI (43879133120) y Wiki Build (43879133114) pasaron para su head `69806572c4757b39fa08d26adc4b084755f432cd`. Aún no está integrado ni publicado.
