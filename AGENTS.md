# Instrucciones de continuidad

Estado auditado el 18-11-2026: main `f3e2259d76ff62c2949b29a01292cd988b4b3e99`, publicado. NAV-01/02/03, ampliación de orden/fechas y corrección de numeración consecutiva están terminados. CI 44130965495, Wiki Build 44130965520 y Pages 44130965464 success. Consultar HEAD y ejecuciones remotos al retomar.

## Encargo y prioridad

El usuario validó NAV-04 en Windows y autorizó integrarlo en main y verificar su publicación. NAV-04 se publicó en d8cb7aa y el usuario confirmó la prueba pública. El usuario validó NAV-05 en Windows y autorizó su integración y publicación. NAV-05 publicado en 3b2739c y confirmado por el usuario. NAV-06 fue validado en Windows y autorizado para publicación. NAV-07 es el siguiente desarrollo. Véase docs/23-reference-relations.md. Summary/Boundary aplazados; biblioteca AST-027 último hito. No corregir código como efecto secundario de documentar.

Leer docs/README.md, 00-master-prompt.md, 09-continuation.md, 04-project-status.md y 03-roadmap.md. Informe actual: docs/audits/2026-11-18-application-state.md. Arquitectura 02, instalación limpia 10, historia 18 y operación 19. Conservar auditorías históricas.

## Fuentes y contrato

TreeTable vive en examples/astro-component-lab/src/components/TreeTable.astro, compartido por wiki/laboratorio. Demos en src/examples; usar ComponentExample con import normal y ?raw del mismo archivo para Resultado/Código. docs/ de mantenimiento no son páginas del árbol. StackBlitz es copia independiente.

Corchetes sin escapes; raíz de tabla nivel 0. start local; numbering/tiered/collapsible/folded heredables. [id=ref-nombre] opcional y no heredable. navigation.id/parent/order determina el árbol documental independiente de carpetas; referencias doc:doc-000001#ref-nombre no crean parentesco. No repetir numeración, plegado, clases ni fullscreen ya existentes.

Conservar resolución por ID al renderizar MarkdownContent y validación de HTML real: el contenido Markdown puede estar cacheado con una URL antigua. No confiar solo en Remark. DocumentNavigator lee el contexto de la página; migas arriba, árbol lateral y padre/hermanos/hijos/recorrido abajo. jsdom es dependencia de pruebas raíz, no del cliente ni del laboratorio.

## Orden y numeración

order solo ordena. Grupos de valores distintos reciben ordinales densos por padre (10,10,30 → 1,1,2). Empates por created, fallback modified e ID. Fechas exclusivamente YAML con tres decimales y zona; nunca filesystem/Git/ledger/reloj. Pendientes al final y sin número, raíz neutra, padre sin order corta prefijo. Índice schemaVersion 2. No modificar orders para simular numeración.

## Verificación

CI Node 22, npm ci/check/build: 43 dominio + 16 HTML/DOM = 59. Integraciones explícitas de ordenación y caché/renombrado completan 61. Preparar raíz antes del laboratorio: carece de tsconfig propio y el check puede alcanzar middleware raíz. jsdom no acredita layout, scroll real, fullscreen nativo o táctil. Auditoría informativa verde no implica cero vulnerabilidades. PRs #1/#2/#4/#5 siguen abiertos; no integrarlos automáticamente.
