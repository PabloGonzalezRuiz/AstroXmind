# Decisiones vigentes

Estado contrastado el 17-11-2026 sobre main `5f1a33ff7a846a42914f33be61782adb0e5f8452`. Esta revisión parte del SHA publicado indicado y añade NAV-01/02 en la rama feature/nav-01-document-tree, sin cambiar main ni publicar.

| ID | Decisión | Estado |
|---|---|---|
| ADR-001/002 | Astro independiente y TreeTable MDX | Implementados |
| AST-017/022/026 | Clases, corchetes y numeración/start | Publicados |
| AST-028/031 | Folded y reinicio tras padre no numerado | Publicados |
| AST-030/032/033 | Demos con fuente única, fullscreen/centrado/scroll | Publicados |
| ADR-003 / AST-034 | Fase Navegación como primera prioridad | NAV-01/02 implementados en rama; resto pendiente |
| NAV-01 | Árbol por identidad/padre/orden | Implementado/validado en rama |
| AST-018 | Summary/Boundary aplazados | Vigente |
| AST-027 | Biblioteca como último hito | Vigente |

Desarrollo incremental: explicar siguiente paso y solicitar autorización. El plan no equivale a funcionalidad disponible. Ver ADR-003 y docs/13 para alternativas y aceptación.

NAV-02: un solo registro para UI y exportación JSON; recorrido anterior/siguiente global en preorden, sin bucle en extremos. La estructura de carpetas no interviene. Serie de cuatro artículos ficticios y su índice, todos en una carpeta plana; árbol lógico explícito en YAML. Navegación mediante enlaces HTML y sin dependencias nuevas.
