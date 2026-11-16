---
title: Laboratorio de componentes Astro
description: Entorno aislado para editar componentes Astro y ver en vivo su resultado y errores.
---

# Laboratorio de componentes Astro

Este laboratorio abre un proyecto Astro pequeño en StackBlitz. Puedes editar el componente o el ejemplo MDX; la vista previa se actualiza con Vite y los errores aparecen en el panel de terminal.

[**Abrir el laboratorio editable en StackBlitz**](https://stackblitz.com/fork/github/PabloGonzalezRuiz/AstroXmind/tree/main/examples/astro-component-lab?startScript=dev)

## Qué incluye

- Un proyecto Astro independiente con el componente `TreeTable.astro`.
- Una página MDX con listas jerárquicas, clases por nivel y numeración gradual o entre hermanos.
- Vista previa y terminal para observar cambios y errores de compilación.
- El mismo componente que se usa en la prueba de TreeTable.

StackBlitz abre una copia de prueba de `examples/astro-component-lab`. Los cambios allí sirven para experimentar y no modifican el repositorio por sí solos.

## Prueba y archivos fuente

- [Ver la prueba TreeTable](../componentes/tree-table/).
- [Abrir TreeTable.astro](https://github.com/PabloGonzalezRuiz/AstroXmind/blob/main/examples/astro-component-lab/src/components/TreeTable.astro).
- [Ver el MDX completo](https://github.com/PabloGonzalezRuiz/AstroXmind/blob/main/src/content/docs/componentes/tree-table.mdx).

La wiki publica el resultado compilado. El MDX se edita en el repositorio o desde el enlace de edición de la página. El laboratorio StackBlitz es una copia independiente y no guarda cambios en el MDX de la wiki.

## Lenguaje TreeTable

Añade una anotación entre corchetes a la etiqueta, por ejemplo `[numbering=arabic; tiered=true; start=5]`. Sirve para numerar el nodo, sumar la ruta de antecesores y fijar, reiniciar o continuar desde un número. Se escribe directamente en MDX, sin escapes. Consulta el [ejemplo completo](../componentes/tree-table/).
