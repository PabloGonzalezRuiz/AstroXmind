# Registro de decisiones

| ADR | Decisión | Estado |
|---|---|---|
| [ADR-001](adr/ADR-001-initial-architecture.md) | AstroXmind independiente; Markdown/MDX como fuente | Aceptada |
| [ADR-002](adr/ADR-002-native-mdx-tree-table.md) | Componente Astro TreeTable y laboratorio MDX aislado | Implementada; prototipo publicado |
| AST-020 | Wiki pública limitada a clases y componentes Astro; temario fuera de Pages por ahora | Aceptada e integrada |
| AST-021 | Marcadores numéricos por nodo con ruta gradual opcional y comienzo configurable | Implementada |

Las decisiones nuevas deben registrar contexto, sintaxis exacta, alcance de compatibilidad y fecha.

## Referencia de continuidad — 16-11-2026

Código publicado auditado: `6aff07e65b8cbd8e89f56a2f9a39d04f5a0af372`. PR #8 integrado; numeración literal `[numbering=arabic; tiered=true; start=5]` sin escapes. Clases automáticas `nivel-N` implementadas; mapa configurable AST-017 pendiente de adaptación al componente actual. Summary y Boundary (AST-018) son diseño pendiente, no funcionalidades publicadas. Ver [estado](./04-project-status.md) y [continuidad](./09-continuation.md).
