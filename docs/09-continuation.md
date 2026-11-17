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
