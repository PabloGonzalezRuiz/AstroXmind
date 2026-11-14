# Auditoría y pruebas — estado vigente (2026-11-14)

## Evidencia de funcionamiento
- AST-002: el usuario confirmó la portada y navegación por cuatro bloques. Build y Pages del punto de restauración: runs 43610712895 y 43610712857, success.
- AST-003: lockfile reproducible en `main`; CI [43615034825](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43615034825) success (Node 22, `npm ci`, check con 0 errores y 0 warnings, 7 páginas, 6 indexadas).
- CI posterior [43615164608](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43615164608), commit `045272d1`, job success.
- Índice `automation/ci-run-index/ci/latest-run.json` verificado con run 43615164608, `job_conclusion=success`; no solicitar URL manual si el índice está actualizado.

## Límites
- No hay pruebas E2E automatizadas de enlaces/rutas ni informe de accesibilidad.
- No se ha realizado auditoría completa de vulnerabilidades, dependencias ni licencias.
- No se ha validado una release 0.1.0 estable; `package.json` usa `0.1.0-dev`.
- Una CI exitosa no implica que la web pública esté actualizada en ese instante; comprobar deploy por separado.

## Próxima verificación requerida
1. Auditoría de dependencias/licencias y workflows, incluyendo avisos Node 20 de acciones v4.
2. Pruebas automatizadas de enlaces y rutas principales; verificación del despliegue.
3. Checklist de release y autorización explícita antes de publicar.

Ver historial y detalles técnicos en `docs/audits/2026-11-14-ci-verification.md` y `docs/audits/2026-11-14-restoration-point.md`.
