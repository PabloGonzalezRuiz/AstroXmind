# Arquitectura del lenguaje declarativo

Estado implementado en main auditado el 16-11-2026.

## Objetivo

Describir con poca sintaxis la estructura de tablas y nodos, sus clases de presentación y las propiedades que más adelante se podrán convertir a XMind. Los defaults deben reducir escritura repetitiva y las sobrescrituras locales aportar flexibilidad.

## Flujo actual

```text
Markdown/MDX
  → remark-directive
  → scripts/remark-semantic.mjs
  → AST con datos semánticos
  → rehypeTreeTable
  → HTML y CSS
  → Astro/Starlight y GitHub Pages
```

El plugin remark interpreta directivas y bloques YAML etiquetados como `xmind`. El plugin Rehype genera la representación de tabla. Las clases se aplican por CSS. Los metadatos XMind se transportan durante la compilación, pero no se convierten todavía en un archivo `.xmind`.

## Sintaxis disponible

La galería del sitio es la referencia ejecutable y debe mantenerse al día:
https://pablogonzalezruiz.github.io/AstroXmind/demo-tablas/galeria-remark-directive/

Forma de tabla árbol:

```md
:::tabla-arbol{.Ley}
# TablaArbol

## Nodo1

### Nodo1Subnodo1

### Nodo1Subnodo2

## Nodo2

### Nodo2Subnodo1

#### Nodo2Subnodo1Subnodo1
:::
```

Las directivas admiten clase CSS y atributos de ancla según la gramática implementada. Los encabezados dentro de la directiva codifican jerarquía; no escribir a mano los `rowspan`/`colspan` del resultado.

Propiedades XMind:

```md
```xmind
root:
  structureClass: org.xmind.ui.treetable.toptitle
topic:
  style:
    # propiedades de tema que se hayan verificado con un JSON de XMind
```
```

El ejemplo es un esqueleto: declarar solo claves comprobadas. El bloque se asocia a la directiva aplicable y guarda objetos de propiedades de raíz/topic en datos del AST. Ver el ejemplo completo y reglas en `docs/11-xmind-json-defaults.md`.

## Modelo y límites actuales

- Estructura: directiva `tabla-arbol` y niveles de encabezado.
- Presentación: clases CSS; se separa de datos semánticos.
- Propiedades XMind: YAML compacto, nombres que reflejan la estructura del JSON interno.
- Aún no hay resolución completa desde presets predeterminados, ni esquema exhaustivo, ni serializador XMind.
- Las claves de XMind deben comprobarse en documentos reales exportados y no inferirse solo por nombre.

## Decisiones pendientes

1. Definir un catálogo de presets basado en ejemplos .xmind reales.
2. Acordar la precedencia entre preset, defaults por tipo/nivel y sobrescrituras locales.
3. Definir validación y políticas para claves desconocidas y valores inválidos.
4. Definir representación intermedia independiente del HTML.
5. Probar el serializador abriendo, guardando y reabriendo el resultado en XMind Desktop.

No se debe volver a describir el sistema como un parser manual sin remark-directive; eso corresponde a una etapa histórica.
