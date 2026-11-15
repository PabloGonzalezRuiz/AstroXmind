# AST-009 · Wiki privada y app web para iPhone — 2026-11-15

## Resultado
Publicación privada verificada: https://astroxmind-pablo.mixedclef8.chatgpt.site
Proyecto Sites: appgprj_6af97185a1d48191b9fc5f6eae308de5
Versión guardada: appgprj_6af97185a1d48191b9fc5f6eae308de5~appgver_b265c65e2d3081918a0343bdbe8a6ae9
Despliegue: appgdep_6af9727cd2648191a97d69a4437c786e; resultado succeeded.
Fuente de publicación: commit ec3f7484899fcb2beed9b4fedb5ef7ff8eacb8e2 en el repositorio de fuente de Sites.

El control de acceso fue leído antes de publicar: propietario como único usuario permitido, ningún grupo ni visitante externo. El navegador sin sesión recibió “Log in to access”, sin contenido de la wiki. La publicación contiene la estructura Astro/Starlight de la rama content/tai-practicos-fusion y sus 22 apartados de prácticos, junto con la adaptación móvil.

## Implementación
- manifest.webmanifest con display standalone, nombre AstroXmind, start_url y scope ajustados al alojamiento.
- Iconos PNG 180, 192 y 512 generados desde coordenadas con Node/zlib, sin nuevas dependencias.
- Metadatos apple-touch-icon, apple-mobile-web-app-capable y theme-color.
- Guía /iphone/ y acceso desde portada.
- Fuente GitHub conserva base /AstroXmind; la copia de Sites usa raíz / y su dominio propio.
- No se ha añadido service worker ni soporte sin conexión. No hay sincronización automática GitHub→Sites.
- main, PR #1 y el backup histórico no se han modificado; no hay tag/release nueva.

## Validaciones
Astro check: cero errores/warnings/hints en ambas variantes. Build: éxito, 12 páginas. Manifiesto e iconos verificados. Navegación real de portada a prácticos, cuaderno y solución comprobada en preview. Eliminados IDs duplicados en soluciones y reparado formato de traza Java/explicación PHP detectado en esa revisión. El control estático posterior comprueba que los IDs HTML no se repiten y los enlaces a prácticos resuelven sus fragmentos.

No se ha instalado en un iPhone real ni probado un inicio de sesión del usuario desde standalone: el usuario debe abrir el enlace en Safari, entrar con su cuenta de ChatGPT y usar Compartir → Añadir a pantalla de inicio → Abrir como app web.

## Actualizaciones futuras
Para modificar esta publicación, reutilizar project_id appgprj_6af97185a1d48191b9fc5f6eae308de5, obtener su acceso/fuente mediante Sites y abrir ese repositorio con el helper. No crear otro Site. La identidad está en .openai/hosting.json en la fuente de Sites. SOURCE.md identifica el origen GitHub y la adaptación de rutas. Incorporar cambios desde GitHub de forma explícita y volver a comprobar compilación/enlaces antes de publicar con la misma audiencia privada.

Referencias: https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html y https://starlight.astro.build/reference/configuration/ .
