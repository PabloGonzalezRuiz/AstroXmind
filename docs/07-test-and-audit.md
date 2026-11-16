# Construcción y auditoría

Revisado el 16-11-2026 tras el despliegue de AST-020.

## Validación local

Requiere Node.js 22 y npm.

```sh
npm ci
npm run check
npm run build
```

`npm run check` ejecuta el diagnóstico de Astro y TypeScript. `npm run build` genera el sitio estático Astro; no requiere Pandoc ni ejecutar los generadores de las galerías retiradas.

## GitHub Actions

- `.github/workflows/ci.yml`: instala dependencias, corre `npm run check` y construye la wiki.
- `.github/workflows/wiki-ci.yml`: construye el sitio y guarda el artefacto de revisión.
- `.github/workflows/wiki-pages.yml`: construye y despliega GitHub Pages desde `main`; verifica cuatro páginas y la ausencia de los antiguos HTML públicos y rutas del temario.
- Auditoría de dependencias y licencias sigue en workflow independiente.

Para el commit `109e0338b4a72c79f6796b6d66486d188c65486c`:
- CI: 43897812197, éxito.
- Wiki Build: 43897812128, éxito.
- Pages Deploy: 43897812168, éxito.
- Dependency/license audit: 43897812008, éxito.

Los checks anteriores prueban ese SHA concreto. Consultar los runs más recientes antes de continuar.
