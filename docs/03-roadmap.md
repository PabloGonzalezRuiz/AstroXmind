# Hoja de ruta

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

Requisito transversal del asistente: conservar resúmenes de fases completadas en orden, con datos persistidos y ubicación real de archivos, seguidos del paso activo.

**Prioridad vigente (23-11-2026):** Procesado de Temarios. CALL-01 y CALL-02 confirmados funcionalmente; CALL-03 genera el expediente oficial TAI 2025, con F00/F01/F02/F03/F05 ejecutadas y estado REVISION (F04 opcional). CALL-04 incorpora criterios oficiales CPS como documento separado, persistencia confirmada. Siguiente: confirmar visualización del Paso 3 y CALL-05, revisar evidencia, bases, programa y reglas; no inventar cortes reales. No desbloquear el temario hasta aceptación del expediente documental. No publicar datos privados ni credenciales.

## Hoja de ruta activa — ProcesamientoTemario

| Orden | ID | Tarea | Estado |
|---|---|---|---|
| 1 | PRIVATE-01 / CALL-01 | Menú autorizado, oposición con ID inmutable y alias | Confirmado; prueba de renombrado pendiente |
| 2 | CALL-02 / CALL-03 | Año, PDF oficial, metadatos y derivados, reinicio y resubida | Confirmado en TAI 2025; revisión de fidelidad pendiente |
| 3 | CALL-03-UX | Scroll y contorno del botón de procesar | Implementado; validar visualmente |
| 4 | CALL-04 | Criterios oficiales CPS: PDF, metadatos, transcripción y perfil propio | Cargado y verificado en GitHub; prueba visual pendiente |
| 4a | PROG-01 | Contrato programático de programa desglosado y versionado | Implementado, 10 pruebas correctas |
| 4b | PROG-02 | Generar YAML y vista MD editable, comprobar literal y cobertura | Implementado y probado; candidato pendiente de aceptación |
| 5 | CALL-05 | Cerrar revisión de expediente, rectificaciones, reinicio independiente y cortes oficiales cuando existan | Siguiente; puerta de aceptación |
| 5a | PROG-03 | Correspondencias verificadas, proyección histórica y no duplicación | Pendiente |
| 6 | TEM-01 | Alta de temario único por oposición; recibir DOCX y conservar original | Bloqueado por CALL-05 |
| 7 | TEM-02 | Conversión DOCX a Markdown limpio, bloques con IDs/YAML y estado de procesamiento | Pendiente |
| 8 | PISTAS-01 | Extraer asociaciones históricas de DOCX, preguntas y Excel a pistas separadas, sin validarlas automáticamente | Pendiente |
| 9 | EXAM-01 | Incorporar exámenes y plantillas oficiales, variantes y preguntas anuladas/reservas | Pendiente |
| 10 | LINK-01 | Relacionar preguntas, bloques del temario y programa oficial por referencias bidireccionales; varios años o ninguno; prevalencia de vínculos manuales | Pendiente |
| 11 | TEST-01 | Tests validados, baremos/versiones y simulacros cronometrados (duración del perfil anual; TAI 2025: 120 min) | Pendiente |
| 12 | COVER-01 | Cobertura, estadísticas y bloques sin procesar; priorizar preguntas | Pendiente |

El inspector de propiedades queda al final del backlog de edición, antes del empaquetado final de biblioteca. No repetir NAV ni FrameEjemplo.

Base funcional verificada el 22-11-2026: main `b78362d7809b0cbeeea0b994e520e51eec38987c`; CI y Pages correctos, 101 pruebas locales. [Estado](04-project-status.md) · [Auditoría](audits/2026-11-22-project-audit.md).

## Prioridades anteriores, aplazadas hasta nueva indicación

0. **FRAME-02 — Rediseñar FrameEjemplo.** Entrega autorizada el 22-11-2026: [página exclusiva](https://pablogonzalezruiz.github.io/AstroXmind/frame-ejemplo/) con un único marco y catálogo completo, editor arriba, resultado debajo, reset y etiqueta compacta en edición documental. Check/build correctos (103 pruebas). Pendiente comprobar Pages y aceptación visual, incluida prueba de Acciones en iPhone. [Contrato y criterios](29-frame-ejemplo.md).

1. **Editor contextual de componentes (CTX-01 a CTX-07).** Catálogo declarativo, transformación de selecciones e imports automáticos, menú contextual, inspector de apertura, inspector de nodos con herencia trazable, validación y extensibilidad. [Plan completo](28-contextual-component-editor.md). CTX-01/02/03/04/05 implementados (catálogo, motor, menú e inspectores); CTX-06 pendiente de autorización. Edición de demos importadas como archivos independientes queda como ampliación posterior.
2. **Reordenar documentos desde el explorador.** Arrastrar entre hermanos o ramas, guardar el nuevo orden, recalcular la numeración y conservar IDs, URLs y referencias. Reutilizar el guardado del editor.
3. **Evaluar el arrastre en TreeTable.** Decidir tras validar el explorador. Si procede, probar movimientos de nodos que actualicen la fuente conservando referencias y opciones de plegado.
4. **Historial documental (HIST-01).** Aplazado hasta finalizar CTX y las dos tareas de ordenación/arrastre anteriores. Consultar versiones por documento, fecha, autor, commit y diferencias; valorar restauración como nuevo guardado, sin reescribir el historial Git. La prueba previa queda conservada en `96c2930` y retirada de la versión activa. Requiere autorización al llegar a su turno.
5. **Seguridad y mantenimiento.** Retomar la actualización de dependencias desde la auditoría ya preparada.
6. **Summary y Boundary** (aplazados), **presets y exportación XMind**, **contenido de estudio** (aplazado) y **biblioteca de componentes** como último hito.

## Fase «Navegación» — AST-034 (completada)

Objetivo: árbol documental fuerte, referencias bidireccionales rápidas y base compartida para wiki, consulta e impresión/descarga de ramas. Inspirarse en patrones de notas enlazadas, sin reproducir la aplicación Obsidian ni adoptar una dependencia de su formato.

| Paso | Funcionalidad | Viabilidad y alcance |
|---|---|---|
| NAV-01 | Identidad y árbol documental | Alta. ID estable, padre único y orden; índice derivado en build y validación de árbol. Base de todo lo demás. |
| NAV-02 | Navegación jerárquica contextual | Alta tras NAV-01. Ruta de ubicación, subir al padre, hijos, anterior/siguiente y árbol con posición actual. |
| NAV-03 | Referencias a documentos, apartados y nodos | Alta/media. Destinos con ID estable y enlaces normales; revelar antecesores plegados, seleccionar Resultado si corresponde y resaltar destino. |
| NAV-04 | Enlaces entrantes y salientes | Alta tras NAV-03. Generar backlinks con contexto y salto al punto de cita, sin escribir el enlace inverso a mano. |
| NAV-05 | Ida/vuelta rápida | Media. Volver al origen exacto con posición, foco, pestaña y plegado; historial reciente limitado a la sesión y fallback sin historial. |
| NAV-06 | Imprimir y descargar una rama | Media. Recorrer descendientes en orden; vista continua desplegada con índice y enlaces internos. Primera descarga: HTML autónomo por rama; impresión del navegador/PDF con estilos adecuados. |
| NAV-07 | Consulta sin abandonar el origen | Media. Vista previa accesible y panel lateral de referencia, con abrir documento y retorno; teclado y táctil, no solo hover. |
| NAV-08 | Mapa local de conexiones | Opcional, tras lo anterior. Grafo del documento y sus enlaces cercanos; no sustituye el árbol ni condiciona impresión/offline. Se genera con los índices existentes, sin dependencias adicionales. |

NAV-01/02/03 están integrados y publicados en f3e2259, con CI/build/Pages y HTTP verificados. NAV-04 publicado y confirmado por el usuario. NAV-05 integrado tras la confirmación en Windows del retorno desde el Artículo 2 a la cita de TreeTable en Navegación (18-11-2026). El usuario confirmó también el funcionamiento de NAV-05 en la wiki pública. NAV-06 validado en Windows y confirmado por el usuario en la wiki pública después del [despliegue](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44271236001). NAV-07 publicado y confirmado por el usuario. NAV-08 publicado y confirmado por el usuario. La fase de navegación queda completada. Orden de trabajo NAV-01 → NAV-02 → NAV-03 → NAV-04 → NAV-05 → NAV-06 → NAV-07; NAV-08 opcional. Las pruebas se añaden con cada comportamiento, no se posponen a la fase de robustez. Detalle en [docs/13-navigation-phase.md](13-navigation-phase.md).

**NAV-04 validado.** El usuario confirmó en Windows el arranque con PowerShell y el recorrido de ida y vuelta a la cita plegada. También confirmó las cuatro citas del Artículo 2 y el salto a dos puntos distintos de Navegación. [Despliegue verificado](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44264899513). El retorno de NAV-05 está validado en Windows y en la [wiki pública](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44267671415). [Guía de aceptación](23-reference-relations.md).

## Robustez y accesibilidad — AST-029 / AST-012

Publicados: acceso a pantalla completa con Tab, laboratorio independiente, varias sublistas por nodo, plegado global, barra flotante y diagnósticos de anotaciones. Pablo confirmó los recorridos de teclado y móvil, y el desplazamiento con la barra flotante. La prueba automatizada de la tabla grande cubre el plegado con 504 nodos.

La referencia de plegado y el ejemplo interactivo de Sintaxis del lenguaje están publicados. El despliegue y el HTML se han comprobado. El PR #5 conserva su revisión separada.

## Seguridad y mantenimiento — AST-003.5

En curso. Auditoría inicial de ambos lockfiles completada. Flujo CI de doble ámbito preparado en rama. Siguiente tarea: preparar una actualización compatible de Astro, MDX y Starlight y reevaluar el PR #1 desde la base actual. El PR #4 se revisa por separado.

## Summary y Boundary — AST-018 (aplazados)

Modelo semántico de grupos, referencias e IDs; considerar el contrato de IDs introducido por Navegación, sin implementarlo prematuramente en esa fase.

## Presets y exportación XMind — AST-023

Modelo intermedio, fixtures reales y round-trip en Desktop. No confundir exportación HTML/PDF de NAV-06 con exportación .xmind.

## Contenido de estudio — AST-024 (aplazado)

Decidir acceso, fuentes/licencias antes de publicar. PR #2 permanece separado.

## Biblioteca de componentes — AST-027 (empaquetado último hito)

La biblioteca interna y catálogo se anticipan en CTX para alimentar el editor. Empaquetado/distribución pública siguen al final. No publicar npm ni crear repositorios hasta acordarlo.

## Ya completado

Wiki/laboratorio Astro; corchetes sin escapes; clases por nivel y nodo; plegado y estado inicial heredables; numeración heredable/start local y reinicio tras padre sin número; 14 demos Resultado/Código; NAV-01/02/03; pantalla completa con centrado y scroll. Ver estado y contrato, no volver a implementarlos.

## Ampliación de NAV-02 completada

Orden opcional, fechas YAML con milisegundos, pendientes al final y numeración consecutiva por grupos de order están implementados y publicados en f3e2259. Duplicados comparten número. [Contrato](20-navigation-ordering.md) y [corrección](22-consecutive-numbering-fix.md). No queda una integración pendiente de esta ampliación.

La primera entrega de edición incluye Markdown y resultado en dos paneles, con actualización en directo. En móvil se alternan con pestañas. [Detalles y prueba de aceptación](25-wiki-editing-proposal.md#edición-con-vista-previa-en-directo).

El editor completo está publicado en todas las páginas documentales. La [guía actual](27-editor-github-pages-pat.md) sustituye el estado histórico del prototipo `d87deba`.

**Separación de expedientes (23-11-2026):** la oposición tiene un listado de tarjetas por año/modalidad y un alta independiente. Tras crear el YAML F00 se abre el expediente; sus pasos comienzan con el PDF oficial (Paso 1), luego criterios CPS (Paso 2). No se ofrecen duplicados, tampoco F00 sin PDF. Consultar `docs/32-oposiciones.md`. Compilación local y 65 pruebas correctas; pendiente comprobación en Pages.
