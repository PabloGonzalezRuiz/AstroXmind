# Punto de reanudación de AstroXmind

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

Lista Markdown dentro de TreeTable. Clases automáticas desde `nivel-0`. Anotación literal `[numbering=arabic; tiered=true; start=5]`, sin llaves ni escapes. `numbering="siblings"` muestra número local; `numbering="path"` habilita ruta gradual para nodos marcados con tiered; `none` oculta números. Sin marcador no se numera el nodo. Cada grupo de hermanos tiene contador independiente.

## Fuentes activas

- Componente: `examples/astro-component-lab/src/components/TreeTable.astro`.
- Página publicada: `src/content/docs/componentes/tree-table.mdx`.
- Configuración: `astro.config.mjs`.
- Scripts Remark/Pandoc y ejemplos antiguos se conservan, pero no forman parte del build actual de la wiki.

## Pendientes y siguiente cambio propuesto

1. Adaptar las clases configurables por nivel al TreeTable MDX actual. Conservar `nivel-N`, definir profundidad desde cero y documentar combinación con clases locales. La implementación de `feature/ast-017-level-classes` (SHA `28dd01bf5c30439accdc25dceb89d1079a43eaaf`) modifica el parser Remark anterior: no integrarla directamente ni considerarla publicada o validada.
2. Diseñar Summary y Boundary como grupos de nodos hermanos, con IDs estables, referencias y validación. Las sintaxis de docs/12 son propuestas; `resumen` HTML no implementa Summary XMind.
3. Evaluar regresiones adecuadas al componente actual: PR #5 sigue abierto y usa una base anterior.
4. Mantener exportación XMind, presets completos, editor persistente y publicación de temario como fases pendientes/aplazadas.

Los PR #1 (seguridad), #2 (contenido), #4 (documentación) y #5 (regresiones) continúan abiertos. Deben revisarse contra la base actual antes de cualquier integración; esta auditoría no los modifica.

## Límites de autorización

Este cambio documental se prepara en rama separada. No modificar main, publicar releases, abrir o fusionar PR ni ejecutar otros cambios externos sin aprobación. Antes de retomar, volver a leer el HEAD remoto; el SHA de esta nota es una referencia histórica fija.
