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
| AST-017 | Clases CSS por nivel | Implementación en rama aislada; pendiente validación | Revisar y validar `feature/ast-017-level-classes` |
| AST-018 | Elementos semánticos de MarkXMind | Propuesta documentada | Definir modelo intermedio y sintaxis AstroXmind para relaciones, límites, resúmenes, enlaces, notas y plegado |
| AST-019 | TreeTable Astro con MDX y sandbox | PR #6 borrador; corrigiendo el orden MDX/Starlight tras fallar el primer CI | Revisar nuevos checks; abrir StackBlitz y validar preview, errores, filas irregulares y contenido rico |
| SEC-001 | Actualización Astro/Starlight | PR #1 abierto | Rebasar/revisar estado de seguridad y conflictos |
| DOC-001 | Continuidad de proyecto | Actualizado | Revisar al cerrar cada hito |

## PRs abiertos observados

- #1 Actualización de Astro y Starlight (AST-003.5), rama `security/ast-003-5-dependency-upgrade`: abierto, base desactualizada y estado no mergeable en la revisión. Los checks de un SHA anterior no validaban el último head.
- #2 Cuadernos prácticos TAI: abierto; revisar derechos porque el repositorio y la wiki son públicos.
- #4 Documentación de ubicaciones/wiki operativa: abierto y basado en contexto anterior a GitHub Pages.
- #5 Pruebas de regresión Markdown/XMind: borrador abierto, checks CI/Wiki Build satisfactorios para el SHA observado. No integrado.


- AST-019: PR #6 borrador desde `feature/mdx-tree-table`; sin despliegue a Pages. Primer fallo identificado en integración MDX/Starlight y corregido; comprobar checks del head más reciente.

Los estados de PR pueden cambiar; consultarlos antes de continuar.
