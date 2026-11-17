# NAV-01 · Contrato del árbol documental

Implementado y validado en rama el 17-11-2026; no publicado. Base de código main 5f1a33f; se incorpora la planificación documental 3b14131. No hay UI de navegación nueva en NAV-01.

## Metadatos canónicos

```yaml
---
title: Derechos fundamentales
navigation:
  id: doc-000042
  parent: doc-000010
  order: 20
---
```

El ejemplo ilustra el formato: para usar un ID real hay que reservarlo primero y que su padre exista. No copiar esos números arbitrarios en producción. Los tres campos navigation son obligatorios y no admiten claves adicionales.

| Campo | Contrato |
|---|---|
| id | Cadena doc- seguida de seis dígitos. Única dentro del proyecto e identidad editorial inmutable. No codifica título, carpeta, padre ni profundidad. |
| parent | ID del padre directo o null explícito para la única raíz. No se deduce de directorios. |
| order | Entero seguro no negativo, solo orden entre hermanos. Desempate por ID para resultado estable. |
| title | Título visible habitual del frontmatter. Se puede cambiar sin renombrar el ID. |

## IDs y generación

navigation-ids.json conserva todos los IDs emitidos, incluidos los que no tienen página activa o pertenecen a páginas eliminadas. No borrar entradas para reutilizarlas. El generador reserva de forma monotónica el siguiente número libre y escribe el registro con un bloqueo exclusivo y reemplazo atómico. No cambia IDs existentes, no inventa títulos y no crea páginas.

```sh
npm run --silent navigation:id
```

La salida es el nuevo ID reservado. Copiarlo al YAML del documento y guardar ambos archivos en el mismo cambio. El validador rechaza IDs no reservados o duplicados; si dos ramas de Git asignan el mismo ID de forma independiente, resolver la colisión antes de integrar. Unicidad es dentro del proyecto, no entre proyectos ajenos. No hace falta que los IDs sean consecutivos en documentos activos. El formato se debe ampliar deliberadamente al agotar seis dígitos.

## Árbol actual

| Documento | ID | Padre | Orden |
|---|---|---|---|
| Inicio | doc-000001 | null | 0 |
| Guía de componentes | doc-000002 | doc-000001 | 10 |
| TreeTable | doc-000003 | doc-000002 | 10 |
| Laboratorio | doc-000004 | doc-000001 | 20 |

Las URLs existentes permanecen iguales. La posición lógica de TreeTable es bajo la guía aunque su archivo esté en componentes/. Todos los documentos podrían estar en una carpeta plana sin cambiar relaciones; hay pruebas que reconstruyen y mueven ramas desde YAML real en esa situación.

## Mover una rama

Cambiar solo navigation.parent de la raíz de la rama traslada todos sus descendientes lógicos. No modificar parent en los descendientes, sus IDs ni sus rutas. Cambiar order es opcional si se desea otra posición entre los nuevos hermanos. No se admite mover una rama dentro de sí misma ni de sus descendientes.

Ejemplo con IDs del árbol actual: cambiar parent de la guía doc-000002 a doc-000004 mueve la guía y TreeTable bajo Laboratorio; TreeTable conserva parent doc-000002. Es un ejemplo de operación, no el árbol guardado en esta rama.

## Instrucciones de reconstrucción para IA

1. Leer el frontmatter de todos los documentos del ámbito; no usar su orden físico, títulos ni carpetas para inferir parentesco.
2. Crear un mapa por navigation.id y comprobar unicidad y reserva del ID.
3. Localizar la raíz con parent null; conectar el resto por ID exacto.
4. Rechazar padres ausentes, autopadres, ciclos, raíces extra y order inválido; no reparar ni adivinar automáticamente.
5. Ordenar hermanos por order y desempatar por ID.
6. Recorrer el árbol en preorden; la rama de un documento es él y todos sus descendientes. Las referencias cruzadas no añaden hijos.
7. Conservar IDs al cambiar título, archivo o URL. Para trasladar una rama, editar solo parent de su raíz.

## Ámbito y publicación

Solo páginas de src/content/docs con las extensiones Markdown/MDX admitidas por Starlight; no docs/ de mantenimiento, src/examples ni nombres de archivo que empiezan por _. Los borradores se validan, pero se excluyen del registro público; un documento público no puede depender de un padre borrador. La raíz debe ser pública. Esta primera versión es para la configuración de idioma raíz y salida estática del proyecto actual. Antes de añadir idiomas/routing personalizado, adaptar el resolver y probar la coincidencia con las rutas generadas.

## Comandos y registro

```sh
npm run navigation:check
npm run test:navigation
npm run check
npm run build
```

Check valida el árbol, ejecuta las pruebas y después Astro check. Build valida independientemente en astro:build:start; también falla si se salta check. En astro:build:done verifica que cada ruta del registro tiene HTML generado y escribe dist/navigation.json. No añade páginas HTML ni cambia los cuatro enlaces actuales. El JSON es salida derivada, no una segunda fuente para editar.

El build usa base, trailingSlash y formato de salida de Astro. navigation:check comprueba la estructura con URLs relativas al ámbito por defecto; el registro final usa la base de publicación. El pipeline de seguridad y los workflows existentes no se cambian; CI ejecutará las comprobaciones mediante npm run check/build cuando corresponda. No se han lanzado Actions de la rama como parte de NAV-01.

## API disponible

src/lib/navigation/index.mjs expone buildNavigationIndex, getNode, getParent, getChildren, getAncestors y getDescendants. getAncestors devuelve de raíz a padre; getDescendants usa preorden y admite includeSelf para obtener una rama completa. Las consultas retornan nodos con identidad, título, URL, padre, orden, hijos y antecesores. El índice se congela para evitar cambios accidentales durante consultas.

Scripts: navigation-content.mjs lee YAML y construye el registro; navigation-integration.mjs conecta validación/emisión con Astro; navigation.mjs ofrece check y reserva de IDs. No se añadieron dependencias npm ni servidor externo. La interfaz gráfica padre/hijos/breadcrumbs corresponde a NAV-02, ya autorizado e implementado en esta rama; ver docs/15-contextual-navigation.md.

Cambiar la URL mantiene identidad y pertenencia, pero NAV-01 no crea redirecciones ni reescribe enlaces Markdown literales a una ruta antigua. Esa resolución de referencias corresponde a NAV-03.

## Evolución NAV-02

La ausencia de UI descrita arriba corresponde al alcance original de NAV-01. NAV-02 ya implementa esa UI en la misma rama, sin publicarla. El registro incluye ahora cinco documentos nuevos de prueba (doc-000005…9), todos en una carpeta plana. Ver [contrato contextual](15-contextual-navigation.md). La interfaz sigue leyendo el mismo registro; no hay otro árbol editable. El build también prueba el HTML contextual de cada página.
