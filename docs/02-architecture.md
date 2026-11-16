# Arquitectura actual

Revisada el 16-11-2026 tras integrar AST-020.

## Wiki publicada

- Astro 5 + Starlight, salida estática para GitHub Pages bajo `/AstroXmind`.
- Markdown/MDX se usa para documentar y probar componentes Astro.
- Navegación explícita: Inicio, Clases y componentes Astro, TreeTable y Laboratorio.
- Configuración en `astro.config.mjs`; el sitio importa MDX y no configura los transformadores Remark/Pandoc de las galerías anteriores.
- El workflow de Pages construye desde `main` y comprueba que el artefacto contenga las cuatro rutas autorizadas, sin los HTML del temario anterior.
- El repositorio continúa siendo público; Pages es solo una capa de publicación y no controla el acceso a fuentes o historial Git.

## TreeTable

`examples/astro-component-lab/src/components/TreeTable.astro` recibe una lista jerárquica a través del slot. En servidor, convierte la lista del slot en nodos, calcula `rowspan`/`colspan` y produce HTML estático. Las clases `nivel-N` representan la profundidad. No envía JavaScript de hidratación para la tabla.

La numeración se declara en una etiqueta de nodo:

- `{numbering=arabic}`: muestra el número de ese nodo.
- `tiered=true`: muestra la ruta de sus antecesores numerados.
- `start=N`: define el inicio o reinicio; los siguientes nodos numerados del grupo continúan.
- Prop `numbering="siblings"` o `numbering="path"` para elegir el formato visible; `none` lo desactiva.

El Markdown de la página MDX escapa las llaves dentro de listas. El parser retira esos marcadores de la etiqueta antes de renderizarla.

## Sandbox

`examples/astro-component-lab` contiene un proyecto Astro mínimo con el componente TreeTable y una página MDX de demostración. StackBlitz importa la carpeta y ejecuta Vite. El usuario ve preview y terminal en vivo; los cambios quedan en esa copia y no se sincronizan a GitHub.

## Rutas publicadas

- `src/content/docs/index.mdx`
- `src/content/docs/clases-astro.mdx`
- `src/content/docs/componentes/tree-table.mdx`
- `src/content/docs/laboratorio-componentes.md`

Las antiguas páginas TAI y galerías no participan en el build de Pages.
