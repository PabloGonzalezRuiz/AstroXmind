# Punto de reanudación

Actualización 17-11-2026: integración autorizada de NAV-01/02/03 en main, desde el código validado 238ce44. Ver docs/17-navigation-publication.md y las ejecuciones del SHA actual para la evidencia de despliegue.

Leer AGENTS.md, estado, hoja de ruta, contrato TreeTable y docs/13-navigation-phase.md. Consultar HEAD remoto antes de actuar.

## Próximo paso

NAV-01/02/03 están autorizados e implementados en feature/nav-01-document-tree. Leer contratos docs/14, 15 y 16. No repetirlos ni pedir de nuevo su autorización. La integración/publicación de esta entrega fue autorizada; consultar docs/17-navigation-publication.md y los runs del SHA actual. NAV-04 es el siguiente paso: citas salientes y backlinks automáticos con contexto y salto al punto de cita; explicar y solicitar autorización antes de implementarlo.

El usuario pidió un apartado Navegación en la wiki con demostración y un componente que conozca su ubicación, con migas arriba y navegación entre páginas abajo. Preparado en src/content/docs/navegacion.mdx (doc-000010, padre inicio); demo Resultado/Código de DocumentNavigator y tabla plegada, referencias entre artículos y nodo. La serie ahora tiene parent doc-000010; sus archivos siguen juntos. DocumentNavigator al pie muestra padre/hermanos/hijos/recorrido; el árbol completo queda en el lateral y en el ejemplo del componente.

El usuario pidió que el resultado incluyera artículos en documentos distintos guardados en una misma carpeta pero representados en jerarquía lógica. Ya existen serie.md y articulo-1…4.md en src/content/docs/pruebas-jerarquia/: serie → artículo 1 → artículo 2 → artículo 3; artículo 4 bajo serie. IDs doc-000005…9. Prueba real de traslado del artículo 2 bajo artículo 4 correcta; estado original restaurado.

El usuario autorizó actualizar main y desplegar esta entrega, sin PR ni release; no ampliar esa autorización a futuras fases. Summary/Boundary aplazados y biblioteca al final. Las capacidades TreeTable existentes permanecen intactas.

## Fuentes

- src/content.config.ts: docsLoader/docsSchema extendido con navigation en esta rama.
- src/lib/navigation y scripts/navigation*.mjs: registro, validación y asignación de IDs.
- navigation-ids.json: registro permanente de IDs emitidos.
- src/content/docs: cuatro páginas originales, cinco documentos de prueba y la nueva sección Navegación en rama, separados de docs/ de mantenimiento.
- examples/astro-component-lab/src/components/TreeTable.astro: fuente compartida wiki/laboratorio.
- src/examples y src/components/ComponentExample.astro: demos y pestañas.
- docs/13-navigation-phase.md: alcance concreto y aceptación de NAV-01.

## Evidencia publicada

SHA auditado: `5f1a33ff7a846a42914f33be61782adb0e5f8452`.

- [CI 44050305122 — éxito](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44050305122).
- [Wiki Build 44050305118 — éxito](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44050305118).
- [Pages Deploy 44050305192 — éxito](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44050305192).

La validación anterior incluyó builds de wiki/laboratorio, comprobaciones DOM dirigidas y lectura de la página/estilos publicados. No hubo revisión visual completa de navegador para las últimas mejoras; fullscreen nativo se probó con API simulada. CI acredita tipos/build, no accesibilidad visual ni ausencia de vulnerabilidades.

## Límites operativos

NAV-01/02/03, artículos y documentación se integran en main en esta entrega autorizada; no PR ni release. Las futuras autorizaciones deben respetar el alcance solicitado. Mantener informes históricos intactos. StackBlitz no sincroniza automáticamente con GitHub.

Fuentes NAV-02: src/navigation-middleware.ts, src/components/navigation/, src/lib/navigation/context.mjs y types.ts, módulo virtual de scripts/navigation-integration.mjs. Validación HTML persistente: tests/navigation-rendered.test.mjs, ejecutada al terminar npm run build. Enlaces de la entrega y procedimiento de comprobación en docs/17-navigation-publication.md.

Fuentes NAV-03: scripts/remark-document-references.mjs, src/lib/navigation/references.mjs y rendered-references.mjs, DocLink.astro, override MarkdownContent, scripts/reference-validation.mjs y reference-client.mjs. Mantener resolución al renderizar: la prueba de renombrado detectó URLs antiguas del caché de Markdown; no basta el plugin Remark. TreeTable.revealTarget conserva acceso a celdas desprendidas del DOM. jsdom está en devDependencies raíz, con lockfile; no toca paquetes del laboratorio. Prueba de reconstrucción: npm run test:references:rebuild.
