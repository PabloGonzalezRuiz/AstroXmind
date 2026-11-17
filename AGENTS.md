# Instrucciones de continuidad

Estado contrastado el 17-11-2026 sobre main `5f1a33ff7a846a42914f33be61782adb0e5f8452`. Esta revisión solo cambia documentación en una rama separada.

Leer docs/09-continuation.md, docs/04-project-status.md, docs/03-roadmap.md, docs/10-declarative-language-architecture.md y docs/13-navigation-phase.md. Confirmar SHA y Actions remotos antes de actuar.

## Prioridad y autorización

- Primera fase pendiente: Navegación AST-034. NAV-01 está planificado, NO implementado y requiere la autorización que el usuario pidió antes de código. Explicar cada próximo paso y solicitar autorización para ese paso.
- Este encargo solo actualiza documentación en rama. No main, apertura/fusión/cierre de PR ni releases sin autorización aplicable.
- Summary/Boundary aplazados; biblioteca AST-027 último hito. No reorganizar ramas antiguas como efecto secundario.

## Estado y fuentes

Clases, numeración/start y corte de ruta, plegado/folded, pestañas y fullscreen/centrado/scroll ya están publicados. No repetir su implementación ni volver a afirmar que folded está ausente.

TreeTable vive en examples/astro-component-lab/src/components/TreeTable.astro. Wiki y laboratorio comparten esa fuente. Demos en src/examples; usar ComponentExample con import del componente y ?raw del mismo archivo. docs/ de mantenimiento no son páginas del futuro árbol documental. StackBlitz no sincroniza cambios con GitHub.

Conservar corchetes sin escapes. Raíz de tabla en nivel 0; start local; numbering/tiered/collapsible/folded heredables. IDs de nodo y navigation de página aún no son sintaxis activa. Árbol de pertenencia y red de citas deben permanecer separados.

## Verificación

CI Node.js 22, npm ci, npm run check y build; sandbox tiene build/lockfile propio. Comprobar comportamiento pertinente, no baterías ad hoc innecesarias. Compartir evidencia por SHA y no afirmar publicación antes de Pages. Una auditoría informativa verde no acredita ausencia de vulnerabilidades. No reescribir auditorías históricas.
