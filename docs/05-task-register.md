# Registro de tareas

Actualizado el 16-11-2026. Base publicada: `6aff07e65b8cbd8e89f56a2f9a39d04f5a0af372`.

| ID | Tarea | Estado | Siguiente acción |
|---|---|---|---|
| AST-001 | Wiki Astro y Pages | Publicada | Mantener validación |
| AST-012 | Regresiones Markdown | PR #5 abierto, no integrado | Evaluar adecuación a TreeTable actual |
| AST-017 | Clases configurables por nivel | Implementación parcial en rama antigua, no publicada | Adaptar a componente MDX actual |
| AST-018 | Summary, Boundary y otras estructuras | Diseño, no implementado | Modelo de grupos e IDs estables |
| AST-019 | TreeTable MDX y laboratorio | PR #6 integrado | Mantener componente único |
| AST-020 | Wiki centrada en componentes | PR #7 integrado | Mantener alcance público |
| AST-021 | Numeración por nodo | PR #7 integrado | Revisión visual pendiente |
| AST-022 | Numeración con corchetes sin escapes | PR #8 integrado y desplegado | Conservar sintaxis vigente |
| AST-023 | Exportación XMind | No implementada | Modelo intermedio y fixtures reales |
| AST-024 | Publicación de temario | Aplazada | Requiere decisión de acceso y revisión de fuentes |
| DOC-001 | Reconciliar documentación | Actualizada en rama documental | Integrar solo con aprobación |

AST-022 queda reservado a la numeración con corchetes. La antigua fila que lo asignaba a metadatos semánticos era un conflicto documental: esos elementos corresponden a AST-018. No se modifica el historial de auditorías.

## AST-025 · Plegado heredable TreeTable (rama de desarrollo)

Implementado en esta rama, no integrado ni publicado. `collapsible="true"` en TreeTable establece el valor inicial heredable (por defecto false). Un sufijo `[collapsible=false]` o `[collapsible=true]` sobrescribe ese valor para el nodo y sus descendientes. Las hojas no tienen botón. False impide plegar ese nodo; no evita que un antecesor oculte la rama. Todos comienzan expandidos.

Las anotaciones admiten comas o punto y coma y opciones en cualquier orden, conservando numbering, tiered y start. El cliente recalcula rowspan/colspan al plegar, preserva numeración y estados internos, y ofrece botones de teclado con aria-expanded. Sin JavaScript queda la tabla completa. Demo en la página TreeTable y en el sandbox.

No abrir PR, modificar main ni publicar sin autorización.

## AST-026 · Contrato de numeración heredable (rama, no publicado)

Numbering arabic se hereda a descendientes; numbering=none lo desactiva para una rama y puede reactivarse más abajo. Tiered también se hereda y puede sobrescribirse. Start es local; los contadores se reinician por grupo de hermanos y solo avanzan en nodos numerados. Las excepciones no cambian hermanos y las rutas conservan solo antecesores numerados. El modo del componente controla presentación; no activa numeración. Ejemplo: nodo padre [numbering=arabic], hijo [tiered=true], otro hijo [start=5], rama excluida [numbering=none]. Sustituye el contrato anterior de marcado obligatorio de cada descendiente. Biblioteca de componentes anotada como último hito AST-027 en la hoja de ruta.
