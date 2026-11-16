# Construcción, validación y auditoría

Revisado el 16-11-2026.

## Validación local

Requisitos observados: Node.js 22 y npm.

```sh
npm ci
npm run check
npm run build
```

El script `check` ejecuta la comprobación de Astro y TypeScript configurada en el proyecto. `build` compila el sitio estático. En el SHA auditado `main` no define un script `test`; el PR #5 añade pruebas `node:test`, pero sigue abierto.

## GitHub Actions en main

- `.github/workflows/ci.yml`: instalación reproducible, check, build con Pandoc y comprobación de salida.
- `.github/workflows/wiki-ci.yml`: build y artifact de wiki.
- `.github/workflows/wiki-pages.yml`: despliegue Pages desde main.
- `.github/workflows/dependency-audit.yml`: auditoría de dependencias y licencias.
- Hay además flujo de indexación.

Ejecuciones exitosas verificadas en el commit `f6fda9f743d038ab7ee08ee0b71ad65c790c34db`:
- CI 43830753415
- Wiki Build 43830748377
- Pages Deploy 43830748527
- Dependency/license audit 43830748358
- Indexing CI 43830837870

Consultar siempre el SHA del run. No reutilizar esos resultados como prueba de commits posteriores.

## Deuda de workflows observada

El workflow de Pages vuelve a instalar `remark-directive` mediante un paso heredado aunque ya aparece en dependencias; además, verifica una ruta/contenido Tabulator heredados. Confirmar si esa página sigue en el sitio y simplificar el flujo cuando se trabaje en mantenimiento de Actions.

## Incidente del lockfile

Una versión anterior de `package-lock.json` estaba incompleta y rompía `npm ci`. La rama principal quedó reparada antes del SHA auditado y los checks posteriores pasaron. Los fallos anteriores están superados, no representan el estado actual.
