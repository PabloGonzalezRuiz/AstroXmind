# Arquitectura del lenguaje declarativo

Estado de `main` auditado el 16-11-2026; AST-017 se implementa en la rama aislada `feature/ast-017-level-classes`.

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

El plugin remark interpreta directivas y bloques YAML etiquetados como `xmind` o `clases`. El plugin Rehype genera la representación de tabla. Las clases se aplican por CSS. Los metadatos XMind se transportan durante la compilación, pero no se convierten todavía en un archivo `.xmind`.

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

## Clases CSS por nivel (AST-017)

El plugin aplica un mapa de clases CSS a cada nodo según su profundidad. La configuración se mantiene separada de las propiedades XMind:

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

Reglas implementadas en la rama AST-017:

- Nivel 1 corresponde a `##`, primer nivel de topics debajo del título raíz `#`; `###` es nivel 2, y así sucesivamente.
- El mapa se declara una vez y da clases predeterminadas a cada celda del nivel correspondiente.
- Los atributos de clase del encabezado se conservan y se agregan a las clases por nivel; deduplicar sin alterar el orden.
- Una lista vacía no asigna clases automáticas a ese nivel.
- Se admiten niveles positivos y nombres CSS que empiezan por letra o guion bajo y continúan con letras, números, guion o guion bajo.
- Los bloques `yaml clases` sucesivos combinan sus clases por nivel; se eliminan duplicados preservando el orden.
- La clase del bloque, como `.Ley`, sigue aplicándose al contenedor exterior.
- Mantener `yaml clases` separado de `yaml xmind`: CSS y propiedades serializables de XMind son contratos distintos.
- La misma asignación por profundidad se aplica a árboles de encabezados y directivas anidadas `nodo`.

## Referencia MarkXMind

[MarkXMind](https://github.com/jinzcdev/markxmind) usa XMindMark: texto jerárquico con indentación y marcadores compactos. Su README y guía documentan relaciones, límites, resúmenes, hipervínculos, notas y plegado, además de parsear/exportar `.xmind`. El paquete `@markxmind/markxmind-core` declara API para convertir entre el texto de XMindMark y modelos/archivos XMind; el repositorio indica licencia MIT.

Propuesta: adoptar sus **conceptos y casos de uso** como referencia para ampliar el modelo semántico de AstroXmind, manteniendo Markdown/remark-directive como formato fuente. La tabla de decisión técnica está en `docs/12-markxmind-compatibility.md`.

No copiar literalmente todos sus marcadores `[B]`, `[S]`, `[L:...]`, `[N:...]`, `[F]`: en AstroXmind Markdown las clases, enlaces, notas y directivas ya tienen representación propia y esos sufijos serían menos explícitos para una IA. Mapear los conceptos a directivas o bloques semánticos y conservar endpoints con IDs estables.

## Modelo y límites actuales

- Estructura: directiva `tabla-arbol`/`rootTopic` y niveles de encabezado.
- Presentación: clases CSS del bloque y clases particulares por encabezado.
- Propiedades XMind: YAML compacto con nombres que reflejan el JSON interno.
- El mapa de clases por nivel está implementado en la rama AST-017; aún no está en `main`.
- Siguen pendientes la resolución completa de presets, el esquema exhaustivo y el serializador XMind.
- Verificar claves XMind con documentos exportados de XMind; no inferir su validez por el nombre.

## Decisiones pendientes

1. Integrar/regresar AST-012 y fijar el comportamiento mediante pruebas.
2. Revisar y validar la implementación AST-017 en `feature/ast-017-level-classes` antes de integrarla.
3. Definir presets y herencia XMind (AST-013).
4. Modelar elementos de MarkXMind y la sintaxis de AstroXmind para ellos (AST-018).
5. Validar declaraciones y diseñar representación intermedia (AST-014).
6. Convertir a XMind y abrir, guardar y reabrir el resultado en XMind Desktop (AST-015).

No describir la implementación actual como un parser manual sin remark-directive; eso corresponde a una etapa histórica.
