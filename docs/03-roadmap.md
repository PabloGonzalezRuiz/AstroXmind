# Hoja de ruta

Actualizada el 16-11-2026 sobre `6aff07e65b8cbd8e89f56a2f9a39d04f5a0af372`.

## Terminado

- AST-019: componente TreeTable MDX y laboratorio Astro, PR #6 integrado.
- AST-020: wiki pública centrada en componentes y clases Astro, PR #7 integrado.
- AST-021: numeración decimal por nodo con ruta gradual y comienzo configurable, PR #7 integrado.
- AST-022: numeración entre corchetes sin escapes MDX, PR #8 integrado y desplegado.

## Pendientes y siguiente cambio propuesto

1. Adaptar las clases configurables por nivel al TreeTable MDX actual. Conservar `nivel-N`, definir profundidad desde cero y documentar combinación con clases locales. La implementación de `feature/ast-017-level-classes` (SHA `28dd01bf5c30439accdc25dceb89d1079a43eaaf`) modifica el parser Remark anterior: no integrarla directamente ni considerarla publicada o validada.
2. Diseñar Summary y Boundary como grupos de nodos hermanos, con IDs estables, referencias y validación. Las sintaxis de docs/12 son propuestas; `resumen` HTML no implementa Summary XMind.
3. Evaluar regresiones adecuadas al componente actual: PR #5 sigue abierto y usa una base anterior.
4. Mantener exportación XMind, presets completos, editor persistente y publicación de temario como fases pendientes/aplazadas.

Los PR #1 (seguridad), #2 (contenido), #4 (documentación) y #5 (regresiones) continúan abiertos. Deben revisarse contra la base actual antes de cualquier integración; esta auditoría no los modifica.

## Cierre de cada cambio

Actualizar estado, tareas y continuidad con SHA y evidencia. No confundir una rama implementada con código validado, integrado o desplegado. No ampliar patrones numéricos sin una necesidad acordada. La siguiente implementación necesita autorización; el encargo actual cubre documentación.

## AST-025 · Plegado heredable TreeTable (rama de desarrollo)

Implementado en esta rama, no integrado ni publicado. `collapsible="true"` en TreeTable establece el valor inicial heredable (por defecto false). Un sufijo `[collapsible=false]` o `[collapsible=true]` sobrescribe ese valor para el nodo y sus descendientes. Las hojas no tienen botón. False impide plegar ese nodo; no evita que un antecesor oculte la rama. Todos comienzan expandidos.

Las anotaciones admiten comas o punto y coma y opciones en cualquier orden, conservando numbering, tiered y start. El cliente recalcula rowspan/colspan al plegar, preserva numeración y estados internos, y ofrece botones de teclado con aria-expanded. Sin JavaScript queda la tabla completa. Demo en la página TreeTable y en el sandbox.

No abrir PR, modificar main ni publicar sin autorización.
