# Punto de reanudación

Estado contrastado el 17-11-2026 sobre main `5f1a33ff7a846a42914f33be61782adb0e5f8452`. Esta revisión solo cambia documentación en una rama separada.

Leer AGENTS.md, estado, hoja de ruta, contrato TreeTable y docs/13-navigation-phase.md. Consultar HEAD remoto antes de actuar.

## Próximo paso

El usuario ha pedido planificación y actualización documental, y después explicación y autorización para cada paso. **No implementar NAV-01 antes de su autorización.** NAV-01 añade identidad/padre/orden y registro validado a las cuatro páginas actuales, sin UI ni exportador. Al cerrar, explicar NAV-02 y solicitar permiso para ese paso.

Navegación es primera fase. Summary/Boundary quedan aplazados y biblioteca AST-027 sigue al final. Estado inicial folded, pestañas y pantalla completa ya están publicados; no volver a tratarlos como pendientes.

## Fuentes

- src/content.config.ts: docsLoader/docsSchema actual sin bloque navigation.
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
