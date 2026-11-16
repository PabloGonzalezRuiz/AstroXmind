# Hoja de ruta

Actualizada el 16-11-2026 sobre `6aff07e65b8cbd8e89f56a2f9a39d04f5a0af372`.

## Terminado

- AST-019: componente TreeTable MDX y laboratorio Astro, PR #6 integrado.
- AST-020: wiki pública centrada en componentes y clases Astro, PR #7 integrado.
- AST-021: numeración decimal por nodo con ruta gradual y comienzo configurable, PR #7 integrado.
- AST-022: numeración entre corchetes sin escapes MDX, PR #8 integrado y desplegado.

## Pendientes y siguiente cambio propuesto

1. Clases por nivel y nodo adaptadas al TreeTable MDX en la rama actual; revisar para su futura integración. Antecedente: adaptar las clases configurables por nivel al TreeTable MDX actual. Conservar `nivel-N`, definir profundidad desde cero y documentar combinación con clases locales. La implementación de `feature/ast-017-level-classes` (SHA `28dd01bf5c30439accdc25dceb89d1079a43eaaf`) modifica el parser Remark anterior: no integrarla directamente ni considerarla publicada o validada.
2. Diseñar Summary y Boundary como grupos de nodos hermanos, con IDs estables, referencias y validación. Las sintaxis de docs/12 son propuestas; `resumen` HTML no implementa Summary XMind.
3. Evaluar regresiones adecuadas al componente actual: PR #5 sigue abierto y usa una base anterior.
4. Mantener exportación XMind, presets completos, editor persistente y publicación de temario como fases pendientes/aplazadas.

Los PR #1 (seguridad), #2 (contenido), #4 (documentación) y #5 (regresiones) continúan abiertos. Deben revisarse contra la base actual antes de cualquier integración; esta auditoría no los modifica.

## Cierre de cada cambio

Actualizar estado, tareas y continuidad con SHA y evidencia. No confundir una rama implementada con código validado, integrado o desplegado. No ampliar patrones numéricos sin una necesidad acordada. Los cambios funcionales de la rama corresponden a las peticiones explícitas del usuario; integrar y publicar sigue requiriendo aprobación.

## AST-025 · Plegado heredable TreeTable (rama de desarrollo)

Implementado en esta rama, no integrado ni publicado. `collapsible="true"` en TreeTable establece el valor inicial heredable (por defecto false). Un sufijo `[collapsible=false]` o `[collapsible=true]` sobrescribe ese valor para el nodo y sus descendientes. Las hojas no tienen botón. False impide plegar ese nodo; no evita que un antecesor oculte la rama. Todos comienzan expandidos.

Las anotaciones admiten comas o punto y coma y opciones en cualquier orden, conservando numbering, tiered y start. El cliente recalcula rowspan/colspan al plegar, preserva numeración y estados internos, y ofrece botones de teclado con aria-expanded. Sin JavaScript queda la tabla completa. Demo en la página TreeTable y en el sandbox.

No abrir PR, modificar main ni publicar sin autorización.

## AST-026 · Numeración heredable (rama de desarrollo)

Numbering arabic/none y tiered se heredan; start es local. Una sobrescritura afecta al nodo y sus descendientes, no a sus hermanos. Pendiente de integración y despliegue.


## AST-017 · Clases por nivel y nodo en TreeTable MDX (rama, no publicado)

Implementado en la rama de desarrollo actual, sin integrar main ni abrir PR. Sintaxis: `<TreeTable levelClasses="1:ArticuloCabecera; 2:ArticuloPunto">` y excepción `[class=ArticuloCabecera]`. Raíz = nivel 0; profundidad absoluta por tabla. Una clase semántica por nivel/nodo; prioridad explícita del nodo > mapa de nivel > padre heredado > estilo predeterminado. La excepción se hereda salvo otra clase explícita o un nivel configurado. No modifica hermanos. `[class=none]` restaura estilo predeterminado y corta la clase heredada; un nivel configurado inferior puede volver a asignar clase.

Se conservan nivel-N; los colores predeterminados solo se aplican sin clase semántica. Los nombres no generan CSS: importar una hoja global. La demo incluye ArticuloCabecera y ArticuloPunto en examples/astro-component-lab/src/styles/article-example.css, compartida entre wiki y sandbox. No son nombres reservados. Se validan nombres y niveles duplicados. Numbering, collapsible y class se combinan en una misma anotación, con coma o punto y coma.

La rama antigua feature/ast-017-level-classes permanece intacta; su parser Remark no se integra. Este cambio implementa el contrato en el componente activo de MDX. Próximo desarrollo funcional pendiente: modelo de Summary/Boundary. Biblioteca AST-027 sigue siendo el último hito.

## Último hito · AST-027 · Biblioteca de componentes

Al final de la hoja de ruta: agrupar los componentes reutilizables en una biblioteca propia, con tema compartido y AstroXmind como documentación y laboratorio. Evaluar packages/astroxmind-components y una sola fuente para wiki y sandbox. No publicar en npm ni crear repositorios hasta acordarlo. Estado: planificado, no implementado.
