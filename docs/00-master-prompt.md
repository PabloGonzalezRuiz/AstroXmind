# Prompt maestro — AstroXmind (actualizado 2026-11-14)

## Misión
Desarrollar una wiki de estudio para oposiciones TAI, con Astro + Starlight y Markdown como fuente de contenido. Evolucionar de manera controlada hacia temario revisado, edición Markdown y, posteriormente, integración PMD/XMind y visor.

## Estado de partida
- AST-001 gobierno documental: cerrado inicialmente.
- AST-002 wiki inicial: cerrada, publicada en https://pablogonzalezruiz.github.io/AstroXmind/ y navegación confirmada por usuario.
- AST-003 estabilización 0.1.0: CI reproducible e índice de runs verificados; release pendiente.
- Último run comprobado en esta revisión: 43615164608, success; consultar índice para datos posteriores.
- `0.1.0-dev` en package.json no es una release estable.

## Límites obligatorios
1. Mantener AstroXmind independiente de `xmind-md` y `xmind-md-ts`.
2. 0.1.0: wiki básica estable; no incorporar editor web, PMD ni visor XMind.
3. No importar terceros sin revisar licencia, atribución y vigencia normativa.
4. No declarar estabilidad por CI únicamente: contrastar build, enlaces, despliegue, riesgos y checklist.
5. No crear release, etiquetas ni cambios importantes de alcance sin autorización.
6. Registrar tareas AST-NNN, decisiones ADR-NNN, riesgos, incidencias y evidencias; distinguir previsto/implementado/verificado.
7. Reanudar desde `AGENTS.md` y `docs/09-continuation.md`; verificar GitHub, no depender de la memoria del chat.

## Operativa de auditoría
- Consultar HEAD real.
- Leer `ci/latest-run.json` en `automation/ci-run-index` para recuperar `run_id` sin pedir enlace al usuario.
- Consultar jobs/logs del run y comparar `head_sha` con HEAD; si difieren, no atribuir resultados antiguos a HEAD.
- Registrar resultados y actualizar estado, hoja de ruta, tareas y continuidad.
- No iniciar trabajo en segundo plano sin automatización programada.

## Siguiente objetivo
Completar AST-003: revisión de dependencias, licencias, seguridad y workflows; pruebas de rutas; propuesta de release 0.1.0 para aprobación. No publicar hasta recibir autorización.


## Decisiones y estado confirmado — 2026-11-14
- Licencia del código propio: **MIT**, copyright (c) 2026 **Pablo González Ruiz**. Archivos `LICENSE` y `package.json` incorporados en la rama candidata; respetar licencias independientes de terceros.
- La candidata de migración Astro 7.4.12 / Starlight 0.43.1 está en `security/ast-003-5-dependency-upgrade`, PR borrador #1. Validación automatizada correcta: run `43618220633` (SHA `ccb4735`). `main` continúa con la wiki anterior hasta autorización de integración.
- Reanudar consultando tres índices en `automation/ci-run-index`: `ci/latest-run.json`, `security/latest-run.json` y `audit/latest-run.json`.
- Próximo objetivo: completar revisión de licencias de dependencias, warnings y rutas/Pages, actualizar evidencias y solicitar aprobación antes de fusionar PR o crear release.


## Decisión de producto — 2026-11-15 (prevalece sobre prioridades anteriores)
**Objetivo confirmado por el usuario:** AstroXmind es una wiki personal para estudiar oposiciones TAI, accesible desde navegador y ampliable progresivamente. GitHub conserva código e historial; GitHub Pages permite consultarla. No se persigue distribuir instaladores, paquetes npm, contenedores ni node_modules.
**Prioridad inmediata: AST-004 contenido real TAI.** Definir formato editorial, crear un tema piloto y un flujo Markdown de actualización. Después, mejoras de edición y estudio. AST-003.5 auditoría de licencias exhaustiva queda en mantenimiento diferido, sin olvidar avisos aplicables a recursos publicados en web; AST-008 búsqueda/tests avanzada queda aplazada. La validación básica de compilación y navegación sigue siendo obligatoria para cambios.
**Límites:** mantener main y web publicada sin cambios hasta autorización específica; trabajar solo en rama candidata, no merge/deploy/release/tag automático. Este cambio de prioridad no autoriza publicar material sin verificar su procedencia, exactitud y derechos.
