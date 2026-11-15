# AstroXmind — instrucciones para agentes

## DECISIÓN ACTUAL — 2026-11-15 (prevalece sobre instrucciones históricas de este archivo)
**Objetivo principal:** lenguaje Markdown declarativo y semántico para AstroXmind, orientado a IA, con estructura jerárquica, temas CSS propios y tablas árbol HTML nativas. Evolucionar el procesador para IDs, enlaces cruzados e índices de referencias inversas. XMind es futuro opcional; Pandoc/Quarto no forman parte del motor de visualización prioritario.
**Tecnología real en `main`:** sintaxis inspirada en remark-directive, pero el paquete no está declarado allí. El prototipo usa `scripts/render-tree-table.mjs` y `src/tree-tables/constitucion.md`; genera `public/tree-table/index.html` en prebuild, con `details/summary` y CSS. La rama aislada `test/remark-directive` contiene la integración explícita y el build local descritos arriba; no están en `main`. Ver `docs/10-declarative-language-architecture.md`.
**Pruebas:** la wiki Astro publicada para desarrollo se consulta en `https://pablogonzalezruiz.github.io/AstroXmind/`. ChatGPT Sites es otra superficie, sin sincronización verificada. No asegurar que una ruta funciona sin comprobar Pages y el navegador.
**Prioridad inmediata:** validar la tabla árbol en móvil y escritorio; después integrar parser robusto remark/remark-directive, CSS separado, semántica e IDs, referencias cruzadas y backlinks. No declarar implementadas estas capacidades futuras. Mantener backup, sin PR merges/releases sin autorización.

## Estado verificado — AST-012.0, 2026-11-15
En la rama de trabajo `test/remark-directive`, creada desde `main` en `04b73c9c656afdbc61492e5f43891ab6e207eadd`, se declara `remark-directive` y `npm ci` más `npm run build` terminan correctamente en este entorno local (Node 24.22.1). El HTML generado incluye clases de directiva, `id`/`data-numero` y plegables nativos `details/summary`. Para desbloquear AST-012.0 aún falta verificar la rama en GitHub Actions, en el Codespace Node 22, y validar visualmente escritorio y móvil. Esta sesión no ha conseguido abrir una terminal de Codespaces; no confundir el build local con esa validación.


## DECISIÓN VIGENTE — 2026-11-15 · leer antes de actuar
La wiki que el usuario utiliza actualmente es **ChatGPT Sites** (`https://astroxmind-pablo.mixedclef8.chatgpt.site`), NO GitHub Pages. GitHub es el repositorio de desarrollo. No afirmar que un commit de GitHub aparece en ChatGPT Sites: la integración/sincronización NO está verificada. Aplazar alojamiento definitivo, privacidad, invitados, permisos y automatización entre plataformas hasta la fase final; ahora centrarse en el desarrollo de la wiki, empezando por la galería de tablas árbol. No cambiar despliegues ni acceso por iniciativa propia. Distinguir siempre «en GitHub» de «visible en ChatGPT Sites». El usuario desea inicialmente acceso solo para sí, con invitados opcionales en el futuro; la privacidad efectiva de ChatGPT Sites no se ha verificado.


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
