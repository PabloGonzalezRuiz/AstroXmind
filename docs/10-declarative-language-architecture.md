# Contrato del lenguaje TreeTable

Auditado el 17-11-2026 sobre `main`, commit `e7bfb8e7f41ec5637c685e62698eb12b7ab1b658`.

## Contrato implementado

- Fuente: lista Markdown anidada dentro de TreeTable. Raíz en profundidad 0; clases automáticas nivel-N.
- Prop del componente `numbering="none|siblings|path"`: controla la presentación, no activa numeración por sí sola; por defecto none.
- `[numbering=arabic]` activa y hereda numeración hacia descendientes; `[numbering=none]` la desactiva para una rama, con posible reactivación inferior. Las excepciones no afectan a hermanos.
- `tiered=true/false` se hereda. En modo path se muestran rutas de antecesores numerados; en siblings se muestra solo número local.
- `start=N` es local y no se hereda. Cada grupo de hermanos empieza en 1 y continúa desde el último numerado; un nodo sin número no consume posición. Padre 7 e hijo con start=5 → 7.5; los hijos de este empiezan en 7.5.1.
- `collapsible="true"` habilita plegado heredable; por defecto false. `[collapsible=false|true]` sobrescribe por rama. Las hojas no tienen botón. False no impide que un antecesor plegable oculte esa rama.
- En main auditado todos los nodos empiezan desplegados. En esta rama AST-028 añade folded; ver sección de implementación al final.
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

Estado inicial AST-028: implementado en esta rama como folded, pendiente de integración y publicación; contrato al final. Summary y Boundary: AST-018 aplazado, no equivalen a una clase o a una sección HTML resumen. YAML xmind y presets del prototipo anterior no generan .xmind en el componente actual.

## AST-028 · Estado inicial y botón compacto — implementación en rama

Implementado el 17-11-2026 en feature/ast-028-folded-compact-toggle. No integrado ni publicado por este encargo.

- Prop global folded=true/false (booleano o cadena true/false); valor predeterminado false. Sufijo de nodo [folded=true] o [folded=false], heredable y sobrescribible.
- Collapsible sigue siendo la capacidad de plegado. False mantiene el nodo abierto, aunque folded continúa siendo configuración heredable para descendientes que reactiven collapsible=true. Las hojas no tienen botón. Un hijo abierto bajo un padre cerrado aparece al abrir ese padre.
- Se genera toda la tabla en servidor; el cliente lee los estados efectivos y recalcula filas al iniciar. Sin JavaScript se conserva todo el contenido, sin botones inactivos.
- Botón absoluto arriba a la izquierda (0.2rem), tamaño visual 1rem, símbolo 0.75rem. Reserva superior para evitar solapamiento con texto; no ocupa espacio en línea. Se conserva/restaura foco del botón al reconstruir filas.
- Ejemplos en página TreeTable y sandbox; numeración y clases conservadas. Summary/Boundary aplazados; biblioteca sigue al final.
- Check Astro: 0 errores/avisos. Builds de wiki y laboratorio correctos. Comprobación DOM de estado inicial, herencia, excepciones, collapsible=false, restauración de estado/foco, celdas, aislamiento entre tablas y fallback sin JS correcta. CSS compacto verificado por lectura; no revisión visual en navegador porque Chromium falló al iniciar (socket no permitido). No se ha ejecutado Actions de esta rama.
