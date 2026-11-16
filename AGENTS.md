# Instrucciones para continuar AstroXmind

## Fuente de verdad

Antes de cambiar código, revisar:
1. [docs/09-continuation.md](docs/09-continuation.md) para el estado reciente.
2. [docs/04-project-status.md](docs/04-project-status.md) y [docs/03-roadmap.md](docs/03-roadmap.md).
3. [docs/10-declarative-language-architecture.md](docs/10-declarative-language-architecture.md) para el contrato del lenguaje.

Si los documentos y el repositorio divergen, comprobar primero la rama y el SHA actual de GitHub.

## Proyecto

- Repositorio: `PabloGonzalezRuiz/AstroXmind`; rama de publicación: `main`.
- Wiki pública: https://pablogonzalezruiz.github.io/AstroXmind/.
- El sitio público está limitado a componentes y clases Astro; no publicar contenido del temario.
- Stack actual: Astro + Starlight + MDX. La wiki se construye estáticamente y se publica en GitHub Pages.
- El componente TreeTable se mantiene en `examples/astro-component-lab/src/components/TreeTable.astro`; la página publicada lo importa directamente.
- La sintaxis para numerar nodos usa sufijos de texto entre corchetes, por ejemplo `[numbering=arabic; tiered=true; start=5]`. Deben funcionar sin escapes en listas MDX. No volver a las llaves que requerían escapes.
- El laboratorio StackBlitz es una copia independiente: permite editar y ver preview/errores, pero no sincroniza los cambios con GitHub.

## Validación y publicación

- Los workflows de CI y Wiki Build validan cambios enviados en un pull request. Pages publica desde `main`.
- Revisar el resultado de Actions para el SHA del PR y compartir los enlaces de ejecución.
- No añadir ni ejecutar baterías de pruebas ad hoc si la tarea no lo requiere. Usar los workflows existentes para comprobar build y errores.
- No fusionar pull requests ni publicar releases sin autorización explícita para esa acción concreta.
- No cerrar ni reescribir pull requests existentes como parte de otra tarea.
- No afirmar que un cambio está publicado hasta verificar el deployment de Pages.
- Los commits directos a `main` publican cambios en la wiki; trabajar en una rama para validar primero.

## Referencia de continuidad — 16-11-2026

Código publicado auditado: `6aff07e65b8cbd8e89f56a2f9a39d04f5a0af372`. PR #8 integrado; numeración literal `[numbering=arabic; tiered=true; start=5]` sin escapes. Clases automáticas `nivel-N` implementadas; mapa configurable AST-017 pendiente de adaptación al componente actual. Summary y Boundary (AST-018) son diseño pendiente, no funcionalidades publicadas. Ver [estado](./docs/04-project-status.md) y [continuidad](./docs/09-continuation.md).
