# Continuación de AstroXmind

Leer docs/09-continuation.md, docs/04-project-status.md, docs/03-roadmap.md y docs/10-declarative-language-architecture.md. Comprobar main y Actions en GitHub; la auditoría del 17-11-2026 se basa en e7bfb8e7f41ec5637c685e62698eb12b7ab1b658.

## Estado y fuentes

- Wiki pública: https://pablogonzalezruiz.github.io/AstroXmind/. Solo clases/componentes, sin temario.
- TreeTable: examples/astro-component-lab/src/components/TreeTable.astro; importado por wiki y sandbox. CSS de ejemplo compartido en src/styles/article-example.css dentro del laboratorio.
- Publicados: AST-017 clases, AST-025 plegado heredable, AST-026 numeración heredable y AST-022 corchetes sin escapes. No reintroducir llaves.
- Contrato exacto y precedencia: docs/10. Profundidad 0 para raíz. Start no se hereda; numbering, tiered y collapsible sí. Clases explícitas > nivel > padre.
- Próxima tarea funcional AST-028: estado inicial, todavía ausente. La rama feature/ast-021-tree-fold-state es solo una base; AST-021 ya identifica numeración.
- Summary/Boundary aplazados; biblioteca AST-027 último hito. Scripts Remark/Pandoc y rama AST-017 antigua no son el pipeline MDX activo.

## Verificación y permisos

CI usa Node.js 22, npm ci, npm run check y npm run build. Usar comprobaciones apropiadas al cambio, sin baterías ad hoc innecesarias. Compartir runs por SHA; un workflow informativo de dependencias verde no demuestra ausencia de vulnerabilidades. No afirmar publicación hasta comprobar Pages.

Trabajar en rama. No tocar main, abrir/fusionar PR, cerrar/reescribir PRs o publicar releases sin autorización explícita aplicable. Las ediciones de StackBlitz no vuelven a GitHub. Mantener auditorías históricas sin reescribir.
