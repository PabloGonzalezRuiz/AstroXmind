# Construcción y auditoría

Revisado el 16-11-2026 tras integrar y desplegar AST-022.

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

## Verificación del código publicado

Base auditada: `6aff07e65b8cbd8e89f56a2f9a39d04f5a0af372` en `main`, 16-11-2026. PR #8 integrado.

- [CI correcto](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43901962478).
- [Wiki Build correcto](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43901962607).
- [Pages Deploy correcto](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43901962390).
- La auditoría de dependencias 43897812008 corresponde al SHA anterior `109e033`; no atribuirla al HEAD actual.

Los checks acreditan compilación y despliegue del SHA indicado, no fidelidad visual ni interoperabilidad XMind.

## Límites

No se ejecutaron pruebas locales nuevas en esta actualización documental. PR #5 no está integrado. No hay evidencia de validación Actions de la rama AST-017. Para un futuro cambio de código usar Node.js 22, npm ci, npm run check y npm run build; no abrir PR ni disparar workflows sin autorización.
