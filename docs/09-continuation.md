# Punto de reanudación

Auditado el 17-11-2026 sobre `main`, commit `e7bfb8e7f41ec5637c685e62698eb12b7ab1b658`.

1. Volver a consultar main, código y Actions antes de actuar: esta nota describe un SHA fijo.
2. Leer AGENTS.md, docs/04-project-status.md, docs/03-roadmap.md y docs/10-declarative-language-architecture.md.
3. No volver a tratar plegado, numeración heredable o clases como cambios sin integrar: están publicados.
4. Próxima tarea: AST-028, estado inicial plegado/desplegado. La rama feature/ast-021-tree-fold-state está creada pero vacía respecto de main. No afirmar que folded existe ni continuar por Summary/Boundary antes de esa prioridad.
5. AST-027 biblioteca sigue al final. La auditoría actual no autoriza desarrollo adicional, integración a main, PRs o releases.

## Fuentes activas

- examples/astro-component-lab/src/components/TreeTable.astro: fuente única usada por wiki y sandbox en el repositorio.
- examples/astro-component-lab/src/styles/article-example.css: estilos semánticos de demostración.
- src/content/docs/componentes/tree-table.mdx: ejemplos públicos.
- astro.config.mjs: pipeline Astro/MDX. Scripts Remark/Pandoc conservados son antecedentes, no build activo.
- StackBlitz copia el laboratorio; las ediciones allí no se sincronizan automáticamente con GitHub.

## Evidencia remota

Para `e7bfb8e7f41ec5637c685e62698eb12b7ab1b658`:

- [CI: éxito, 43913208743](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43913208743).
- [Wiki Build: éxito, 43913208998](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43913208998).
- [Pages Deploy: éxito, 43913209250](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43913209250).
- La página pública TreeTable respondió y contiene los ejemplos de clases, plegado y numeración heredable. Esta lectura HTTP no sustituye una revisión visual/interactiva.

La auditoría de dependencias [43897812008](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43897812008) es anterior y corresponde a `109e033`, no al HEAD auditado. Su workflow genera un informe y no bloquea por severidad: éxito no significa cero vulnerabilidades.

## PRs abiertos

| PR | Tema | Estado comprobado | Tratamiento |
|---|---|---|---|
| #1 | Actualización de seguridad Astro/Starlight | Borrador; head 9009ca9 | Revalidar sobre base actual |
| #2 | Prácticos TAI | Borrador; head 12e6279 | Aplazado fuera de Pages |
| #4 | Documentación de arquitectura | Abierto; head 813456e | Reconciliar con arquitectura vigente |
| #5 | Regresiones Markdown | Borrador; head 51c9b69 | Evaluar cobertura del TreeTable MDX |

No se han modificado PRs ni disparado Actions en esta auditoría. No se ha comprobado mergeabilidad; abierto no implica ausencia ni presencia de conflictos.

## Siguiente implementación revisable

Proponer propiedad global y por nodo para estado inicial, por defecto abierto; acordar semántica de herencia y relación con collapsible=false. Implementar parser, resolución de estado y layout inicial, ejemplo mixto, comprobaciones de filas/ARIA/teclado. No ampliar a Summary/Boundary en ese cambio.

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

## Corrección AST-031 · Reactivación de numeración

Un nodo sin numeración corta la ruta gradual. Los hijos que reactiven numbering=arabic empiezan en 1 (o start explícito), sin recuperar prefijos de abuelos. Ejemplo: Nodo numerado 1 → Rama sin número → Reactivar 1 → Hijo 1.1. El contador de los hermanos del nodo sin número no cambia. La corrección afecta al cálculo compartido de wiki y laboratorio, sin cambiar la sintaxis ni la herencia de clases/plegado.

## AST-032 · Pantalla completa de cada tabla — 17-11-2026

Botón en esquina superior derecha: visible con hover o foco de teclado; siempre visible en puntero táctil y mientras la tabla está ampliada. Sin nueva propiedad del lenguaje. Fullscreen API nativa cuando disponible; si falta o se rechaza, panel fijo que ocupa la ventana. Salida con botón o Escape. En el panel alternativo se mantiene foco dentro del contenido, se restaura el overflow previo del body y se devuelve foco. Tabla/celdas no se clonan, preservando plegado, numeración, clases y estado al volver. Sin JS el control permanece oculto.

Validación: npm run check (0 errores/avisos), builds de wiki/laboratorio correctos. DOM del script compilado verifica API nativa simulada/eventos, API ausente/rechazada, botón/Escape, foco, restauración de overflow e independencia de tablas. No se ha realizado una prueba visual o de Fullscreen API nativa en navegador real en este cambio.
