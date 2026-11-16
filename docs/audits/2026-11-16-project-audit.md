# Auditoría del proyecto — 16-11-2026

## Alcance y método

Revisión del estado visible del repositorio GitHub, la rama principal, el contenido de workflows, runs de Actions, estado de PR y documentación de continuidad. Es una fotografía del estado observado; los PR y Actions cambian con el tiempo.

## Resumen ejecutivo

La wiki ya está publicada en GitHub Pages. Main contiene la arquitectura nueva de Markdown declarativo, remark-directive, clases CSS y propiedades XMind en YAML. Los workflows principales fueron exitosos en el commit revisado. La documentación estaba atrasada y mezclaba la arquitectura actual con instrucciones históricas de Codespaces, parser manual y ChatGPT Sites; este commit alinea los documentos operativos con el repositorio.

No hay todavía una conversión funcional a XMind ni un sistema completo de defaults/herencia. Hay PRs abiertos con tareas de seguridad, contenido y pruebas; los checks verdes no equivalen a integración.

## Estado del repositorio

- Repositorio: https://github.com/PabloGonzalezRuiz/AstroXmind
- Visibilidad: público.
- Rama por defecto: `main`.
- Base de código revisada: `f6fda9f743d038ab7ee08ee0b71ad65c790c34db`.
- Commit documental más reciente observado al completar esta auditoría: `d4f2d60bec8433f1c97d1e0e71d742fe5231aee1`.
- GitHub Pages: https://pablogonzalezruiz.github.io/AstroXmind/
- Galería: https://pablogonzalezruiz.github.io/AstroXmind/demo-tablas/galeria-remark-directive/

## Arquitectura confirmada en el código

- Astro 5.16 y Starlight 0.36.
- Dependencias directas `remark-directive` y `yaml`.
- Integración en `astro.config.mjs`: remarkDirective, remarkSemantic y rehypeTreeTable.
- Procesador declarativo en `scripts/remark-semantic.mjs`.
- Clases CSS en `public/remark-directive-gallery.css`.
- Ejemplos actuales en `src/content/docs/demo-tablas/galeria-remark-directive.md`.
- El YAML `xmind` transporta propiedades de raíz/topic y usa como estructura de tabla ejemplo `org.xmind.ui.treetable.toptitle`.
- No se encontró implementación de conversión a documento `.xmind`; se trata de metadatos futuros y renderizado web.

## Actions

Para la base de código `f6fda9f743d038ab7ee08ee0b71ad65c790c34db` se observaron satisfactorios:
- CI: [run 43830753415](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43830753415)
- Wiki Build: [run 43830748377](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43830748377)
- Pages Deploy: [run 43830748527](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43830748527)
- Dependency/license audit: [run 43830748358](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43830748358)
- Indexing CI: [run 43830837870](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43830837870)

El commit `d4f2d60` y su antecesor `feea809` actualizan solo documentación. No se verificó el resultado de Actions de esos commits; los checks anteriores no deben atribuirse a ellos.

En un commit de funcionalidad anterior falló `npm ci` por un `package-lock.json` incompleto. El lockfile se reparó y los runs citados posteriores pasaron. Es un incidente resuelto.

## Pull requests abiertos en el momento de revisión

- **#1 actualización de Astro/Starlight (AST-003.5):** abierto; base desactualizada y estado no mergeable/conflictivo según la vista revisada. Había checks exitosos en un SHA anterior al head actual, por lo que no validaban el head actual.
- **#2 cuadernos prácticos TAI:** abierto. El proyecto es público; revisar procedencia, licencias y permisos antes de incorporar contenido.
- **#4 documentación de ubicaciones/wiki:** abierto y basado en contexto previo a GitHub Pages. Reconciliar el contenido con la arquitectura vigente.
- **#5 pruebas de regresión Markdown/XMind:** draft abierto; checks CI y Wiki Build exitosos para el SHA observado. Aún no está integrado en main y por tanto `npm test` no es un comando disponible en el main auditado.

Verificar todos estos estados de nuevo antes de actuar.

## Hallazgos y deuda

1. **Documentación contradictoria:** corregida en el conjunto documental de este cambio; volver a sincronizarla tras cada desarrollo.
2. **Actualización de dependencias:** propuesta en PR #1; necesita revisión de alertas, compatibilidad, lockfile, licencias y checks del SHA exacto.
3. **Workflow Pages heredado:** contiene instalación adicional de `remark-directive` aunque ya es dependencia del proyecto, y una comprobación heredada para contenido de Tabulator.
4. **YAML sin contrato exhaustivo:** falta esquema, normalización y errores de usuario.
5. **Defaults y herencia:** aún son objetivo de diseño, no una capacidad completa.
6. **Conversión a XMind:** pendiente.
7. **Contenido TAI del PR #2:** revisar derechos dado el despliegue público.

## Recomendación para reanudar

Primero comprobar main y heads de los PR. Después revisar el PR #5 como cambio acotado de regresión. Mantener la actualización de dependencias separada. A continuación diseñar presets/herencia de propiedades con fixtures reales de XMind. No fusionar, publicar releases ni añadir contenido de terceros sin permiso explícito.

## Documentación alineada por esta actualización

`README.md`, `AGENTS.md`, `docs/00-master-prompt.md`, `docs/03-roadmap.md`, `docs/04-project-status.md`, `docs/05-task-register.md`, `docs/06-issues-and-risks.md`, `docs/07-test-and-audit.md`, `docs/09-continuation.md`, `docs/10-declarative-language-architecture.md`.
