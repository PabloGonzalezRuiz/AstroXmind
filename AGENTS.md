# Instrucciones de continuidad

**Hito de continuidad H-TEM-01 (23-11-2026; reanudar 24-11):** base funcional `0758632`, CI/Build/Pages correctos y 123 pruebas principales locales; dos integraciones adicionales de reconstrucción fallan en el entorno temporal, pendiente diagnóstico. El expediente 2025 libre sigue en REVISION, con año/modalidad explícitos y CPS separado. Próximo trabajo PROG-01: definir esquema canónico del programa desglosado (YAML), conceptos permanentes, ocurrencias versionadas y asociaciones múltiples; Markdown anidado como vista editable. Después PROG-02, CALL-05 y PROG-03; no reiniciar ni importar datos hasta validar. Las prioridades anteriores son históricas. [Auditoría y criterios de aceptación](docs/audits/2026-11-23-hito-temario.md).

**Idioma:** español para comunicaciones, documentación, etiquetas de interfaz, comentarios y mensajes de commits; conservar identificadores técnicos cuando sea necesario.

**Cierre de sesión:** consultar los documentos maestros privados actualizados antes de desarrollar. La aceptación del expediente documental precede al temario. Comprobar HEAD y CI al reanudar.

**Prioridad vigente (23-11-2026):** Procesado de Temarios. CALL-01 y CALL-02 confirmados funcionalmente; CALL-03 genera el expediente oficial TAI 2025, con F00/F01/F02/F03/F05 ejecutadas y estado REVISION (F04 opcional). CALL-04 incorpora criterios oficiales CPS como documento separado, persistencia confirmada. Siguiente: confirmar visualización del Paso 3 y CALL-05, revisar evidencia, bases, programa y reglas; no inventar cortes reales. No desbloquear el temario hasta aceptación del expediente documental. No publicar datos privados ni credenciales.

Base funcional verificada el 19-11-2026: main `da19c5ba05c5ab2fd12353c3f86e22c49fedd78e`, NAV-01 a NAV-08, editor GitHub, TreeTable inline y teclado publicados. 79 pruebas y CI/Pages correctos. Consultar HEAD y ejecuciones remotos al retomar.

## Encargo y prioridad

**Entrega histórica: FrameEjemplo (19-11-2026).** Leer `docs/29-frame-ejemplo.md`. Pablo autorizó la implementación, integración y publicación, además de actualizar la documentación para retomar mañana. El catálogo de prácticas deriva de `src/examples/tree-table/`, usa el editor compartido; nunca persistir sus cambios. Comprobar CI/Pages del HEAD y validar selección/reset en la wiki antes de retomar CTX-06.

**Prioridad anterior (aplazada).** Editor contextual CTX-01 a CTX-07; CTX-01/02/03/04/05 implementados; CTX-06 espera autorización. Leer docs/28-contextual-component-editor.md y docs/27-editor-github-pages-pat.md. Catálogo v1 en examples/astro-component-lab/src/catalog; motor src/lib/wiki-editor-transform.mjs; no duplicar valores/patrones del modelo. Después reordenar desde el explorador y evaluar movimientos en TreeTable.

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

**Separación de expedientes (23-11-2026):** la oposición tiene un listado de tarjetas por año/modalidad y un alta independiente. Tras crear el YAML F00 se abre el expediente; sus pasos comienzan con el PDF oficial (Paso 1), luego criterios CPS (Paso 2). No se ofrecen duplicados, tampoco F00 sin PDF. Consultar `docs/32-oposiciones.md`. Compilación local y 65 pruebas correctas; pendiente comprobación en Pages.
