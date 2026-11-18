# NAV-02 · Navegación contextual y artículos de prueba

**Estado vigente (18-11-2026):** NAV-01/02/03 y ampliación de ordenación publicados en main f3e2259, con CI/build/Pages y HTTP verificados. Las menciones a «en rama/no publicado» o permisos de las secciones históricas se refieren al cierre original de cada paso. Estado operativo actual: [04](04-project-status.md), arquitectura [02](02-architecture.md) y [operación 19](19-operations-and-verification.md).

Implementado en feature/nav-01-document-tree el 17-11-2026, sobre NAV-01 1aa5a59. Autorizado por el usuario, incluida la petición posterior de artículos en documentos distintos de una misma carpeta. Sin publicación, PR ni cambios en main.

## Comportamiento

- Ruta de ubicación: antecesores desde la raíz y título actual con aria-current.
- Subir: padre inmediato; se omite en la raíz.
- Dentro de este documento: hijos inmediatos ordenados por order, fecha YAML y finalmente ID; se omite en hojas.
- Anterior/siguiente: recorrido global preorden del árbol público, entrando en cada rama antes de pasar a la siguiente. Se omiten enlaces en los extremos, sin recorrido circular.
- Árbol lateral: jerarquía completa en listas HTML anidadas y enlace de página actual marcado. Se muestra también en la portada splash. No se añaden controles de plegado del menú en este paso.

Son enlaces HTML normales, disponibles sin JavaScript propio. Starlight conserva el control de apertura del menú en móvil. No se cambia el componente TreeTable ni su lenguaje. Las regiones contextuales se excluyen de Pagefind para no duplicar títulos ajenos en cada página. El 404 técnico no recibe un contexto documental falso.

## Una carpeta, varias profundidades lógicas

Todos estos archivos se guardan directamente en src/content/docs/pruebas-jerarquia/, sin subcarpetas:

| Archivo | ID | Padre | Orden |
|---|---|---|---|
| serie.md | doc-000005 | doc-000010 (Navegación, desde NAV-03) | 30 |
| articulo-1.md | doc-000006 | doc-000005 | 10 |
| articulo-2.md | doc-000007 | doc-000006 | 10 |
| articulo-3.md | doc-000008 | doc-000007 | 10 |
| articulo-4.md | doc-000009 | doc-000005 | 20 |

El árbol presenta serie → artículo 1 → artículo 2 → artículo 3, y artículo 4 como hermano de artículo 1. Contenido ficticio de demostración, sin valor normativo. Cambiar el nombre del archivo o su carpeta no cambia el parentesco.

## Prueba de traslado

En articulo-2.md, conservar id y order y cambiar solo parent:

```yaml
navigation:
  id: doc-000007
  parent: doc-000009
  order: 10
```

La rama Artículo 2 → Artículo 3 queda bajo Artículo 4. El padre del Artículo 3 sigue siendo doc-000007. IDs, archivos y URLs permanecen iguales; ruta de ubicación, hijos, menú y recorrido se recalculan. Para deshacer la prueba, devolver parent a doc-000006. Un intento de mover bajo un descendiente falla por ciclo.

## Arquitectura y ejecución

La integración Astro expone un módulo virtual de servidor que invoca loadNavigation con root/base/trailingSlash/formato resueltos. La UI y navigation.json usan el mismo lector y validador. El middleware de Starlight obtiene el contexto por ID editorial; PageTitle y Hero añaden la ruta; Sidebar presenta el árbol; Pagination añade hijos y recorrido. No hay menú manual, petición de red para cargar el JSON ni índice editable adicional.

La lectura por render refleja las ediciones en desarrollo sin reiniciar el servidor. La salida continúa siendo estática; en producción hay que reconstruir para actualizar metadatos. Ámbito actual: root locale, configuración de rutas existente de la wiki. No se introduce una solución multilingüe en NAV-02.

```sh
npm ci
npm run check
npm run build
npm run dev
```

Abrir /AstroXmind/pruebas-jerarquia/serie/ en el servidor anunciado. El sitio público conserva las cuatro páginas originales: no dar la URL de Pages de esta serie como si ya existiera.

## Validación y límites

26 pruebas de árbol/contexto; Astro check sin errores/avisos. Tras build, diez pruebas del HTML real contrastan todas las páginas y el 404 con el registro: parentesco, ruta, hijos, árbol anidado, página actual y recorrido. Traslado real probado editando un parent, reconstruyendo y pasando las pruebas HTML; estado inicial restaurado. Ver auditoría NAV-02.

Sin inspección visual completa ni revisión manual de teclado/táctil; no atribuir esa cobertura al build. Sin nuevos paquetes ni workflows. NAV-03 queda pendiente de autorización: referencias estables a documentos, apartados y nodos, con revelado del destino. Backlinks corresponden a NAV-04; exportación offline a NAV-06.

## Evolución autorizada en NAV-03

El componente inferior se extrae a src/components/DocumentNavigator.astro y añade hermanos y enlace al padre; detecta la página actual sin props obligatorias y permite showTree=false para ocultar el árbol integrado. La wiki mantiene migas arriba y árbol lateral. El apartado Navegación doc-000010 aloja su demo y la de referencias a tabla, ambas con Resultado/Código. La serie doc-000005 pasa bajo Navegación conservando todos sus archivos en la misma carpeta; la tabla de metadatos refleja este cambio; la auditoría histórica de NAV-02 conserva el estado original. Ver docs/16-document-references.md. NAV-03 ya implementado; NAV-04 requiere autorización.

## Ampliación de ordenación publicada

Order es opcional: los documentos sin orden van al final, por created/modified explícitas del YAML (con milisegundos), y muestran «Pendiente de ordenar». Los números heredan ordinales consecutivos por nivel, no los valores de order; duplicados comparten número. [Contrato completo](20-navigation-ordering.md). No se usan fechas del archivo, Git o del ledger, ni se publica esta ampliación por documentarla.
