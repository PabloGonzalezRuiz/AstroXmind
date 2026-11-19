# Instrucciones de continuidad

Base funcional verificada el 19-11-2026: main `da19c5ba05c5ab2fd12353c3f86e22c49fedd78e`, NAV-01 a NAV-08, editor GitHub, TreeTable inline y teclado publicados. 79 pruebas y CI/Pages correctos. Consultar HEAD y ejecuciones remotos al retomar.

## Encargo y prioridad

**Prioridad vigente.** Editor contextual CTX-01 a CTX-07; CTX-01 implementado, CTX-02 espera autorización. Leer docs/28-contextual-component-editor.md y docs/27-editor-github-pages-pat.md. Catálogo v1 en examples/astro-component-lab/src/catalog; no duplicar valores/patrones del modelo. Después reordenar desde el explorador y evaluar movimientos en TreeTable.

El usuario validó NAV-04 en Windows y autorizó integrarlo en main y verificar su publicación. NAV-04 se publicó en d8cb7aa y el usuario confirmó la prueba pública. El usuario validó NAV-05 en Windows y autorizó su integración y publicación. NAV-05 publicado en 3b2739c y confirmado por el usuario. NAV-06 se publicó y el usuario confirmó su funcionamiento. NAV-07 fue validado en Windows y autorizado para publicación. El usuario confirmó NAV-07 en la wiki pública. NAV-08 validado en Windows e integrado en main. Véase docs/23-reference-relations.md. Summary/Boundary aplazados; biblioteca AST-027 último hito. No corregir código como efecto secundario de documentar.

Leer docs/README.md, 00-master-prompt.md, 09-continuation.md, 04-project-status.md y 03-roadmap.md. Para edición wiki, revisar docs/25-wiki-editing-proposal.md y el informe AST-035 de docs/26-astro-editing-patterns.md. Informe actual: docs/audits/2026-11-18-nav08-handoff.md. Arquitectura 02, instalación limpia 10, historia 18 y operación 19. Conservar auditorías históricas.

## Fuentes y contrato

TreeTable vive en examples/astro-component-lab/src/components/TreeTable.astro, compartido por wiki/laboratorio. Demos en src/examples; usar ComponentExample con import normal y ?raw del mismo archivo para Resultado/Código. docs/ de mantenimiento no son páginas del árbol. StackBlitz es copia independiente.

Corchetes sin escapes; raíz de tabla nivel 0. start local; numbering/tiered/collapsible/folded heredables. [id=ref-nombre] opcional y no heredable. navigation.id/parent/order determina el árbol documental independiente de carpetas; referencias doc:doc-000001#ref-nombre no crean parentesco. No repetir numeración, plegado, clases ni fullscreen ya existentes.

Conservar resolución por ID al renderizar MarkdownContent y validación de HTML real: el contenido Markdown puede estar cacheado con una URL antigua. No confiar solo en Remark. DocumentNavigator lee el contexto de la página; migas arriba, árbol lateral y padre/hermanos/hijos/recorrido abajo. jsdom es dependencia de pruebas raíz, no del cliente ni del laboratorio.

## Orden y numeración

order solo ordena. Grupos de valores distintos reciben ordinales densos por padre (10,10,30 → 1,1,2). Empates por created, fallback modified e ID. Fechas exclusivamente YAML con tres decimales y zona; nunca filesystem/Git/ledger/reloj. Pendientes al final y sin número, raíz neutra, padre sin order corta prefijo. Índice schemaVersion 2. No modificar orders para simular numeración.

## Verificación

CI Node 22, npm ci/check/build: Consultar los recuentos del SHA auditado en la auditoría vigente. En la rama de robustez, el laboratorio tiene tsconfig y trabajo CI propios. Comprobar lab y wiki por separado. jsdom no acredita layout, scroll real, fullscreen nativo o táctil. Auditoría informativa verde no implica cero vulnerabilidades. PRs #1/#2/#4/#5 siguen abiertos; no integrarlos automáticamente.

## Pruebas manuales

Pablo prefiere validar las funciones mediante enlaces directos a la wiki. Las entregas nuevas se preparan en rama, pasan las comprobaciones automáticas y, una vez publicadas, se indican las secciones exactas para probar. El ZIP local sigue disponible como forma de distribución.
