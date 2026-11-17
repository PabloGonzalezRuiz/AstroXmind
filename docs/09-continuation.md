# Punto de reanudación

Estado contrastado el 17-11-2026 sobre main `5f1a33ff7a846a42914f33be61782adb0e5f8452`. Esta revisión parte del SHA publicado indicado y añade NAV-01 en rama de desarrollo, sin cambiar main.

Leer AGENTS.md, estado, hoja de ruta, contrato TreeTable y docs/13-navigation-phase.md. Consultar HEAD remoto antes de actuar.

## Próximo paso

NAV-01 fue autorizado e implementado en feature/nav-01-document-tree. Ver docs/14-navigation-contract.md. No repetir ese código ni volver a pedir autorización para NAV-01. Las comprobaciones locales han pasado; la rama no se ha integrado ni publicado. NAV-02 es el siguiente paso: ruta de ubicación, padre/hijos y anterior/siguiente derivados del registro; explicar y solicitar autorización antes de implementarlo.

No cambiar main, abrir/fusionar PR ni publicar release por esta autorización. Summary/Boundary aplazados y biblioteca al final. Las capacidades TreeTable existentes permanecen intactas.

## Fuentes

- src/content.config.ts: docsLoader/docsSchema extendido con navigation en esta rama.
- src/lib/navigation y scripts/navigation*.mjs: registro, validación y asignación de IDs.
- navigation-ids.json: registro permanente de IDs emitidos.
- src/content/docs: las cuatro páginas públicas, separadas de docs/ de mantenimiento.
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

La rama de este encargo contiene solo documentos; no main, PR, release ni despliegue. Las futuras autorizaciones deben respetar el alcance solicitado. Mantener informes históricos intactos. StackBlitz no sincroniza automáticamente con GitHub.
