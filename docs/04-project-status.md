# Estado actual de AstroXmind

**Fecha de corte:** 2026-11-14. **Repositorio:** `PabloGonzalezRuiz/AstroXmind`. **Rama:** `main`.

## Resumen verificable
- **AST-001:** gobierno documental inicial cerrado; mantenimiento documental continuo.
- **AST-002:** wiki Astro 5 + Starlight 0.36 operativa; portada, guía y cuatro páginas introductorias de bloques. El usuario confirmó portada y enlaces funcionales.
- **Publicación:** https://pablogonzalezruiz.github.io/AstroXmind/ ; despliegues previos de GitHub Pages verificados (véase auditoría del punto de restauración). No se ha repetido en esta auditoría una prueba de navegador en vivo.
- **AST-003:** `package-lock.json` integrado y verificado (blob `3e298a7f8ace3a0a704cb12b83406f59b22ab02d`); CI en Node 22 con `npm ci`, `npm run check`, `npm run build`, `dist/index.html`.
- **Última CI verificada:** run [43615164608](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43615164608), commit `045272d133fcdeefc868dba621bd9283707cd435`, job completado con `success`. La ejecución anterior [43615034825](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43615034825) también fue correcta (0 errores/advertencias, 7 páginas).
- **Descubrimiento automático:** `automation/ci-run-index:ci/latest-run.json` contiene el último run, SHA y conclusión; indexador `.github/workflows/ci-run-index.yml` validado.
- **Versión:** `0.1.0-dev`; **no hay release estable 0.1.0 verificada/publicada en este proceso**.
- **Fuera de alcance actual:** temario completo, editor, conversión PMD/XMind, visor y sincronización.

## Restauración
Punto histórico documentado: rama `backup/2026-11-14-wiki-funcional` en `a4ea18658aa90323c5a2f83116d6130229b8cd96`. Véase `docs/audits/2026-11-14-restoration-point.md`. No se ha modificado.

## Bloqueos de cierre de AST-003
Auditoría de seguridad/licencias, revisión de workflows, prueba adicional de rutas y release autorizada. CI verde **no** demuestra por sí sola ausencia de vulnerabilidades ni estabilidad completa.

## Fuente de verdad
Verificar HEAD real, contenido Git y resultados de Actions antes de afirmar estado. Este documento es una fotografía con fecha, no un sustituto de la comprobación.

## Actualización AST-003.5 — 2026-11-14
- Auditoría estructural y corrección de instalaciones en `wiki-ci.yml` y `wiki-pages.yml`: ahora usan `npm ci`.
- Añadidos `scripts/audit_dependencies.py` y `.github/workflows/dependency-audit.yml` para generar evidencia de avisos npm y licencias.
- **No declarar auditoría de vulnerabilidades superada** hasta leer el artefacto del workflow. Informe: `docs/audits/2026-11-14-ast-003-5-security.md`.
- La release sigue pendiente de autorización.


## Auditoría de seguimiento — 2026-11-14, posterior a la validación de seguridad
- **main** conserva la wiki publicada con Astro 5/Starlight 0.36; la migración aún NO está integrada ni desplegada. CI principal indexada: run 43616941979, commit d0996d4, success; no atribuir ese resultado a commits posteriores.
- **Candidata de seguridad**: rama `security/ast-003-5-dependency-upgrade`, PR borrador #1. Astro 7.4.12, Starlight 0.43.1 y licencia MIT a nombre de Pablo González Ruiz (`LICENSE` y `package.json`) verificados en esa rama.
- **Última ejecución de candidata**: [43618220633](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43618220633), SHA `ccb4735bff7cc07e3cec7393133d518d0eee4754`, success en todos los pasos, incluido `npm audit --audit-level=low`. El run previo [43617922839](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43617922839) informó 0 vulnerabilidades. El resultado no equivale a una auditoría jurídica de licencias ni a garantía de ausencia de fallos.
- Índices: `automation/ci-run-index:ci/latest-run.json` (main), `security/latest-run.json` (candidata), `audit/latest-run.json` (auditoría histórica).
- **Pendientes reales**: revisión de licencias de terceros (15 entradas señaladas en auditoría inicial), revisión de advertencias y acciones Node 20, pruebas de enlaces/Pages sobre la versión migrada, comprobación de CI con lockfile ya integrado, evaluación y eventual fusión del PR solo con autorización, y release separada con autorización expresa.
- Restauración intacta: `backup/2026-11-14-wiki-funcional` en `a4ea18658aa90323c5a2f83116d6130229b8cd96`.

## Confirmación de navegación por el usuario — 2026-11-14
El usuario confirma que **todos los enlaces de la wiki publicada funcionan**. Se registra como aceptación manual de navegación de la versión actualmente accesible en GitHub Pages, sin inventario individual de URLs ni prueba automatizada. **No extrapolar esta confirmación a la rama candidata Astro 7/Starlight 0.43**, que todavía no se ha fusionado ni desplegado. AST-003.6 permanece parcialmente pendiente para prueba automática y aceptación específica de la candidata.


## AST-004.1 · Prácticos TAI — 2026-11-15
El usuario autoriza retomar fusión y copia; OneDrive queda fuera. Implementado en rama `content/tai-practicos-fusion`: 22 apartados adaptados de 5 cuadernos MIT, soluciones separadas y catálogo externo de 17 casos adicionales sin copiar. Check/build locales superados; CI remota pendiente. Véase `docs/audits/2026-11-15-practicos-fusion.md` y `docs/practicos-sources.json`. Repositorio comprobado privado. No fusionar hacia Pages sin comprobar privacidad efectiva del sitio; el workflow de main despliega automáticamente. No se ha publicado esta incorporación. PR #1 de dependencias y backup histórico intactos.


## AST-009 · Acceso privado para iPhone — 2026-11-15
Wiki privada publicada y verificada en https://astroxmind-pablo.mixedclef8.chatgpt.site. Manifiesto standalone, iconos y guía /iphone/ implementados; check/build y navegación de prácticos verificados. Proyecto Sites appgprj_6af97185a1d48191b9fc5f6eae308de5; reutilizarlo para próximas actualizaciones. Solo cuenta propietaria; sin acceso offline ni sincronización automática GitHub→Sites. Fuente y evidencia en docs/audits/2026-11-15-iphone-private-site.md. El usuario debe completar Añadir a pantalla de inicio en su iPhone. PR #2 conserva los cambios de fuente sin fusionar main; despliegue privado de Sites independiente del Pages público.
