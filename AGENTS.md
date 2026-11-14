# AstroXmind — instrucciones para agentes

## Lectura obligatoria
Leer `docs/09-continuation.md`, `docs/04-project-status.md`, `docs/03-roadmap.md`, `docs/05-task-register.md` y `docs/00-master-prompt.md`. Consultar GitHub y no asumir que la documentación es prueba de implementación.

## Estado (2026-11-14)
AST-001 y AST-002 cerradas. AST-003 parcialmente verificada: lockfile, `npm ci`, CI y consulta automática de runs correctos; release 0.1.0 pendiente. Última CI auditada: run 43615164608. El contenido TAI completo, editor y PMD/XMind no están implementados.

## Verificación de CI sin pedir enlaces
Leer `ci/latest-run.json` desde `automation/ci-run-index`, extraer `run_id` y `head_sha`, consultar jobs/logs y contrastar SHA con HEAD de `main`. El índice puede tardar en actualizarse. No confundir resultado de CI con despliegue Pages.

## Reglas
- Registrar tareas AST-NNN, decisiones ADR-NNN y riesgos/incidencias con evidencias.
- Diferenciar planificado, implementado y verificado.
- Mantener punto de restauración `backup/2026-11-14-wiki-funcional` sin cambios.
- No publicar releases, cambiar alcance ni integrar otros repositorios sin autorización.
- No importar temario externo sin verificar licencia, atribución y vigencia.
- Al finalizar, actualizar estado, tareas, auditoría y continuidad; no afirmar trabajo en segundo plano sin automatización.


## Auditoría actualizada — 2026-11-14
La rama candidata `security/ast-003-5-dependency-upgrade` (PR #1) contiene Astro 7.4.12, Starlight 0.43.1 y licencia MIT de Pablo González Ruiz. Run 43618220633 success (SHA ccb4735). `main` aún no integra la migración. Consultar `security/latest-run.json` y `audit/latest-run.json` además de `ci/latest-run.json` en `automation/ci-run-index`. Pendientes: licencias transitivas, advertencias, rutas/Pages y aprobación de integración/release.
