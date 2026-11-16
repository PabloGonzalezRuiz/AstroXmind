# Evaluación de MarkXMind para AstroXmind

Revisión de la rama `main` del repositorio público el 16-11-2026.

- Proyecto: [jinzcdev/markxmind](https://github.com/jinzcdev/markxmind)
- Guía de sintaxis: [docs/xmindmark-syntax.md](https://github.com/jinzcdev/markxmind/blob/main/docs/xmindmark-syntax.md)
- Especificación: [docs/specification.md](https://github.com/jinzcdev/markxmind/blob/main/docs/specification.md)
- Paquete de parser: [@markxmind/markxmind-core](https://www.npmjs.com/package/@markxmind/markxmind-core)
- El repositorio declara MIT. Antes de incorporar el paquete, volver a inspeccionar la licencia publicada y auditar sus dependencias/versiones.

## Qué aporta

MarkXMind define XMindMark, sintaxis compacta basada en líneas e indentación, y describe marcadores para:
- relaciones entre topics mediante pares `[n]`/`[^n]` y etiqueta opcional;
- límites que agrupan topics hermanos consecutivos, con título opcional;
- resúmenes de hermanos, también con título y subtopics;
- enlaces `[L:url]`;
- notas de texto plano `[N:contenido]`;
- plegado inicial `[F]`.

README y paquete core anuncian funciones para parsear el lenguaje a un modelo de hoja, exportar `.xmind` y convertir un archivo `.xmind` a XMindMark. El README también declara exportación de SVG/PNG desde el editor web. Su modelo apunta a mapas mentales y no documenta clases CSS por nivel ni la tabla HTML de tipo árbol que estamos desarrollando.

## Diagnóstico de compatibilidad

AstroXmind ya usa Markdown estándar, remark-directive, clases por encabezado y bloques YAML para propiedades XMind. Adoptar íntegramente XMindMark añadiría otro parser y otra jerarquía paralela. Además, los marcadores compactos con corchetes no expresan por sí solos las clases de presentación y sus enlaces podrían confundirse con sintaxis Markdown.

La dirección recomendada es **compatibilidad conceptual con un modelo intermedio propio**, no sustituir ahora el formato fuente ni introducir una dependencia de producción. Tras formalizar ese modelo, se podrá evaluar el paquete como adaptador opcional de entrada/salida, comparando atributos XMind, estructura de tabla árbol, estabilidad de import/export y tamaño/dependencias.

## Mapeo propuesto hacia AstroXmind

| Concepto MarkXMind | Equivalente propuesto | Consideración |
|---|---|---|
| Topics y subtopics | Encabezados dentro de `:::rootTopic` | Ya representados; conservar el Markdown |
| Enlace de topic | Enlace Markdown en el contenido y/o propiedad `href` validada | Usar URL normalizada; evitar `[L:...]` duplicado |
| Nota asociada a topic | `:::nota` dentro del topic o metadato semántico `nota` | Diferenciar texto visible de notas XMind |
| Plegado | Directiva/property semántica `folded` | `:::plegable` HTML existente no equivale necesariamente a estado plegado al exportar |
| Relación entre topics | Declaración explícita `:::relacion{origen="#id" destino="#id"}` | Requiere IDs estables y validación de endpoints |
| Límite | `:::limite{#id titulo="..."}` que agrupe topics hermanos | El renderer actual necesita un modelo de grupos para no romper la tabla |
| Resumen | `:::resumen-xmind{targets="..."}` con contenido/título jerárquico | Es un objeto estructural, no una clase CSS ni una nota |

Los nombres son propuestas de diseño, no sintaxis implementada. Los conceptos pueden tener renderers distintos: la vista web, la representación intermedia y el exportador XMind no deben forzarse a compartir HTML.

## Relación con clases por nivel

MarkXMind organiza la jerarquía, pero no ofrece en la guía examinada un contrato equivalente para clases CSS por profundidad. Para AstroXmind se propone declarar aparte:

````md
```yaml clases
niveles:
  1: rama-principal
  2: subrama
  3: concepto-clave
```
````

Así, las clases seguirían perteneciendo a la capa de presentación, mientras que relaciones, límites, resúmenes, notas y plegado serían semántica de XMind. El bloque `yaml xmind` queda reservado para propiedades comprobadas del documento XMind.

## Orden de trabajo sugerido

1. Fijar la sintaxis y comportamiento actual con regresiones (AST-012).
2. Implementar mapa de clases por nivel y combinarlo con clases locales (AST-017).
3. Diseñar un modelo intermedio tipado: topics, enlaces, relaciones, límites, resúmenes, notas y plegado (AST-018).
4. Validar IDs y referencias, y definir qué elementos se renderizan en web y cuáles solo se serializan.
5. Evaluar el paquete core como adaptador con fixtures XMind reales y auditoría de licencia/dependencias.
6. No declarar interoperabilidad completa hasta comprobar round-trip en XMind Desktop.

## Fuentes consultadas

- [README MarkXMind](https://github.com/jinzcdev/markxmind/blob/main/README.md)
- [Guía de XMindMark](https://github.com/jinzcdev/markxmind/blob/main/docs/xmindmark-syntax.md)
- [Especificación XMindMark](https://github.com/jinzcdev/markxmind/blob/main/docs/specification.md)
- [README del paquete core](https://github.com/jinzcdev/markxmind/tree/main/packages/markxmind-core)
- [Licencia del repositorio](https://github.com/jinzcdev/markxmind/blob/main/LICENSE)
