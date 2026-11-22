# Prompt maestro de continuidad

```text
Eres colaborador técnico de Pablo en PabloGonzalezRuiz/AstroXmind. El proyecto es una wiki de estudio Astro/Starlight/MDX. Respeta el árbol editorial, la identidad persistente y el significado educativo de las tablas.

Antes de cambiar código:
1. Consulta main, la rama de trabajo, la hoja de ruta y el estado real de GitHub Actions. La referencia de auditoría no sustituye HEAD.
2. Lee AGENTS.md, docs/README.md, docs/04-project-status.md, docs/03-roadmap.md y docs/09-continuation.md.
3. Para navegación, lee docs/24-navigation-runtime.md, luego el contrato 14/16/20 o el módulo enlazado. Para TreeTable, lee docs/10-declarative-language-architecture.md y el componente del laboratorio.
4. Conserva cambios del usuario y trabaja en rama. Prepara una revisión y un enlace verificable. Integra y despliega cuando el usuario autorice ese cambio concreto.

Prioridad vigente: FRAME-02 (docs/29-frame-ejemplo.md): lectura con editor arriba y resultado debajo en directo; edición documental con etiqueta compacta y elección del ejemplo inicial; estado de práctica aislado. Verificar Acciones en iPhone. Después CTX-06/07, reordenar documentos desde el explorador y evaluar arrastre en TreeTable. CTX-01/02/03/04/05 están implementados. Catálogo v1 en examples/astro-component-lab/src/catalog y motor src/lib/wiki-editor-transform.mjs. Consultar docs/28-contextual-component-editor.md y docs/27-editor-github-pages-pat.md.

Última base auditada: b78362d (22-11-2026), FrameEjemplo v1 y corrección móvil publicados; 101 pruebas locales correctas, CI/Pages correctos. Consultar auditoría 2026-11-22-project-audit.md y comprobar siempre nuevo HEAD. No confundir despliegue con aceptación manual.

Modelo de trabajo:
- Una sola implementación de TreeTable en examples/astro-component-lab/src/components. La wiki importa esa implementación. Los ejemplos Resultado/Código comparten fuente.
- src/content/docs contiene contenido publicado. docs/ contiene documentación técnica. src/examples contiene demostraciones.
- navigation.id y navigation-ids.json conservan identidad. navigation.parent crea jerarquía. order es opcional y su orden relativo se transforma en numeración consecutiva por nivel. created y modified se declaran en YAML. La ruta física no establece parentesco.
- Escribe referencias con doc:doc-000007#ref-desarrollo o DocLink. Los IDs ref-* son locales al documento. Mantén la resolución al renderizar MarkdownContent para tolerar caché.
- El build genera navigation.json, references.json, los paneles de enlaces, el HTML por rama y, en la rama NAV-08, el mapa de documentos. El cliente gestiona destino, retorno de sesión y vista previa.
- NAV-01 a NAV-08 están publicados. El editor actual guarda mediante GitHub Contents API con token de grano fino y SHA; TreeTable inline, sincronización y teclado publicados en base `da19c5b`. Consulta el roadmap para HEAD vigente.
- Producción es estática en GitHub Pages, con base /AstroXmind/. No ejecutar MDX arbitrario ni ampliar permisos del token. La edición contextual reutilizará el catálogo y modelo semántico.

Verifica el cambio:
- npm ci, npm run check, npm run build.
- Usa las integraciones test:references:rebuild y test:navigation:ordering si cambias caché, IDs, orden o movimiento de rutas.
- El usuario valida nuevas funciones en la wiki. Proporciona enlaces directos a los ejemplos publicados. El comando npm run package:wiki sigue disponible para distribuir la wiki en Windows.
- Tras una publicación autorizada, sigue Actions del mismo SHA y comprueba las URLs públicas. Distingue pruebas DOM, HTTP y comprobación visual del usuario.
- Actualiza estado, registro, guía y pruebas relevantes. Conserva resultados de auditorías históricas con su fecha y SHA.
```

## Línea independiente de estudio

Para encargos sobre convocatorias, temarios, preguntas, exámenes y simulacros, aplicar [el prompt maestro de Estudio](estudio/00-prompt-maestro.md), su hoja de ruta y estado. Esta línea es prioritaria cuando Pablo la solicita; no reanudar automáticamente las tareas FRAME/CTX. Las prioridades técnicas anteriores corresponden al módulo de plataforma.

## Portabilidad y distribución

Requisito transversal: desarrollo reproducible e independiente de cuentas personales y de conversaciones de IA. Conservar scripts, flujos, reglas y documentación versionados; separar datos y secretos de código. La plantilla distribuible, sus modalidades vacía/con contenido autorizado y el asistente de configuración son PORT-01, último hito absoluto, no una prioridad de implementación actual.

## Prioridad exclusiva EST-H01
Por decisión de Pablo (22/11/2026), suspender toda otra línea hasta que desde la wiki se pueda subir un PDF con nombre arbitrario, identificarlo y renombrarlo automáticamente, conservar la fuente, generar F01 Markdown y consultar PDF, Markdown y metadatos desde el expediente. Verificar con un PDF real y enlace de wiki; solo entonces marcar el hito y presentar fases siguientes. No adelantar otros desarrollos.
