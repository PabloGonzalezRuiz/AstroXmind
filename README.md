# AstroXmind

Wiki de estudio construida con Astro Starlight. La fuente vive en Markdown/MDX y se publica con GitHub Pages.

- Wiki: https://pablogonzalezruiz.github.io/AstroXmind/
- Galería de directivas: https://pablogonzalezruiz.github.io/AstroXmind/demo-tablas/galeria-remark-directive/
- Repositorio: https://github.com/PabloGonzalezRuiz/AstroXmind
- Sandbox Astro (preview y errores en vivo): https://stackblitz.com/fork/github/PabloGonzalezRuiz/AstroXmind/tree/main/examples/astro-component-lab?startScript=dev
- AST-019 (TreeTable MDX y sandbox): integrado en `main`; ejemplo público en https://pablogonzalezruiz.github.io/AstroXmind/demo-tablas/tabla-arbol-mdx/
- AST-020 (enlaces a fuente/componente y edición manual): PR #7 borrador, CI y Wiki Build correctos: https://github.com/PabloGonzalezRuiz/AstroXmind/pull/7
- Continuidad y estado actual: [docs/09-continuation.md](docs/09-continuation.md)
- Auditoría vigente: [docs/audits/2026-11-16-project-audit.md](docs/audits/2026-11-16-project-audit.md)
- Hoja de ruta: [docs/03-roadmap.md](docs/03-roadmap.md)

## Estado verificado: 16-11-2026

El sitio se construye con Astro 5 y Starlight. La cadena Markdown incluye `remark-directive`, un plugin semántico propio y un plugin Rehype para tablas. El lenguaje de tablas declarativas permite definir una tabla árbol en Markdown, aplicar clases de estilo y adjuntar propiedades XMind como YAML.

El sitio está desplegado públicamente en GitHub Pages. La rama por defecto es `main`. AST-019 se publicó en el commit `5dd5273c03ed8efd10155420f44a04f8a254d67f`; CI, Wiki Build y Pages Deploy finalizaron correctamente. AST-020 sigue en el PR #7 y todavía no se ha publicado.

## Desarrollo local

Requiere Node.js 22 y npm.

```sh
npm ci
npm run check
npm run build
```

El flujo principal está descrito en [docs/07-test-and-audit.md](docs/07-test-and-audit.md). En el commit auditado, el proyecto no declara todavía un script `npm test`; una propuesta de pruebas de regresión está en el PR #5 y sigue sin integrar.

## Documentos

- [Prompt maestro y principios](docs/00-master-prompt.md)
- [Estado del proyecto](docs/04-project-status.md)
- [Registro de tareas](docs/05-task-register.md)
- [Riesgos y decisiones](docs/06-issues-and-risks.md)
- [Arquitectura del lenguaje declarativo](docs/10-declarative-language-architecture.md)
- [Propiedades XMind y valores por defecto](docs/11-xmind-json-defaults.md)

La guía de reconstrucción manual describe un estado histórico y no sustituye las instrucciones de continuidad actuales.
