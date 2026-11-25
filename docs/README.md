# Documentación de AstroXmind

**ED-03 (25-11-2026):** prototipo independiente de tres paneles preparado para publicar, con datos exclusivamente ficticios; correcciones NUM y ORD, asignación explícita de IDs, vista reactiva, exportación local y reordenación. 168 pruebas principales locales correctas. Pablo autoriza integración del PR #12 y publicación tras CI. No se guarda en el expediente ni se modifica el almacén privado. ED-04 (persistencia, plantilla, correspondencias y guardado real) y ED-05 (aceptación) pendientes. [Prototipo](36-ed03-prototipo.md).

**Cierre de auditoría H-EDITOR-01 (24-11-2026; reanudar 25-11):** producción main `58a2b56` operativa, CI/Build/Pages correctos (144 pruebas principales de la última entrega). Rama `feature/ed-01-editor-contract`, base funcional auditada `fe583def05d6581d169cfb66f054552803d18589`, [PR #12 en borrador](https://github.com/PabloGonzalezRuiz/AstroXmind/pull/12), CI y Build correctos; 20 pruebas específicas reproducidas localmente. ED-01/02/02B implementados en rama, no publicados. **Siguiente ED-03, previa autorización de Pablo:** editor independiente de tres paneles; incorporar regresiones para nivel sin segmento de numeración (colisión con padre) y reordenación a posición ocupada (ajuste atómico de hermanos). Conservar IDs, evidencia, historial y separación entrada/ocurrencia/concepto. ED-04 persistencia y plantilla, ED-05 aceptación; CALL-05 y PROG-03 después. Expediente TAI 2025 LIBRE sigue REVISION, borrador 192 nodos/37 fragmentos, MD y YAML coherentes; PDF/CPS intactos. No aceptar ni importar corpus o preguntas. Los estados anteriores son históricos. [Auditoría de cierre](audits/2026-11-24-h-editor-01.md).

**PROG-02 (24-11-2026):** generación local YAML/MD reversible implementada y probada con la fuente oficial de TAI 2025 (33 temas, 192 nodos, 37 fragmentos, páginas PDF 45–47; cotejo independiente de 5.387 caracteres no blancos correcto). 141 pruebas principales locales, check/build correctos. El candidato no está aceptado ni guardado en el expediente; permanece REVISION. [Contrato y resultados](34-generacion-programa.md). Siguiente CALL-05: revisión guiada, fidelidad de F02/F03 y reprocesamiento no destructivo que preserve CPS; después PROG-03, temario y preguntas bloqueados hasta aceptación.

**Reanudación H-TEM-01 · PROG-01 (24-11-2026):** contrato YAML v1, esquema, validador y fixtures sintéticos implementados; 10 pruebas nuevas correctas, check/build local correctos (133 pruebas principales). [Contrato PROG-01](33-programa-oficial.md). Siguiente PROG-02: generación reversible YAML/Markdown con verificación literal y de cobertura; después CALL-05 y PROG-03. Expediente privado intacto; sin importación ni acceso nuevo. La aceptación del diseño y el flujo real sigue pendiente.

**Hito de continuidad H-TEM-01 (23-11-2026; reanudar 24-11):** base funcional `0758632`, CI/Build/Pages correctos y 123 pruebas principales locales; dos integraciones adicionales de reconstrucción fallan en el entorno temporal, pendiente diagnóstico. El expediente 2025 libre sigue en REVISION, con año/modalidad explícitos y CPS separado. Próximo trabajo PROG-01: definir esquema canónico del programa desglosado (YAML), conceptos permanentes, ocurrencias versionadas y asociaciones múltiples; Markdown anidado como vista editable. Después PROG-02, CALL-05 y PROG-03; no reiniciar ni importar datos hasta validar. Las prioridades anteriores son históricas. [Auditoría y criterios de aceptación](audits/2026-11-23-hito-temario.md).

Índice de mantenimiento contrastado con base funcional main `da19c5ba05c5ab2fd12353c3f86e22c49fedd78e` el 19-11-2026. Este directorio está en GitHub, pero no se convierte en páginas de la wiki. Las páginas de usuario viven en src/content/docs.

**Prioridad vigente (23-11-2026):** flujo privado de gestión documental. Primero validar autenticación y autorización para habilitar el menú privado; después alta de convocatoria por nombre, alta de edición por año y asistente secuencial de la edición 2025. Primer hito: recepción de PDF oficial, carpeta propia, extracción y validación de metadatos, nombre canónico sin modificar el original y enlace de acceso protegido. Detenerse tras F00 para aceptación. F01–F05 y temario quedan bloqueados; no publicar documentación privada ni credenciales. La especificación detallada y el prompt de conversión se conservan en los documentos maestros privados de continuidad.

La [propuesta de editor contextual](28-contextual-component-editor.md) detalla una prioridad anterior de la [hoja de ruta](03-roadmap.md). El [editor vigente](27-editor-github-pages-pat.md) ya permite edición y guardado GitHub.

## Leer según la tarea

| Necesidad | Documento |
|---|---|
| Reanudar con una IA u otro colaborador | [Prompt maestro](00-master-prompt.md) y [continuidad](09-continuation.md) |
| Entender toda la aplicación y sus módulos | [Arquitectura completa](02-architecture.md) |
| Instalar desde cero o reproducir un SHA | [Manual de reconstrucción limpia](10-manual-reconstruccion.md) |
| Saber qué se construyó y por qué | [Historia de desarrollo](18-development-history.md) y [222 commits](history/commits-through-2cdba36.md) |
| Operar, comprobar CI/Pages y recuperar | [Operación y verificación](19-operations-and-verification.md) |
| Saber qué está publicado y qué falta | [Estado](04-project-status.md), [hoja de ruta](03-roadmap.md), [tareas](05-task-register.md) |
| Revisar riesgos y decisiones | [Riesgos](06-issues-and-risks.md), [decisiones](08-decisions.md) y ADRs |
| Usar el lenguaje TreeTable | [Contrato de autoría](10-declarative-language-architecture.md) |
| Comprender la fase Navegación | [Plan y alcance](13-navigation-phase.md) |
| Identidad, reserva de IDs y pertenencia | [Contrato documental](14-navigation-contract.md) |
| Componente contextual y jerarquía plana | [Navegación contextual](15-contextual-navigation.md) |
| Referencias y destinos plegados | [Contrato NAV-03](16-document-references.md) |
| Ver qué se autorizó/publicó | [Registro de publicación](17-navigation-publication.md) |
| Publicación de esta ampliación | [Registro de entrega](21-navigation-ordering-publication.md) |
| Orden opcional, fechas YAML y numeración | [Ampliación de navegación](20-navigation-ordering.md) |
| Localizar módulos NAV-01 a NAV-08 | [Guía del runtime](24-navigation-runtime.md) |
| Probar referencias entrantes y salientes | [NAV-04](23-reference-relations.md) |
| Auditoría actual | [Estado del 22-11-2026](audits/2026-11-22-project-audit.md) |
| Editor contextual | [Catálogo, transformaciones e inspector](28-contextual-component-editor.md) |
| Banco de pruebas universal | [FrameEjemplo: contrato, catálogo y validación](29-frame-ejemplo.md) |
| Detalle de pruebas y evidencias | [Validación](07-test-and-audit.md) y [auditoría documental](audits/2026-11-17-architecture-documentation.md) |
| Contexto XMind/MarkXMind pendiente | [XMind y presets](11-xmind-json-defaults.md), [MarkXMind](12-markxmind-compatibility.md) |

## Precedencia y fuentes de verdad

El código/configuración del SHA actual y su resultado comprobado determinan lo disponible. Estado/continuidad/arquitectura describen la versión vigente auditada; contratos definen uso; roadmap expresa trabajo futuro. Informes en audits/ y ADRs conservan decisiones/evidencias de su contexto y no prueban por sí solos que un prototipo siga activo.

Hay dos instalaciones npm, una única implementación TreeTable y un árbol lógico derivado del YAML. No confundir archivo/carpeta con parent, una referencia con parentesco, artefacto de build con despliegue, ni dist con una descarga autónoma offline.

NAV-01 a NAV-08 y el editor completo están publicados; CTX-01/02/03/04/05 implementados; CTX-06 espera autorización. [Hoja de ruta](03-roadmap.md).
