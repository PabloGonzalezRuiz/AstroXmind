# Editor de AstroXmind en GitHub Pages

La alternativa de guardado directo mantiene la compilación Astro estática. El navegador llama a la API de contenidos de GitHub con un token personal de grano fino de duración limitada. La GitHub App del candidato anterior y ChatGPT Sites siguen disponibles como alternativas.

## Preparación y prueba

1. Publicar la versión aprobada del editor en GitHub Pages.
2. La edición directa de la página escribe en `main`, por decisión de Pablo del 19-11-2026.
3. Abrir https://github.com/settings/personal-access-tokens/new y elegir Resource owner `PabloGonzalezRuiz`, acceso Only select repositories → `AstroXmind`, permiso Contents Read and write, caducidad corta. No activar Workflows ni otros permisos.
4. En https://pablogonzalezruiz.github.io/AstroXmind/configuracion/ introducir el token y pulsar Guardar token. En cualquier documento, abrir Acciones → Editar documento; se carga automáticamente su archivo completo. Pulsar Guardar.
5. Abrir el enlace al commit, comprobar el archivo real en `src/content/docs/`, esperar el despliegue y actualizar la página. El token se conserva en el navegador.

El token se conserva en localStorage bajo una clave propia de AstroXmind. El usuario puede reemplazarlo o eliminarlo con Olvidar token. El JavaScript del mismo origen puede leerlo, por lo que se debe usar un navegador personal y un token de alcance limitado y caducidad corta. Revocarlo en GitHub invalida el token. GitHub concede Contents a nivel de repositorio. El editor obtiene la ruta real del documento del build y limita las escrituras a archivos MD/MDX en `src/content/docs/`. Se verifica el YAML básico y se conserva el ID editorial antes de escribir. La API compara el SHA anterior para detectar conflictos; tras un fallo de escritura el botón queda deshabilitado hasta recuperar la revisión. La confirmación incluye hora y commit. Astro y CI verifican la compilación y solo entonces GitHub Pages actualiza la wiki.

El primer guardado real se verificó el 19-11-2026 en el commit [755e29b](https://github.com/PabloGonzalezRuiz/AstroXmind/commit/755e29bd542116ee451eaefd7e425e1e5587b5bc). Pablo confirmó la recuperación posterior. Un intento posterior no produjo un nuevo commit; la revisión añade estado persistente, recuperación explícita ante errores y pruebas simuladas de guardados consecutivos. Falta la validación manual de esa revisión. TreeTable compleja queda como siguiente ampliación del editor.

La pantalla de Configuración es una ruta administrativa de Starlight, fuera del árbol documental. La cabecera proporciona acceso desde cualquier página y el módulo `github-connection.mjs` centraliza el almacenamiento y las peticiones. La comprobación de conexión verifica lectura de la rama; la escritura se acredita con un commit real. La clave de almacenamiento se conserva para reutilizar los tokens ya guardados.

El editor de página separa lectura y edición mediante el menú Acciones. Editar documento abre un diálogo a pantalla completa con modos Markdown, Dividido y Resultado, herramientas de formato, guardado y cierre. Ver código fuente muestra la fuente completa de la versión publicada y el historial enlaza a los commits de su archivo. El lector sigue mostrando el HTML estático de Astro hasta que finaliza el siguiente despliegue. Pablo confirmó el funcionamiento del editor y detectó que la página TreeTable enseñaba imports como texto. La rama de borradores anterior permanece como evidencia histórica.

### Vista previa MDX de ejemplos publicados

`wiki-editor-mdx.mjs` separa imports, Markdown y llamadas `ComponentExample`. La vista previa actualiza el Markdown en directo y reutiliza el HTML compilado real de las demos cuyos imports y llamadas no cambian. `MarkdownContent.astro` prepara copias inertes sin scripts; los IDs se aíslan al mostrarlas y las mismas instancias se conservan durante la edición. Los imports se mantienen en el archivo, pero no aparecen como texto en el resultado. No se ejecutan expresiones MDX nuevas en el navegador que guarda el token de GitHub. Si una llamada o los imports cambian, se muestra un aviso de recompilación en lugar de una demo obsoleta. La edición interactiva del contenido interno de los ejemplos importados, o de un TreeTable MDX nuevo, sigue pendiente. Prueba: [TreeTable](https://pablogonzalezruiz.github.io/AstroXmind/componentes/tree-table/) → Acciones → Editar documento.

Referencias: [tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens), [API Contents](https://docs.github.com/en/rest/repos/contents), [investigación](26-astro-editing-patterns.md).

### Sincronización bidireccional de paneles

En modo Dividido, **Sincronizar paneles** está activado por defecto. Al pulsar un bloque del resultado se selecciona su fuente; al mover el cursor en el código se resalta el bloque correspondiente y se desplaza la vista si queda fuera de pantalla. El desplazamiento se interpola entre posiciones reales de los bloques, midiendo también las líneas partidas visualmente del editor; no se utiliza un porcentaje global. El interruptor permite trabajar de forma independiente. Pulsar enlaces, botones o pestañas mantiene su comportamiento habitual.

`wiki-editor-sync.mjs` obtiene rangos de caracteres del AST Markdown/GFM y los asocia al HTML seguro; las llamadas `ComponentExample` tienen sus rangos MDX completos, con el desplazamiento original después del YAML y los imports. Los rangos se reconstruyen al editar. Una TreeTable importada completa corresponde a su declaración, no a las celdas de otro archivo; la sincronización por nodo llegará con la edición de su fuente. No se ejecuta MDX adicional.

### TreeTable inline editable

La sección [Ejemplo editable en directo](https://pablogonzalezruiz.github.io/AstroXmind/componentes/tree-table/#ejemplo-editable-en-directo) contiene un bloque `<TreeTable>` real, no importado como demo. El editor permite modificar sus nodos, propiedades y jerarquía: interpreta únicamente atributos literales conocidos y la lista Markdown, y reutiliza `tree-table-model.ts` para la validación, numeración, clases, filas y HTML. Los mismos estilos y `tree-table-client.ts` proporcionan plegado y pantalla completa en ambos contextos. No se evalúan expresiones JS ni imports del usuario. Los errores de sintaxis aparecen en la vista previa. Cada celda inline conserva su rango de origen para la sincronización por nodo. Las demos `ComponentExample` ya publicadas se mantienen como ejemplos de referencia sin editar sus archivos externos desde la página. La experimentación local es posible sin token, pero guardar sigue requiriendo la revisión GitHub verificada.

### Identificación y sincronización de revisiones

Cada guardado con cambios inserta un único comentario en el YAML inicial (no visible en lectura), con UUID de revisión, SHA del blob anterior y fecha ISO. El UUID también figura en el mensaje del commit. No se puede incluir el SHA del propio commit en sus bytes sin alterar ese SHA. El editor obtiene el SHA real de GitHub, vuelve a leer el archivo en ese commit y exige coincidencia exacta del contenido y del blob antes de confirmar en verde. Al abrir de nuevo consulta el último commit que modificó esa ruta y comprueba la marca y su contenido; si no corresponden, informa y la marca se renueva en el siguiente guardado, incluso si no se ha modificado el texto. Un guardado sin cambios y con marca vigente comprueba la revisión remota, sin generar commits vacíos. Un conflicto o fallo de comprobación muestra un aviso rojo y conserva el borrador. La publicación y la sincronización con GitHub se muestran por separado; una vez confirmada la publicación exacta, la sesión recuerda el SHA real en el lector.

### Historial integrado (aplazado)

Por decisión de Pablo, HIST-01 se realizará después del editor contextual, la reordenación del explorador y la evaluación del arrastre TreeTable. El prototipo de consulta y pruebas queda en el commit `96c2930`; se retira el menú integrado de la versión activa. Permanece el enlace al historial nativo de GitHub que ya existía. Véase [hoja de ruta](03-roadmap.md).

### Guardado y confirmación de publicación

Tras un PUT correcto, el editor confirma el commit, vuelve al lector y muestra «Publicando cambios…». `wiki-editor-publication.mjs` consulta cada cuatro segundos el HTML de la propia URL con una revisión en la consulta y sin caché local. Compara la fuente completa guardada con el textarea del documento publicado, sin ejecutar el HTML ni enviar el token de GitHub. Solo recarga al coincidir el documento y su contenido exacto, conservando el fragmento de navegación. Se cancela al volver a editar o salir de la página; nunca se recarga con cambios sin guardar. Tras tres minutos sin confirmación se conserva el enlace al commit y se ofrecen actualización manual y GitHub Actions. Guardado y publicación son estados distintos.

El 19-11-2026 Pablo guardó una TreeTable real en `34b56b9`; una regresión que dependía de la lista editable bloqueó el despliegue. La prueba usa ahora una fuente MDX de prueba independiente de la página editable. Se conserva su tabla y se añade otra lista para verificar el nuevo flujo.

### Teclado e indentación

En listas TreeTable con `-`, la convención editorial es dos espacios por nivel (no caracteres de tabulación). Dentro del textarea, Tab añade dos espacios al nodo o a las líneas seleccionadas; Mayús+Tab elimina hasta dos espacios iniciales. Enter continúa la lista con el mismo nivel y marcador (incrementa las listas ordenadas); Enter sobre un elemento vacío termina la lista. Esc seguido de Tab o Mayús+Tab libera una pulsación de navegación, sin cerrar el diálogo. Fuera del textarea Tab funciona normalmente. El módulo `wiki-editor-keys.mjs` emite el evento `input`, por lo que el resultado en directo y el estado de guardado se actualizan como al escribir.
