# Editor de AstroXmind en GitHub Pages

La alternativa de guardado directo mantiene la compilación Astro estática. El navegador llama a la API de contenidos de GitHub con un token personal de grano fino de duración limitada. La GitHub App del candidato anterior y ChatGPT Sites siguen disponibles como alternativas.

## Preparación y prueba

1. Crear la rama `editor/drafts` desde main, una sola vez. No contiene publicaciones nuevas inicialmente.
2. Publicar la versión aprobada del editor en GitHub Pages.
3. Abrir https://github.com/settings/personal-access-tokens/new y elegir Resource owner `PabloGonzalezRuiz`, acceso Only select repositories → `AstroXmind`, permiso Contents Read and write, caducidad corta. No activar Workflows ni otros permisos.
4. En https://pablogonzalezruiz.github.io/AstroXmind/editar-prueba/#guardado-en-github introducir el token en el campo del editor, pulsar Conectar y abrir borrador, editar texto de prueba y pulsar Guardar en GitHub.
5. Abrir el enlace al commit, comprobar el archivo `editor-drafts/preview.md` en `editor/drafts`, desconectar y volver a abrirlo con un token válido.

El token reside en memoria del navegador durante la sesión y se borra del campo tras pulsar Conectar. No se incluye en la URL, el borrador, el código ni el almacenamiento local o de sesión. Desconectar o cerrar/recargar la página termina su uso; revocarlo en GitHub invalida el token. GitHub concede Contents a nivel de repositorio, no de rama. El editor limita sus llamadas a una ruta y rama fijas. El repositorio público implica que los borradores son públicos. La API compara el SHA anterior para detectar conflictos; tras un fallo de escritura el usuario debe reabrir el borrador antes de reintentar.

La prueba automatizada simula las respuestas de GitHub. La prueba real requiere un token generado por Pablo y un guardado explícito. TreeTable compleja queda como siguiente ampliación del editor.

Referencias: [tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens), [API Contents](https://docs.github.com/en/rest/repos/contents), [investigación](26-astro-editing-patterns.md).
