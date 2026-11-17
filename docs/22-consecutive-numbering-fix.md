# Corrección de numeración consecutiva — 17-11-2026

Base: main f9272968aaff825baf969d6673fb6c328799074d. El usuario mostró que los prefijos 10, 10.10 y 30.30 eran incorrectos. Se había confundido order (posición editorial con huecos) con número visible. El usuario autorizó continuar hasta corregirlo, publicarlo y actualizar estado, sin otra petición de permiso. No PR/release ni NAV-04.

## Regla final

Cada padre ordena sus hijos como antes: order explícito primero; empates y pendientes por fechas created/modified declaradas en YAML con milisegundos, después ID. Sobre los hijos ya ordenados, los valores distintos de order reciben ordinales consecutivos desde 1. Duplicados comparten ordinal, no consumen números adicionales por fecha. Ejemplo: orders 10,10,30,90 → números 1,1,2,3.

La ruta hereda ordinales del padre. Order omitido no recibe número ni consume ordinal; conserva la marca pendiente. Un padre pendiente rompe la ruta, y un hijo ordenado reinicia con su ordinal local. La raíz única no muestra número. No se editan el YAML existente, los títulos, los IDs o las URLs para conseguir la corrección.

Árbol real: Clases 1, TreeTable 1.1, Laboratorio 2, Navegación 3, Serie 3.1, Artículos 1/2/3 en 3.1.1/3.1.1.1/3.1.1.1.1 y Artículo 4 en 3.1.2.

## Validación

Se actualizan las expectativas anteriores que copiaban order literalmente y se añaden pruebas independientes de los números esperados en el árbol real y en el sidebar HTML. La regresión de integración mantiene hermanos duplicados con fechas separadas por 1 ms y pendientes al final; exige que los duplicados muestren 3.1.1.

Ejecutar check (43 pruebas y Astro), build (16 HTML/DOM), test:navigation:ordering (una compilación en temporal) y test:references:rebuild (dos builds con caché). Total 61. Sin nuevas dependencias ni cambios de workflows, schemaVersion/estructura, fechas YAML o TreeTable. No se declara inspección visual completa a partir del DOM.

## Publicación

La entrega corrige código y documentación antes de actualizar main. El push autorizado activa CI, Wiki Build y Pages. Consultar sus runs por el SHA nuevo y comprobar HTTP/HTML/JSON antes de comunicar éxito. El registro de la publicación anterior es histórico, no prueba de esta corrección.

[Demostración](https://pablogonzalezruiz.github.io/AstroXmind/navegacion/) y [navigation.json](https://pablogonzalezruiz.github.io/AstroXmind/navigation.json). Confirmar 1,1.1,2,3,3.1 y la coherencia de las etiquetas en los diez documentos, además de las catorce referencias. Estado operativo en docs/04-project-status.md; contrato actual en docs/20-navigation-ordering.md. Los informes históricos previos se conservan intactos.
