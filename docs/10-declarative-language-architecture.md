# Lenguaje AstroXmind para componentes y árboles

Estado implementado en `main`: 16-11-2026.

## Alcance

La sintaxis siguiente se implementa en el componente Astro TreeTable usado en la wiki. Describe jerarquía, clases de nivel y numeración. No es todavía un conversor general a XMind ni una sintaxis para todas sus propiedades.

## Jerarquía y clases

Dentro de `<TreeTable>`, se escribe una lista Markdown anidada: cada guion crea un nodo y la sangría fija su profundidad. El componente asigna `nivel-0` a la raíz, `nivel-1` al primer nivel de descendientes y así sucesivamente. Las clases se definen en el propio componente Astro.

## Numeración por nodo

El JSON compartido de XMind representa la numeración mediante extensión por topic:
`provider: org.xmind.ui.numbering`, `pattern: numeral-arabic`; para ruta gradual añade `tiered: true`.

AstroXmind expresa ese concepto al final de la etiqueta, entre corchetes. En MDX se escribe literalmente, sin escapes:

```md
- TablaArbol
  - Nodo1 [numbering=arabic]
    - Nodo1Subnodo1 [numbering=arabic; tiered=true]
    - Nodo1Subnodo2
  - Nodo2 [numbering=arabic; start=4]
    - Nodo2Subnodo1 [numbering=arabic; tiered=true]
```

- `numbering=arabic`: numera este nodo con dígitos decimales.
- Sin `tiered=true`: muestra solo su número entre hermanos, por ejemplo `4.`.
- `tiered=true`: antepone la ruta de ancestros numerados, por ejemplo `1.1.`.
- `start=N`: da a este nodo el número N; si otro nodo numerado lo sigue en el mismo grupo, continúa en N+1. Puede reiniciar con `start=1`.
- Al entrar en los hijos de otro padre se inicia un contador independiente, salvo que se configure un comienzo explícito.

El atributo `numbering` se hereda a los descendientes. Las excepciones locales no cambian la configuración de los hermanos.

## Opciones del componente

`numbering="siblings"` muestra el número local. `numbering="path"` permite mostrar la ruta acumulada de los nodos marcados con `tiered=true`. `numbering="none"` (valor por defecto) oculta los números.

En MDX, escribe la anotación entre corchetes directamente en la lista, igual que en los bloques de código. No requiere escapes. TreeTable quita el marcador de la etiqueta visible.

## Límites actuales

- Solo patrón decimal `arabic`.
- No hay conversiones de la sintaxis a JSON XMind todavía.
- `start=N` es una extensión de AstroXmind; no aparece en el fragmento JSON de referencia.
- El componente procesa una lista jerárquica y genera HTML estático. El sandbox StackBlitz es una copia que no sincroniza cambios.
- La wiki pública no ofrece contenido del temario en esta fase; el repositorio Git permanece público.

## Referencia de continuidad — 16-11-2026

Código publicado auditado: `6aff07e65b8cbd8e89f56a2f9a39d04f5a0af372`. PR #8 integrado; numeración literal `[numbering=arabic; tiered=true; start=5]` sin escapes. Clases automáticas `nivel-N` implementadas; mapa configurable AST-017 pendiente de adaptación al componente actual. Summary y Boundary (AST-018) son diseño pendiente, no funcionalidades publicadas. Ver [estado](./04-project-status.md) y [continuidad](./09-continuation.md).

## AST-025 · Plegado heredable TreeTable (rama de desarrollo)

Implementado en esta rama, no integrado ni publicado. `collapsible="true"` en TreeTable establece el valor inicial heredable (por defecto false). Un sufijo `[collapsible=false]` o `[collapsible=true]` sobrescribe ese valor para el nodo y sus descendientes. Las hojas no tienen botón. False impide plegar ese nodo; no evita que un antecesor oculte la rama. Todos comienzan expandidos.

Las anotaciones admiten comas o punto y coma y opciones en cualquier orden, conservando numbering, tiered y start. El cliente recalcula rowspan/colspan al plegar, preserva numeración y estados internos, y ofrece botones de teclado con aria-expanded. Sin JavaScript queda la tabla completa. Demo en la página TreeTable y en el sandbox.

No abrir PR, modificar main ni publicar sin autorización.

## AST-026 · Contrato de numeración heredable (rama, no publicado)

Numbering arabic se hereda a descendientes; numbering=none lo desactiva para una rama y puede reactivarse más abajo. Tiered también se hereda y puede sobrescribirse. Start es local; los contadores se reinician por grupo de hermanos y solo avanzan en nodos numerados. Las excepciones no cambian hermanos y las rutas conservan solo antecesores numerados. El modo del componente controla presentación; no activa numeración. Ejemplo: nodo padre [numbering=arabic], hijo [tiered=true], otro hijo [start=5], rama excluida [numbering=none]. Sustituye el contrato anterior de marcado obligatorio de cada descendiente. Biblioteca de componentes anotada como último hito AST-027 en la hoja de ruta.

Start predeterminado: 1 por grupo de hermanos. Con ruta gradual, padre 7 → hijos 7.1 y 7.2; si un hijo lleva start=5, su siguiente hermano es 6 y sus propios hijos comienzan en 1 (por ejemplo 7.5.1). No copiar start del padre.

## AST-017 · Clases por nivel y nodo en TreeTable MDX (rama, no publicado)

Implementado en la rama de desarrollo actual, sin integrar main ni abrir PR. Sintaxis: `<TreeTable levelClasses="1:ArticuloCabecera; 2:ArticuloPunto">` y excepción `[class=ArticuloCabecera]`. Raíz = nivel 0; profundidad absoluta por tabla. Una clase semántica por nivel/nodo; prioridad explícita del nodo > mapa de nivel > padre heredado > estilo predeterminado. La excepción se hereda salvo otra clase explícita o un nivel configurado. No modifica hermanos. `[class=none]` restaura estilo predeterminado y corta la clase heredada; un nivel configurado inferior puede volver a asignar clase.

Se conservan nivel-N; los colores predeterminados solo se aplican sin clase semántica. Los nombres no generan CSS: importar una hoja global. La demo incluye ArticuloCabecera y ArticuloPunto en examples/astro-component-lab/src/styles/article-example.css, compartida entre wiki y sandbox. No son nombres reservados. Se validan nombres y niveles duplicados. Numbering, collapsible y class se combinan en una misma anotación, con coma o punto y coma.

La rama antigua feature/ast-017-level-classes permanece intacta; su parser Remark no se integra. Este cambio implementa el contrato en el componente activo de MDX. Próximo desarrollo funcional pendiente: modelo de Summary/Boundary. Biblioteca AST-027 sigue siendo el último hito.
