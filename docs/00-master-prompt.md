# Prompt maestro — AstroXmind (actualizado 2026-11-14)

## MISIÓN Y DECISIÓN VIGENTE — 2026-11-15 (sustituye las prioridades anteriores)
AstroXmind es una wiki de estudio y un laboratorio de **Markdown declarativo semántico para tablas árbol HTML con temas CSS personalizables**, fácil de generar por IA. El documento Markdown es fuente de verdad; el procesador transforma jerarquía, roles y atributos a HTML semántico; CSS controla apariencia; HTML `details/summary` proporciona plegado nativo. Las relaciones semánticas (identificadores, referencias y backlinks) serán una ampliación gradual. Exportación XMind, importación DOCX/Pandoc y edición web son objetivos secundarios o futuros, no condiciones para la tabla árbol.
La sintaxis actual `:::tree-table{structure="legislation" theme="ocean" columns="2" fold="native"}` está **inspirada** en remark-directive; el código actual es un parser de demostración, no una instalación funcional del plugin. No afirmar que `columns` tenga comportamiento implementado: actualmente se lee como atributo, pero no genera columnas configurables.

**Actualización AST-012.0 — rama `test/remark-directive` (2026-11-15):** la dependencia ya está declarada e instalada en una rama separada basada en `main` `04b73c9c`. `npm ci`, `npm run build` y la inspección local de clases/atributos/plegables terminaron correctamente con Node 24.22.1. Esto aún no valida Codespaces Node 22, Actions ni la presentación visual en móvil/escritorio; no fusionar ni desplegar.
Pruebas activas en GitHub Pages: `https://pablogonzalezruiz.github.io/AstroXmind/`; comprobar despliegue antes de prometer URLs. ChatGPT Sites no está conectado automáticamente a GitHub. Véase `docs/10-declarative-language-architecture.md`. La hoja de ruta de seguridad y releases sigue abierta, sin confundirla con la prioridad funcional.


## Prioridad y plataforma acordadas — 2026-11-15
**Referencia de la wiki que usa el usuario: ChatGPT Sites** (`https://astroxmind-pablo.mixedclef8.chatgpt.site`), no GitHub Pages. GitHub sirve para desarrollar y versionar; no se ha acreditado sincronización con ChatGPT Sites. La configuración Astro/Actions todavía apunta a GitHub Pages: es un hecho técnico heredado, NO una decisión de usar Pages como sitio habitual. **Prioridad actual: desarrollar las funcionalidades y contenidos de AstroXmind**, comenzando por la galería de tablas árbol. Aplazar alojamiento final, privacidad, gestión de invitados y automatización de publicación hasta que la wiki funcione. No cambiar infraestructura ahora. Preferencia futura: acceso solo del propietario con invitaciones selectivas, sujeto a comprobar controles de acceso reales.


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
