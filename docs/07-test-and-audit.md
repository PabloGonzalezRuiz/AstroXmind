# Validación y auditoría

Auditado el 17-11-2026 sobre `main`, commit `e7bfb8e7f41ec5637c685e62698eb12b7ab1b658`.

## Evidencia remota

Para `e7bfb8e7f41ec5637c685e62698eb12b7ab1b658`:

- [CI: éxito, 43913208743](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43913208743).
- [Wiki Build: éxito, 43913208998](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43913208998).
- [Pages Deploy: éxito, 43913209250](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43913209250).
- La página pública TreeTable respondió y contiene los ejemplos de clases, plegado y numeración heredable. Esta lectura HTTP no sustituye una revisión visual/interactiva.

La auditoría de dependencias [43897812008](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43897812008) es anterior y corresponde a `109e033`, no al HEAD auditado. Su workflow genera un informe y no bloquea por severidad: éxito no significa cero vulnerabilidades.

## Qué comprueba CI

Node.js 22, npm ci, npm run check y npm run build. Wiki Build produce artefacto; Pages publica main. No sustituye pruebas funcionales ni certifica compatibilidad XMind. El workflow de auditoría de dependencias solo se activa por cambios de rutas concretas o dispatch; no se ha vuelto a ejecutar en esta auditoría.

## Evidencia histórica de desarrollo

En el desarrollo anterior se registraron builds locales de wiki y sandbox y comprobaciones DOM de herencia, excepciones, celdas, numeración y clases. Esas comprobaciones temporales no constituyen una suite persistente integrada en main. PR #5 sigue abierto sobre otra base. No afirmar cobertura automatizada completa.

## Verificación de esta auditoría

Lecturas de GitHub (SHA, ramas, commits, PRs, Actions y fuentes) y respuesta HTTP de TreeTable pública con ejemplos actuales. No hubo nueva ejecución local de tests/build, revisión visual o interacción de navegador; el cambio es documental.

Validación futura tras cambios: npm ci, npm run check, npm run build y build del laboratorio si cambia. Incorporar casos funcionales dirigidos cuando se implemente AST-028, sin baterías ad hoc innecesarias.
