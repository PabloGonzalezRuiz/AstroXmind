# Instrucciones de continuidad

Actualización 17-11-2026: el usuario autorizó integrar y publicar NAV-01/02/03 en main, sin PR ni release. Fuente validada: 238ce44. Registro: docs/17-navigation-publication.md. Consultar HEAD y Actions remotos antes de actuar; acreditar publicación por SHA y HTTP, no solo por commit.

## Prioridad y autorización

NAV-01/02/03 implementados e integrados: IDs/árbol, navegación contextual, referencias estables, DocumentNavigator y demostración en /AstroXmind/navegacion/. La autorización de publicación cubre esta entrega; no autoriza NAV-04 ni cambios externos posteriores. Explicar NAV-04 y pedir autorización antes de implementarlo. No abrir/fusionar/cerrar PR ni publicar releases. Summary/Boundary aplazados y biblioteca AST-027 último hito.

Leer docs/09-continuation.md, 04-project-status.md, 03-roadmap.md, 10-declarative-language-architecture.md, 13-navigation-phase.md y 16-document-references.md. Mantener auditorías históricas intactas.

## Fuentes y contrato

TreeTable vive en examples/astro-component-lab/src/components/TreeTable.astro, compartido por wiki/laboratorio. Demos en src/examples; usar ComponentExample con import normal y ?raw del mismo archivo para Resultado/Código. docs/ de mantenimiento no son páginas del árbol. StackBlitz es copia independiente.

Corchetes sin escapes; raíz de tabla nivel 0. start local; numbering/tiered/collapsible/folded heredables. [id=ref-nombre] opcional y no heredable. navigation.id/parent/order determina el árbol documental independiente de carpetas; referencias doc:doc-000001#ref-nombre no crean parentesco. No repetir numeración, plegado, clases ni fullscreen ya existentes.

Conservar resolución por ID al renderizar MarkdownContent y validación de HTML real: el contenido Markdown puede estar cacheado con una URL antigua. No confiar solo en Remark. DocumentNavigator lee el contexto de la página; migas arriba, árbol lateral y padre/hermanos/hijos/recorrido abajo. jsdom es dependencia de pruebas raíz, no del cliente ni del laboratorio.

## Verificación

CI Node.js 22, npm ci, npm run check/build. Prueba adicional npm run test:references:rebuild sobre copia temporal. Las 48 pruebas previas incluyen DOM y caché; no acreditan inspección visual completa, scroll real, fullscreen nativo ni táctil. Laboratorio tiene lockfile propio. No afirmar seguridad por auditoría meramente informativa.
