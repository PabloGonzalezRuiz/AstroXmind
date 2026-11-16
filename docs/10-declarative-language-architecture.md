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

El atributo `numbering` es local al topic. Los demás hermanos no muestran número si no llevan el marcador.

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
