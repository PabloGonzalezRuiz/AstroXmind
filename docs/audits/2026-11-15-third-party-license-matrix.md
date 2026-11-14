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
