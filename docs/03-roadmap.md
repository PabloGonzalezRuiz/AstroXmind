# Hoja de ruta

Auditado el 17-11-2026 sobre `main`, commit `e7bfb8e7f41ec5637c685e62698eb12b7ab1b658`.

## Terminado

- AST-001 / AST-019 / AST-020: wiki, componente TreeTable MDX y laboratorio Astro.
- AST-021: numeración por nodo; AST-022: anotaciones entre corchetes sin escapes.
- AST-025: plegado interactivo con herencia y sobrescrituras.
- AST-026: numeración heredable y start local.
- AST-017: clases semánticas por nivel y nodo, con CSS de ejemplo compartido.

## Pendientes en orden

1. **AST-028 — Estado inicial y botón compacto.** Implementado en feature/ast-028-folded-compact-toggle: folded global/por nodo, heredable con default false; collapsible=false mantiene nodo abierto. Botón flotante compacto y foco conservado. Validado localmente; pendiente de integración/publicación. Siguiente tarea de desarrollo: AST-029, sin ampliar todavía Summary/Boundary.
2. **AST-029 / AST-012 — Robustez y verificación actual.** Revisar teclado/foco tras reconstruir filas, móvil, accesibilidad y árboles grandes. Adaptar regresiones al componente MDX; el PR #5 cubre una base anterior. Revisar el parser que solo toma la primera lista anidada por nodo y la validación de anotaciones desconocidas. No declarar una suite persistente de regresiones que no está en main.
3. **AST-003.5 — Seguridad y mantenimiento.** Reevaluar PR #1 y auditoría de dependencias/lockfiles, incluyendo sandbox; distinguir informe de una barrera de seguridad. Revisar documentación del PR #4 sin sobrescribir trabajo ni cerrar PRs. Resolver ramas antiguas solo con autorización concreta.
4. **AST-018 — Summary y Boundary, aplazados por ahora.** Retomarlos después del estado inicial: modelo de grupos de hermanos, IDs estables, referencias y renderizado que conserve tabla. Relationship/notas/otros elementos son extensiones posteriores, no funcionalidad actual.
5. **AST-023 — Presets y exportación XMind.** Modelo intermedio, fixtures reales, defaults y validación round-trip en Desktop. No implementado.
6. **Editor y persistencia.** Edición web y sincronización: pendientes, fuera del comportamiento actual del sandbox.
7. **AST-024 — Contenido de estudio.** Aplazado; decidir acceso, fuentes y licencias antes de publicar. PR #2 queda abierto y separado del laboratorio público.
8. **AST-027 — Biblioteca de componentes (último hito).** Agrupar componentes y tema compartido, evaluar packages/astroxmind-components, wiki como catálogo y laboratorio. No crear repositorios ni publicar npm como parte de esta auditoría.

## Política de cierre

Actualizar estado, tareas, contrato y continuidad al cambiar código. Indicar SHA, pruebas reales y enlace de despliegue. Trabajar en rama; main, PRs y releases requieren aprobación concreta. Las auditorías históricas se conservan intactas y no sustituyen el estado actual.
