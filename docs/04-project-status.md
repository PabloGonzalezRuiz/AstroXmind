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

## Inventario de licencias de candidata — 2026-11-14
Inspección directa de lockfile actualizado: 442 paquetes, 0 sin metadatos de licencia y 26 entradas para revisión especial (14 variantes sharp con LGPL/expresiones compuestas; 12 lightningcss con MPL-2.0). **No equivale a certificación jurídica ni prueba de redistribución.** Informe: `docs/audits/2026-11-14-ast-003-5-license-review.md`. AST-003.5 permanece abierta para revisar LICENSE/NOTICE, artefactos distribuidos y advertencias técnicas. PR #1 sigue sin fusionar.
