# NAV-03 · Referencias estables, componente y demostración

**Estado vigente (18-11-2026):** NAV-01/02/03 y ampliación de ordenación publicados en main f3e2259, con CI/build/Pages y HTTP verificados. Las menciones a «en rama/no publicado» o permisos de las secciones históricas se refieren al cierre original de cada paso. Estado operativo actual: [04](04-project-status.md), arquitectura [02](02-architecture.md) y [operación 19](19-operations-and-verification.md).

Implementado en feature/nav-01-document-tree el 17-11-2026, sobre NAV-02 e39254b033dd5ad5771aa39772024dbcafc062ae. El usuario autorizó NAV-03 y pidió un apartado Navegación con demostración, un componente que conozca la jerarquía, migas arriba y navegación inferior. No se autoriza publicar, modificar main, abrir/fusionar PR ni release.

## Identidad y sintaxis

```md
[Documento](doc:doc-000007)
[Apartado](doc:doc-000007#ref-desarrollo)
[Nodo de tabla](doc:doc-000010#ref-medida-detalle)
```

El documento usa el ID editorial neutral ya reservado. El destino local es explícito, único en la página y debe cumplir `ref-` seguido de letra minúscula y letras/números/guiones. No se genera a partir del título ni del índice de fila. Conservar ambos IDs si se cambia el texto; renombrar o mover el archivo conserva la identidad documental. No se crean redirecciones para URLs antiguas.

Para apartados, usar HTML estándar con ID explícito:

```html
<h2 id="ref-desarrollo">Contenido</h2>
```

Es un destino estable, no el slug automático de un encabezado Markdown. Estos títulos HTML no se incorporan automáticamente al índice de encabezados de Markdown/Starlight. Los encabezados Markdown existentes conservan sus enlaces nativos; la sintaxis `doc:` de NAV-03 exige destinos explícitos ref-nombre.

Para nodos TreeTable:

```md
- Rama [id=ref-rama]
  - Detalle [id=ref-detalle]
```

`id` es opcional y **no heredable**. Es local al documento, así que distintas páginas pueden reutilizar ref-detalle; en una misma página no puede repetirse entre tablas o apartados. TreeTable valida el formato y duplicados dentro de su instancia; el build valida unicidad en el HTML completo. Los nodos sin ID siguen funcionando. Las claves data-tree-key siguen siendo internas para plegado, sin valor editorial.

MDX admite enlaces Markdown y un componente:

```mdx
import DocLink from '../components/DocLink.astro';

<DocLink to="doc:doc-000007#ref-desarrollo">Consultar desarrollo</DocLink>
```

Ajustar la ruta del import al archivo. Si no se proporciona slot, DocLink usa el título del documento. No transforma `<a href="doc:...">` arbitrario: el build lo rechaza sin resolver. Usar Markdown o DocLink. También se admiten enlaces Markdown por definición. Los links dentro de etiquetas TreeTable conservan la referencia semántica al sanear HTML inline.

## Resolución y validación

Remark convierte enlaces Markdown reales y añade data-doc-reference. No interpreta texto de código ni ejemplos raw. DocLink hace lo mismo desde MDX. El ID documental se resuelve usando el registro público actual, con base y ruta vigentes; borradores o documentos desconocidos no son destinos públicos.

Content Layer puede guardar HTML Markdown con una URL antigua. Por eso el override MarkdownContent vuelve a resolver las referencias marcadas durante cada render de servidor, con el índice vigente. No basta con resolver en Remark. La prueba de renombrado real detectó ese caso y el render lo corrige, conservando la validación final contra divergencias.

En astro:build:done se lee cada HTML generado y se comprueba:

- Destinos únicos; formato ref-nombre válido para IDs semánticos.
- Cada referencia apunta a documento publicado y fragmento existente, cuando lo especifica.
- URL generada coherente con el ID y ausencia de enlaces doc: sin resolver.
- Ejemplos de código escapados no cuentan como enlaces reales.

Se emite dist/references.json con referencias efectivamente renderizadas (source, target, fragment, href), además de navigation.json. No es una segunda fuente editable ni una UI de backlinks; NAV-04 añadirá citas inversas/contexto. Un destino que falta se rechaza al compilar; el servidor dev no sustituye esta validación completa.

## Salto a un destino plegado o dentro de pestañas

TreeTable.revealTarget(id) busca incluso celdas que salieron del DOM por plegado. Abre únicamente sus antecesores, actualiza los botones, reconstruye la tabla y conserva el plegado de ramas ajenas y del propio destino si tiene hijos. El cliente espera el registro de custom elements, selecciona el panel Starlight que contiene el destino, abre details antecesores y aplica desplazamiento, foco y resaltado.

Funciona en entrada directa con hash, cambios de hash y repetición del mismo destino después de volver a plegarlo. No intercepta clics modificados, descarga o apertura en otra pestaña. Los hashes normales conservan el comportamiento del navegador. El resaltado permanece hasta otro destino de referencia; no se añade animación. Sin JavaScript, la tabla conserva las celdas inicialmente renderizadas y los enlaces siguen siendo enlaces HTML, sin mejora de foco/revelado dinámico.

No se introduce ClientRouter, historial de sesión, restauración exacta del origen ni exportación offline. Si se imprime una rama en NAV-06 habrá que namespacear anclas por documento y transformar recursos/enlaces; dist no es todavía un HTML autónomo.

## DocumentNavigator y distribución

DocumentNavigator.astro lee Astro.locals.documentNavigation, proporcionado por el middleware a partir de navigation.id. No requiere props obligatorias ni listas manuales. Presenta ubicación actual, subir al padre, hermanos (marcando el actual), hijos inmediatos y anterior/siguiente global en preorden. La raíz no tiene padre/anterior; las hojas no muestran hijos; se omiten hermanos si no hay alternativas.

showTree=true por defecto permite el árbol completo dentro de un details abierto; showTree=false lo oculta. La wiki utiliza el modo sin árbol al pie y mantiene el árbol lateral; las migas quedan arriba, antes de título/hero. El ejemplo muestra el modo completo. Es un componente del proyecto, dependiente de su middleware y registro, no una biblioteca independiente publicada.

## Demostración en la wiki

src/content/docs/navegacion.mdx, ID doc-000010, parent doc-000001, order 30. Publicado en /AstroXmind/navegacion/. Incluye tres ejemplos con Resultado/Código y fuente única importada como componente y ?raw:

- navigation-context.mdx: DocumentNavigator detecta la página por sí solo.
- navigation-target.mdx: TreeTable plegada con IDs explícitos, camino profundo y rama ajena.
- navigation-link.mdx: DocLink funcional.

La portada y TreeTable enlazan al apartado. La serie doc-000005 ahora tiene parent doc-000010; sus cinco archivos permanecen juntos en pruebas-jerarquia/. Hay enlaces reales entre los cuatro artículos, apartados y el nodo de la tabla. No se introduce contenido normativo ni temario.

## Comprobaciones y límites

npm run check: árbol, pruebas de navegación/referencias y Astro check. npm run build: diez documentos, 404, registros y pruebas HTML/DOM. npm run test:references:rebuild: dos builds reales sobre una copia temporal, manteniendo caché y renombrando solo el archivo destino para verificar que las referencias se recalculan. Las fuentes del checkout no se modifican en esa prueba.

jsdom 26.1.0 se añade solo a devDependencies raíz y lockfile para pruebas DOM persistentes; no se incluye en el cliente ni en el laboratorio. Las pruebas ejecutan bundles compilados de TreeTable/Starlight Tabs y el módulo cliente de referencia. Comprueban celdas desprendidas, antecesores, rama ajena, Código/Resultado, foco, hash directo y repetido. No acreditan layout, scroll real, fullscreen nativo ni táctil. Chromium no pudo arrancar en este entorno; revisión visual pendiente.

Siguiente paso: NAV-04, enlaces salientes/entrantes automáticos con contexto y origen de cita. Requiere autorización propia. Integración/publicación siguen pendientes de aprobación expresa.

## Autorización de publicación posterior

El 17-11-2026 el usuario autorizó actualizar main y desplegar esta entrega, sin PR ni release. Las menciones anteriores a «solo en rama/no publicado» describen el cierre de implementación previo a esa autorización. Estado operativo y enlaces vigentes en [registro de publicación](17-navigation-publication.md). NAV-04 sigue sin autorización.
