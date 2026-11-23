# CALL-01 · Crear oposición

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
