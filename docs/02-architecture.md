# Arquitectura actual y prevista (2026-11-14)

## Implementada
- Astro 5 + Starlight 0.36, sitio estático de estudio TAI, base `/AstroXmind`, idioma español.
- `src/content/docs/`: portada, guía y cuatro introducciones de bloques; colección Starlight registrada en `src/content.config.ts`.
- `package-lock.json` versionado; Node 22, `npm ci`, `astro check`, `astro build`, verificación `dist/index.html`.
- CI solo lectura en `.github/workflows/ci.yml`; despliegue Pages mediante workflow `.github/workflows/wiki-pages.yml` (verificar antes de modificar).
- Indexación automática de runs: `.github/workflows/ci-run-index.yml` escucha `workflow_run` y publica JSON en rama separada `automation/ci-run-index`. Se evita escritura en CI principal.
- GitHub Pages: https://pablogonzalezruiz.github.io/AstroXmind/ .

## No implementada
- Temario TAI completo y control de fuentes/licencias.
- Editor Markdown con persistencia y versiones.
- Adaptador PMD/XMind, visor web y sincronización.

## Fronteras
`AstroXmind` es independiente de `xmind-md` y `xmind-md-ts`. Una futura integración requiere contrato, revisión de licencias y compatibilidad, prototipo aislado y autorización. No usar Actions como motor de vista previa interactiva inmediata.

## Verificación
Último run auditado: 43615164608, éxito. Consultar el índice antes de dar por actual el resultado. La versión 0.1.0 estable sigue pendiente.
