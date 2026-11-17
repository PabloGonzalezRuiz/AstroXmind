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

## AST-030 · Ejemplos con pestañas — 17-11-2026

Todos los ejemplos pedagógicos de componentes de la wiki usan src/components/ComponentExample.astro, con Tabs/TabItem/Code de Starlight: Resultado por defecto y Código con resaltado/copia. Ocho grupos en TreeTable y tres en la guía. Las tarjetas de navegación de inicio y el enlace externo al laboratorio no son demostraciones de código.

Cada ejemplo MDX está en src/examples; se importa como componente para la vista previa y con ?raw para el código. La fuente es única. La demo de Panel incluye uso MDX e implementación Astro; los ejemplos de clases muestran la hoja CSS real. Los bloques informativos de lenguaje permanecen como explicación y las listas de muestra se muestran también con pestañas.

Regla para futuros ejemplos: usar ComponentExample, importar la demo y su mismo archivo ?raw; no duplicar manualmente el código visible. Grupos independientes, sin sincronización global de la pestaña elegida. Estado de plegado conservado al alternar.

Validación local: npm ci, npm run check (0 errores/avisos), npm run build correctos; DOM de ambas páginas verifica 11 grupos, correspondencia exacta de data-code para copia, cambio por clic/teclas, foco, IDs únicos y TreeTable dentro de pestañas. No hubo nueva captura visual en navegador. No se modificaron dependencias ni el componente TreeTable. El laboratorio externo se conserva sin dependencia de Starlight.

## AST-032 · Pantalla completa de cada tabla — 17-11-2026

Botón en esquina superior derecha: visible con hover o foco de teclado; siempre visible en puntero táctil y mientras la tabla está ampliada. Sin nueva propiedad del lenguaje. Fullscreen API nativa cuando disponible; si falta o se rechaza, panel fijo que ocupa la ventana. Salida con botón o Escape. En el panel alternativo se mantiene foco dentro del contenido, se restaura el overflow previo del body y se devuelve foco. Tabla/celdas no se clonan, preservando plegado, numeración, clases y estado al volver. Sin JS el control permanece oculto.

Validación: npm run check (0 errores/avisos), builds de wiki/laboratorio correctos. DOM del script compilado verifica API nativa simulada/eventos, API ausente/rechazada, botón/Escape, foco, restauración de overflow e independencia de tablas. No se ha realizado una prueba visual o de Fullscreen API nativa en navegador real en este cambio.
