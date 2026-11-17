# Estado del proyecto

Estado contrastado el 17-11-2026 sobre main `5f1a33ff7a846a42914f33be61782adb0e5f8452`. Esta revisión solo cambia documentación en una rama separada.

## Implementado y publicado

Astro + Starlight + MDX. Cuatro páginas públicas de contenido: inicio, guía, TreeTable y laboratorio. No se publica temario; GitHub/historial siguen públicos.

- AST-017: clases por nivel/nodo.
- AST-022: anotaciones entre corchetes sin escapes.
- AST-025/028: plegado heredable y folded inicial, botón compacto.
- AST-026/031: numeración heredable, start local y corte de ruta tras padre sin número.
- AST-030: 11 demostraciones con pestañas Resultado/Código y fuente única ?raw.
- AST-032/033: pantalla completa, centrado y scroll cuando no cabe.

[TreeTable publicado](https://pablogonzalezruiz.github.io/AstroXmind/componentes/tree-table/).

## Evidencia publicada

SHA auditado: `5f1a33ff7a846a42914f33be61782adb0e5f8452`.

- [CI 44050305122 — éxito](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44050305122).
- [Wiki Build 44050305118 — éxito](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44050305118).
- [Pages Deploy 44050305192 — éxito](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44050305192).

La validación anterior incluyó builds de wiki/laboratorio, comprobaciones DOM dirigidas y lectura de la página/estilos publicados. No hubo revisión visual completa de navegador para las últimas mejoras; fullscreen nativo se probó con API simulada. CI acredita tipos/build, no accesibilidad visual ni ausencia de vulnerabilidades.

## Planificado, no implementado

Fase Navegación AST-034/NAV-01…08: primera prioridad de la hoja de ruta. IDs documentales, parent/order, árbol contextual, referencias a nodos, backlinks, retorno, impresión/HTML offline de ramas, consulta lateral y grafo opcional. El esquema actual usa docsSchema() sin estos campos personalizados y aún no hay registro jerárquico.

Siguiente acción: explicar NAV-01 y solicitar autorización de implementación. Summary/Boundary aplazados; biblioteca al final. Este encargo solo actualiza documentación y no cambia main ni publica web.
