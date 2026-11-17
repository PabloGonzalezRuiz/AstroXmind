# Estado del proyecto

Estado contrastado el 17-11-2026 sobre main `5f1a33ff7a846a42914f33be61782adb0e5f8452`. Esta revisión parte del SHA publicado indicado y añade NAV-01/02 en la rama feature/nav-01-document-tree, sin cambiar main ni publicar.

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

## Implementado en rama, sin publicar

NAV-01: IDs estables, padre/orden, validación y registro derivado. NAV-02: ruta de ubicación, padre, hijos, anterior/siguiente en preorden y árbol lateral con página actual. Todo se deriva del mismo YAML, incluidas la portada y la serie de prueba.

Nueve páginas en la rama: las cuatro publicadas más una serie y cuatro artículos ficticios. Todos los nuevos documentos comparten src/content/docs/pruebas-jerarquia/. Cambiar solo el parent del Artículo 2 mueve también el Artículo 3 bajo el Artículo 4 sin cambiar archivos ni URLs. Contrato: docs/15-contextual-navigation.md.

Comprobaciones locales: 26 pruebas de árbol/contexto, Astro check sin errores ni avisos, build y 10 pruebas del HTML generado. Traslado real de rama y actualización en servidor dev verificados; restaurada la jerarquía inicial. Sin revisión visual completa en navegador. No se han ejecutado Actions nuevos ni publicado esta rama.

## Pendiente

NAV-03…08: referencias estables a documentos/apartados/nodos, backlinks, retorno, impresión/HTML offline de ramas, consulta lateral y grafo opcional. Siguiente acción: explicar NAV-03 y solicitar autorización. Summary/Boundary aplazados; biblioteca al final. Main y Pages conservan el estado publicado indicado arriba.
