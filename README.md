# AstroXmind

Wiki de estudio de oposiciones TAI construida con Astro 5 y Starlight 0.36. El despliegue del código GitHub y la wiki en ChatGPT Sites no tienen sincronización verificada.

- **Wiki operativa confirmada por el propietario:** https://astroxmind-pablo.mixedclef8.chatgpt.site (requiere inicio de sesión con ChatGPT).
- **GitHub Pages:** https://pablogonzalezruiz.github.io/AstroXmind/ (el propietario indica que no funciona; no usar como URL operativa).
- **Mapa de ubicaciones y diagrama:** [docs/architecture-locations.md](docs/architecture-locations.md).
- **Estado (2026-11-14):** wiki inicial operativa; AST-002 cerrada; CI reproducible e índice automático verificados; release estable 0.1.0 pendiente.
- **Versión en package.json:** `0.1.0-dev` (no equivale a release).
- **Alcance implementado:** portada, guía de estudio y páginas introductorias de cuatro bloques; contenido TAI completo, editor y PMD/XMind no implementados.
- **Ejemplos de conversión XMind:** [fuentes `.md`, `.xmind` y `content.json`](examples/xmind/README.md).

## Continuar el desarrollo

Leer [AGENTS.md](AGENTS.md), [prompt maestro](docs/00-master-prompt.md), [continuidad](docs/09-continuation.md), [estado](docs/04-project-status.md), [tareas](docs/05-task-register.md), [hoja de ruta](docs/03-roadmap.md), [auditoría CI](docs/audits/2026-11-14-ci-verification.md) y [modelo de lenguaje declarativo alineado con XMind](docs/11-xmind-json-defaults.md).

CI más reciente verificada al elaborar esta revisión: [run 43615164608](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43615164608), éxito. Para obtener futuras ejecuciones sin pedir URL, leer [ci/latest-run.json](https://github.com/PabloGonzalezRuiz/AstroXmind/blob/automation/ci-run-index/ci/latest-run.json) en la rama `automation/ci-run-index`.

No publicar releases ni integrar repositorios externos sin autorización.
