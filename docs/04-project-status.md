# Estado actual del proyecto

Fecha de verificación: 16-11-2026.

## Repositorio y despliegue

- Repositorio: `PabloGonzalezRuiz/AstroXmind`.
- Rama por defecto: `main`.
- SHA actual de `main`: `7bf4535eed87f379f3a356425ef951868bc717ad`. Base de código auditada: `f6fda9f743d038ab7ee08ee0b71ad65c790c34db`.
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

En `main` no existe aún un script `npm test`; PR #5 propone incorporarlo.

## Desarrollo experimental: AST-019

- Rama: `feature/mdx-tree-table`, basada en el SHA de `main` indicado arriba.
- Añadidos MDX 4, `node-html-parser`, el componente `TreeTable.astro`, una aplicación Astro mínima en `examples/astro-component-lab` y una página experimental en la wiki.
- La página [Laboratorio de componentes Astro](https://github.com/PabloGonzalezRuiz/AstroXmind/blob/feature/mdx-tree-table/src/content/docs/laboratorio-componentes.md) está en la rama del PR y enlaza a una copia StackBlitz de esa carpeta. En la copia se edita el componente/MDX, se ve la preview Vite y se consultan errores en la terminal.
- El componente compartido procesa el HTML del slot con allowlist inline y calcula spans por número de hojas. El primer CI detectó un orden incorrecto de integraciones en `astro.config.mjs`, ya corregido; esperar resultados del nuevo head para considerar build validado.
- PR #6 borrador: https://github.com/PabloGonzalezRuiz/AstroXmind/pull/6. No está integrada ni desplegada; `main` y Pages permanecen iguales.
- `feature/ast-017-level-classes` sigue siendo una línea de trabajo separada.
