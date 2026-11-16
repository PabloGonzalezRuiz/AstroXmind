---
title: Laboratorio de componentes Astro
description: Entorno aislado para editar componentes Astro y ver en vivo su resultado y errores.
---

# Laboratorio de componentes Astro

Este laboratorio abre un proyecto Astro pequeño en StackBlitz. Puedes editar el componente o el ejemplo MDX; la vista previa se actualiza con Vite y los errores aparecen en el panel de terminal.

[**Abrir el laboratorio editable en StackBlitz**](https://stackblitz.com/fork/github/PabloGonzalezRuiz/AstroXmind/tree/main/examples/astro-component-lab?startScript=dev)

## Qué incluye

- Un proyecto Astro independiente, sin Starlight ni los plugins Markdown de la wiki.
- El componente `TreeTable.astro` y una página MDX con ramas de distintas profundidades, negrita y un enlace.
- Vista previa y terminal para observar cambios y errores de compilación.
- El componente compartido con la página de ejemplo de la wiki.

StackBlitz abre una copia de prueba de la carpeta `examples/astro-component-lab`. Los cambios que hagas allí sirven para experimentar y no modifican por sí solos el repositorio.

## Ejemplo compilado

[Ver la página de la tabla MDX](../demo-tablas/tabla-arbol-mdx/).

En esa página tienes enlaces al [componente que la genera](https://github.com/PabloGonzalezRuiz/AstroXmind/blob/main/examples/astro-component-lab/src/components/TreeTable.astro), al [MDX completo](https://github.com/PabloGonzalezRuiz/AstroXmind/blob/main/src/content/docs/demo-tablas/tabla-arbol-mdx.mdx) y a su edición en GitHub. La lista base aparece debajo de la tabla.

## Ver y editar el MDX de la wiki

Astro publica el resultado compilado, pero la fuente se mantiene en el repositorio. La página de ejemplo indica la ruta exacta, muestra el MD base y enlaza al editor de GitHub. Para editarla en local, abre `src/content/docs/demo-tablas/tabla-arbol-mdx.mdx` en tu editor y ejecuta `npm run dev` en la raíz del repositorio. Los cambios del StackBlitz son una copia aislada: no modifican automáticamente el MDX de la wiki.

## Alcance

El laboratorio prueba la representación de una lista Markdown dentro de un componente Astro mediante el slot. El componente no sustituye el procesador actual de los temas `.md` ni los convierte aún a XMind.
