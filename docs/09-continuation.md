# Punto de reanudación de AstroXmind

Verificado el 16-11-2026. Lee este documento primero al retomar.

## Estado publicado

- Repositorio: https://github.com/PabloGonzalezRuiz/AstroXmind.
- Rama `main`, commit `109e0338b4a72c79f6796b6d66486d188c65486c`.
- Wiki desplegada: https://pablogonzalezruiz.github.io/AstroXmind/.
- Navegación actual: inicio, guía de clases/componentes Astro, ejemplo TreeTable y laboratorio.
- No se publica temario. La antigua ruta Bloque I comprobada devuelve 404.
- Repo público: retirar rutas de Pages no privatiza el contenido ni el historial que continúe accesible en GitHub.

## Acceso rápido

- [Clases y componentes Astro](https://pablogonzalezruiz.github.io/AstroXmind/clases-astro/).
- [TreeTable y numeración](https://pablogonzalezruiz.github.io/AstroXmind/componentes/tree-table/).
- [Laboratorio Astro](https://pablogonzalezruiz.github.io/AstroXmind/laboratorio-componentes/).
- [PR #7 integrado](https://github.com/PabloGonzalezRuiz/AstroXmind/pull/7).

## Implementación de numeración

En etiquetas de nodos, la anotación entre corchetes es texto literal y no necesita escapes en MDX:

```md
- Nodo1 [numbering=arabic]
  - Hijo con ruta gradual [numbering=arabic; tiered=true]
  - Iniciar en cinco [numbering=arabic; start=5]
  - Continuar automáticamente [numbering=arabic]
```

El atributo inicial establece/reinicia ese nodo; los siguientes nodos numerados del mismo nivel continúan. Un nuevo grupo de hermanos empieza en 1. `tiered=true` agrega la ruta numerada de sus antecesores. El componente ofrece `numbering="siblings"` y `numbering="path"`. La sintaxis entre corchetes se escribe igual en la lista MDX y en el bloque base.

## Cambio pendiente de integración · AST-022

- Rama: `feature/ast-022-bracket-numbering`; commit validado: `300f6575577da2f0dff9f2b6a6ba8efde89b9246`.
- PR #8: https://github.com/PabloGonzalezRuiz/AstroXmind/pull/8.
- CI correcto: https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43901356728.
- Wiki Build correcto: https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43901356520.
- La sintaxis publicada en `main` seguirá siendo la anterior hasta integrar el PR y verificar Pages.

## Componentes fuente

- TreeTable: `examples/astro-component-lab/src/components/TreeTable.astro`.
- MDX publicado: `src/content/docs/componentes/tree-table.mdx`.
- Guía: `src/content/docs/clases-astro.mdx`.
- Página laboratorio: `src/content/docs/laboratorio-componentes.md`.
- Sandbox de StackBlitz: copia `examples/astro-component-lab`; las modificaciones no se sincronizan automáticamente con GitHub.

## Validación del despliegue

Para `109e0338b4a72c79f6796b6d66486d188c65486c`:
- CI: https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43897812197.
- Wiki Build: https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43897812128.
- Pages Deploy: https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43897812168.
- Dependency audit: https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43897812008.

## Siguiente trabajo

Revisar la visualización de numeración en móvil y escritorio. Después, acordar pruebas automatizadas y si se ampliarán patrones numéricos. Mantener fuera del sitio el temario hasta que el usuario cambie esa decisión.
