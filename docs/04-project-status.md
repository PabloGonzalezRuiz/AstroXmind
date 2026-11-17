# Estado del proyecto

Estado contrastado el 17-11-2026 sobre main `5f1a33ff7a846a42914f33be61782adb0e5f8452`. Esta revisión parte del SHA publicado indicado y añade NAV-01/02/03 en la rama feature/nav-01-document-tree, sin cambiar main ni publicar.

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

NAV-01: IDs estables y árbol validado. NAV-02: migas arriba, árbol lateral y contexto de lectura. NAV-03: referencias por identidad a documento/apartado/nodo; resolución de URL al renderizar, validación de destinos reales y revelado de caminos plegados/pestañas con foco y resaltado.

DocumentNavigator es el componente reutilizable que detecta la página y muestra padre, hermanos, hijos y anterior/siguiente. El ejemplo muestra también el árbol completo. Apartado Navegación: src/content/docs/navegacion.mdx, accesible localmente en /AstroXmind/navegacion/. Demostraciones Resultado/Código y enlaces guiados entre artículos y una tabla plegada. La serie queda bajo Navegación; sus cinco archivos permanecen juntos en pruebas-jerarquia/. Diez páginas de contenido en rama, frente a cuatro en Pages.

Validación y límites en docs/16-document-references.md y audits/2026-11-17-nav-03-validation.md. Pruebas persistentes de árbol, referencias, caché, HTML y DOM con bundles reales de TreeTable/Starlight. Sin revisión visual completa; Chromium no pudo iniciarse en este entorno. No se han ejecutado nuevos Actions ni desplegado la rama.

## Pendiente

NAV-04: enlaces entrantes/salientes automáticos con contexto y salto al punto de cita. Requiere autorización. Después NAV-05…08: retorno, impresión/HTML offline, consulta lateral y grafo opcional. Summary/Boundary aplazados; biblioteca al final. Main y Pages conservan el estado publicado indicado arriba.
