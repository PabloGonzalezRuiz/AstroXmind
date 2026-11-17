# Validación NAV-03 — 17-11-2026

Base: NAV-02 e39254b033dd5ad5771aa39772024dbcafc062ae, rama feature/nav-01-document-tree. El usuario autorizó NAV-03 y pidió una sección Navegación con demostración y un componente que lea su ubicación, con migas arriba y navegación entre páginas abajo. Sin autorización de publicación/main/PR/release.

## Entregado

Referencias doc:doc-000001 y doc:doc-000001#ref-nombre en Markdown y DocLink MDX. IDs locales explícitos en apartados y TreeTable, opcionales y no heredables; validación de destino real/duplicados/URL y references.json. Revelado de celdas desprendidas del DOM por plegado, selección de panel Starlight, detalles antecesores, foco/resaltado y repetición del mismo hash.

DocumentNavigator detecta contexto y agrupa padre/hermanos/hijos/anterior/siguiente; árbol completo opcional dentro del componente. Migas arriba, árbol lateral y navegador al pie. Nueva página Navegación doc-000010 con tres demos Resultado/Código (fuente única ?raw) y prueba guiada por los artículos. La serie conserva sus cinco archivos en la misma carpeta y pasa bajo Navegación. Diez páginas de contenido en rama, cuatro publicadas.

## Hallazgo y corrección de caché

El primer renombrado real detectó HTML Markdown cacheado por Astro con la URL anterior, aunque la referencia conservaba su ID. La validación bloqueó ese build por URL divergente. Se añadió resolución por identidad en cada render de MarkdownContent, además del paso Remark. No se desactivó la validación ni se requirió borrar el caché para renombrar.

Regresión persistente: test:references:rebuild crea copia temporal, realiza build, renombra solo el archivo del Artículo 2, repite build con el mismo caché y comprueba referencias/ID/padre. Pasa. Prueba adicional dev: la referencia desde Artículo 1 sigue al archivo renombrado y restaurado sin reiniciar el servidor; archivos y servidor restaurados/cerrados al acabar.

## Comprobaciones locales

- npm run check: 32 pruebas de árbol/referencias y Astro check sin errores/avisos.
- npm run build: diez documentos y 404, navigation.json/references.json; doce pruebas de HTML y tres de DOM, todas correctas.
- npm run test:references:rebuild: una prueba de integración, dos builds reales con caché persistente, correcta. Total 48 pruebas persistentes ejecutadas.
- Tres casos negativos de build real: destino ref-desarrollo eliminado, ID repetido en un apartado y anotación de nodo repetida en TreeTable; todos fallan como se espera. Fuentes restauradas antes del build final válido.
- DOM: jsdom ejecuta bundles compilados reales de TreeTable y Starlight Tabs. Se comprueban foco y estado del DOM: nodo desprendido recuperado, solo antecesores abiertos, rama ajena cerrada, Código → Resultado, hash directo y repetido, hash mal formado. Unicidad y no herencia de IDs comprobadas en el HTML generado.
- Laboratorio compartido: npm ci, npm run check y npm run build correctos; su lockfile/paquetes no se cambian.
- git diff --check correcto.

jsdom 26.1.0 se añade a devDependencies raíz y lockfile para pruebas persistentes; sin nueva dependencia de cliente ni de laboratorio. Chromium falla al arrancar por restricciones socket/ptrace del entorno. No hay inspección visual completa ni prueba de scroll real, fullscreen nativo o táctil; jsdom no acredita esas coberturas.

## Publicación y continuidad

Cambios guardados solo en la rama autorizada, sin nuevos Actions, despliegues, PR ni releases. Main conserva 5f1a33ff7a846a42914f33be61782adb0e5f8452. La demostración no se presenta como ya disponible en Pages. Documentación operativa y contrato NAV-03 actualizados; informes históricos intactos. NAV-04 (enlaces entrantes/salientes automáticos con contexto) pendiente de autorización.
