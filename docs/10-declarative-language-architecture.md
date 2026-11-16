# Arquitectura del lenguaje declarativo

Estado implementado en main auditado el 16-11-2026. Las propuestas de clases por nivel y de compatibilidad MarkXMind todavía no están implementadas.

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

La [galería](https://pablogonzalezruiz.github.io/AstroXmind/demo-tablas/galeria-remark-directive/) es la referencia ejecutable.

```md
:::tabla-arbol{.Ley}
# TablaArbol

## Nodo1 {.rama-principal}
### Nodo1Subnodo1
### Nodo1Subnodo2

## Nodo2
### Nodo2Subnodo1
#### Nodo2Subnodo1Subnodo1
:::
```

Las directivas y encabezados admiten clases particulares. Los encabezados dentro de la directiva codifican jerarquía; el renderer calcula los `rowspan`/`colspan`.

El bloque `yaml xmind` transporta propiedades estructurales XMind. No debe contener configuración de estilos CSS.

## Mejora propuesta: clases por nivel

El código actual extrae clases en sufijos de encabezado como `{.rama-principal}`, pero no aplica automáticamente un mapa de clases a todos los nodos de una profundidad.

Propuesta de sintaxis, aún no implementada:

````md
:::rootTopic{.Ley}
```yaml clases
niveles:
  1: rama-principal
  2: [subrama, texto-oscuro]
  3: concepto-clave
```
# TablaArbol
## Nodo1
### Nodo1Subnodo1
#### Nodo1Subnodo1Subnodo1
:::
````

Reglas propuestas:

- Nivel 1 corresponde a `##`, primer nivel de topics debajo del título raíz `#`; `###` es nivel 2, y así sucesivamente.
- El mapa se declara una vez y da clases predeterminadas a cada celda del nivel correspondiente.
- Los atributos de clase del encabezado se conservan y se agregan a las clases por nivel; deduplicar sin alterar el orden.
- Una lista vacía permitiría no asignar clases predeterminadas a un nivel.
- La clase del bloque, como `.Ley`, sigue aplicándose al contenedor exterior.
- Mantener `yaml clases` separado de `yaml xmind`: CSS y propiedades serializables de XMind son contratos distintos.

La futura implementación debe añadir información explícita de nivel a cada celda y probar niveles omitidos, ramas desiguales, combinación de clases y valores mal formados.

## Referencia MarkXMind

[MarkXMind](https://github.com/jinzcdev/markxmind) usa XMindMark: texto jerárquico con indentación y marcadores compactos. Su README y guía documentan relaciones, límites, resúmenes, hipervínculos, notas y plegado, además de parsear/exportar `.xmind`. El paquete `@markxmind/markxmind-core` declara API para convertir entre el texto de XMindMark y modelos/archivos XMind; el repositorio indica licencia MIT.

Propuesta: adoptar sus **conceptos y casos de uso** como referencia para ampliar el modelo semántico de AstroXmind, manteniendo Markdown/remark-directive como formato fuente. La tabla de decisión técnica está en `docs/12-markxmind-compatibility.md`.

No copiar literalmente todos sus marcadores `[B]`, `[S]`, `[L:...]`, `[N:...]`, `[F]`: en AstroXmind Markdown las clases, enlaces, notas y directivas ya tienen representación propia y esos sufijos serían menos explícitos para una IA. Mapear los conceptos a directivas o bloques semánticos y conservar endpoints con IDs estables.

## Alternativa en evaluación: TreeTable Astro desde MDX

En `feature/mdx-tree-table` se prueba otra ruta para la presentación:

```text
lista Markdown en MDX
  → Astro.slots.render('default')
  → HTML de la lista
  → node-html-parser
  → árbol tipado en servidor
  → tabla HTML estática con rowspan/colspan
```

El ejemplo vive en `examples/astro-component-lab/`. La wiki comparte su componente en una página MDX; la página [Laboratorio de componentes Astro](../laboratorio-componentes/) enlaza a StackBlitz, donde el proyecto tiene preview Vite y terminal. El MDX del prototipo usa `extendMarkdownConfig: false` para no heredar el pipeline Remark/Rehype actual.

El slot debe contener exactamente una lista jerárquica sin ordenar. Se escribe con guiones y sangría Markdown: cada guion crea un nodo y su indentación determina el nivel. Los encabezados `#` no definen la jerarquía de la tabla; se reservan para los títulos y secciones del documento. El componente limpia atributos, conserva etiquetas inline permitidas y acepta solo enlaces con esquema/ruta segura. El cálculo reserva una fila por cada camino hoja; cada rama usa `rowspan` y cada hoja rellena las columnas restantes con `colspan`.

AST-019 está integrada y publicada en `main`. La prueba usa listas con guiones, ramas de distinta profundidad, énfasis y enlace. El procesador actual de las tablas declarativas `.md` continúa usando niveles de encabezado; este componente MDX es un formato alternativo explícito y no cambia ese contrato.

## Modelo y límites actuales

- Estructura: directiva `tabla-arbol`/`rootTopic` y niveles de encabezado.
- Presentación: clases CSS del bloque y clases particulares por encabezado.
- Propiedades XMind: YAML compacto con nombres que reflejan el JSON interno.
- Todavía no hay mapa de clases por nivel, resolución completa de presets, esquema exhaustivo ni serializador XMind.
- Verificar claves XMind con documentos exportados de XMind; no inferir su validez por el nombre.

## Decisiones pendientes

1. Revisar AST-019 en el sandbox y decidir si la salida, el manejo de errores y el flujo de edición satisfacen el uso previsto.
2. Integrar/regresar AST-012 y fijar el comportamiento mediante pruebas.
2. Implementar clases por nivel (AST-017).
4. Definir presets y herencia XMind (AST-013).
5. Modelar elementos de MarkXMind y la sintaxis de AstroXmind para ellos (AST-018).
6. Validar declaraciones y diseñar representación intermedia (AST-014).
7. Convertir a XMind y abrir, guardar y reabrir el resultado en XMind Desktop (AST-015).

No describir la implementación actual como un parser manual sin remark-directive; eso corresponde a una etapa histórica.
