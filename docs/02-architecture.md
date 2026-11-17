# Arquitectura actual

Auditado el 17-11-2026 sobre `main`, commit `e7bfb8e7f41ec5637c685e62698eb12b7ab1b658`.

Astro + Starlight + MDX generan el sitio estático bajo /AstroXmind. Cuatro páginas de contenido y 404 técnico; temario y galerías antiguas fuera de Pages. Ver astro.config.mjs.

TreeTable renderiza inicialmente una lista del slot a un modelo de nodos, resuelve numeración, clases y collapsible, calcula rowspan/colspan y genera tabla completa en servidor. Un custom element astro-xmind-tree-table añade botones y reconstruye filas al plegar/desplegar, manteniendo celdas y estado de ramas. Hay JavaScript cliente para esa interacción; no se usa hidratación React/Vue.

El estado inicial de todas las ramas es desplegado: el conjunto collapsed se inicializa vacío. No existe propiedad de estado inicial. Sin JavaScript, botones ocultos y tabla completa.

Componente: examples/astro-component-lab/src/components/TreeTable.astro. Wiki y sandbox importan esta fuente desde sus páginas MDX. CSS de clases de ejemplo: examples/astro-component-lab/src/styles/article-example.css. Clases propias evitan los colores predeterminados nivel-N, conservando el identificador de profundidad.

El laboratorio StackBlitz es una copia aislada. Scripts Remark/Pandoc permanecen como prototipos fuera del pipeline actual. La biblioteca de paquetes aún no existe. No hay exportación XMind ni persistencia/editor web.

Fuentes de las páginas: src/content/docs/index.mdx, clases-astro.mdx, componentes/tree-table.mdx y laboratorio-componentes.md.
