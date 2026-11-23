# PRIVATE-01 · Acceso al menú de gestión documental

Aceptación de Pablo: el desplegable de hamburguesa publicado en `e33e77e` ya aparece. Ajuste solicitado: un único enlace **Procesado de Temarios** en el grupo autorizado; eliminar Configuración de GitHub duplicada y estado «Conexión autorizada». Mantener diagnóstico cuando no hay autorización. La configuración continúa disponible en la cabecera. Pendiente publicación de este ajuste.

Corrección propuesta 23-11-2026: botón de hamburguesa general a la izquierda del título (visible siempre), desplegable con Configuración de GitHub y diagnóstico de conexión. Solo la sección Área privada y Gestión documental aparecen con identidad autorizada. Se elimina el duplicado del árbol lateral. El diagnóstico distingue token ausente, inválido, identidad distinta y fallo de conexión sin mostrar credenciales. El usuario informó que no veía el acceso en la primera publicación `f6c536e`. La corrección se prepara en `fix/menu-privado-hamburguesa`, pendiente publicación/aceptación.

Estado 23-11-2026: candidata en rama `feature/private-01`, no publicada. Se prepara la primera parte de la fase 00: menú y entrada sin datos privados. Base main `91c56aceba66a91e33bc7cab9fb90f8e919bd2cb`; CI, Wiki Build y Pages correctos en esa base.

## Contrato

- Reutiliza el token de grano fino configurado en el editor. No se piden credenciales nuevas ni se amplían permisos.
- El menú Área privada permanece oculto inicialmente, hasta que GitHub confirme la identidad autenticada y esta corresponda al ID estable autorizado de la cuenta propietaria. No basta con consultar una rama de un repositorio público.
- Validación en cada entrada, retorno/foco, cambio del token en la pestaña o entre pestañas, y periódicamente mientras la página sea visible. Fallos de red, token inválido y otra identidad ocultan el menú y el panel. Resultados atrasados de una validación no restauran una sesión eliminada.
- La ruta `/AstroXmind/privado/` es únicamente una carcasa pública sin datos privados; al entrar directamente muestra acceso restringido hasta validar identidad. No se representa una denegación visual como autorización de servidor.
- La fase 00 no estará cerrada hasta comprobar el acceso real desde el navegador de Pablo y definir un almacenamiento protegido para CALL-01. GitHub Pages de este repositorio es público; no incluir documentos, nombres privados, índices, artefactos, credenciales ni metadatos privados en su build o repositorio. Las operaciones futuras deberán comprobar permisos en el servicio que almacena los datos. No crear repositorios adicionales ni modificar permisos sin acuerdo.

## Prueba propuesta tras autorización de publicación

1. Abrir la wiki sin token: no aparece Área privada en cabecera ni árbol. La ruta de entrada directa muestra acceso restringido.
2. Configurar el token existente y comprobar conexión; Área privada aparece solo para la cuenta autorizada. Abrir Gestión documental; se muestra confirmación, sin convocatorias ni datos privados.
3. Olvidar el token, probar token inválido/revocado y repetir en otra pestaña. Se oculta el menú y el panel. No divulgar tokens, ni introducirlos en URLs.
4. Confirmar alcance de almacenamiento privado antes de CALL-01. No crear convocatoria ni avanzar a F00 todavía.

Pruebas automatizadas: tests/wiki-editor.test.mjs cubre identidad distinta, ausencia de token, revocación simulada, cambio de token, entrada directa, error de red y respuesta obsoleta. No acredita autorización real de un almacén inexistente. Sin nuevas dependencias.

Referencias oficiales: [usuario autenticado](https://docs.github.com/en/rest/users/users#get-the-authenticated-user), [publicación estática de Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
