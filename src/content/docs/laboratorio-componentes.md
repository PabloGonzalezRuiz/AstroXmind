---
title: Laboratorio de componentes Astro
description: Entorno aislado para editar componentes Astro y ver en vivo su resultado y errores.
---

# Laboratorio de componentes Astro

Este laboratorio abre un proyecto Astro pequeño en StackBlitz. Puedes editar el componente o el ejemplo MDX; la vista previa se actualiza con Vite y los errores aparecen en el panel de terminal.

[**Abrir el laboratorio editable en StackBlitz**](https://stackblitz.com/fork/github/PabloGonzalezRuiz/AstroXmind/tree/main/examples/astro-component-lab?startScript=dev)

## Qué incluye

- Un proyecto Astro independiente con el componente `TreeTable.astro`.
- Una página MDX con ramas de distintas profundidades, negrita y un enlace.
- Vista previa y terminal para observar cambios y errores de compilación.
- El componente compartido con la prueba TreeTable de la wiki.

StackBlitz abre una copia de prueba de `examples/astro-component-lab`. Los cambios que hagas allí sirven para experimentar y no modifican por sí solos el repositorio.

## Prueba y archivos fuente

- [Ver la prueba TreeTable](../componentes/tree-table/).
- [Abrir el componente TreeTable.astro](https://github.com/PabloGonzalezRuiz/AstroXmind/blob/main/examples/astro-component-lab/src/components/TreeTable.astro).
- [Ver el MDX completo de la prueba](https://github.com/PabloGonzalezRuiz/AstroXmind/blob/main/src/content/docs/componentes/tree-table.mdx).

Astro publica el resultado compilado; el MDX se edita en el repositorio o desde el enlace de edición de la página. El laboratorio StackBlitz es una copia independiente y no guarda cambios en el MDX de la wiki.

## Qué demuestra

El componente recibe una lista Markdown mediante su slot, calcula la distribución de las celdas durante la compilación y genera HTML estático. Las clases `nivel-0`, `nivel-1` y siguientes se aplican según la profundidad de cada nodo. La página de [TreeTable](../componentes/tree-table/) muestra el resultado y el MD base.
