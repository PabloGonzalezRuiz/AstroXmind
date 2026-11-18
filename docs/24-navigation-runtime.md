# Navegación y exportación: guía de mantenimiento

La fuente editorial es `src/content/docs`. El identificador `navigation.id` conserva la identidad al mover archivos o cambiar el título. `navigation.parent` establece la jerarquía. Las citas vinculan documentos y apartados sin modificar el parentesco.

| Función | Entradas y salida | Dónde cambiarla |
|---|---|---|
| NAV-01/02 · Árbol, orden y contexto | YAML + `navigation-ids.json` → índice v2, migas, árbol y recorrido | `scripts/navigation-content.mjs`, `src/lib/navigation/index.mjs`, `src/components/navigation/` |
| NAV-03 · Referencias | Markdown `doc:doc-000007#ref-desarrollo` o `DocLink` → enlaces HTML normales | `scripts/remark-document-references.mjs`, `src/lib/navigation/references.mjs`, `MarkdownContent.astro`, `reference-client.mjs` |
| NAV-04 · Citas cruzadas | HTML renderizado → `references.json` v2 y paneles de referencias con contexto | `scripts/reference-validation.mjs` |
| NAV-05 · Punto de lectura | Cadena de hasta 12 saltos entre páginas en `sessionStorage` → scroll, foco, pestañas, desplegables y plegado de tablas | `reading-return.mjs`, `Head.astro`, `Breadcrumbs.astro`, `TreeTable.astro` |
| NAV-06 · Rama para imprimir | Índice + HTML final → `rama/<id>.html`, índice interno, impresión/PDF del navegador y descarga | `scripts/branch-export.mjs`, enlace en `Breadcrumbs.astro` |
| NAV-07 · Vista previa | Enlace o backlink → HTML de destino del mismo sitio → extracto de texto en diálogo lateral | `ReferencePreview.astro`, `reference-preview.mjs` |
| NAV-08 · Mapa local | Padre, hijos y referencias entrantes/salientes → SVG y lista agrupada en el HTML | `scripts/document-graph.mjs`, `DocumentGraph.astro` |

Los módulos cliente de navegación viven en `src/lib/navigation/`. La implementación compartida de TreeTable está en `examples/astro-component-lab/src/components/TreeTable.astro`.

## Orden de compilación

1. Astro valida el contenido. La integración de navegación construye el índice y el middleware publica el contexto de documento para Starlight.
2. El pipeline Markdown/MDX resuelve las citas. En el render, `MarkdownContent.astro` resuelve otra vez la URL para evitar referencias obsoletas procedentes de la caché.
3. `astro:build:done` lee los HTML finales. Valida destinos, genera IDs de cita, referencias salientes y entrantes, y entrega esos datos al grafo. Guarda HTML e índices y genera las exportaciones de rama.
4. Los scripts del navegador gestionan el salto a los nodos plegados, el retorno de sesión y el panel de vista previa. El grafo es HTML y SVG estático con enlaces normales.

## Contratos al modificar

- Los nombres `ref-*` deben ser únicos en el documento. El HTML de una rama añade prefijos por ID documental para mantener las anclas únicas.
- TreeTable retira del DOM las filas plegadas. La búsqueda de destinos debe consultar también las celdas que guarda el componente. Las vistas previas se decoran de nuevo cuando reaparecen las filas.
- La vista lateral muestra un extracto textual. Abre la referencia original al elegir el documento completo para que NAV-05 recuerde el origen. Con un error de carga sigue disponible el enlace.
- El grafo solo incluye conexiones directas. Una pareja de documentos ocupa una entrada y conserva todos sus tipos de vínculo. Ignora autorreferencias. La lista contiene todos los vecinos y el SVG muestra hasta ocho. La lista es la alternativa al SVG para teclado y lectores de pantalla.
- La rama exportada mantiene los destinos internos y usa URL en línea para los externos. Conserva Resultado en los ejemplos y las tablas desplegadas. El ZIP Windows contiene la wiki completa, mientras que `rama/<id>.html` representa una sola rama.
- Usar `npm run build` o el ZIP para probar funciones que dependen del HTML final. `npm run dev` no ejecuta el posprocesamiento de build.

## Pruebas de aceptación

1. En Navegación, abre el mapa al pie. **Artículos de prueba** aparece una sola vez, con su papel jerárquico y las citas aplicables. **Artículo 2 · Desarrollo** aparece con sus relaciones de referencia. Abre ese documento desde la lista.
2. En Navegación usa **Vista previa** en la referencia al Artículo 2. Cierra con Escape y comprueba el foco. Vuelve a abrirla, sigue el documento completo y prueba el retorno.
3. Abre el HTML descargado de una rama sin conexión. Comprueba índice, citas internas y vista previa de impresión. Revisa visualmente páginas anchas y papel horizontal si hace falta.

Pruebas automatizadas en `tests/navigation-rendered.test.mjs` y `tests/reference-client.test.mjs`. Las pruebas DOM no comprueban diseño visual, gestos táctiles ni fragmentación física en impresión.
