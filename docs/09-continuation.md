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
