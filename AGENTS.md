# Instrucciones de continuidad

Actualización 17-11-2026: el usuario autorizó integrar y publicar NAV-01/02/03 en main, sin PR ni release. Fuente validada: 238ce44. Registro: docs/17-navigation-publication.md. Consultar HEAD y Actions remotos antes de actuar; acreditar publicación por SHA y HTTP, no solo por commit.

## Prioridad y autorización

NAV-01/02/03 implementados e integrados: IDs/árbol, navegación contextual, referencias estables, DocumentNavigator y demostración en /AstroXmind/navegacion/. La autorización de publicación cubre esta entrega; no autoriza NAV-04 ni cambios externos posteriores. Explicar NAV-04 y pedir autorización antes de implementarlo. No abrir/fusionar/cerrar PR ni publicar releases. Summary/Boundary aplazados y biblioteca AST-027 último hito.

Leer docs/README.md, 00-master-prompt.md, 09-continuation.md, 04-project-status.md y 03-roadmap.md. Arquitectura completa: docs/02; instalación limpia: docs/10-manual; historia y 222 commits: docs/18 y docs/history; operación: docs/19. Contratos de autoría y NAV: docs/10, 14, 15 y 16. Mantener auditorías históricas intactas.

## Fuentes y contrato

TreeTable vive en examples/astro-component-lab/src/components/TreeTable.astro, compartido por wiki/laboratorio. Demos en src/examples; usar ComponentExample con import normal y ?raw del mismo archivo para Resultado/Código. docs/ de mantenimiento no son páginas del árbol. StackBlitz es copia independiente.

Corchetes sin escapes; raíz de tabla nivel 0. start local; numbering/tiered/collapsible/folded heredables. [id=ref-nombre] opcional y no heredable. navigation.id/parent/order determina el árbol documental independiente de carpetas; referencias doc:doc-000001#ref-nombre no crean parentesco. No repetir numeración, plegado, clases ni fullscreen ya existentes.

Conservar resolución por ID al renderizar MarkdownContent y validación de HTML real: el contenido Markdown puede estar cacheado con una URL antigua. No confiar solo en Remark. DocumentNavigator lee el contexto de la página; migas arriba, árbol lateral y padre/hermanos/hijos/recorrido abajo. jsdom es dependencia de pruebas raíz, no del cliente ni del laboratorio.

## Verificación

CI Node.js 22, npm ci, npm run check/build. Prueba adicional npm run test:references:rebuild sobre copia temporal. Las 48 pruebas previas incluyen DOM y caché; no acreditan inspección visual completa, scroll real, fullscreen nativo ni táctil. Laboratorio tiene lockfile propio. No afirmar seguridad por auditoría meramente informativa.

## Encargo documental y hallazgo de instalación

La publicación de NAV-01/02/03 terminó: main 2cdba361920b58a5002faa063e46660f22ff36ef; CI 44096661054, Wiki Build 44096660778 y Pages 44096660802 success, diez páginas/catorce referencias verificadas. El nuevo encargo actualiza arquitectura, reconstrucción desde instalación limpia, historia, estado y prompt en rama documental. No autoriza otro despliegue ni NAV-04. No presentar el prompt como si la navegación siguiera sin publicar.

Reproducción local de esta auditoría: Node 24.22.1, npm ci/check/build/test:references:rebuild correctos, 48 pruebas. CI usa Node 22 y ejecuta 47; la prueba adicional no corre sola. El laboratorio carece de tsconfig propio y su check puede alcanzar el middleware raíz; falló durante la preparación paralela y pasó tras preparar la raíz. Usar ese orden y conservar la deuda de aislamiento para robustez. No corregir código como efecto secundario de actualizar documentación.

## Ampliación de navegación autorizada después de documentar

El usuario pidió order opcional, pendientes al final y numeración heredada solo para order explícito, compartida entre duplicados. Aclaró que las fechas son campos del YAML junto a order y con milisegundos. En feature/navigation-order-created-20261117, created y modified son opcionales; created tiene prioridad, modified es fallback. Nunca inferir fechas de filesystem, Git, ledger o reloj del build. No se modifica reserva/registro de IDs. Ver docs/20-navigation-ordering.md. La ampliación mantiene main/Pages en 2cdba36 y no autoriza NAV-04 ni despliegue. La raíz no añade prefijo 0; padre sin order corta ruta; NavigationLabel centraliza la presentación. Emitir índice schemaVersion:2 y comprobar build real con fechas separadas por 1 ms.
