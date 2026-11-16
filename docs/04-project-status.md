# Estado actual del proyecto

Actualizado el 16-11-2026.

## Implementado y publicado

Wiki Astro + Starlight + MDX, con inicio, guía de clases/componentes, TreeTable y laboratorio. El sitio no publica temario; el repositorio y su historial siguen públicos.

TreeTable recibe una lista Markdown jerárquica, calcula rowspan/colspan y genera HTML estático. Asigna clases fijas `nivel-0`, `nivel-1` y siguientes. Admite numeración decimal por nodo, local o gradual, y comienzo/reinicio configurable.

La sintaxis vigente es `[numbering=arabic; tiered=true; start=5]`: corchetes, opciones separadas por punto y coma y ningún escape MDX. El componente retira el marcador de la etiqueta visible. PR #6, #7 y #8 están integrados.

[Tabla publicada y fuente de los ejemplos](https://pablogonzalezruiz.github.io/AstroXmind/componentes/tree-table/).

StackBlitz es una copia independiente sin sincronización de cambios con GitHub. No existe exportación a XMind.

## Verificación del código publicado

Base auditada: `6aff07e65b8cbd8e89f56a2f9a39d04f5a0af372` en `main`, 16-11-2026. PR #8 integrado.

- [CI correcto](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43901962478).
- [Wiki Build correcto](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43901962607).
- [Pages Deploy correcto](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43901962390).
- La auditoría de dependencias 43897812008 corresponde al SHA anterior `109e033`; no atribuirla al HEAD actual.

Los checks acreditan compilación y despliegue del SHA indicado, no fidelidad visual ni interoperabilidad XMind.

## Pendientes y siguiente cambio propuesto

1. Clases configurables por nivel ya implementadas en esta rama para TreeTable MDX (AST-017); pendientes de integración y publicación. Ver el contrato actualizado al final. La rama Remark anterior se conserva sin integrar.
2. Diseñar Summary y Boundary como grupos de nodos hermanos, con IDs estables, referencias y validación. Las sintaxis de docs/12 son propuestas; `resumen` HTML no implementa Summary XMind.
3. Evaluar regresiones adecuadas al componente actual: PR #5 sigue abierto y usa una base anterior.
4. Mantener exportación XMind, presets completos, editor persistente y publicación de temario como fases pendientes/aplazadas.

Los PR #1 (seguridad), #2 (contenido), #4 (documentación) y #5 (regresiones) continúan abiertos. Deben revisarse contra la base actual antes de cualquier integración; esta auditoría no los modifica.

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
