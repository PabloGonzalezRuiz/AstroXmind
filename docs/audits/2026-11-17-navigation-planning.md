# Planificación y consolidación documental — 17-11-2026

Estado contrastado el 17-11-2026 sobre main `5f1a33ff7a846a42914f33be61782adb0e5f8452`. Esta revisión solo cambia documentación en una rama separada.

## Evidencia publicada

SHA auditado: `5f1a33ff7a846a42914f33be61782adb0e5f8452`.

- [CI 44050305122 — éxito](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44050305122).
- [Wiki Build 44050305118 — éxito](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44050305118).
- [Pages Deploy 44050305192 — éxito](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44050305192).

La validación anterior incluyó builds de wiki/laboratorio, comprobaciones DOM dirigidas y lectura de la página/estilos publicados. No hubo revisión visual completa de navegador para las últimas mejoras; fullscreen nativo se probó con API simulada. CI acredita tipos/build, no accesibilidad visual ni ausencia de vulnerabilidades.

## Encargo

Listar funciones viables inspiradas en Obsidian, crear fase Navegación primero en roadmap, actualizar documentación y explicar/pedir autorización para el primer paso. Se entrega planificación sin código, integración main, PR o release.

## Resultado

Actualizados documentos operativos, contrato y manual, con diseño docs/13 y ADR-003. Eliminadas contradicciones que seguían diciendo que folded/pestañas/fullscreen no estaban publicados. Todas las funciones NAV quedan pendientes; NAV-01 será el primer paso a autorizar.

El código actual usa docsSchema() sin navigation; no hay jerarquía editorial, backlinks o exportador de ramas. La nueva prioridad reemplaza recomendaciones antiguas de empezar por AST-029. La robustez necesaria se comprueba en cada NAV; no se omite por esa reordenación.

Los informes previos de docs/audits y ADR anteriores se mantienen intactos como historia. Solo documentación vigente se consolida. Comprobar enlaces locales y diff antes de guardar; no se requieren builds adicionales para este cambio Markdown fuera de las páginas publicadas.
