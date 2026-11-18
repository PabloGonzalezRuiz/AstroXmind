# Borradores de la wiki en GitHub

El editor público actual conserva los borradores en el navegador. La candidata añade autenticación mediante GitHub App y guardado en una rama de borradores. Es compatible con el mismo editor una vez desplegado el servicio.

## Alcance

Una cuenta autorizada por ID numérico puede abrir y guardar `editor-drafts/preview.md` en `editor/drafts` del repositorio AstroXmind. Es un documento de prueba fuera del árbol de contenido. La rama guarda una revisión real en GitHub y el enlace de confirmación abre ese archivo. Si el repositorio es público, cualquier persona con acceso público al repositorio puede leer esa rama de borradores. Usa texto de prueba.

El servicio usa el token de usuario de una GitHub App, valida el estado y PKCE durante OAuth y guarda el token en memoria del servidor. La cookie de sesión es opaca, HttpOnly, Secure y caduca en un máximo de 30 minutos. El guardado valida el origen y compara el SHA del borrador antes de escribir. La llamada a GitHub también usa el SHA para detectar escrituras simultáneas. Un conflicto conserva el texto actual en el editor.

## Activación pendiente

1. Provisionar un alojamiento HTTPS con Node y un proxy para servir la compilación Astro y enviar `/AstroXmind/editor-api/*` al mismo origen. GitHub Pages sirve contenido estático; el servicio necesita un alojamiento propio.
2. Registrar una GitHub App limitada a AstroXmind con permiso de repositorio **Contents: read and write**. Instalarla solo en ese repositorio y configurar la URL de callback como `ORIGEN_HTTPS/AstroXmind/editor-api/callback`.
3. Crear la rama `editor/drafts` una sola vez. Configurar en el servidor `WIKI_EDITOR_ORIGIN`, `GITHUB_APP_CLIENT_ID`, `GITHUB_APP_CLIENT_SECRET` y `WIKI_EDITOR_USER_ID`. Introducir el secreto en el gestor del alojamiento.
4. Ejecutar `node server/wiki-editor-github.mjs`, que escucha en loopback, puerto 8788. Compilar ese despliegue con `PUBLIC_WIKI_EDITOR_GITHUB=true`. La wiki estática habitual mantiene sus controles locales.
5. Abrir `/AstroXmind/editar-prueba/`, iniciar sesión, abrir el borrador y hacer un guardado. Verificar el archivo y SHA en GitHub, reabrirlo y provocar un conflicto entre dos pestañas. La rama de borradores no activa el despliegue de Pages.

El prototipo usa sesiones en memoria para una sola instancia. Reiniciar el servicio caduca la sesión y el usuario puede volver a autenticarse. El guardado local sirve para mantener el texto durante el salto a GitHub.

## Comprobación de la candidata

`node --test tests/wiki-editor-github.test.mjs` comprueba el recorrido con respuestas simuladas de GitHub. Incluye usuario sin sesión, estado OAuth incorrecto o repetido, cookie opaca, rechazo de otro origen, ruta y rama fijas, recuperación del borrador y conflicto. La prueba real requiere la activación anterior. La prueba de edición con TreeTable compleja sigue después del guardado real.

Referencias oficiales: [inicio de sesión con GitHub App](https://docs.github.com/en/apps/creating-github-apps/writing-code-for-a-github-app/building-a-login-with-github-button-with-a-github-app) y [API de archivos](https://docs.github.com/en/rest/repos/contents).
