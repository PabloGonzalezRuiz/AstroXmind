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

1. Adaptar las clases configurables por nivel al TreeTable MDX actual. Conservar `nivel-N`, definir profundidad desde cero y documentar combinación con clases locales. La implementación de `feature/ast-017-level-classes` (SHA `28dd01bf5c30439accdc25dceb89d1079a43eaaf`) modifica el parser Remark anterior: no integrarla directamente ni considerarla publicada o validada.
2. Diseñar Summary y Boundary como grupos de nodos hermanos, con IDs estables, referencias y validación. Las sintaxis de docs/12 son propuestas; `resumen` HTML no implementa Summary XMind.
3. Evaluar regresiones adecuadas al componente actual: PR #5 sigue abierto y usa una base anterior.
4. Mantener exportación XMind, presets completos, editor persistente y publicación de temario como fases pendientes/aplazadas.

Los PR #1 (seguridad), #2 (contenido), #4 (documentación) y #5 (regresiones) continúan abiertos. Deben revisarse contra la base actual antes de cualquier integración; esta auditoría no los modifica.
