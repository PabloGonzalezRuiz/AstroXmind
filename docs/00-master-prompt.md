# Prompt maestro de continuidad

## REUSE-01 — Reutilización entre convocatorias (criterio transversal obligatorio, 26/11/2026)

TAI 2025 LIBRE es el primer caso real, no el ámbito de identidad del conocimiento. Toda fase hasta COVER-01 debe justificar qué queda reutilizable y qué pertenece a una convocatoria concreta. No adelantar PROG-03 ni dar de alta una segunda convocatoria real; sí probar contratos con fixtures sintéticos.

| Hito | Criterio de reutilización obligatorio |
|---|---|
| ED-04C / ED-05 | Contexto explícito de convocatoria, plantilla versionada independiente, identidad editorial y ocurrencias oficiales separadas; renombrado/traslado no cambian identidad. Dos expedientes ficticios aislados; sin copiar IDs de ocurrencia. |
| CALL-05 | Original, evidencia, reglas y vigencia por versión/convocatoria; no sustituir una fuente histórica por la última. |
| TEM-01 / TEM-02 | Corpus único por oposición, bloques/conceptos estables con alias y procedencia; una nueva convocatoria vincula referencias al contenido existente, no lo duplica. |
| PISTAS-01 / EXAM-01 | Pistas y preguntas conservan ID y fuente/examen originales; no confundir una equivalencia textual con identidad de pregunta. Las versiones de respuestas y baremos permanecen específicas. |
| LINK-01 | Relaciones muchos-a-muchos explícitas entre conceptos, preguntas y ocurrencias/versiones; evidencia y decisiones manuales protegidas. Una asociación a un concepto puede reaprovecharse como candidata, no se confirma automáticamente la vigencia en otra convocatoria. |
| TEST-01 / COVER-01 | Baremos, selección y métricas reciben contexto de versión; registrar intentos/resultados históricos intactos y contar preguntas únicas por ID; no sumar duplicados derivados de múltiples vínculos. |

Puerta de cada entrega: documentar componentes/datos reutilizables, datos específicos, IDs y versiones que se preservan y prueba ficticia de segundo contexto o razón de no aplicabilidad. Los nuevos módulos reciben contexto/parametrización en lugar de introducir constantes TAI 2025 innecesarias. Si una limitación actual requiere refactorización DIST-01, registrarla para el final sin acometerla ahora. En PROG-03 se implementará la comparación automática y se comprobará la reutilización con otra convocatoria real.

**Decisión vigente · 26-11-2026 (aprobada por Pablo): estrategia de primera convocatoria completa.** ETAPA 1: completar TAI 2025 LIBRE de extremo a extremo: cerrar ED-04B (PR #16 validado, fusión aún pendiente de autorización), ED-04C, ED-05, CALL-05, TEM-01, TEM-02, PISTAS-01, EXAM-01, LINK-01, TEST-01 y COVER-01. ETAPA 2: tras aceptación integral de TAI 2025, incorporar una segunda convocatoria real (año/modalidad a decidir) y ejecutar PROG-03: reutilizar corpus y conceptos, reconciliar ocurrencias, alias y nombres históricos, conservar evidencia y preguntas, verificar traslados, renumeraciones, altas/bajas y divisiones/fusiones sin duplicar estadísticas. Mantener desde ahora los contratos de identidad, versiones, relaciones múltiples y diseño portable; las pruebas sintéticas de coexistencia durante ED-05 siguen siendo válidas, pero no son alta de una segunda convocatoria real ni adelanto de PROG-03. ETAPA 3: terminado el desarrollo funcional y backlog aprobado, resolver DIST-01 y ejecutar DIST-02, distribución limpia, como último hito. No refactorizar distribución ahora. Esta decisión sustituye cualquier orden histórico que sitúe PROG-03 antes del corpus o DIST antes del cierre funcional.

**Prioridad vigente · 26-11-2026:** ED-03 cerrado y validado visualmente por Pablo; producción `5f78313`, PR #14 fusionado, CI #343/Build #376/Pages #292 correctos. Próximo hito ED-04, desglosado:

| Paso | Entrega | Estado |
|---|---|---|
| ED-04A | Contrato de identidad estable y relaciones; fixtures y validación de invariantes | Diseño documentado; pruebas pendientes |
| ED-04B | Persistencia de plantilla, entradas, correspondencias e índice derivado; reapertura y guardado atómico | Pendiente |
| ED-04C | Integrar editor v2 en el paso de programa del asistente de convocatoria TAI 2025 LIBRE | Pendiente |
| ED-05 | Aceptación del flujo con TAI 2025 y convocatoria ficticia, sin alterar originales ni evidencia | Pendiente |
| CALL-05 / PROG-03 | Cerrar revisión documental; correspondencias históricas | Pendiente |
| LINK-01 y posteriores | Asociaciones de preguntas, estadísticas y tests | Bloqueados hasta aceptación |

[Modelo ED-04A](35-editor-programa.md#ed-04a--identidad-y-relaciones-25-11-2026). Conservar 192 nodos/37 fragmentos del borrador real en REVISION. No reiterar ED-03 ni importar corpus todavía. Los estados anteriores son históricos.

**ED-03 (25-11-2026):** prototipo independiente de tres paneles preparado para publicar, con datos exclusivamente ficticios; correcciones NUM y ORD, asignación explícita de IDs, vista reactiva, exportación local y reordenación. 168 pruebas principales locales correctas. Pablo autoriza integración del PR #12 y publicación tras CI. No se guarda en el expediente ni se modifica el almacén privado. ED-04 (persistencia, plantilla, correspondencias y guardado real) y ED-05 (aceptación) pendientes. [Prototipo](36-ed03-prototipo.md).

**Cierre de auditoría H-EDITOR-01 (24-11-2026; reanudar 25-11):** producción main `58a2b56` operativa, CI/Build/Pages correctos (144 pruebas principales de la última entrega). Rama `feature/ed-01-editor-contract`, base funcional auditada `fe583def05d6581d169cfb66f054552803d18589`, [PR #12 en borrador](https://github.com/PabloGonzalezRuiz/AstroXmind/pull/12), CI y Build correctos; 20 pruebas específicas reproducidas localmente. ED-01/02/02B implementados en rama, no publicados. **Siguiente ED-03, previa autorización de Pablo:** editor independiente de tres paneles; incorporar regresiones para nivel sin segmento de numeración (colisión con padre) y reordenación a posición ocupada (ajuste atómico de hermanos). Conservar IDs, evidencia, historial y separación entrada/ocurrencia/concepto. ED-04 persistencia y plantilla, ED-05 aceptación; CALL-05 y PROG-03 después. Expediente TAI 2025 LIBRE sigue REVISION, borrador 192 nodos/37 fragmentos, MD y YAML coherentes; PDF/CPS intactos. No aceptar ni importar corpus o preguntas. Los estados anteriores son históricos. [Auditoría de cierre](audits/2026-11-24-h-editor-01.md).

**H-EDITOR-01 · ED-02B (24-11-2026):** modelo plano de entradas YAML independientes con ID editorial, padre, orden, título, alias; representación y códigos derivados separados. Reutilización explícita entre convocatorias, conservación de históricos y prevención de ciclos. 20 pruebas locales acumuladas correctas; ED-03 pendiente de autorización. Persistencia de entradas, catálogo, correspondencia con ocurrencias oficiales y evidencia en ED-04. [Contrato](35-editor-programa.md).


**H-EDITOR-01 · ED-02 (24-11-2026):** motor de DSL/MD, índice YAML, códigos/UUID, validación y estados implementado en rama de revisión. 12 pruebas específicas locales correctas; esquema y cotejo YAML correctos; CI integral pendiente. Modalidad sin numeración (LIB/PI). Próximo ED-03, previa autorización: editor independiente con resultado en vivo, copiar, Cerrar y Guardar y cerrar; persistencia y recuperación en ED-04. No se han alterado datos privados ni publicado la interfaz. [Contrato](35-editor-programa.md).


**H-EDITOR-01 · ED-01 (24-11-2026):** contrato de tres paneles, DSL, plantilla versionada, identidad UUID y códigos de proyección definido en [docs/35-editor-programa.md](./35-editor-programa.md). Base main `58a2b56`, esquema validado, seis códigos de ejemplo cotejados y cinco entradas inválidas rechazadas; diez escenarios documentados para pruebas del motor. No hay nuevo editor implementado. ED-02 pendiente de autorización. Preservar expediente privado y cobertura oficial; no importar preguntas.


**PROG-02 (24-11-2026):** generación local YAML/MD reversible implementada y probada con la fuente oficial de TAI 2025 (33 temas, 192 nodos, 37 fragmentos, páginas PDF 45–47; cotejo independiente de 5.387 caracteres no blancos correcto). 141 pruebas principales locales, check/build correctos. El candidato no está aceptado ni guardado en el expediente; permanece REVISION. [Contrato y resultados](34-generacion-programa.md). Siguiente CALL-05: revisión guiada, fidelidad de F02/F03 y reprocesamiento no destructivo que preserve CPS; después PROG-03, temario y preguntas bloqueados hasta aceptación.

**Reanudación H-TEM-01 · PROG-01 (24-11-2026):** contrato YAML v1, esquema, validador y fixtures sintéticos implementados; 10 pruebas nuevas correctas, check/build local correctos (133 pruebas principales). [Contrato PROG-01](33-programa-oficial.md). Siguiente PROG-02: generación reversible YAML/Markdown con verificación literal y de cobertura; después CALL-05 y PROG-03. Expediente privado intacto; sin importación ni acceso nuevo. La aceptación del diseño y el flujo real sigue pendiente.

**Hito de continuidad H-TEM-01 (23-11-2026; reanudar 24-11):** base funcional `0758632`, CI/Build/Pages correctos y 123 pruebas principales locales; dos integraciones adicionales de reconstrucción fallan en el entorno temporal, pendiente diagnóstico. El expediente 2025 libre sigue en REVISION, con año/modalidad explícitos y CPS separado. Próximo trabajo PROG-01: definir esquema canónico del programa desglosado (YAML), conceptos permanentes, ocurrencias versionadas y asociaciones múltiples; Markdown anidado como vista editable. Después PROG-02, CALL-05 y PROG-03; no reiniciar ni importar datos hasta validar. Las prioridades anteriores son históricas. [Auditoría y criterios de aceptación](audits/2026-11-23-hito-temario.md).

```text
Eres colaborador técnico de Pablo en PabloGonzalezRuiz/AstroXmind. El proyecto es una wiki de estudio Astro/Starlight/MDX. Respeta el árbol editorial, la identidad persistente y el significado educativo de las tablas.

**Idioma:** español para comunicaciones, documentación, etiquetas de interfaz, comentarios y mensajes de commits; conservar identificadores técnicos cuando sea necesario.

**Cierre de sesión:** consultar los documentos maestros privados actualizados antes de desarrollar. La aceptación del expediente documental precede al temario. Comprobar HEAD y CI al reanudar.

Antes de cambiar código:
1. Consulta main, la rama de trabajo, la hoja de ruta y el estado real de GitHub Actions. La referencia de auditoría no sustituye HEAD.
2. Lee AGENTS.md, docs/README.md, docs/04-project-status.md, docs/03-roadmap.md y docs/09-continuation.md.
3. Para navegación, lee docs/24-navigation-runtime.md, luego el contrato 14/16/20 o el módulo enlazado. Para TreeTable, lee docs/10-declarative-language-architecture.md y el componente del laboratorio.
4. Conserva cambios del usuario y trabaja en rama. Prepara una revisión y un enlace verificable. Integra y despliega tras pruebas correctas dentro del alcance autorizado; confirmar cambios destructivos o de permisos.

**Prioridad vigente (23-11-2026):** Procesado de Temarios. CALL-01 y CALL-02 confirmados funcionalmente; CALL-03 genera el expediente oficial TAI 2025, con F00/F01/F02/F03/F05 ejecutadas y estado REVISION (F04 opcional). CALL-04 incorpora criterios oficiales CPS como documento separado, persistencia confirmada. Siguiente: confirmar visualización del Paso 3 y CALL-05, revisar evidencia, bases, programa y reglas; no inventar cortes reales. No desbloquear el temario hasta aceptación del expediente documental. No publicar datos privados ni credenciales.

Prioridades anteriores aplazadas: FRAME-02, CTX-06/07, reordenación y arrastre. Conservar las implementaciones existentes y no repetirlas.

Última base auditada: b78362d (22-11-2026), FrameEjemplo v1 y corrección móvil publicados; 101 pruebas locales correctas, CI/Pages correctos. Consultar auditoría 2026-11-22-project-audit.md y comprobar siempre nuevo HEAD. No confundir despliegue con aceptación manual.

Modelo de trabajo:
- Una sola implementación de TreeTable en examples/astro-component-lab/src/components. La wiki importa esa implementación. Los ejemplos Resultado/Código comparten fuente.
- src/content/docs contiene contenido publicado. docs/ contiene documentación técnica. src/examples contiene demostraciones.
- navigation.id y navigation-ids.json conservan identidad. navigation.parent crea jerarquía. order es opcional y su orden relativo se transforma en numeración consecutiva por nivel. created y modified se declaran en YAML. La ruta física no establece parentesco.
- Escribe referencias con doc:doc-000007#ref-desarrollo o DocLink. Los IDs ref-* son locales al documento. Mantén la resolución al renderizar MarkdownContent para tolerar caché.
- El build genera navigation.json, references.json, los paneles de enlaces, el HTML por rama y, en la rama NAV-08, el mapa de documentos. El cliente gestiona destino, retorno de sesión y vista previa.
- NAV-01 a NAV-08 están publicados. El editor actual guarda mediante GitHub Contents API con token de grano fino y SHA; TreeTable inline, sincronización y teclado publicados en base `da19c5b`. Consulta el roadmap para HEAD vigente.
- Producción es estática en GitHub Pages, con base /AstroXmind/. No ejecutar MDX arbitrario ni ampliar permisos del token. La edición contextual reutilizará el catálogo y modelo semántico.

Verifica el cambio:
- npm ci, npm run check, npm run build.
- Usa las integraciones test:references:rebuild y test:navigation:ordering si cambias caché, IDs, orden o movimiento de rutas.
- El usuario valida nuevas funciones en la wiki. Proporciona enlaces directos a los ejemplos publicados. El comando npm run package:wiki sigue disponible para distribuir la wiki en Windows.
- Tras una publicación autorizada, sigue Actions del mismo SHA y comprueba las URLs públicas. Distingue pruebas DOM, HTTP y comprobación visual del usuario.
- Actualiza estado, registro, guía y pruebas relevantes. Conserva resultados de auditorías históricas con su fecha y SHA.
```
