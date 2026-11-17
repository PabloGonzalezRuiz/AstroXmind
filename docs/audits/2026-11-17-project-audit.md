# Auditoría de desarrollo — 17-11-2026

Auditado el 17-11-2026 sobre `main`, commit `e7bfb8e7f41ec5637c685e62698eb12b7ab1b658`.

## Alcance

Inspección remota del árbol, componente activo, workflow de auditoría, script de resumen, commits recientes, ramas, cuatro PRs abiertos y ejecuciones. HTTP del TreeTable público correcto. Auditoría documental; no se modifica código ni se ejecutan nuevos builds o workflows.

## Resultado

Producto publicado con clases AST-017, plegado AST-025 y numeración heredable AST-026. Documentación operativa mezclaba estado publicado con segmentos no integrado/no publicado. Esta actualización sustituye esos segmentos por un contrato consolidado y una lista de tareas con prioridad clara.

La rama feature/ast-021-tree-fold-state y main comparten e7bfb8e7f41ec5637c685e62698eb12b7ab1b658; no hay implementación de estado inicial. Props, parser y conjunto collapsed vacío confirman que el comportamiento vigente es empezar desplegado. Se registra AST-028 evitando colisión con AST-021. Summary/Boundary continúan pendientes y aplazados; biblioteca al final.

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

## Pendientes en orden

1. **AST-028 — Estado inicial plegado/desplegado.** Prioridad funcional solicitada por el usuario antes de Summary/Boundary. Diseñar e implementar una propiedad independiente de collapsible: por defecto desplegado, configuración global y sobrescritura inferior. Nombre propuesto folded (no implementado ni contrato aprobado). Definir herencia, combinación con collapsible=false, hojas y fallback sin JavaScript. La rama feature/ast-021-tree-fold-state apunta al mismo SHA que main: no contiene implementación. No reutilizar AST-021, ya asignado a numeración.
2. **AST-029 / AST-012 — Robustez y verificación actual.** Revisar teclado/foco tras reconstruir filas, móvil, accesibilidad y árboles grandes. Adaptar regresiones al componente MDX; el PR #5 cubre una base anterior. Revisar el parser que solo toma la primera lista anidada por nodo y la validación de anotaciones desconocidas. No declarar una suite persistente de regresiones que no está en main.
3. **AST-003.5 — Seguridad y mantenimiento.** Reevaluar PR #1 y auditoría de dependencias/lockfiles, incluyendo sandbox; distinguir informe de una barrera de seguridad. Revisar documentación del PR #4 sin sobrescribir trabajo ni cerrar PRs. Resolver ramas antiguas solo con autorización concreta.
4. **AST-018 — Summary y Boundary, aplazados por ahora.** Retomarlos después del estado inicial: modelo de grupos de hermanos, IDs estables, referencias y renderizado que conserve tabla. Relationship/notas/otros elementos son extensiones posteriores, no funcionalidad actual.
5. **AST-023 — Presets y exportación XMind.** Modelo intermedio, fixtures reales, defaults y validación round-trip en Desktop. No implementado.
6. **Editor y persistencia.** Edición web y sincronización: pendientes, fuera del comportamiento actual del sandbox.
7. **AST-024 — Contenido de estudio.** Aplazado; decidir acceso, fuentes y licencias antes de publicar. PR #2 queda abierto y separado del laboratorio público.
8. **AST-027 — Biblioteca de componentes (último hito).** Agrupar componentes y tema compartido, evaluar packages/astroxmind-components, wiki como catálogo y laboratorio. No crear repositorios ni publicar npm como parte de esta auditoría.

## Riesgos técnicos detectados por lectura

Solo se procesa la primera sublista por nodo; claves desconocidas aisladas pueden quedar como texto; revisar foco/teclado al reemplazar filas. No se han reproducido como incidencias de navegador en esta auditoría. El auditor de dependencias informa, sin fallo por severidad; no se ejecutó auditoría de vulnerabilidades nueva. Los dos lockfiles y PR #1 requieren revisión posterior.

## Entrega

Rama documental separada. Main queda en el SHA auditado; ninguna integración, release o PR se crea como parte de este encargo. Los documentos de fecha anterior siguen siendo evidencia histórica, no fuente de estado vigente.
