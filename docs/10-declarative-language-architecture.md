# Contrato del lenguaje TreeTable

Auditado el 17-11-2026 sobre `main`, commit `e7bfb8e7f41ec5637c685e62698eb12b7ab1b658`.

## Contrato implementado

- Fuente: lista Markdown anidada dentro de TreeTable. Raíz en profundidad 0; clases automáticas nivel-N.
- Prop del componente `numbering="none|siblings|path"`: controla la presentación, no activa numeración por sí sola; por defecto none.
- `[numbering=arabic]` activa y hereda numeración hacia descendientes; `[numbering=none]` la desactiva para una rama, con posible reactivación inferior. Las excepciones no afectan a hermanos.
- `tiered=true/false` se hereda. En modo path se muestran rutas de antecesores numerados; en siblings se muestra solo número local.
- `start=N` es local y no se hereda. Cada grupo de hermanos empieza en 1 y continúa desde el último numerado; un nodo sin número no consume posición. Padre 7 e hijo con start=5 → 7.5; los hijos de este empiezan en 7.5.1.
- `collapsible="true"` habilita plegado heredable; por defecto false. `[collapsible=false|true]` sobrescribe por rama. Las hojas no tienen botón. False no impide que un antecesor plegable oculte esa rama.
- Todos los nodos empiezan desplegados. No existe todavía una propiedad para estado inicial plegado.
- `levelClasses="1:ArticuloCabecera; 2:ArticuloPunto"` asigna una clase por profundidad absoluta; `[class=Nombre]` permite excepción. Prioridad: explícita > mapa de nivel > padre > predeterminado.
- `[class=none]` corta la clase heredada y restaura estilo predeterminado; un nivel configurado inferior puede asignar otra clase. Se conserva nivel-N. Los nombres requieren CSS global; la demo comparte article-example.css con el sandbox.
- Anotaciones al final de etiqueta, entre corchetes sin escapes; comas o punto y coma, opciones en cualquier orden. Solo una anotación de propiedades al final; texto literal de código no se procesa como metadatos.

## Ejemplo completo válido

```mdx
<TreeTable numbering="path" collapsible="true"
  levelClasses="1:ArticuloCabecera; 2:ArticuloPunto">

- Tema
  - Artículo [numbering=arabic; tiered=true; start=7]
    - Primer punto
    - Segundo punto [start=5]
      - Subpunto
    - Rama excluida [numbering=none; collapsible=false]
    - Excepción de clase [class=ArticuloCabecera]

</TreeTable>
```

Los puntos numerados muestran 7.1 y 7.5; el subpunto muestra 7.5.1. Las clases son nombres CSS, no propiedades de formato XMind.

## Contrato futuro separado

Estado inicial: AST-028, aún no implementado. Folded sería una propuesta de nombre; no usarlo como sintaxis disponible. Summary y Boundary: AST-018 aplazado, no equivalen a una clase o a una sección HTML resumen. YAML xmind y presets del prototipo anterior no generan .xmind en el componente actual.
