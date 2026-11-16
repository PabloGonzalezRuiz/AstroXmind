# Instrucciones para continuar AstroXmind

## Fuente de verdad

Antes de cambiar código, revisar:
1. [docs/09-continuation.md](docs/09-continuation.md) para el estado más reciente y los siguientes pasos.
2. [docs/04-project-status.md](docs/04-project-status.md) para el estado técnico.
3. [docs/03-roadmap.md](docs/03-roadmap.md) y [docs/05-task-register.md](docs/05-task-register.md) para prioridades y pendientes.
4. [docs/audits/2026-11-16-project-audit.md](docs/audits/2026-11-16-project-audit.md) para la auditoría base.

Si estos documentos y el repositorio divergen, verificar primero GitHub y actualizar los documentos. No asumir que los textos antiguos describen el runtime actual.

## Proyecto y publicación

- Repositorio: `PabloGonzalezRuiz/AstroXmind`; rama por defecto `main`.
- Wiki pública: https://pablogonzalezruiz.github.io/AstroXmind/
- Stack confirmado: Astro 5, Starlight, remark-directive, plugin semántico local, plugin rehype de tablas y YAML.
- No hay una conexión de terminal a Codespaces necesaria para editar: los cambios del repositorio se pueden realizar por GitHub. Para compilar localmente se requiere Node.js 22.
- No poner en la wiki datos personales, credenciales ni secretos.

## Flujo actual

Markdown/MDX → remark-directive → remarkSemantic → AST de Markdown → rehypeTreeTable → HTML/CSS → Astro/Starlight → GitHub Pages.

La sintaxis y el contrato actual están en [docs/10-declarative-language-architecture.md](docs/10-declarative-language-architecture.md) y [docs/11-xmind-json-defaults.md](docs/11-xmind-json-defaults.md). No reemplazar el pipeline actual sin una decisión documentada.

## Experimento MDX y sandbox

- Rama aislada: `feature/mdx-tree-table`; aún no está integrada ni publicada.
- Sandbox independiente: `examples/astro-component-lab`; la wiki ofrece el acceso en `src/content/docs/laboratorio-componentes.md`.
- El laboratorio ejecuta Astro con MDX aislado (`extendMarkdownConfig: false`) y el componente `TreeTable.astro` procesa el HTML del slot. Es una alternativa en evaluación, no el contrato de producción.
- Mantener el componente del sitio y el sandbox compartiendo una sola fuente; no duplicar el componente.
- No sustituir la sintaxis de los temas `.md` con MDX sin comparar la experiencia de edición y la compatibilidad XMind.

## Comandos del commit auditado

```sh
npm ci
npm run check
npm run build
```

No añadir ni ejecutar una batería de pruebas ad hoc sin que la tarea lo requiera. `.github/workflows/ci.yml` y `wiki-ci.yml` se activan en `pull_request`; los pushes de rama están limitados. `wiki-pages.yml` despliega al hacer push a `main` y admite ejecución manual. Un PR permite validar sin desplegar; Pages se actualiza cuando los cambios llegan a `main`. A fecha de auditoría, `npm test` no está integrado en `main`.

## Cambios en GitHub

El usuario ha pedido mantener continuidad y ha autorizado trabajo de desarrollo y documentación del proyecto. Aun así:
- No fusionar PRs ni publicar releases sin autorización explícita para esa acción concreta.
- No cerrar ni reescribir PRs existentes como parte de una actualización documental.
- No describir un PR como integrado solo porque sus Actions estén verdes.
- Al actualizar la documentación, anotar fecha, SHA y enlaces de Actions verificados.
- Los commits directos a `main` publican cambios en la wiki; informar de ello.

## Seguridad de dependencias

Existe un PR de actualización de Astro/Starlight, #1, que está abierto y tiene estado de merge no disponible/conflictivo según la auditoría. No asumir que resuelve todas las alertas ni mezclarlo con el modelo declarativo. Reauditar dependencias y checks sobre el SHA exacto antes de tomar una decisión.
