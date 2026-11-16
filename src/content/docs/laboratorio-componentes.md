---
title: Laboratorio de componentes Astro
description: Entorno aislado para editar componentes Astro y ver en vivo su resultado y errores.
---

# Laboratorio de componentes Astro

Este laboratorio abre un proyecto Astro pequeño en StackBlitz. Puedes editar el componente o el ejemplo MDX; la vista previa se actualiza con Vite y los errores aparecen en el panel de terminal.

[**Abrir el laboratorio editable en StackBlitz**](https://stackblitz.com/fork/github/PabloGonzalezRuiz/AstroXmind/tree/feature/mdx-tree-table/examples/astro-component-lab?startScript=dev)

## Qué incluye

- Un proyecto Astro independiente, sin Starlight ni los plugins Markdown de la wiki.
- El componente `TreeTable.astro` y una página MDX con ramas de distintas profundidades, negrita y un enlace.
- Vista previa y terminal para observar cambios y errores de compilación.
- El componente compartido con la página de ejemplo de la wiki.

StackBlitz abre una copia de prueba de la carpeta `examples/astro-component-lab`. Los cambios que hagas allí sirven para experimentar y no modifican por sí solos el repositorio.

## Ejemplo compilado

[Ver la página estática del prototipo en la galería](../demo-tablas/tabla-arbol-mdx/).

## Alcance

Este laboratorio prueba la representación de una lista Markdown dentro de un componente Astro mediante el slot. Sigue siendo un prototipo: no sustituye el procesador actual ni está desplegado en la wiki pública.
