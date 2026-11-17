# Continuación de AstroXmind

Leer docs/09-continuation.md, docs/04-project-status.md, docs/03-roadmap.md y docs/10-declarative-language-architecture.md. Comprobar main y Actions en GitHub; la auditoría del 17-11-2026 se basa en e7bfb8e7f41ec5637c685e62698eb12b7ab1b658.

## Estado y fuentes

- Wiki pública: https://pablogonzalezruiz.github.io/AstroXmind/. Solo clases/componentes, sin temario.
- TreeTable: examples/astro-component-lab/src/components/TreeTable.astro; importado por wiki y sandbox. CSS de ejemplo compartido en src/styles/article-example.css dentro del laboratorio.
- Publicados: AST-017 clases, AST-025 plegado heredable, AST-026 numeración heredable y AST-022 corchetes sin escapes. No reintroducir llaves.
- Contrato exacto y precedencia: docs/10. Profundidad 0 para raíz. Start no se hereda; numbering, tiered y collapsible sí. Clases explícitas > nivel > padre.
- AST-028 (estado inicial folded y botón compacto) ya está publicado en main a6bd581; no repetir su implementación. Próxima revisión funcional: AST-029. La rama feature/ast-021-tree-fold-state es solo una base; AST-021 ya identifica numeración.
- Summary/Boundary aplazados; biblioteca AST-027 último hito. Scripts Remark/Pandoc y rama AST-017 antigua no son el pipeline MDX activo.

## Verificación y permisos

CI usa Node.js 22, npm ci, npm run check y npm run build. Usar comprobaciones apropiadas al cambio, sin baterías ad hoc innecesarias. Compartir runs por SHA; un workflow informativo de dependencias verde no demuestra ausencia de vulnerabilidades. No afirmar publicación hasta comprobar Pages.

Trabajar en rama. No tocar main, abrir/fusionar PR, cerrar/reescribir PRs o publicar releases sin autorización explícita aplicable. Las ediciones de StackBlitz no vuelven a GitHub. Mantener auditorías históricas sin reescribir.

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
