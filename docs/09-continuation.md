# Reanudar AstroXmind

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

**Cierre ED-03 · 25-11-2026:** PR #14 fusionado, producción `5f78313` comprobada; CI #343, Build #376 y Pages #292 correctos. Editor canónico [Editor de temario de convocatoria](https://pablogonzalezruiz.github.io/AstroXmind/editor-temario-convocatoria/). Convocatoria compacta TAI.LBR.2025; bloques directos, plantilla seleccionable, tipos explícitos, clasificación determinista hasta apartado, UUID persistentes, ruta calculada, apartado APT con heredar=1 y subtema Stm con heredar=0. Vista comprobada Stm01, APT01.1, APT02.1. Rutas previas redirigen; no hay interfaz duplicada. Prototipo ficticio: sin persistencia real ni cambios al expediente TAI 2025 LIBRE. Próximo ED-04: adaptar el editor al árbol oficial, preservar IDs existentes y fuentes, resolver correspondencias y guardar transaccionalmente; ED-05 aceptación; editor visual de árbol al final. Incidencias de API de GitHub al mover refs/crear PR; sin reglas de protección configuradas. PR #14 fue creado y fusionado por Pablo; escritura remota directa de AGENTS.md recuperada mediante commit `b3dcb0a`. Si vuelve a fallar, comprobar cabeza actual antes de reintentar; no forzar ni omitir CI.

**ED-03 (25-11-2026):** prototipo independiente de tres paneles preparado para publicar, con datos exclusivamente ficticios; correcciones NUM y ORD, asignación explícita de IDs, vista reactiva, exportación local y reordenación. 168 pruebas principales locales correctas. Pablo autoriza integración del PR #12 y publicación tras CI. No se guarda en el expediente ni se modifica el almacén privado. ED-04 (persistencia, plantilla, correspondencias y guardado real) y ED-05 (aceptación) pendientes. [Prototipo](36-ed03-prototipo.md).

**Cierre de auditoría H-EDITOR-01 (24-11-2026; reanudar 25-11):** producción main `58a2b56` operativa, CI/Build/Pages correctos (144 pruebas principales de la última entrega). Rama `feature/ed-01-editor-contract`, base funcional auditada `fe583def05d6581d169cfb66f054552803d18589`, [PR #12 en borrador](https://github.com/PabloGonzalezRuiz/AstroXmind/pull/12), CI y Build correctos; 20 pruebas específicas reproducidas localmente. ED-01/02/02B implementados en rama, no publicados. **Siguiente ED-03, previa autorización de Pablo:** editor independiente de tres paneles; incorporar regresiones para nivel sin segmento de numeración (colisión con padre) y reordenación a posición ocupada (ajuste atómico de hermanos). Conservar IDs, evidencia, historial y separación entrada/ocurrencia/concepto. ED-04 persistencia y plantilla, ED-05 aceptación; CALL-05 y PROG-03 después. Expediente TAI 2025 LIBRE sigue REVISION, borrador 192 nodos/37 fragmentos, MD y YAML coherentes; PDF/CPS intactos. No aceptar ni importar corpus o preguntas. Los estados anteriores son históricos. [Auditoría de cierre](audits/2026-11-24-h-editor-01.md).

**H-EDITOR-01 · ED-02B (24-11-2026):** modelo plano de entradas YAML independientes con ID editorial, padre, orden, título, alias; representación y códigos derivados separados. Reutilización explícita entre convocatorias, conservación de históricos y prevención de ciclos. 20 pruebas locales acumuladas correctas; ED-03 pendiente de autorización. Persistencia de entradas, catálogo, correspondencia con ocurrencias oficiales y evidencia en ED-04. [Contrato](35-editor-programa.md).


**H-EDITOR-01 · ED-02 (24-11-2026):** motor de DSL/MD, índice YAML, códigos/UUID, validación y estados implementado en rama de revisión. 12 pruebas específicas locales correctas; esquema y cotejo YAML correctos; CI integral pendiente. Modalidad sin numeración (LIB/PI). Próximo ED-03, previa autorización: editor independiente con resultado en vivo, copiar, Cerrar y Guardar y cerrar; persistencia y recuperación en ED-04. No se han alterado datos privados ni publicado la interfaz. [Contrato](35-editor-programa.md).


**H-EDITOR-01 · ED-01 (24-11-2026):** contrato de tres paneles, DSL, plantilla versionada, identidad UUID y códigos de proyección definido en [docs/35-editor-programa.md](./35-editor-programa.md). Base main `58a2b56`, esquema validado, seis códigos de ejemplo cotejados y cinco entradas inválidas rechazadas; diez escenarios documentados para pruebas del motor. No hay nuevo editor implementado. ED-02 pendiente de autorización. Preservar expediente privado y cobertura oficial; no importar preguntas.


**CALL-05 · Editor del programa (24-11-2026):** Paso 3 permite abrir un editor Markdown con árbol sincronizado, seleccionar títulos desde la vista, sangrar con Tab/Mayús+Tab y guardar los derivados YAML y MD en un único commit privado. El mismo reconciliador se usa en Node y navegador; Web Crypto verifica huella del snapshot y de fragmentos. Releer el YAML de GitHub antes de guardar, rechazar una base obsoleta y usar avance no forzado. No cambiar convocatoria.yaml, PDF, CPS, ni informe inicial; expediente REVISION y versión draft. Se conservan IDs, literal, cobertura y numeración recalculada. No permite eliminar ni crear nodos desde MD, ni editar una versión aceptada. La aceptación y revisión documental completa siguen pendientes. [Prueba del editor](https://pablogonzalezruiz.github.io/AstroXmind/oposiciones/?o=tai&anio=2025#programa-desglosado).

**PROG-02 · Vista wiki (24-11-2026):** el candidato real se incorporó al almacén privado bajo `Programa/<versionId>/`, con YAML, MD e informe y referencia en `convocatoria.yaml`. El paso 3 muestra el árbol de solo lectura, plegado/desplegado y enlaces a los archivos privados, tras autorización. Estado BORRADOR y expediente REVISION; sin aceptación ni desbloqueo del temario. 142 pruebas principales locales. Pendiente CALL-05 (revisión integral, edición y validación). [Abrir el programa en la wiki](https://pablogonzalezruiz.github.io/AstroXmind/oposiciones/?o=tai&anio=2025#programa-desglosado).

**PROG-02 (24-11-2026):** generación local YAML/MD reversible implementada y probada con la fuente oficial de TAI 2025 (33 temas, 192 nodos, 37 fragmentos, páginas PDF 45–47; cotejo independiente de 5.387 caracteres no blancos correcto). 141 pruebas principales locales, check/build correctos. El candidato no está aceptado ni guardado en el expediente; permanece REVISION. [Contrato y resultados](34-generacion-programa.md). Siguiente CALL-05: revisión guiada, fidelidad de F02/F03 y reprocesamiento no destructivo que preserve CPS; después PROG-03, temario y preguntas bloqueados hasta aceptación.

**Reanudación H-TEM-01 · PROG-01 (24-11-2026):** contrato YAML v1, esquema, validador y fixtures sintéticos implementados; 10 pruebas nuevas correctas, check/build local correctos (133 pruebas principales). [Contrato PROG-01](33-programa-oficial.md). Siguiente PROG-02: generación reversible YAML/Markdown con verificación literal y de cobertura; después CALL-05 y PROG-03. Expediente privado intacto; sin importación ni acceso nuevo. La aceptación del diseño y el flujo real sigue pendiente.

**Hito de continuidad H-TEM-01 (23-11-2026; reanudar 24-11):** base funcional `0758632`, CI/Build/Pages correctos y 123 pruebas principales locales; dos integraciones adicionales de reconstrucción fallan en el entorno temporal, pendiente diagnóstico. El expediente 2025 libre sigue en REVISION, con año/modalidad explícitos y CPS separado. Próximo trabajo PROG-01: definir esquema canónico del programa desglosado (YAML), conceptos permanentes, ocurrencias versionadas y asociaciones múltiples; Markdown anidado como vista editable. Después PROG-02, CALL-05 y PROG-03; no reiniciar ni importar datos hasta validar. Las prioridades anteriores son históricas. [Auditoría y criterios de aceptación](audits/2026-11-23-hito-temario.md).

**Asistente acumulativo:** cada fase completada conserva un resumen visible encima de la fase activa, con valores persistidos y enlaces al almacén privado. Paso 1 muestra nombre, nombre corto y ruta YAML; Paso 2 solicita año y PDF oficial, conserva el original y muestra enlaces a YAML/PDF. F00–F05 ejecutadas; revisión pendiente. Mantener el patrón para futuras fases.

PRIVATE-01/CALL-01/CALL-02 confirmados. CALL-03 genera el expediente TAI 2025 y CALL-04 incorpora CPS. Consultar [auditoría vigente](audits/2026-11-23-procesado.md). No repetir alta ni reinicio.

**Publicación (acuerdo del 23-11-2026):** Pablo autoriza publicar automáticamente los cambios de AstroXmind dentro del alcance de cada tarea cuando superen las pruebas. Verificar CI, despliegue y URL; comunicar resultado. No solicitar otra autorización rutinaria de publicación. Cambios de permisos, acciones destructivas y ampliaciones de alcance requieren aprobación específica. La aceptación funcional de cada hito sigue siendo independiente.

**Idioma:** español para comunicaciones, documentación, etiquetas de interfaz, comentarios y mensajes de commits; conservar identificadores técnicos cuando sea necesario.

**Cierre de sesión:** consultar los documentos maestros privados actualizados antes de desarrollar. La aceptación del expediente sigue siendo la puerta de entrada al temario. Comprobar HEAD y CI al reanudar.

**Prioridad vigente (23-11-2026):** Procesado de Temarios. CALL-01 y CALL-02 confirmados funcionalmente; CALL-03 genera el expediente oficial TAI 2025, con F00/F01/F02/F03/F05 ejecutadas y estado REVISION (F04 opcional). CALL-04 incorpora criterios oficiales CPS como documento separado, persistencia confirmada. Siguiente: confirmar visualización del Paso 3 y CALL-05, revisar evidencia, bases, programa y reglas; no inventar cortes reales. No desbloquear el temario hasta aceptación del expediente documental. No publicar datos privados ni credenciales.

Los siguientes puntos de continuidad son históricos y no ordenan la próxima sesión.

Punto de continuidad histórico 22-11-2026: [auditoría](audits/2026-11-22-project-audit.md) de main b78362d, publicada y con 101 pruebas correctas. La primera tarea es FRAME-02, no volver a implementar FrameEjemplo v1: preparar el banco vertical visible en lectura, declaración compacta en edición, selector/reset y pruebas de aislamiento; verificar Acciones en iPhone. Después CTX-06/07. No hay autorización para integrar el rediseño todavía. Las notas siguientes conservan contexto de la entrega anterior.

Punto de continuidad 19-11-2026: Pablo autorizó FrameEjemplo hasta su publicación y actualización documental. [Contrato](29-frame-ejemplo.md). Verificar primero HEAD, CI y Pages; probar selector, descarte y reset del ejemplo activo en TreeTable y Clases Astro. Después retomar CTX-06 cuando se autorice, sin perder las tareas posteriores del roadmap.

Primera prioridad: [editor contextual CTX-01 a CTX-07](28-contextual-component-editor.md). CTX-01/02/03/04/05 implementados; CTX-06 espera autorización. Conservar [guardado actual](27-editor-github-pages-pat.md); candidato Node/GitHub App son alternativas históricas.

La base funcional auditada es main `da19c5ba05c5ab2fd12353c3f86e22c49fedd78e`: NAV-01 a NAV-08, editor con GitHub, TreeTable inline y atajos publicados. CI y Pages correctos; [auditoría](audits/2026-11-19-editor-contextual.md).

1. Comprueba el HEAD de main y de la rama activa, las ejecuciones de GitHub Actions y los cambios sin guardar.
2. Lee las [reglas de continuidad](../AGENTS.md), el [prompt maestro](00-master-prompt.md), el [estado](04-project-status.md) y la [hoja de ruta](03-roadmap.md).
3. Usa la [guía del runtime](24-navigation-runtime.md) para localizar la capa afectada. Si el problema es de autoría o IDs, empieza por el [contrato](14-navigation-contract.md) y las [referencias](16-document-references.md).
4. Reproduce con `npm ci`, `npm run check` y `npm run build`. Para abrir la compilación, usa `npm run preview` o el paquete Windows. La guía de [operación](19-operations-and-verification.md) explica el despliegue.

El usuario validó **Mapa de conexiones** en Navegación y Artículo 2, y autorizó integrar NAV-08. Vincula la evidencia a la revisión que se prueba.

Las pruebas manuales de nuevas funciones se realizan en la wiki con enlaces directos a cada ejemplo. El ZIP de Windows sigue disponible como paquete local para quien lo necesite.

**Prioridad anterior (aplazada).** Catálogo declarativo, transformación e inspector contextual, luego reordenación y arrastre. No implementar cambios funcionales al reanudar sin autorización concreta.

**Separación de expedientes (23-11-2026):** la oposición tiene un listado de tarjetas por año/modalidad y un alta independiente. Tras crear el YAML F00 se abre el expediente; sus pasos comienzan con el PDF oficial (Paso 1), luego criterios CPS (Paso 2). No se ofrecen duplicados, tampoco F00 sin PDF. Consultar `docs/32-oposiciones.md`. Compilación local y 65 pruebas correctas; pendiente comprobación en Pages.
