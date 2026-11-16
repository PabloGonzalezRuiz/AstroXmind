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

## Modelo y límites actuales

- Estructura: directiva `tabla-arbol`/`rootTopic` y niveles de encabezado.
- Presentación: clases CSS del bloque y clases particulares por encabezado.
- Propiedades XMind: YAML compacto con nombres que reflejan el JSON interno.
- Todavía no hay mapa de clases por nivel, resolución completa de presets, esquema exhaustivo ni serializador XMind.
- Verificar claves XMind con documentos exportados de XMind; no inferir su validez por el nombre.

## Decisiones pendientes

1. Integrar/regresar AST-012 y fijar el comportamiento mediante pruebas.
2. Implementar clases por nivel (AST-017).
3. Definir presets y herencia XMind (AST-013).
4. Modelar elementos de MarkXMind y la sintaxis de AstroXmind para ellos (AST-018).
5. Validar declaraciones y diseñar representación intermedia (AST-014).
6. Convertir a XMind y abrir, guardar y reabrir el resultado en XMind Desktop (AST-015).

No describir la implementación actual como un parser manual sin remark-directive; eso corresponde a una etapa histórica.
