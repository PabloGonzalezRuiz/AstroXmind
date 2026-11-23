# Registro de tareas

**Hito de continuidad H-TEM-01 (23-11-2026; reanudar 24-11):** base funcional `0758632`, CI/Build/Pages correctos y 123 pruebas principales locales; dos integraciones adicionales de reconstrucción fallan en el entorno temporal, pendiente diagnóstico. El expediente 2025 libre sigue en REVISION, con año/modalidad explícitos y CPS separado. Próximo trabajo PROG-01: definir esquema canónico del programa desglosado (YAML), conceptos permanentes, ocurrencias versionadas y asociaciones múltiples; Markdown anidado como vista editable. Después PROG-02, CALL-05 y PROG-03; no reiniciar ni importar datos hasta validar. Las prioridades anteriores son históricas. [Auditoría y criterios de aceptación](audits/2026-11-23-hito-temario.md).

| ID | Tarea | Estado |
|---|---|---|
| PROG-01 | Esquema de conceptos, nodos, correspondencias y preguntas | Próximo |
| PROG-02 | Derivados YAML y MD anidado editable | Pendiente |
| PROG-03 | Correspondencias entre versiones validadas | Pendiente |
| QA-REBUILD | Diagnóstico de dos integraciones temporales | Pendiente |

Auditado el 23-11-2026 sobre main `ce797d60`. [Evidencias](audits/2026-11-23-procesado.md). [Estado](04-project-status.md) y [hoja de ruta](03-roadmap.md).

| ID/área | Tarea | Estado real |
|---|---|---|
| PRIVATE-01 | Menú privado autenticado y autorizado | Publicado y confirmado por Pablo; almacén privado creado |
| CALL-01 | Alta y renombrado de oposición con ID permanente y URL amigable | Alta y listado confirmados; renombrado pendiente de prueba manual |
| CALL-02 | Alta anual y subida del PDF oficial; resumen acumulativo | Confirmada recepción y resubida TAI 2025 |
| DOC-F00 | Asistente de recepción, metadatos, nombre y enlace del PDF | Ejecutada; revisión pendiente |
| DOC-F01–F05 | Conversión y validación documental | F01/F02/F03/F05 ejecutadas; F04 opcional; revisión pendiente |
| CALL-03 | Procesamiento TAI 2025 y reinicio controlado | Ejecutado; revisión pendiente |
| CALL-03-UX | Scroll y resaltado del botón | Implementado; prueba visual pendiente |
| CALL-04 | Criterios CPS separados | Cargado y verificado en GitHub; prueba visual pendiente |
| CALL-05 | Revisión integral y rectificaciones | Pendiente |
| TEM-01/02, PISTAS-01, EXAM-01, LINK-01, TEST-01, COVER-01 | Temario, pistas, exámenes, enlaces, simulacros y cobertura | Pendientes; orden en hoja de ruta |
| FRAME-01 | Banco reutilizable, catálogo y reset | Publicado; verificación automatizada correcta, aceptación manual pendiente |
| FRAME-02 | Editor vertical en lectura y etiqueta compacta en edición | Aplazado; verificar estado real de entrega |
| MOBILE-01 | Acciones en iPhone | Corrección publicada en b78362d; prueba manual pendiente |
| AST-034 | Fase Navegación | Completada; NAV-01 a NAV-08 publicados y confirmados |
| NAV-01 | Identidad/padre/orden e índice validado | Publicado |
| NAV-02 | Migas, contexto, árbol y serie plana | Publicado |
| NAV-02 (corrección) | Numeración consecutiva por grupos de order, sin prefijos 10/30.30 | Publicado en f3e2259; ver registro 22 |
| NAV-02 (ampliación) | Order opcional, fechas YAML con milisegundos y números heredados | Publicado; ver registros 21/22 |
| NAV-03 | Referencias, destinos, componente y demo | Publicado |
| NAV-04 | Enlaces salientes/backlinks automáticos con contexto | Ida y vuelta verificada por el usuario en Windows. Cuatro citas y destinos distintos verificados. Publicado y confirmado por el usuario |
| NAV-05 | Retorno exacto y recorrido reciente de sesión | Retorno a la cita de TreeTable confirmado en Windows y en la wiki pública |
| NAV-06 | Impresión/descarga de ramas, HTML autónomo primero | Publicado y confirmado por el usuario en la wiki pública |
| NAV-07 | Consulta lateral/vista previa | Publicado y confirmado por el usuario |
| NAV-08 | Grafo local | Publicado y confirmado en la wiki |
| AST-017/022/025/026/028 | Clases, corchetes, numeración, plegado/folded | Publicados |
| AST-030/031/032/033 | Demos, corte de numeración, fullscreen/centrado | Publicados |
| AST-029/012 | Robustez/regresiones de lenguaje | Robustez y guía de plegado publicadas. Guía verificada en HTML |
| AST-003.5 | Seguridad/dependencias/licencias | Auditoría de ambos lockfiles preparada en rama; remediación en seguimiento, PR #1 separado |
| AST-018 | Summary/Boundary | Aplazados |
| AST-023 | Presets/exportación XMind | Sin implementar |
| AST-024 | Publicación de temario | Aplazada; PR #2 separado |
| Editor/persistencia | [Edición y guardado desde la wiki](27-editor-github-pages-pat.md) | Publicado y comprobado; edición de demos externas pendiente |
| AST-035 | [Investigación de patrones de edición Astro](26-astro-editing-patterns.md) | Informe disponible |
| CTX-01 a CTX-07 | [Editor contextual y catálogo](28-contextual-component-editor.md) | Prioridad anterior, aplazada; CTX-01/02/03/04/05 implementados; CTX-06 espera autorización |
| Explorador | Arrastre persistente y recálculo de numeración | Prioridad 2, tras el editor |
| TreeTable | Evaluar movimientos persistentes de nodos | Prioridad 3, condicionada al explorador |
| HIST-01 | Historial de versiones por documento (consulta, diferencias y posible restauración) | Aplazado por Pablo. Prioridad 4, después de editor/explorador/TreeTable; borrador conservado en `96c2930`, retirado de la versión activa; requiere autorización |
| AST-027 | Distribución de biblioteca de componentes | Último hito; catálogo interno anticipado en CTX |
| DOC-002 | Arquitectura completa, historia, instalación y continuidad | Documentación integral publicada; conciliación de estado del 18-11 preparada en rama |

No reasignar IDs de tareas antiguos. Catorce demos y referencias a nodos ya existen; los backlinks están publicados y la exportación HTML por rama está publicada y la biblioteca sigue pendiente. PR #4 de documentación antigua sigue abierto y no se fusiona por actualizar estos documentos.
