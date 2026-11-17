# Estado del proyecto

Actualización 17-11-2026. NAV-01/02/03 se integran en main por autorización expresa del usuario; fuente de código validada 238ce44. Publicación y evidencias: [registro](17-navigation-publication.md). Comprobar las ejecuciones asociadas al SHA actual antes de atribuirle un despliegue.

## Implementado

Astro + Starlight + MDX, TreeTable compartido con el laboratorio. Clases por nivel/nodo, anotaciones entre corchetes, numeración heredable y start local, corte de ruta tras padre sin número, plegado/folded, botón compacto, pestañas Resultado/Código, fullscreen centrado y scroll cuando no cabe.

NAV-01: identidad neutral, padre/orden, índice derivado y validación. NAV-02: migas arriba, árbol lateral y contexto de lectura. NAV-03: referencias a documento/apartado/nodo, resolución por ID al renderizar, validación del HTML real y revelado de caminos plegados/pestañas con foco y resaltado. DocumentNavigator detecta la página y muestra padre/hermanos/hijos/anterior/siguiente; árbol completo opcional.

Diez páginas de contenido: cuatro originales, Navegación, serie y cuatro artículos ficticios. Los cinco archivos de prueba comparten carpeta; la jerarquía lógica se expresa solo por parent/order. [Demostración](https://pablogonzalezruiz.github.io/AstroXmind/navegacion/), con tres ejemplos Resultado/Código. No se publica temario ni normativa; GitHub/historial son públicos.

## Validación

48 pruebas previas: 32 de árbol/referencias, 15 HTML/DOM y una integración de dos builds con caché. Astro check sin errores/avisos; laboratorio ci/check/build correcto. Destino eliminado, ID de apartado duplicado e ID de tabla duplicado rechazados en builds negativos. Los workflows de main vuelven a ejecutar check/build según sus pasos. Ver auditoría NAV-03 y ejecuciones actuales.

No hay revisión visual completa; DOM/build no acreditan layout, scroll real, fullscreen nativo ni táctil. La nueva dependencia jsdom es solo de pruebas raíz.

## Pendiente

NAV-04: enlaces entrantes/salientes automáticos con contexto y salto al punto de cita. Requiere autorización. Después NAV-05…08: retorno exacto, impresión/HTML offline, consulta lateral y grafo opcional. Summary/Boundary aplazados; biblioteca al final. La autorización de esta entrega no permite iniciar NAV-04 ni PR/releases.
