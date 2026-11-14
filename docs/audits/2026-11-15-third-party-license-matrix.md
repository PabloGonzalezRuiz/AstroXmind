# AST-003.5 — Matriz de evidencias y obligaciones pendientes (2026-11-15)

> Estado: investigación técnica en curso. Este documento no certifica cumplimiento legal.

## Evidencia comprobada
- Rama candidata PR #1: https://github.com/PabloGonzalezRuiz/AstroXmind/pull/1
- Código propio: LICENSE MIT, copyright 2026 Pablo González Ruiz; package.json declara MIT. Esta licencia no sustituye las de terceros.
- Auditoría del lockfile previa: 442 paquetes; 26 entradas señaladas con licencias LGPL, MPL o expresiones compuestas; 25 opcionales. No confundir paquetes instalados con código distribuido.
- El script `scripts/license_distribution_evidence.py` inspecciona tarballs exactos de sharp, @img/sharp-libvips-linux-x64, lightningcss y lightningcss-linux-x64-gnu; recopila avisos reconocidos, hash SHA256 de archivos dist y firmas de binarios. Sus resultados son evidencia técnica, no una determinación legal.
- En la evidencia previa, @img/sharp-libvips-linux-x64@1.3.4 no contenía un archivo LICENSE/NOTICE reconocido por el detector. **No implica automáticamente infracción**: falta comprobar la licencia upstream aplicable y si ese binario se distribuye al usuario final.
- Pagefind genera recursos de búsqueda en dist; el script reconoce assets `wasm.*.pagefind` y analiza contenido gzip cuando procede. La licencia y avisos del runtime entregado al navegador requieren revisión separada.

## Matriz de cierre
| Componente | Uso conocido | Evidencia necesaria | Estado |
|---|---|---|---|
| Código AstroXmind | Código fuente propio | LICENSE MIT, atribución | Disponible en candidata |
| Astro / Starlight y transitivas | Compilación y posibles assets cliente | Identificar qué archivos de terceros llegan a dist y sus avisos | Abierto |
| sharp / libvips | Procesamiento de imágenes durante build, potenciales binarios opcionales | Tarball exacto, licencia upstream por versión, trazabilidad de distribución; evitar asumir que se envía al navegador | Abierto |
| lightningcss y plataformas | Transformación CSS y dependencias opcionales | Licencia upstream, archivos efectivamente enviados, avisos requeridos | Abierto |
| Pagefind runtime | Índice y recursos de búsqueda entregados | Identificar versión exacta, código/WASM empaquetado, licencia y avisos | Abierto |
| GitHub Actions | Automatización de CI | Revisión de permisos, versiones y procedencia; no equiparar acciones de CI con archivos redistribuidos | Parcial |

## Procedimiento de aceptación
1. Obtener el artefacto `ast-003-5-license-distribution-evidence` de la ejecución más reciente de AST-003.5 y conservar manifiesto SHA256, informe y archivos LICENSE/NOTICE.
2. Identificar qué elementos de `dist/` son de terceros, incluidos recursos Pagefind opacos; registrar versión, hash y licencia verificable.
3. Resolver licencias compuestas y obligaciones de aviso, atribución, fuente u oferta de fuente **solo cuando correspondan** a los elementos realmente distribuidos.
4. Crear inventario de terceros y avisos aplicables en el artefacto distribuido, con procedencia comprobable. No copiar avisos desde versiones distintas.
5. Repetir build, tests, seguridad, navegación y auditoría de licencias sobre **el mismo SHA**.
6. Realizar validación visual de la candidata antes de solicitar autorización para merge, deploy o release.

## Resultado de esta revisión
Se ha establecido una matriz de cierre con evidencia faltante identificada. **AST-003.5 permanece abierta**. No se afirma que una CI verde demuestre cumplimiento de licencias. AST-004 contenido TAI sigue siendo la siguiente prioridad funcional; AST-008 búsqueda/tests permanece aplazada.


## Contraste directo de evidencia CI (2026-11-15)
- Ejecución de licencias [43653142341](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43653142341), job 132625782437: **success**; se inspeccionaron cuatro tarballs npm exactos y se generó inventario de **41 archivos** en dist, con 8 HTML, 13 JS, 6 CSS, 2 .pagefind, 6 .pf_fragment, 1 .pf_index, 1 .pf_meta, 1 JSON, 1 SVG y 2 XML. El log registra `dist/favicon.svg`, `dist/404.html` y `dist/404/index.html`.
- `sharp@0.35.5`: licencia Apache-2.0 empaquetada; `lightningcss@1.33.0` y `lightningcss-linux-x64-gnu@1.33.0`: archivos MPL-2.0 empaquetados. `@img/sharp-libvips-linux-x64@1.3.4`: 6 archivos, sin LICENSE/NOTICE detectado; hallazgo abierto.
- El artefacto `ast-003-5-license-distribution-evidence` se publicó, pero no se ha abierto íntegramente su contenido desde esta revisión; no afirmar ausencia de componentes nativos solo por el inventario de extensiones.
- **Distinción relevante**: Pagefind aparece en la salida estática y requiere licencia/avisos contrastados por versión. Sharp/libvips y Lightning CSS son dependencias de compilación; su presencia en el lockfile no demuestra su redistribución en la web.
- Incidencia AST-003.6 detectada durante el contraste: la corrección anterior había insertado secuencias literales `\\n` en Python. Se corrigió el validador y se ajustaron pruebas al inventario real. Revalidación pendiente: [Actions](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/workflows/ast-003-6-navigation.yml).
