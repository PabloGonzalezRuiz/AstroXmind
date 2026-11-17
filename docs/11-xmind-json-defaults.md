# Lenguaje AstroXmind alineado con el JSON de XMind

## Alcance histórico y estado vigente

Este documento conserva el diseño de presets y el prototipo Remark anterior. No describe el pipeline publicado actual: la wiki usa TreeTable MDX y no carga presets ni exporta XMind. La galería mencionada al final ya no se publica. Las correspondencias de exportación son objetivos, no funcionalidad disponible.

## Decisión

La fuente declarativa representará los objetos y propiedades de XMind que sean relevantes para convertir el Markdown a `.xmind`. Se exigirán pocos datos de entrada. Cada propiedad omitida se completará a partir de valores predeterminados asociados a la estructura seleccionada.

La estructura de referencia `TablaArbol` usa una sola propiedad estructural explícita: `rootTopic.structureClass = "org.xmind.ui.treetable.toptitle"`. Ese valor selecciona la tabla árbol con título superior. XMind ofrece también una variante con el título a la izquierda; su valor exacto de `structureClass` se incorporará cuando tengamos una exportación JSON real de esa variante. Las opciones internas que el usuario no cambia se mantienen en el preset predeterminado de XMind.

Los JSON predeterminados se obtendrán de archivos `.xmind` creados y exportados desde XMind Desktop. No se inventarán como si fueran salidas de XMind. Los ejemplos reales del repositorio serán la evidencia para extraer presets reutilizables.

## Sintaxis mínima

````md
:::rootTopic
```yaml xmind
structureClass: org.xmind.ui.treetable.toptitle
```
# TablaArbol

## Nodo1
### Nodo1Subnodo1
### Nodo1Subnodo2

## Nodo2
### Nodo1Subnodo2
#### Nodo1Subnodo2Subnodo1
:::
````

La directiva `rootTopic` representa el objeto `rootTopic` del JSON de XMind. Para esta tabla, `structureClass` es la única propiedad estructural que se declara: las demás se resuelven con el preset JSON de esa variante. La propiedad se escribe en un bloque `yaml xmind` con sintaxis jerárquica sin comillas, y conserva el nombre y los tipos de XMind. La clase `.Ley` es una presentación CSS opcional y no se confunde con una propiedad estructural.

| Fuente declarativa | Destino XMind |
| --- | --- |
| `structureClass: org.xmind.ui.treetable.toptitle` en bloque `yaml xmind` | `rootTopic.structureClass` |
| `# TablaArbol` | `rootTopic.title` |
| `##` y encabezados inferiores | Elementos recursivos de `children.attached` |
| `.Ley` | Preset opcional de presentación CSS de AstroXmind |
| Bloque indentado `yaml xmind` | Propiedades del objeto raíz o del tema al que sigue |

Los encabezados de nodo aceptan etiquetas CSS y un ancla al final, por ejemplo `## Derechos {.rama-principal #derechos}`. Las clases se aplican a la celda HTML de ese tema y se resuelven mediante CSS; `#derechos` es un ancla de la wiki. Las propiedades XMind del tema se declaran en un bloque `yaml xmind` independiente, colocado inmediatamente después del encabezado. La clase CSS y `structureClass` tienen funciones distintas: la segunda selecciona la variante estructural exportada por XMind; la primera solo elige una regla de presentación web.

Por ejemplo, `customWidth: 978` dentro de un bloque `yaml xmind` añade un valor numérico a `rootTopic.customWidth`. Esa propiedad sobrescribe solo el ancho que venga del preset; lo demás se conserva. Un tema puede incluir un bloque propio; las propiedades anidadas como `style.properties.fo:font-weight` se escriben con sangría y se convierten al objeto equivalente al exportar.

## Orden de valores predeterminados y sobrescrituras

La resolución prevista, desde menor a mayor prioridad, es:

1. Valores globales compatibles con el formato XMind.
2. JSON predeterminado de la estructura seleccionada por `structureClass`, extraído de ejemplos reales de XMind.
3. Preset visual opcional seleccionado por una clase como `.Ley`.
4. Propiedades escritas explícitamente en la fuente.
5. Títulos y jerarquía escritos en encabezados, que siempre prevalecen sobre títulos de ejemplo del preset.

Los objetos JSON se combinarán por propiedad para permitir sobrescrituras parciales. Las listas se reemplazarán completas, salvo que una propiedad defina otra regla; concatenarlas por defecto puede duplicar temas, colores o elementos de orden. Los valores de propiedades con tipo conocido se validarán y convertirán al tipo correspondiente.

## Ubicación futura de los presets

Cada `structureClass` tendrá un JSON predeterminado independiente que contenga solo la configuración reutilizable, sin títulos, identificadores aleatorios ni los nodos concretos de una prueba. El preset incluye los subvalores que XMind no expone en la fuente y conserva el comportamiento predeterminado de la aplicación. Los presets visuales podrán reutilizar propiedades de `theme` y estilos XMind además del CSS de la wiki. Al crear un preset, se partirá de un `.xmind` generado por la aplicación y se separarán los valores de estructura/estilo de los datos específicos del mapa.

El archivo [`examples/xmind/TablaArbol/content.json`](../examples/xmind/TablaArbol/content.json) se conserva como **referencia de exportación real**, no como preset directamente cargable: incluye los nombres del ejemplo, IDs de sesión, `revisionId` y el tema exportado completo.

## Estado de implementación

La galería convierte `rootTopic`, `structureClass`, encabezados y bloques `yaml xmind` en una vista HTML con `rowspan` y `colspan`. Las clases CSS por encabezado se aplican a la celda correspondiente; las propiedades declaradas en los bloques se conservan en `data-xmind-properties`, pero todavía no se traducen a CSS ni a un `.xmind`. La carga de JSON predeterminados por estructura y la generación del `.xmind` desde esa configuración siguen siendo fases futuras.

## Estado contrastado — 17-11-2026

Referencia publicada: `e7bfb8e7f41ec5637c685e62698eb12b7ab1b658`. Clases AST-017, plegado AST-025 y numeración heredable AST-026 están publicados. El siguiente cambio funcional es estado inicial AST-028; Summary/Boundary aplazados. La biblioteca AST-027 sigue al final. Estado operativo y contrato completos: [estado](04-project-status.md), [contrato](10-declarative-language-architecture.md) y [hoja de ruta](03-roadmap.md). Las propuestas de presets/exportación o directivas heredadas no describen funcionalidad disponible del componente actual.
