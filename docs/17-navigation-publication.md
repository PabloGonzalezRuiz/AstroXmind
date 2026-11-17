# Integración y publicación de Navegación — 17-11-2026

El usuario autorizó explícitamente actualizar main y desplegar NAV-01/02/03 y su demostración, sin PR ni release. Código revisado/validado en 238ce44e50047db6d2465ec70ac86b1da2d71b36; base main anterior 5f1a33ff7a846a42914f33be61782adb0e5f8452. La integración conserva ese historial y solo añade correcciones de documentación/estado para publicar; no cambia comportamiento ni inicia NAV-04.

## Entrega

- [Navegación](https://pablogonzalezruiz.github.io/AstroXmind/navegacion/): componente automático, referencias y tabla plegada, con tres demos Resultado/Código.
- [Serie](https://pablogonzalezruiz.github.io/AstroXmind/pruebas-jerarquia/serie/): cuatro artículos en archivos distintos de una misma carpeta, con jerarquía lógica independiente.
- [Destino plegado](https://pablogonzalezruiz.github.io/AstroXmind/navegacion/#ref-medida-detalle): revela el camino necesario, selecciona Resultado y enfoca el destino.
- Migas arriba, árbol lateral con posición actual y navegación inferior a padre/hermanos/hijos/anterior/siguiente.

Diez páginas de contenido, 404 técnico, navigation.json y references.json. Contenido de prueba ficticio, sin temario ni normativa.

## Validación y evidencia del despliegue

Antes de integrar pasaron 48 pruebas persistentes, Astro check y builds de wiki/laboratorio. Ver [auditoría NAV-03](audits/2026-11-17-nav-03-validation.md). Las modificaciones de publicación son documentales. Cada push de main activa CI, Wiki Build y Pages; sus runs del SHA de integración son la evidencia definitiva, no el texto de esta nota.

- [GitHub Actions](https://github.com/PabloGonzalezRuiz/AstroXmind/actions).
- [Workflow Pages](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/workflows/wiki-pages.yml).

Comprobar CI/build/deploy terminados correctamente y respuestas HTTP del apartado, artículos y registros antes de comunicar publicación. Si un run falla, inspeccionar el trabajo y corregir dentro del alcance de esta entrega; no publicar releases ni abrir PR. No afirmar revisión visual completa: las pruebas DOM no acreditan layout/scroll/fullscreen nativo/táctil.

## Continuidad

Los informes anteriores se conservan como evidencia histórica de la etapa en rama. Esta autorización posterior permite publicar esta entrega; no concede permisos generales para main ni fases nuevas. NAV-04 sigue pendiente de autorización: enlaces entrantes/salientes automáticos con contexto y origen de cita. Summary/Boundary aplazados y biblioteca último hito.

## Cierre comprobado de la publicación

La entrega 2cdba361920b58a5002faa063e46660f22ff36ef se publicó correctamente: [CI 44096661054](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44096661054), [Wiki Build 44096660778](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44096660778) y [Pages 44096660802](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44096660802), todos success. Se verificaron diez respuestas HTML 200, catorce referencias/destinos, jerarquía y tres ejemplos de Navegación. El encargo documental posterior conserva esta evidencia sin desplegar una nueva versión.
