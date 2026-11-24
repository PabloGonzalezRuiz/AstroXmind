# Reanudar AstroXmind

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
