# Decisiones vigentes

Actualización 17-11-2026: integración autorizada de NAV-01/02/03 en main, desde el código validado 238ce44. Ver docs/17-navigation-publication.md y las ejecuciones del SHA actual para la evidencia de despliegue.

| ID | Decisión | Estado |
|---|---|---|
| ADR-001/002 | Astro independiente y TreeTable MDX | Implementados |
| AST-017/022/026 | Clases, corchetes y numeración/start | Publicados |
| AST-028/031 | Folded y reinicio tras padre no numerado | Publicados |
| AST-030/032/033 | Demos con fuente única, fullscreen/centrado/scroll | Publicados |
| ADR-003 / AST-034 | Fase Navegación como primera prioridad | NAV-01/02/03 implementados en rama; resto pendiente |
| NAV-01 | Árbol por identidad/padre/orden | Implementado/validado en rama |
| AST-018 | Summary/Boundary aplazados | Vigente |
| AST-027 | Biblioteca como último hito | Vigente |

Desarrollo incremental: explicar siguiente paso y solicitar autorización. El plan no equivale a funcionalidad disponible. Ver ADR-003 y docs/13 para alternativas y aceptación.

NAV-02: un solo registro para UI y exportación JSON; recorrido anterior/siguiente global en preorden, sin bucle en extremos. La estructura de carpetas no interviene. Serie de cuatro artículos ficticios y su índice, todos en una carpeta plana; árbol lógico explícito en YAML. Navegación mediante enlaces HTML y sin dependencias nuevas.

NAV-03: referencias canónicas doc:doc-000001#ref-destino; anclas explícitas para resistir cambios de título, no slugs automáticos. Resolución por identidad también al renderizar para corregir HTML Markdown cacheado; validación final sobre DOM real. DocumentNavigator agrupa contexto inferior y hermanos; migas arriba y árbol lateral, con demo de árbol integrado. No implementar backlinks como efecto secundario.
