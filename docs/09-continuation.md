# Continuidad — LEER PRIMERO (revisión 2026-11-14)

## Procedimiento de reanudación sin contexto previo
1. Leer `AGENTS.md`, `docs/00-master-prompt.md`, `docs/04-project-status.md`, `docs/03-roadmap.md`, `docs/05-task-register.md` y `docs/06-issues-and-risks.md`.
2. Consultar commits recientes de `PabloGonzalezRuiz/AstroXmind` en `main`; nunca asumir que el SHA documentado sigue siendo HEAD.
3. Leer `ci/latest-run.json` **desde la rama `automation/ci-run-index`**. Obtener `run_id`, `head_sha`, `job_conclusion`. Consultar los jobs y logs de ese run; comparar el SHA con el HEAD. Si no coincide, declarar CI de HEAD pendiente.
4. Revisar workflows `.github/workflows/ci.yml`, `.github/workflows/ci-run-index.yml`, `.github/workflows/wiki-ci.yml` y `.github/workflows/wiki-pages.yml` antes de modificarlos.
5. Verificar la web https://pablogonzalezruiz.github.io/AstroXmind/ y rutas de los cuatro bloques si el trabajo afecta navegación.
6. Registrar decisiones, riesgos, incidencias, evidencias, commits y siguiente tarea en los documentos correspondientes.

## Estado confirmado al redactar
- AST-001 y AST-002 cerradas; wiki inicial publicada y navegación confirmada por usuario.
- AST-003 en curso: lockfile y CI reproducible, automatización de índice y compilación verificadas. Último run observado: `43615164608` (`success`), SHA `045272d133fcdeefc868dba621bd9283707cd435`.
- `package.json` sigue en `0.1.0-dev`; **no declarar release 0.1.0 publicada**.
- Siguiente tarea: auditoría de dependencias/licencias y revisión de workflows; después checklist de release y solicitar autorización para publicar.
- No hay temario completo, editor ni integración PMD/XMind.

## Incidencias y lecciones
- Se corrigieron 404 de Pages por falta de `src/content.config.ts` y rutas base; ver `docs/06-issues-and-risks.md`.
- Un intento de añadir escritura de índice dentro de CI provocó ejecuciones fallidas de 0 s; causa exacta no confirmada. Se restauró CI solo lectura y se separó indexador en `workflow_run`, ver auditoría CI.
- Advertencias no bloqueantes de Node 20 en acciones `checkout@v4`/`setup-node@v4`; revisar en fase de hardening.

## Restauración y límites
- Backup histórico: `backup/2026-11-14-wiki-funcional` en `a4ea18658aa90323c5a2f83116d6130229b8cd96`. No mover.
- No publicar releases, fusionar proyectos externos ni iniciar fases posteriores sin autorización.
- Documentación es evidencia contextual, **no prueba suficiente**: verificar GitHub y Actions.

## Actualización AST-003.5 — 2026-11-14
- Auditoría estructural y corrección de instalaciones en `wiki-ci.yml` y `wiki-pages.yml`: ahora usan `npm ci`.
- Añadidos `scripts/audit_dependencies.py` y `.github/workflows/dependency-audit.yml` para generar evidencia de avisos npm y licencias.
- **No declarar auditoría de vulnerabilidades superada** hasta leer el artefacto del workflow. Informe: `docs/audits/2026-11-14-ast-003-5-security.md`.
- La release sigue pendiente de autorización.

## Inventario de licencias de candidata — 2026-11-14
Inspección directa de lockfile actualizado: 442 paquetes, 0 sin metadatos de licencia y 26 entradas para revisión especial (14 variantes sharp con LGPL/expresiones compuestas; 12 lightningcss con MPL-2.0). **No equivale a certificación jurídica ni prueba de redistribución.** Informe: `docs/audits/2026-11-14-ast-003-5-license-review.md`. AST-003.5 permanece abierta para revisar LICENSE/NOTICE, artefactos distribuidos y advertencias técnicas. PR #1 sigue sin fusionar.
