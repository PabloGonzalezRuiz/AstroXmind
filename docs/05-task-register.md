# Registro de tareas

Actualizado el 16-11-2026. Base publicada: `6aff07e65b8cbd8e89f56a2f9a39d04f5a0af372`.

| ID | Tarea | Estado | Siguiente acción |
|---|---|---|---|
| AST-001 | Wiki Astro y Pages | Publicada | Mantener validación |
| AST-012 | Regresiones Markdown | PR #5 abierto, no integrado | Evaluar adecuación a TreeTable actual |
| AST-017 | Clases por nivel y nodo | Implementadas en rama TreeTable MDX, no publicadas | Revisar e integrar solo con autorización |
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

## AST-017 · Clases por nivel y nodo en TreeTable MDX (rama, no publicado)

Implementado en la rama de desarrollo actual, sin integrar main ni abrir PR. Sintaxis: `<TreeTable levelClasses="1:ArticuloCabecera; 2:ArticuloPunto">` y excepción `[class=ArticuloCabecera]`. Raíz = nivel 0; profundidad absoluta por tabla. Una clase semántica por nivel/nodo; prioridad explícita del nodo > mapa de nivel > padre heredado > estilo predeterminado. La excepción se hereda salvo otra clase explícita o un nivel configurado. No modifica hermanos. `[class=none]` restaura estilo predeterminado y corta la clase heredada; un nivel configurado inferior puede volver a asignar clase.

Se conservan nivel-N; los colores predeterminados solo se aplican sin clase semántica. Los nombres no generan CSS: importar una hoja global. La demo incluye ArticuloCabecera y ArticuloPunto en examples/astro-component-lab/src/styles/article-example.css, compartida entre wiki y sandbox. No son nombres reservados. Se validan nombres y niveles duplicados. Numbering, collapsible y class se combinan en una misma anotación, con coma o punto y coma.

La rama antigua feature/ast-017-level-classes permanece intacta; su parser Remark no se integra. Este cambio implementa el contrato en el componente activo de MDX. Próximo desarrollo funcional pendiente: modelo de Summary/Boundary. Biblioteca AST-027 sigue siendo el último hito.
