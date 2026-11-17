# Contrato vigente del lenguaje de autoría

Referencia publicada 2cdba36, verificada el 17-11-2026. NAV-01/02/03 están disponibles en la wiki; las auditorías anteriores describen su etapa histórica. [Arquitectura](02-architecture.md) y [referencias](16-document-references.md).

## Contrato TreeTable publicado

- Lista Markdown/MDX, profundidad inicial 0, clases automáticas nivel-N.
- Sufijo entre corchetes sin escapes; propiedades separadas por punto y coma o coma.
- Componente numbering=none/siblings/path controla presentación. Nodos numbering=arabic/none y tiered=true/false se heredan.
- Padre sin número corta la ruta: reactivar → 1, hijo → 1.1, salvo start explícito. Start no se hereda; cada grupo empieza en 1 y los hermanos numerados continúan. No recuperar prefijo de abuelos.
- Collapsible=true/false es capacidad heredable, por defecto false. Folded=true/false es estado inicial heredable, por defecto false. Collapsible=false fuerza ese nodo abierto; folded puede seguir heredándose a descendientes que reactiven capacidad. Hojas sin botón.
- LevelClasses="1:ArticuloCabecera; 2:ArticuloPunto" y [class=Nombre]. Prioridad explícita > nivel > padre > defecto; class=none corta la clase heredada. Los colores requieren CSS global, los nombres no son palabras reservadas.
- Botón de plegado pequeño y absoluto arriba a la izquierda. Pantalla completa contextual arriba a la derecha, Escape/botón para salir, teclado/táctil y alternativa dentro de ventana. Centrado si cabe y scroll en ejes necesarios si no cabe; preserva estado.
- Ocho demos TreeTable y tres de guía con pestañas Resultado/Código. src/examples se importa como componente y como ?raw para no duplicar fuentes.
- Los metadatos navigation de documento están publicados (docs/14-navigation-contract.md). En NAV-03 se añade [id=ref-nombre] al nodo, no heredable, publicado; ver docs/16-document-references.md.

## Ejemplo válido actual

```mdx
<TreeTable numbering="path" collapsible="true" folded="false"
  levelClasses="1:ArticuloCabecera; 2:ArticuloPunto">

- Tema
  - Artículo [numbering=arabic; tiered=true; start=7]
    - Primer punto
    - Punto cinco [start=5]
      - Subpunto
    - Rama sin número [numbering=none]
      - Reactivar [numbering=arabic]
        - Hijo

</TreeTable>
```

Rama reactivada: 1 e hijo 1.1; punto con start=5: 7.5 y subpunto 7.5.1. El modo fullscreen no cambia este contrato.

## Futuro, separado del contrato activo

NAV-01 implementa navigation en frontmatter. NAV-03 implementa destinos [id=ref-nombre] y referencias doc:doc-000001#ref-nombre publicados. El YAML canónico está en docs/14-navigation-contract.md. No introducir llaves escapadas ni convertir YAML heredado en una capacidad ficticia de exportación XMind.

NAV-01 incorpora el bloque YAML navigation (id neutro doc-000001, parent por ID y order) en frontmatter de página, no dentro de anotaciones de TreeTable. Ver [contrato documental](14-navigation-contract.md). El movimiento de rama cambia un parent sin reescribir descendientes.

## Ampliación NAV-03 publicada

[id=ref-nombre] identifica una celda de TreeTable; opcional, local al documento, no heredable. Rechazar duplicados en la tabla y en el HTML completo de la página. Un apartado usa un ID HTML explícito del mismo formato. La referencia Markdown [texto](doc:doc-000001#ref-nombre) se convierte en un enlace HTML normal; DocLink permite lo mismo desde componentes MDX. La resolución al renderizar respeta la URL actual aunque el Markdown esté cacheado. No son índices de fila ni nombres deducidos del título. Demo en /AstroXmind/navegacion/ publicada.
