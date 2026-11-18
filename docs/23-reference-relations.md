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

## Prueba confirmada: varias citas al mismo apartado

En Artículo 2, «Enlaces entrantes» debe mostrar cuatro citas: tres de Navegación y una de Artículo 1. Abre primero la entrada cuyo contexto empieza por «Salta al apartado del Artículo 2». Debe resaltar el enlace en el texto de Navegación. Vuelve al Artículo 2 desde ese enlace y abre la entrada que contiene «Medida de organización». Debe resaltar la cita dentro de la tabla. El usuario confirmó las cuatro citas y ambos saltos en su navegador.

## Generar el ZIP sin Node.js en tu equipo

1. Abre [Wiki · Build](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/workflows/wiki-ci.yml) en GitHub.
2. Pulsa **Run workflow**, elige la rama que quieres empaquetar y confirma. Mientras NAV-04 esté en pruebas, usa `feature/nav-04`.
3. Abre la ejecución completada y descarga **AstroXmind-Wiki-Local** desde **Artifacts**.
4. Extrae el archivo descargado y luego `AstroXmind-Wiki-Local.zip`. Abre `Abrir-NAV-04.cmd` en Windows.

GitHub compila la wiki y prepara el paquete. Puedes pedir una copia nueva desde el navegador, sin instalar Node.js, npm o Python en tu equipo.

El paquete incluye el sitio completo. La exportación de una rama individual corresponde a NAV-06.
