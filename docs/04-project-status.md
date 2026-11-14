# Estado del proyecto

Fecha: 2026-11-14.

- Repositorio: `PabloGonzalezRuiz/AstroXmind`, rama `main`.
- Fase 0 AST-001: cerrada (documentación y auditoría inicial).
- Fase 1 AST-002: **wiki inicial implementada; compilación verificada** (Actions 43591621032, commit a3b61547). La navegación en navegador todavía no se ha comprobado.
- Código creado: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/content/docs/` (portada, guía y cuatro bloques de ejemplo).
- Workflow de compilación: `.github/workflows/wiki-ci.yml`; ejecución exitosa [43591621032](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43591621032).
- Despliegue público y versión estable 0.1.0: **no realizados**.
- Temario externo, editor y XMind: **no implementados**.

El resultado de Actions debe verificarse antes de declarar AST-002 cerrada. Revisar el HEAD y las ejecuciones más recientes en GitHub al reanudar.

## Intento de despliegue Pages

Workflow `Wiki · Deploy GitHub Pages` creado en `.github/workflows/wiki-pages.yml`. Run [43592193295](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43592193295): compilación correcta, despliegue fallido con 404. Requiere habilitar Pages en Settings → Pages → Source: GitHub Actions. **No hay web publicada verificada.**

## Publicación confirmada (2026-11-14)

El segundo intento de [43592285017](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43592285017) finalizó **success**, con jobs `build` y `deploy` correctos. URL configurada: https://pablogonzalezruiz.github.io/AstroXmind/ . La navegación real en navegador queda pendiente de revisión del usuario.
