# Lenguaje AstroXmind alineado con el JSON de XMind

## Decisión

La fuente declarativa representará los objetos y propiedades de XMind que sean relevantes para convertir el Markdown a `.xmind`. Se exigirán pocos datos de entrada. Cada propiedad omitida se completará a partir de valores predeterminados asociados a la estructura seleccionada.

La estructura de referencia `TablaArbol` usa `rootTopic.structureClass = "org.xmind.ui.treetable.toptitle"`.

Los JSON predeterminados se obtendrán de archivos `.xmind` creados y exportados desde XMind Desktop. No se inventarán como si fueran salidas de XMind. Los ejemplos reales del repositorio serán la evidencia para extraer presets reutilizables.

## Sintaxis mínima

```md
:::rootTopic{structureClass="org.xmind.ui.treetable.toptitle"}
# TablaArbol

## Nodo1
### Nodo1Subnodo1
### Nodo1Subnodo2

## Nodo2
### Nodo1Subnodo2
#### Nodo1Subnodo2Subnodo1
:::
```

La directiva `rootTopic` representa el objeto `rootTopic` del JSON de XMind. Para esta tabla, `structureClass` es la única propiedad XMind obligatoria: las demás se resuelven con el preset JSON de esa estructura. Los atributos usan los nombres de propiedad de XMind, incluida la capitalización. La clase `.Ley` es una presentación opcional del ejemplo y no se confunde con una propiedad JSON.

| Fuente declarativa | Destino XMind |
| --- | --- |
| `structureClass="org.xmind.ui.treetable.toptitle"` | `rootTopic.structureClass` |
| `# TablaArbol` | `rootTopic.title` |
| `##` y encabezados inferiores | Elementos recursivos de `children.attached` |
| `.Ley` | Preset opcional de presentación de AstroXmind |
| Otros atributos de `rootTopic` | Propiedades homónimas del objeto raíz |

Por ejemplo, `customWidth="978"` añade un valor explícito para `rootTopic.customWidth`. Esa propiedad sobrescribe solo el ancho que venga del preset; lo demás se conserva. Las propiedades numéricas, booleanas y JSON deben conservar su tipo al resolver el modelo.

## Orden de valores predeterminados y sobrescrituras

La resolución prevista, desde menor a mayor prioridad, es:

1. Valores globales compatibles con el formato XMind.
2. JSON predeterminado de la estructura seleccionada por `structureClass`, extraído de ejemplos reales de XMind.
3. Preset visual opcional seleccionado por una clase como `.Ley`.
4. Propiedades escritas explícitamente en la fuente.
5. Títulos y jerarquía escritos en encabezados, que siempre prevalecen sobre títulos de ejemplo del preset.

Los objetos JSON se combinarán por propiedad para permitir sobrescrituras parciales. Las listas se reemplazarán completas, salvo que una propiedad defina otra regla; concatenarlas por defecto puede duplicar temas, colores o elementos de orden. Los valores de propiedades con tipo conocido se validarán y convertirán al tipo correspondiente.

## Ubicación futura de los presets

Cada `structureClass` tendrá un JSON predeterminado independiente que contenga solo la configuración reutilizable, sin títulos, identificadores aleatorios ni los nodos concretos de una prueba. Los presets visuales podrán reutilizar propiedades de `theme` y estilos XMind además del CSS de la wiki. Al crear un preset, se partirá de un `.xmind` generado por la aplicación y se separarán los valores de estructura/estilo de los datos específicos del mapa.

El archivo [`examples/xmind/TablaArbol/content.json`](../examples/xmind/TablaArbol/content.json) se conserva como **referencia de exportación real**, no como preset directamente cargable: incluye los nombres del ejemplo, IDs de sesión, `revisionId` y el tema exportado completo.

## Estado de implementación

La galería ya convierte `rootTopic`, `structureClass`, encabezados y atributos explícitos en una vista HTML con `rowspan` y `colspan`. Conserva las propiedades de entrada en `data-xmind-properties`. La carga de JSON predeterminados por estructura, la combinación profunda con presets y la generación del `.xmind` desde esa configuración siguen siendo fases futuras.
