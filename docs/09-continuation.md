# Punto de reanudación de AstroXmind

> Actualización de integración — 16-11-2026: los cambios de plegado heredable (AST-025), numeración heredable (AST-026) y clases por nivel/nodo (AST-017) ya están incorporados en main, commit `1a80d4c51b078dcb1aab7fd8f722f4e2eba58245`, por petición expresa del usuario de actualizar la wiki. Las menciones posteriores a rama/no integrado describen el estado de desarrollo anterior y quedan superadas por esta nota. La biblioteca AST-027 continúa como último hito pendiente.
>
> Verificación de este SHA: [CI](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43913037615), [Wiki Build](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43913037671), [Pages Deploy](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43913037713). Consultar la conclusión de cada ejecución antes de afirmar que la página está publicada.


Actualizado el 16-11-2026. Leer primero junto con AGENTS.md.

## Verificación del código publicado

Base auditada: `6aff07e65b8cbd8e89f56a2f9a39d04f5a0af372` en `main`, 16-11-2026. PR #8 integrado.

- [CI correcto](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43901962478).
- [Wiki Build correcto](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43901962607).
- [Pages Deploy correcto](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43901962390).
- La auditoría de dependencias 43897812008 corresponde al SHA anterior `109e033`; no atribuirla al HEAD actual.

Los checks acreditan compilación y despliegue del SHA indicado, no fidelidad visual ni interoperabilidad XMind.

## Enlaces de uso

- [Wiki](https://pablogonzalezruiz.github.io/AstroXmind/).
- [TreeTable con corchetes](https://pablogonzalezruiz.github.io/AstroXmind/componentes/tree-table/).
- [Clases Astro](https://pablogonzalezruiz.github.io/AstroXmind/clases-astro/).
- [Laboratorio](https://pablogonzalezruiz.github.io/AstroXmind/laboratorio-componentes/).

## Contrato vigente

Lista Markdown dentro de TreeTable. Clases automáticas desde `nivel-0`. Anotación literal `[numbering=arabic; tiered=true; start=5]`, sin llaves ni escapes. `numbering="siblings"` muestra número local; `numbering="path"` habilita ruta gradual para nodos marcados con tiered; `none` oculta números. Sin marcador el nodo hereda la configuración de su padre; en la raíz la numeración comienza desactivada. Cada grupo de hermanos tiene contador independiente.

## Fuentes activas

- Componente: `examples/astro-component-lab/src/components/TreeTable.astro`.
- Página publicada: `src/content/docs/componentes/tree-table.mdx`.
- Configuración: `astro.config.mjs`.
- Scripts Remark/Pandoc y ejemplos antiguos se conservan, pero no forman parte del build actual de la wiki.

## Pendientes y siguiente cambio propuesto

1. Clases configurables por nivel ya implementadas en esta rama para TreeTable MDX (AST-017); pendientes de integración y publicación. Ver el contrato actualizado al final. La rama Remark anterior se conserva sin integrar.
2. Diseñar Summary y Boundary como grupos de nodos hermanos, con IDs estables, referencias y validación. Las sintaxis de docs/12 son propuestas; `resumen` HTML no implementa Summary XMind.
3. Evaluar regresiones adecuadas al componente actual: PR #5 sigue abierto y usa una base anterior.
4. Mantener exportación XMind, presets completos, editor persistente y publicación de temario como fases pendientes/aplazadas.

Los PR #1 (seguridad), #2 (contenido), #4 (documentación) y #5 (regresiones) continúan abiertos. Deben revisarse contra la base actual antes de cualquier integración; esta auditoría no los modifica.

## Límites de autorización

Este cambio documental se prepara en rama separada. No modificar main, publicar releases, abrir o fusionar PR ni ejecutar otros cambios externos sin aprobación. Antes de retomar, volver a leer el HEAD remoto; el SHA de esta nota es una referencia histórica fija.

## AST-025 · Plegado heredable TreeTable (rama de desarrollo)

Implementado en esta rama, no integrado ni publicado. `collapsible="true"` en TreeTable establece el valor inicial heredable (por defecto false). Un sufijo `[collapsible=false]` o `[collapsible=true]` sobrescribe ese valor para el nodo y sus descendientes. Las hojas no tienen botón. False impide plegar ese nodo; no evita que un antecesor oculte la rama. Todos comienzan expandidos.

Las anotaciones admiten comas o punto y coma y opciones en cualquier orden, conservando numbering, tiered y start. El cliente recalcula rowspan/colspan al plegar, preserva numeración y estados internos, y ofrece botones de teclado con aria-expanded. Sin JavaScript queda la tabla completa. Demo en la página TreeTable y en el sandbox.

No abrir PR, modificar main ni publicar sin autorización.

## AST-026 · Contrato de numeración heredable (rama, no publicado)

Numbering arabic se hereda a descendientes; numbering=none lo desactiva para una rama y puede reactivarse más abajo. Tiered también se hereda y puede sobrescribirse. Start es local; los contadores se reinician por grupo de hermanos y solo avanzan en nodos numerados. Las excepciones no cambian hermanos y las rutas conservan solo antecesores numerados. El modo del componente controla presentación; no activa numeración. Ejemplo: nodo padre [numbering=arabic], hijo [tiered=true], otro hijo [start=5], rama excluida [numbering=none]. Sustituye el contrato anterior de marcado obligatorio de cada descendiente. Biblioteca de componentes anotada como último hito AST-027 en la hoja de ruta.

Start predeterminado: 1 por grupo de hermanos. Con ruta gradual, padre 7 → hijos 7.1 y 7.2; si un hijo lleva start=5, su siguiente hermano es 6 y sus propios hijos comienzan en 1 (por ejemplo 7.5.1). No copiar start del padre.

## AST-017 · Clases por nivel y nodo en TreeTable MDX (rama, no publicado)

Implementado en la rama de desarrollo actual, sin integrar main ni abrir PR. Sintaxis: `<TreeTable levelClasses="1:ArticuloCabecera; 2:ArticuloPunto">` y excepción `[class=ArticuloCabecera]`. Raíz = nivel 0; profundidad absoluta por tabla. Una clase semántica por nivel/nodo; prioridad explícita del nodo > mapa de nivel > padre heredado > estilo predeterminado. La excepción se hereda salvo otra clase explícita o un nivel configurado. No modifica hermanos. `[class=none]` restaura estilo predeterminado y corta la clase heredada; un nivel configurado inferior puede volver a asignar clase.

Se conservan nivel-N; los colores predeterminados solo se aplican sin clase semántica. Los nombres no generan CSS: importar una hoja global. La demo incluye ArticuloCabecera y ArticuloPunto en examples/astro-component-lab/src/styles/article-example.css, compartida entre wiki y sandbox. No son nombres reservados. Se validan nombres y niveles duplicados. Numbering, collapsible y class se combinan en una misma anotación, con coma o punto y coma.

La rama antigua feature/ast-017-level-classes permanece intacta; su parser Remark no se integra. Este cambio implementa el contrato en el componente activo de MDX. Próximo desarrollo funcional pendiente: modelo de Summary/Boundary. Biblioteca AST-027 sigue siendo el último hito.
