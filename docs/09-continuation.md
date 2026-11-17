# Punto de reanudación

Estado contrastado el 17-11-2026 sobre main `5f1a33ff7a846a42914f33be61782adb0e5f8452`. Esta revisión parte del SHA publicado indicado y añade NAV-01/02 en la rama feature/nav-01-document-tree, sin cambiar main ni publicar.

Leer AGENTS.md, estado, hoja de ruta, contrato TreeTable y docs/13-navigation-phase.md. Consultar HEAD remoto antes de actuar.

## Próximo paso

NAV-01/02 están autorizados, implementados y validados en feature/nav-01-document-tree. Ver docs/14-navigation-contract.md y docs/15-contextual-navigation.md. No repetirlos ni pedir de nuevo su autorización. La rama no está integrada ni publicada. NAV-03 es el siguiente paso: referencias estables a documentos, apartados y nodos de TreeTable; explicar y solicitar autorización antes de implementarlo.

El usuario pidió que el resultado incluyera artículos en documentos distintos guardados en una misma carpeta pero representados en jerarquía lógica. Ya existen serie.md y articulo-1…4.md en src/content/docs/pruebas-jerarquia/: serie → artículo 1 → artículo 2 → artículo 3; artículo 4 bajo serie. IDs doc-000005…9. Prueba real de traslado del artículo 2 bajo artículo 4 correcta; estado original restaurado.

No cambiar main, abrir/fusionar PR ni publicar release por esta autorización. Summary/Boundary aplazados y biblioteca al final. Las capacidades TreeTable existentes permanecen intactas.

## Fuentes

- src/content.config.ts: docsLoader/docsSchema extendido con navigation en esta rama.
- src/lib/navigation y scripts/navigation*.mjs: registro, validación y asignación de IDs.
- navigation-ids.json: registro permanente de IDs emitidos.
- src/content/docs: cuatro páginas originales y cinco documentos de prueba en rama, separados de docs/ de mantenimiento.
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

La rama contiene NAV-01/02, artículos de prueba y documentación; no main, PR, release ni despliegue. Las futuras autorizaciones deben respetar el alcance solicitado. Mantener informes históricos intactos. StackBlitz no sincroniza automáticamente con GitHub.

Fuentes NAV-02: src/navigation-middleware.ts, src/components/navigation/, src/lib/navigation/context.mjs y types.ts, módulo virtual de scripts/navigation-integration.mjs. Validación HTML persistente: tests/navigation-rendered.test.mjs, ejecutada al terminar npm run build. No hay enlaces publicados a los artículos todavía.
