# Instrucciones de continuidad

Estado contrastado el 17-11-2026 sobre main `5f1a33ff7a846a42914f33be61782adb0e5f8452`. Esta revisión parte del SHA publicado indicado y añade NAV-01/02 en la rama feature/nav-01-document-tree, sin cambiar main ni publicar.

Leer docs/09-continuation.md, docs/04-project-status.md, docs/03-roadmap.md, docs/10-declarative-language-architecture.md y docs/13-navigation-phase.md. Confirmar SHA y Actions remotos antes de actuar.

## Prioridad y autorización

- Primera fase pendiente: Navegación AST-034. NAV-01 y NAV-02 están autorizados, implementados y validados en la rama feature/nav-01-document-tree; pendientes de integración/publicación. NAV-03…08 siguen sin implementar y requieren autorización propia. Explicar cada próximo paso y solicitar autorización para ese paso.
- El usuario autorizó actualizar documentación e implementar NAV-01/02 y la serie de artículos de prueba en rama, sin publicación. No main, apertura/fusión/cierre de PR ni releases sin autorización aplicable.
- Summary/Boundary aplazados; biblioteca AST-027 último hito. No reorganizar ramas antiguas como efecto secundario.

## Estado y fuentes

Clases, numeración/start y corte de ruta, plegado/folded, pestañas y fullscreen/centrado/scroll ya están publicados. No repetir su implementación ni volver a afirmar que folded está ausente.

TreeTable vive en examples/astro-component-lab/src/components/TreeTable.astro. Wiki y laboratorio comparten esa fuente. Demos en src/examples; usar ComponentExample con import del componente y ?raw del mismo archivo. docs/ de mantenimiento no son páginas del futuro árbol documental. StackBlitz no sincroniza cambios con GitHub.

Conservar corchetes sin escapes. Raíz de tabla en nivel 0; start local; numbering/tiered/collapsible/folded heredables. Navigation de página ya está implementado en esta rama; los IDs de nodo de TreeTable siguen pendientes de NAV-03. Árbol de pertenencia y red de citas deben permanecer separados.

## Verificación

CI Node.js 22, npm ci, npm run check y build; sandbox tiene build/lockfile propio. Comprobar comportamiento pertinente, no baterías ad hoc innecesarias. Compartir evidencia por SHA y no afirmar publicación antes de Pages. Una auditoría informativa verde no acredita ausencia de vulnerabilidades. No reescribir auditorías históricas.
