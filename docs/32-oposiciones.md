# CALL-01 · Crear oposición

La oposición agrupa convocatorias de distintos años. Se pregunta el nombre y, opcionalmente, un nombre corto en Procesado de Temarios. El siguiente paso será añadir una convocatoria por año, tras aceptar esta entrega.

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

El asistente conserva los pasos completados como resúmenes visibles, ordenados antes del formulario activo. Paso 1 muestra nombre, nombre corto y enlace al YAML real del repositorio privado; se permite editar los nombres sin reabrir el alta. Paso 2 solicita año y PDF oficial (hasta 20 MB, firma PDF), con botón Subir a GitHub. El original se conserva byte a byte como `convocatoria-oficial.pdf`, con nombre original, tamaño, fecha y ruta en el YAML. La subida crea o completa el registro anual en un único commit; no sobrescribe PDF existente. El resumen muestra enlaces a YAML y PDF o estado PDF pendiente en registros anteriores. Las siguientes fases mantienen este patrón. No extraer metadatos oficiales ni renombrar canónicamente todavía: sigue pendiente F00.

Al pulsar una oposición se oculta el Paso 1 y se muestra su espacio propio con título, Paso 2, año, Guardar, listado anual y Volver. El renombrado queda como botón secundario. El alta crea `Oposiciones/<carpeta-inmutable>/Convocatorias/<año>/convocatoria.yaml` con ID derivado del ID de oposición y año, `oposicionId`, `anio`, fecha ISO con milisegundos, `faseActual: F00` y `fasesCompletadas: []`. Actualiza la fase de oposición en el mismo commit no forzado. Rechaza duplicados. F00 aún no implementado; validar primero CALL-02.
