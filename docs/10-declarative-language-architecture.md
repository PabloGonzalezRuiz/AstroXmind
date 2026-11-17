# Contrato del lenguaje publicado

Estado contrastado el 17-11-2026 sobre main `5f1a33ff7a846a42914f33be61782adb0e5f8452`. Esta revisión parte del SHA publicado indicado y añade NAV-01/02 en la rama feature/nav-01-document-tree, sin cambiar main ni publicar.

## Contrato TreeTable publicado

- Lista Markdown/MDX, profundidad inicial 0, clases automáticas nivel-N.
- Sufijo entre corchetes sin escapes; propiedades separadas por punto y coma o coma.
- Componente numbering=none/siblings/path controla presentación. Nodos numbering=arabic/none y tiered=true/false se heredan.
- Padre sin número corta la ruta: reactivar → 1, hijo → 1.1, salvo start explícito. Start no se hereda; cada grupo empieza en 1 y los hermanos numerados continúan. No recuperar prefijo de abuelos.
- Collapsible=true/false es capacidad heredable, por defecto false. Folded=true/false es estado inicial heredable, por defecto false. Collapsible=false fuerza ese nodo abierto; folded puede seguir heredándose a descendientes que reactiven capacidad. Hojas sin botón.
- LevelClasses="1:ArticuloCabecera; 2:ArticuloPunto" y [class=Nombre]. Prioridad explícita > nivel > padre > defecto; class=none corta la clase heredada. Los colores requieren CSS global, los nombres no son palabras reservadas.
- Botón de plegado pequeño y absoluto arriba a la izquierda. Pantalla completa contextual arriba a la derecha, Escape/botón para salir, teclado/táctil y alternativa dentro de ventana. Centrado si cabe y scroll en ejes necesarios si no cabe; preserva estado.
- Ocho demos TreeTable y tres de guía con pestañas Resultado/Código. src/examples se importa como componente y como ?raw para no duplicar fuentes.
- Los metadatos navigation de documento están implementados en esta rama (docs/14-navigation-contract.md). La propiedad id de nodo de TreeTable sigue pendiente de NAV-03.

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

NAV-01 implementa navigation en frontmatter de página; los destinos a nodos de TreeTable y las referencias cruzadas se diseñarán en NAV-03. El YAML canónico está en docs/14-navigation-contract.md. No introducir llaves escapadas ni convertir YAML heredado en una capacidad ficticia de exportación XMind.

NAV-01 incorpora el bloque YAML navigation (id neutro doc-000001, parent por ID y order) en frontmatter de página, no dentro de anotaciones de TreeTable. Ver [contrato documental](14-navigation-contract.md). El movimiento de rama cambia un parent sin reescribir descendientes.
