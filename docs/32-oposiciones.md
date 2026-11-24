# CALL-01 · Crear oposición

**Reanudación H-TEM-01 · PROG-01 (24-11-2026):** contrato YAML v1, esquema, validador y fixtures sintéticos implementados; 10 pruebas nuevas correctas, check/build local correctos (133 pruebas principales). [Contrato PROG-01](33-programa-oficial.md). Siguiente PROG-02: generación reversible YAML/Markdown con verificación literal y de cobertura; después CALL-05 y PROG-03. Expediente privado intacto; sin importación ni acceso nuevo. La aceptación del diseño y el flujo real sigue pendiente.

**Hito de continuidad H-TEM-01 (23-11-2026; reanudar 24-11):** base funcional `0758632`, CI/Build/Pages correctos y 123 pruebas principales locales; dos integraciones adicionales de reconstrucción fallan en el entorno temporal, pendiente diagnóstico. El expediente 2025 libre sigue en REVISION, con año/modalidad explícitos y CPS separado. Próximo trabajo PROG-01: definir esquema canónico del programa desglosado (YAML), conceptos permanentes, ocurrencias versionadas y asociaciones múltiples; Markdown anidado como vista editable. Después PROG-02, CALL-05 y PROG-03; no reiniciar ni importar datos hasta validar. Las prioridades anteriores son históricas. [Auditoría y criterios de aceptación](audits/2026-11-23-hito-temario.md).

La oposición agrupa convocatorias de distintos años. Se pregunta el nombre y, opcionalmente, un nombre corto en Procesado de Temarios. CALL-02 y CALL-03 amplían esta base con alta anual y procesamiento.

El repositorio independiente `PabloGonzalezRuiz/AstroXmind-Datos` fue creado privado el 23-11-2026 con rama main y README. No se copia su contenido al repositorio público ni al build; la interfaz estática llama directamente a GitHub desde el navegador autorizado. El token de grano fino debe incluir ambos repositorios con Contents lectura y escritura. La interfaz no sustituye la protección del repositorio. No guardar ni compartir el token en documentos.

Cada alta crea `Oposiciones/<id>/oposicion.yaml`; ejemplo ficticio:

```yaml
version: 2
id: op-12345678-1234-4234-8234-123456789abc
nombre: Técnicos Auxiliares de Informática
nombreCorto: TAI
slug: tai
alias: []
fechaCreacion: "2026-11-23T08:00:00.123Z"
faseActual: 2
fasesCompletadas: [1]
```

El UUID y la ruta física son inmutables; referencias internas por ID, nunca por nombre. El nombre corto se normaliza a minúsculas ASCII y guiones para la URL. La ruta estática `/AstroXmind/oposiciones/?o=tai` usa una página común y un parámetro amigable: no requiere generar páginas privadas en GitHub Pages. Los slugs y alias se resuelven en el navegador tras autorización mediante el índice derivado de los YAML privados. Al editar el nombre corto, el slug previo se conserva como alias y las antiguas URL se resuelven a la actual. Se reservan también todos los alias, sin duplicados entre oposiciones. Los registros v1 conservan carpeta e ID; se interpretan como v2 y el cambio de nombre guarda el nuevo esquema sin mover documentos.

Las fechas se almacenan en UTC con milisegundos. Se verifica identidad, propietario, visibilidad privada y rama antes de cada operación. Las escrituras usan instantánea Git, árbol y commit con avance no forzado de la rama; si hay concurrencia se rechaza el avance y se vuelve a consultar antes de reintentar. No existe fallback al repo público. El listado se consulta tras guardar y al volver a abrir la página. No se incluyen metadatos privados en el build.

Pruebas: sin token no se muestra el formulario; con token sin acceso al almacén no se habilita Guardar; con permiso correcto guardar un nombre elegido por Pablo, comprobar YAML y volver a entrar para verificar persistencia; abrir la oposición desde el listado, modificar nombre corto, comprobar ID/ruta invariables y abrir URL anterior. Repetir slug o alias y verificar rechazo. No crear datos reales durante las pruebas automatizadas.

## CALL-02 · Añadir convocatoria

Durante la autorización y lectura de los pasos se muestra un diálogo modal de carga de pantalla completa, con indicador animado (estático si se prefiere movimiento reducido), bloqueo de interacción y scroll. Se cierra al completar, al fallar, al revocar la sesión o al superar 45 segundos; no se muestran datos de peticiones obsoletas. Sin JavaScript se muestra una indicación para activarlo.

El asistente conserva los pasos completados como resúmenes visibles, ordenados antes del formulario activo. Paso 1 muestra nombre, nombre corto y enlace al YAML real del repositorio privado; se permite editar los nombres sin reabrir el alta. Paso 2 solicita año y PDF oficial (hasta 20 MB, firma PDF), con botón Subir a GitHub. El original se conserva byte a byte como `convocatoria-oficial.pdf`, con nombre original, tamaño, fecha y ruta en el YAML. La subida crea o completa el registro anual en un único commit; no sobrescribe PDF existente. El resumen muestra enlaces a YAML y PDF o estado PDF pendiente en registros anteriores. Las siguientes fases mantienen este patrón. Este diseño inicial se sustituye por CALL-03 en el flujo actual.

Al pulsar una oposición se oculta el Paso 1 y se muestra su espacio propio con título, Paso 2, año, Guardar, listado anual y Volver. El renombrado queda como botón secundario. El alta crea `Oposiciones/<carpeta-inmutable>/Convocatorias/<año>/convocatoria.yaml` con ID derivado del ID de oposición y año, `oposicionId`, `anio`, fecha ISO con milisegundos, `faseActual: F00` y `fasesCompletadas: []`. Actualiza la fase de oposición en el mismo commit no forzado. Rechaza duplicados. F00 se implementó posteriormente en CALL-03.

## CALL-03 · Procesamiento y reinicio de prueba TAI 2025

El PDF completo del BOE se analiza en el navegador con PDF.js sin enviar su contenido a terceros. Se verifica la fecha de cabecera, referencia, Anexo V y estructura 9/5/9/10. Se conserva el original byte a byte con nombre canónico y SHA-256; se generan metadatos, transcripción por página, selección del anexo, programa MD y YAML de plazas y reglas. F04 (resumen) se omite por ser opcional. La edición permanece pendiente de revisión; no se declara completado el Paso 2. Los criterios posteriores y la validación integral de fidelidad quedan pendientes. El soporte inicial es el BOE completo de TAI 2025, no PDFs escaneados ni otras oposiciones.

«Eliminar PDF y reiniciar» exige confirmación y comprueba las rutas exactas del PDF y derivados registrados contra el inventario del año. Borra únicamente esos archivos y restablece F00 en un commit no forzado; conserva oposición, año y el historial Git. Se puede repetir la subida, con recalculado completo. No se borran documentos adicionales no asociados a esa subida ni se modifica el repositorio público de datos. Las pruebas usan simulaciones y nunca eliminan datos reales.

Durante la subida se reutiliza el diálogo modal con mensajes de preparación, análisis y escritura en GitHub, sin el límite de 45 segundos reservado a las lecturas. Al terminar se recarga el resumen: enlaces al PDF y a todos los derivados, datos extraídos de plazas, examen y bloques. Ante error se cierra el diálogo y se muestra el motivo.

El campo numérico de año se inicializa con el año actual del navegador y vuelve a ese valor al terminar la subida o restablecer la sesión. Permite bajar o subir de año con las flechas del control, sin teclear.

Se genera además `__F05-REGLAS-CORRECCION.yaml` con el perfil de evaluación, puntuación directa, reservas, límites transformados, elección de supuesto, desempates y evidencia literal. Los cortes y fórmulas CPS posteriores permanecen pendientes, sin inventar valores. La prueba de regresión ejecuta subida, reinicio y nueva subida y comprueba el mismo inventario y huella; el reinicio elimina también este YAML.

Tras procesar y recargar correctamente los pasos, se desplaza la vista al botón «Procesar y guardar en GitHub» y se destaca con un contorno dorado durante unos segundos. Se respeta la preferencia de movimiento reducido. Prueba real de Pablo del 23/11: reinicio eliminó los siete archivos previos; resubida regeneró los ocho esperados, incluidos los siete derivados, conservando la huella del PDF y los seis derivados previos.

## CALL-04 · Criterios oficiales CPS (Paso 3)

Cada edición con PDF de convocatoria procesado ofrece un formulario propio para el documento CPS. Se comprueba cuerpo, modalidad, año y plazas; se guardan PDF intacto, metadatos, transcripción y perfil YAML independiente en la misma carpeta anual. La fecha del nombre es la fecha documental firmada (18/05/2026 en la prueba), no una fecha de publicación inventada. El perfil recoge umbral inicial, cupos objetivo, mínimo del 30%, empate en corte y transformación proporcional; los cortes reales siguen pendientes. No se modifica el YAML de bases ni se permite borrar la convocatoria mientras tenga criterios vinculados. Una futura revisión incorporará rectificaciones y reinicio independiente. Referencia de prueba: https://sede.inap.gob.es/sites/sede/files/public/2026-05/TAI%20LI%202025.pdf.

## Estado auditado 23-11-2026

El registro anual real contiene el original y siete derivados, incluido el YAML de reglas, en REVISION. Ya figura el bloque criteriosCPS. Próxima prueba: recargar y verificar resumen/enlaces del Paso 3; revisar ambos perfiles, fuentes y límites antes de aceptar y desbloquear temario. El resaltado está implementado después de recargar: falta confirmación visual. [Auditoría](audits/2026-11-23-procesado.md).

## Requisito futuro · Simulacros cronometrados

Después de generar y validar los exámenes tipo test, incorporar temporizador de cuenta atrás basado en `duracionMinutos` del perfil oficial de la edición (TAI 2025: 120 minutos). Mostrar tiempo restante, avisar antes del vencimiento y finalizar el simulacro al agotarse el tiempo. Registrar el tiempo empleado. No implementar todavía; continuar con el expediente documental oficial.

### Verificación real CALL-04 (23-11-2026)

CALL-04: documento oficial CPS de TAI 2025 incorporado al almacén privado; original y tres derivados comprobados. El analizador de producción se probó con el PDF real mediante PDF.js 5.6.205 en Node (la wiki usa 4.10.38); persistencia verificada en GitHub sin alterar PDF ni bases. Falta confirmar visualización en la wiki y probar la subida desde su interfaz. Siguiente: CALL-05, revisión integral, rectificaciones y cortes oficiales sin inventar datos. No desbloquear temario antes de aceptación.

## Ficha anual de convocatoria

El año es un enlace a `/oposiciones/?o=<slug>&anio=<año>`. La cabecera «Resumen de convocatoria» aparece antes del Paso 1 únicamente al abrir una edición. Se filtra el listado a esa edición; el enlace «Todas las convocatorias» devuelve al conjunto de años. Se muestran publicación, plazas, bloques, duración, preguntas, reservas y penalización, junto con las reglas de calificación y desempate obtenidas del perfil de corrección asociado al PDF y los criterios CPS de la misma edición. Los cortes reales no incorporados se distinguen de los umbrales mínimos. Los datos se leen exclusivamente del almacén privado en la sesión autorizada; no se vuelcan al repositorio público. Al revocar la sesión se limpia la ficha. Pendiente de prueba visual y confirmación del despliegue.

La ficha anual distingue acierto, error y blanco por pregunta de teoría y práctica (puntuación directa idéntica según las bases). Calcula también el peso medio orientativo a partir de máximos y número de preguntas: TAI 2025, teoría +0,625 / −0,208333… / 0; práctica +2,5 / −0,833333… / 0. No son valores de calificación transformada oficiales: esta depende de los cortes y baremos CPS. El peso medio práctico cuadruplica el teórico. Fuente: BOE-A-2025-26262, anexo V, apartados 2.2 y 2.3.

## Modalidades de acceso por año

El alta solicita explícitamente ingreso libre o promoción interna. Un año admite ambas modalidades: `2025` conserva la ruta e ID históricos de ingreso libre (modalidad LIBRE implícita para registros v1) y `2025-pi` identifica el expediente de promoción interna con modalidad PROMOCION_INTERNA explícita. Las fichas, archivos, reglas, reinicio y enlaces anuales se separan por clave. No se mueve ni sobrescribe el expediente existente. Las preguntas, exámenes y simulacros futuros deberán referenciar el ID de expediente, no solo el año. El cupo de discapacidad es una reserva dentro de cada modalidad.

TAI 2025, mismo BOE-A-2025-26262: anexo V libre, anexo VI promoción interna. PI: 340 plazas (317 generales, 23 discapacidad), 50 teóricas + 5 reserva, 12 prácticas + 3 reserva, 90 minutos, error −1/4, blancos 0; temario 25 temas (5/3/8/9). La fase de oposición vale 100 puntos (50 por parte) y la fase de concurso hasta 66 adicionales; reglas de desempate propias. Se probó el analizador con una estructura representativa de las bases. Pendiente: probar con el PDF real, desplegar y verificar interfaz, adaptar y validar analizador CPS de PI (bloqueado por ahora para evitar asociar criterios de libre) y completar pruebas de regresión de coexistencia.

### Disponibilidad y prevención de duplicados

Al cambiar el año, el selector consulta el inventario de la oposición ya cargado: deshabilita las modalidades con PDF registrado, indica «ya registrada» y bloquea el botón si no hay opción válida. Si ambas están registradas, pide otro año. Un expediente F00 sin PDF se muestra como continuación, nunca como alta duplicada. La escritura vuelve a comprobar año y modalidad en una instantánea de GitHub y rechaza sobrescrituras o cambios concurrentes. La lógica de disponibilidad se ha probado con libre histórico, PI coexistente, año vacío, año nuevo y registro incompleto. Pendiente de comprobar visualmente en la wiki.


### Expedientes independientes (23-11-2026)

La ficha de la oposición conserva sus datos generales y muestra una tarjeta por año y modalidad, con estado resumido y enlace «Abrir / continuar convocatoria». Debajo, «Crear nueva convocatoria» solicita exclusivamente año y modalidad. El alta persiste el YAML F00 del expediente y navega a su URL; ningún registro existente se ofrece como alta, incluso si aún no tiene PDF. La vista de detalle muestra solo el resumen y los pasos de la convocatoria seleccionada: Paso 1 PDF oficial, Paso 2 criterios CPS, siguientes fases guiadas tras revisión. Un expediente sin PDF comienza en el Paso 1; el reinicio opera exclusivamente sobre el expediente abierto. Se preservan rutas e IDs históricos. El temario sigue siendo común a la oposición. Compilación local con fuentes de los módulos vigentes y 65 pruebas correctas; pendiente verificar Pages y prueba real de alta desde la wiki.

El contenedor de alta lleva el título «Nueva convocatoria» y dentro figura «Paso 1 · Crear convocatoria», seguido del formulario de año y modalidad. El procesamiento del PDF continúa el Paso 1 en el expediente individual; la numeración no depende de los pasos de la oposición. Validado mediante las pruebas de la vista (65 pruebas correctas).

### Modalidad explícita y cabecera del expediente

La cabecera de cada expediente muestra el nombre de la oposición, el año y la modalidad. Tanto LIBRE como PROMOCION_INTERNA se guardan explícitamente en `convocatoria.yaml` desde el alta; los registros históricos de ingreso libre sin campo se interpretan como LIBRE y se normalizan al leer. El expediente TAI 2025 existente se ha actualizado en el repositorio privado (commit 8bab890e), sin cambios de ID, ruta, PDF, derivados ni estado de revisión. Compilación y 66 pruebas correctas, incluidas cabeceras de ambas modalidades y compatibilidad histórica.
