# Ejemplo XMind: TablaArbol

Este directorio conserva juntos los tres artefactos del ejemplo de referencia:

- [`TablaArbol.md`](./TablaArbol.md): Markdown importado en XMind.
- [`TablaArbol.xmind`](./TablaArbol.xmind): archivo de trabajo de XMind.
- [`content.json`](./content.json): JSON exportado por XMind; coincide con el `content.json` incluido dentro del `.xmind`.

La estructura observada en XMind corresponde a estas relaciones:

```text
TablaArbol
├── Nodo1
│   ├── Nodo1Subnodo1
│   └── Nodo1Subnodo2
└── Nodo2
    └── Nodo1Subnodo2
        └── Nodo1Subnodo2Subnodo1
```

## Correspondencia con el Markdown

El Markdown conservado es la entrada importada originalmente en XMind. La entrada mínima de AstroXmind declara solo `structureClass="org.xmind.ui.treetable.toptitle"`; el resto se cargará del preset JSON de esa estructura. El `#` define `rootTopic.title`; `##` y niveles inferiores forman el árbol `children.attached`. Así, el último elemento que aparece como lista en el archivo importado se normaliza como un encabezado `####` en la fuente AstroXmind. `.Ley` y propiedades como `customWidth="978"` son opcionales: activan una presentación concreta o sobrescriben solo ese valor.

La geometría de la tabla tiene una fila por camino hasta una hoja. Cada nivel ocupa una columna. Por tanto, `Nodo1` ocupa dos filas (`rowspan=2`) porque tiene dos hojas; `Nodo2` y sus descendientes ocupan una fila. La celda raíz del título se extiende por las tres columnas (`colspan=3`).

## Propiedades del JSON de XMind

El archivo `.xmind` es un ZIP. En esta muestra contiene `content.json`, `content.xml`, `metadata.json`, `manifest.json` y una miniatura. El JSON separado en este directorio es idéntico al JSON interno del archivo XMind.

| Propiedad | Ubicación en la muestra | Uso para la conversión |
| --- | --- | --- |
| `structureClass` | `rootTopic.structureClass` | Propiedad estructural clave: `org.xmind.ui.treetable.toptitle` selecciona la tabla árbol con título superior. |
| `children.attached` | En cada tema | Conserva la jerarquía y el orden de los hijos; es el origen del árbol de filas y columnas. |
| `title` | Cada tema | Texto que debe conservarse en su nodo correspondiente. |
| `id` | Cada tema y hoja | Identificadores internos de XMind; conviene generarlos al exportar y mantenerlos estables si se necesita sincronización posterior. |
| `style` | Raíz y algunos temas | Estilos locales con un `id` y `properties`; en el ejemplo contienen propiedades `fo:*` y `fill-pattern`. |
| `theme` | Hoja (`sheet`) | Estilos globales y de nivel, incluidas familia/tamaño de fuente, color, forma, bordes y líneas. |
| `customWidth` | Tema raíz | Ancho personalizado guardado por XMind (`978` en esta muestra); no se necesita para reconstruir el árbol básico. |

Valores destacables de esta exportación: el fondo de la hoja está en `style.properties["svg:fill"]` (`#EEEEEEFF`); la familia de letra global es `theme.global.properties["fo:font-family"]` (`NeverMind Hand`); y el mapa de colores del tema está en `theme.map.properties["color-list"]`. Las propiedades de texto y forma usan espacios de nombres como `fo:*`, `svg:*`, `shape-class` y `line-class`.

Para la primera conversión, Remark debe preservar la semántica mediante el bloque `tabla-arbol`, convertir títulos y listas en nodos jerárquicos y conservar el valor de `structureClass` como metadato. Las propiedades visuales `fo:*`, `svg:*`, `shape-class` y `line-*` deben tratarse después como estilos opcionales, no confundirse con la estructura del árbol.

En la galería web, el bloque `rootTopic` conserva el objeto jerárquico; `structureClass="org.xmind.ui.treetable.toptitle"` y las demás propiedades XMind se guardan en `data-xmind-properties`. Los valores numéricos, booleanos y JSON se tipan al crear ese metadato (`customWidth="978"` se convierte en `978`). La clase `.Ley` es un preset de presentación opcional, independiente del estilo JSON de XMind.

Ver también la [norma de presets y sobrescrituras](../../../docs/11-xmind-json-defaults.md).
