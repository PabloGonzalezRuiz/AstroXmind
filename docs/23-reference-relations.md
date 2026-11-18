# NAV-04 · Referencias entrantes y salientes

Candidata preparada para prueba. El panel aparece al pie de los documentos con citas. «Enlaces salientes» lleva a cada destino original. «Enlaces entrantes» muestra el documento que cita esta página y un fragmento de contexto. Cada entrada vuelve al enlace concreto, incluso cuando varias citas provienen del mismo documento.

La autoría sigue utilizando enlaces Markdown con `doc:` o `DocLink` en MDX. El build valida el HTML, recoge las referencias resueltas y genera los dos paneles en HTML estático. Los bloques de código mostrados como texto quedan fuera del registro.

`references.json` pasa a versión 2 y conserva `source`, `target`, `fragment` y `href`. Añade `citation`, `label` y `context`. El ancla automática depende del destino lógico, el texto y el contexto. Las citas idénticas se distinguen con un sufijo. Cambiar la URL del documento no cambia por sí solo el ancla. Editar una cita o su contexto puede cambiarla.

Prueba principal de aceptación, confirmada por el usuario en Windows el 18-11-2026:

1. Abrir Navegación y bajar hasta «Enlaces salientes». Seguir «Salta al apartado del Artículo 2».
2. En Artículo 2, abrir «Enlaces entrantes». Buscar el contexto «Medida de organización» y pulsar su enlace a Navegación.
3. Debe activarse Resultado y abrirse la rama necesaria de la tabla hasta enfocar la cita. La rama de control permanece plegada.

Los paneles se generan al compilar. Para probarlos en local, ejecutar `npm run build` seguido de `npm run preview`. La navegación exacta a una cita está incluida en NAV-04. Restaurar el estado anterior de lectura corresponde a NAV-05.


La copia compilada para Windows está en [AstroXmind-NAV-04.zip](../AstroXmind-NAV-04.zip). Descárgala, extrae el ZIP y ejecuta `Abrir-NAV-04.cmd` con Windows PowerShell.

## Siguiente prueba: varias citas al mismo apartado

En Artículo 2, «Enlaces entrantes» debe mostrar cuatro citas: tres de Navegación y una de Artículo 1. Abre primero la entrada cuyo contexto empieza por «Salta al apartado del Artículo 2». Debe resaltar el enlace en el texto de Navegación. Vuelve al Artículo 2 desde ese enlace y abre la entrada que contiene «Medida de organización». Debe resaltar la cita dentro de la tabla. Queda por confirmar este recorrido en el navegador del usuario.
