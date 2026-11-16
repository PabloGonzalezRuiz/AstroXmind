# Registro de tareas

Actualizado el 16-11-2026; las propuestas AST-017 y AST-018 proceden de la revisión de clases por nivel y MarkXMind.

| ID | Tarea | Estado | Siguiente acción |
|---|---|---|---|
| AST-001 | Wiki Astro y publicación en Pages | Hecho | Mantener verificación tras cambios |
| AST-008 | Galería de directivas y tabla árbol | Hecho en main | Añadir casos conforme aparezcan necesidades |
| AST-011 | Metadatos YAML de propiedades XMind | Hecho parcialmente en main | Estabilizar contrato y validar |
| AST-012 | Pruebas de regresión | Propuesto en PR #5, no integrado | Revisar diff/SHA; decidir integración |
| AST-013 | Defaults y herencia de presets XMind | Pendiente | Especificar precedencia y fixtures |
| AST-014 | Esquema y validación de YAML | Pendiente | Definir errores y normalización |
| AST-015 | Conversión a XMind | Pendiente | Modelo intermedio y prueba con XMind Desktop |
| AST-016 | Contenido de prácticos TAI | PR #2 abierto | Revisar procedencia, licencia y exposición pública |
| AST-017 | Clases CSS por nivel | Implementada en rama aislada; pendiente validación | Revisar el diff y comprobar CI/compilación antes de integrar |
| AST-018 | Elementos semánticos de MarkXMind | Propuesta documentada | Definir modelo intermedio y sintaxis AstroXmind para relaciones, límites, resúmenes, enlaces, notas y plegado |
| SEC-001 | Actualización Astro/Starlight | PR #1 abierto | Rebasar/revisar estado de seguridad y conflictos |
| DOC-001 | Continuidad de proyecto | Actualizado | Revisar al cerrar cada hito |

## PRs abiertos observados

- #1 Actualización de Astro y Starlight (AST-003.5), rama `security/ast-003-5-dependency-upgrade`: abierto, base desactualizada y estado no mergeable en la revisión. Los checks de un SHA anterior no validaban el último head.
- #2 Cuadernos prácticos TAI: abierto; revisar derechos porque el repositorio y la wiki son públicos.
- #4 Documentación de ubicaciones/wiki operativa: abierto y basado en contexto anterior a GitHub Pages.
- #5 Pruebas de regresión Markdown/XMind: borrador abierto, `Build and validate` y `build` satisfactorios para `51c9b694dd16edc758d9ed39e810330817005039`. No integrado; la base apunta a un commit previo.
- AST-017: rama `feature/ast-017-level-classes` creada desde `main` en `7bf4535`; no modifica `main`, no abre PR ni cambia Pages.

Los estados de PR pueden cambiar; consultarlos antes de continuar.
