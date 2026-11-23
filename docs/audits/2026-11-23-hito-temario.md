# Auditoría de cierre — 23/11/2026 · H-TEM-01

## Evidencia y alcance

- Base de código auditada: main `0758632c2a3d2f55ad42c4fe63377e579d60f992`; checkout limpio, 203 archivos versionados. Se contrastaron historial reciente, documentación, módulos y pruebas del flujo documental y estado previo de navegación/editor.
- Almacén de datos separado, privado y accesible mediante autorización GitHub; se comprobó la persistencia del registro TAI 2025 LIBRE en REVISION, no se alteró. No publicar sus originales ni ejemplos privados.
- [CI](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/45206970018), [Wiki Build](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/45206969847) y [Pages](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/45206969942): success para el SHA auditado. [Ruta de gestión](https://pablogonzalezruiz.github.io/AstroXmind/oposiciones/) HTTP 200; no equivale a aceptación visual autenticada.
- Instalación bloqueada correcta; Node 24.22.3/npm 11.19.1 local (CI Node 22). Check: navegación 43, catálogo 6, transformación 8, Astro 79 archivos sin errores/avisos/hints. Build estático y 66 pruebas DOM/cliente correctos. Total 123 pruebas principales correctas.
- Integraciones adicionales `test:references:rebuild` y `test:navigation:ordering`: 1 fallo cada una al compilar en /tmp, por metadatos de compilación de Starlight Page.astro y resolución de rutas de dependencias; no se alcanzan sus aserciones finales. Pendiente reproducir con Node 22 y checkout aislado. No declarar regresión funcional confirmada ni ocultar fallos. No se repitió auditoría de dependencias ni aceptación móvil.

## Inventario de estado

| Área | Estado comprobado / límite |
|---|---|
| Wiki Astro/Starlight/MDX | 12 documentos de navegación; build correcto, Pages success. |
| TreeTable | Fuente única laboratorio/wiki; listas, plegado/504 nodos, numeración, clases, fullscreen; pruebas DOM. |
| Navegación NAV-01–08 | Publicada; IDs, referencias, backlinks, retorno, exportación, vista previa y mapa. Dos integraciones de rebuild pendientes de diagnóstico. |
| Editor | MD/MDX, sincronización, TreeTable, catálogo e inspectores CTX-01–05, guardado GitHub, teclado; CTX-06/07 y ordenación/arrastre aplazados. |
| FrameEjemplo | Banco independiente, editor vertical, reset sin persistencia; tests correctos; falta aceptación visual/iPhone. |
| Área privada | Carcasa estática pública sin datos privados; autenticación y almacén privado separados; pruebas DOM y persistencia verificadas. No afirmar protección de servidor de la página estática. |
| CALL-01/02 | Alta y listado de oposición; tarjetas por año/modalidad; alta independiente y duplicados rechazados; renombrado real pendiente. |
| CALL-03 | PDF original + siete derivados, fase REVISION; F04 opcional. Cabecera explícita, ruta anual libre histórica y PI separada. |
| CALL-04 | CPS separado, original + tres derivados registrados; Paso 2 en detalle, falta prueba visual autenticada y subida desde interfaz; PI CPS bloqueado. |
| CALL-05 | Pendiente fidelidad completa, rectificaciones, cortes reales y reinicio independiente. |
| PROG-01/02/03 | Aún no implementados: contrato, generación y correspondencias del programa desglosado. |
| TEM/PISTAS/EXAM/LINK/TEST/COVER | Pendientes, no importar masivamente antes de validar programa y asociaciones. |
| Summary/Boundary, XMind, distribución | Aplazados. |

## Hallazgos y acciones

1. El parser actual produce bloques y temas con texto corrido; no hay modelo de apartados atomizados ni relaciones versionadas. F02 actualmente serializa el anexo seleccionado, no todo el documento limpio como exige el contrato. F03 reconstruye plazas, reglas y programa; revisar cobertura literal y procedencia por fragmento antes de aceptar. El parser PI está limitado a 2025, y no ofrece OCR. No dar por válida una nueva edición solo por cambiar el año.
2. El reinicio actualmente bloquea bases con criterios CPS vinculados. Diseñar reprocesamiento no destructivo o reinicio independiente con inventario exacto, prueba ficticia, recuperación y preservación de documentos independientes; no borrar datos reales en este cierre.
3. La separación de oposición/convocatoria y modalidad explícita está en el código auditado; falta aceptación visual autenticada de los últimos ajustes. Documentos previos con «Paso 3 CPS» o «F00 como primera prioridad» son históricos. En el detalle actual: Paso 1 PDF, Paso 2 CPS; el alta de nueva convocatoria tiene su propio Paso 1.
4. Mantener dos identidades: concepto permanente independiente de ruta/año y ocurrencia de nodo en versión concreta, con padre/orden/código visible. Identidad de pregunta independiente de clasificación. Vinculación muchos a muchos, índices inversos derivados, revisión manual prevalente y trazabilidad.
5. No duplicar estadísticas al proyectar pregunta sobre varias ediciones. Una correspondencia puede ser parcial, división/fusión, desplazamiento, renombrado, alta o baja; guardar evidencia, estado, autor, confianza e historial; revisar vigencia legal/técnica antes de reutilizar respuestas.

## Punto de reanudación — martes 24/11/2026

**H-TEM-01: contrato de programa oficial desglosado, versionado y editable.** Primero PROG-01: especificar esquema YAML con IDs estables, ocurrencias, referencias a fuente, relaciones pregunta/concepto y correspondencias muchos a muchos, fixtures de cambio de posición y división/fusión. Después PROG-02: generar YAML canónico y Markdown numerado anidado editable como salida controlada (profundidad variable, fuente literal intacta). Validar cobertura; distinguir título editorial y literal. CODE y pruebas antes de habilitar reinicio de TAI 2025. CALL-05: resolver fidelidad y reinicio preservando CPS, obtener aceptación del usuario. PROG-03: verificar proyección entre convocatorias con caso histórico; solo luego importar corpus/preguntas. Las tareas anteriores siguen en backlog.

No implementar funcionalidad ni eliminar/subir documentos en esta entrega documental. Leer AGENTS, 00-master-prompt, 09-continuation, 03-roadmap y documentos maestros privados. Registrar nueva evidencia por SHA. El hito no implica que PROG-01 esté completado.

