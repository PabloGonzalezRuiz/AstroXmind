# CALL-01 · Crear oposición

La oposición agrupa convocatorias de distintos años. Primero se pregunta solo el nombre en Procesado de Temarios. El siguiente paso será añadir una convocatoria por año, tras aceptar esta entrega.

El repositorio independiente `PabloGonzalezRuiz/AstroXmind-Datos` fue creado privado el 23-11-2026 con rama main y README. No se copia su contenido al repositorio público ni al build; la interfaz estática llama directamente a GitHub desde el navegador autorizado. El token de grano fino debe incluir ambos repositorios con Contents lectura y escritura. La interfaz no sustituye la protección del repositorio. No guardar ni compartir el token en documentos.

Cada alta crea `Oposiciones/<CARPETA>/oposicion.yaml`; ejemplo ficticio:

```yaml
version: 1
id: op-<uuid>
nombre: TAI
fechaCreacion: "2026-11-23T08:00:00.123Z"
faseActual: 2
fasesCompletadas: [1]
```

La carpeta normaliza a mayúsculas ASCII y guiones; el nombre original permanece en YAML. El identificador UUID permanece estable. Las fechas se almacenan en UTC con milisegundos. Se verifica identidad, propietario, visibilidad privada y rama antes de cada operación; se rechazan duplicados y no hay sobrescritura ni fallback al repo público. El listado se consulta tras guardar y al volver a abrir la página.

Pruebas: sin token no se muestra el formulario; con token sin acceso al almacén no se habilita Guardar; con permiso correcto guardar un nombre elegido por Pablo, comprobar YAML y volver a entrar para verificar persistencia; repetir nombre y verificar rechazo. No crear datos reales durante las pruebas automatizadas. CALL-02 y F00 no incluidos.
