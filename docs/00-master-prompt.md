# Prompt maestro de continuidad

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
