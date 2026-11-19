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

El editor de página separa lectura y edición mediante el menú Acciones. Editar documento abre un diálogo a pantalla completa con modos Markdown, Dividido y Resultado, herramientas de formato, guardado y cierre. Ver código fuente muestra la fuente completa de la versión publicada y el historial enlaza a los commits de su archivo. El lector sigue mostrando el HTML estático de Astro hasta que finaliza el siguiente despliegue. La vista previa Markdown no ejecuta MDX; la previsualización fiel de TreeTable sigue pendiente. La rama de borradores anterior permanece como evidencia histórica.

Referencias: [tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens), [API Contents](https://docs.github.com/en/rest/repos/contents), [investigación](26-astro-editing-patterns.md).
