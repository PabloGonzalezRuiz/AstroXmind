# Estado actual del proyecto

Fecha de verificación: 16-11-2026.

## Repositorio y despliegue

- Repositorio: `PabloGonzalezRuiz/AstroXmind`.
- Rama por defecto: `main`.
- SHA actual de `main`: `7bf4535eed87f379f3a356425ef951868bc717ad`. Código auditado: `f6fda9f743d038ab7ee08ee0b71ad65c790c34db`.
- Repositorio público.
- GitHub Pages está publicado en https://pablogonzalezruiz.github.io/AstroXmind/.
- La portada y la galería declarativa están disponibles bajo el prefijo `/AstroXmind/`.

## Implementación en main

- Astro 5.16 y Starlight 0.36.
- Dependencias directas incluyen `remark-directive` y `yaml`.
- `astro.config.mjs` conecta remarkDirective, remarkSemantic y rehypeTreeTable.
- `scripts/remark-semantic.mjs` convierte las directivas declarativas y sus propiedades en datos del AST que consume el renderer de tablas.
- `public/remark-directive-gallery.css` contiene estilos globales de la galería, incluidas clases para nodos.
- `src/content/docs/demo-tablas/galeria-remark-directive.md` contiene ejemplos, incluidos los apartados 12–14 y YAML para propiedades XMind.
- `docs/11-xmind-json-defaults.md` describe los metadatos y pendientes de defaults.

## Validaciones observadas para el SHA auditado

- CI: ejecución 43830753415, éxito.
- Wiki Build: ejecución 43830748377, éxito.
- GitHub Pages Deploy: ejecución 43830748527, éxito.
- Dependency/license audit: ejecución 43830748358, éxito.
- Indexing CI: ejecución 43830837870, éxito.
- Enlace a Actions: https://github.com/PabloGonzalezRuiz/AstroXmind/actions

Estos resultados corresponden al SHA indicado y no garantizan el estado de commits posteriores.

## Capacidad y límites

Ya existe renderizado web de las tablas y almacenamiento de propiedades declaradas en el procesamiento de contenido. Todavía no existe un conversor funcional a XMind ni un catálogo de presets que complete automáticamente todas las propiedades omitidas. La compatibilidad de propiedades es parcial y los documentos XMind reales siguen siendo la referencia para ampliar el contrato.

AST-017 está implementada en `feature/ast-017-level-classes` (commit inicial `0aaa3857f17c1316e7a6c210b67368cf5c2995d8`): el mapa `yaml clases` aplica clases por profundidad, combina clases locales y valida niveles/clases. La galería y documentos de continuidad se actualizan en esa rama. Esta rama aún no se ha compilado ni integrado; la wiki publicada continúa reflejando `main`.

PR #5 sigue abierto en borrador. Sus checks `Build and validate` y `build` pasaron para `51c9b694dd16edc758d9ed39e810330817005039`; el PR no está integrado y apunta a una base anterior.
