# Arquitectura actual

Auditado el 17-11-2026 sobre `main`, commit `e7bfb8e7f41ec5637c685e62698eb12b7ab1b658`.

Astro + Starlight + MDX generan el sitio estático bajo /AstroXmind. Cuatro páginas de contenido y 404 técnico; temario y galerías antiguas fuera de Pages. Ver astro.config.mjs.

TreeTable renderiza inicialmente una lista del slot a un modelo de nodos, resuelve numeración, clases y collapsible, calcula rowspan/colspan y genera tabla completa en servidor. Un custom element astro-xmind-tree-table añade botones y reconstruye filas al plegar/desplegar, manteniendo celdas y estado de ramas. Hay JavaScript cliente para esa interacción; no se usa hidratación React/Vue.

En la base publicada auditada el estado inicial era desplegado; esta rama añade folded y carga el conjunto collapsed desde los valores efectivos antes del layout inicial. Sin JavaScript, botones ocultos y tabla completa.

Componente: examples/astro-component-lab/src/components/TreeTable.astro. Wiki y sandbox importan esta fuente desde sus páginas MDX. CSS de clases de ejemplo: examples/astro-component-lab/src/styles/article-example.css. Clases propias evitan los colores predeterminados nivel-N, conservando el identificador de profundidad.

El laboratorio StackBlitz es una copia aislada. Scripts Remark/Pandoc permanecen como prototipos fuera del pipeline actual. La biblioteca de paquetes aún no existe. No hay exportación XMind ni persistencia/editor web.

Fuentes de las páginas: src/content/docs/index.mdx, clases-astro.mdx, componentes/tree-table.mdx y laboratorio-componentes.md.

## AST-028 · Estado inicial y botón compacto — implementación en rama

Implementado el 17-11-2026 en feature/ast-028-folded-compact-toggle. No integrado ni publicado por este encargo.

- Prop global folded=true/false (booleano o cadena true/false); valor predeterminado false. Sufijo de nodo [folded=true] o [folded=false], heredable y sobrescribible.
- Collapsible sigue siendo la capacidad de plegado. False mantiene el nodo abierto, aunque folded continúa siendo configuración heredable para descendientes que reactiven collapsible=true. Las hojas no tienen botón. Un hijo abierto bajo un padre cerrado aparece al abrir ese padre.
- Se genera toda la tabla en servidor; el cliente lee los estados efectivos y recalcula filas al iniciar. Sin JavaScript se conserva todo el contenido, sin botones inactivos.
- Botón absoluto arriba a la izquierda (0.2rem), tamaño visual 1rem, símbolo 0.75rem. Reserva superior para evitar solapamiento con texto; no ocupa espacio en línea. Se conserva/restaura foco del botón al reconstruir filas.
- Ejemplos en página TreeTable y sandbox; numeración y clases conservadas. Summary/Boundary aplazados; biblioteca sigue al final.
- Check Astro: 0 errores/avisos. Builds de wiki y laboratorio correctos. Comprobación DOM de estado inicial, herencia, excepciones, collapsible=false, restauración de estado/foco, celdas, aislamiento entre tablas y fallback sin JS correcta. CSS compacto verificado por lectura; no revisión visual en navegador porque Chromium falló al iniciar (socket no permitido). No se ha ejecutado Actions de esta rama.
