# Prompt maestro de AstroXmind

## Objetivo

Mantener AstroXmind como una wiki técnica para desarrollar y probar componentes Astro. La wiki pública documenta componentes `.astro`, clases CSS, el uso desde MDX y la vista previa aislada. No publicar páginas de temario en esta fase.

El proyecto puede explorar posteriormente una representación de estudio compatible con XMind, pero el alcance público actual es el laboratorio de componentes.

## Estado actual

- Repositorio: `PabloGonzalezRuiz/AstroXmind`; rama de publicación: `main`.
- Wiki: https://pablogonzalezruiz.github.io/AstroXmind/.
- Páginas públicas: Inicio, Clases y componentes Astro, TreeTable y Laboratorio.
- No hay páginas de temario en el sitio. Las antiguas rutas de temario y galerías tecnológicas fueron retiradas del build.
- El repositorio sigue siendo público; GitHub conserva el historial de commits y las fuentes que sigan en él.
- Configuración del sitio: Astro + Starlight + integración MDX. El pipeline de Remark/Pandoc anterior ya no se utiliza al construir la wiki.
- `TreeTable.astro` está en `examples/astro-component-lab/src/components/`; el caso MDX de la wiki está en `src/content/docs/componentes/tree-table.mdx`.
- La guía Astro está en `src/content/docs/clases-astro.mdx`; el sandbox se abre desde `src/content/docs/laboratorio-componentes.md`.
- La conversión a `.xmind` aún no está implementada.

## Lenguaje TreeTable

Los nodos se escriben como lista Markdown anidada. Las clases `nivel-0`, `nivel-1` y siguientes identifican la profundidad. La numeración se marca al final de la etiqueta con corchetes, sin necesidad de escapes en MDX:

```md
- Nodo numerado [numbering=arabic]
  - Nodo con numeración gradual [numbering=arabic; tiered=true]
  - Reiniciar en cinco [numbering=arabic; start=5]
```

- `numbering=arabic` activa un número decimal para ese nodo.
- Sin `tiered=true`, se muestra solo su número respecto a los hermanos.
- Con `tiered=true`, se agrega la ruta de ancestros numerados, por ejemplo `1.2.`.
- `start=N` fija/reinicia el número del nodo; los siguientes nodos numerados del mismo grupo continúan desde ese número.
- En el componente, `numbering="siblings"` muestra números locales; `numbering="path"` permite la ruta gradual; `numbering="none"` es el valor por defecto.
- En MDX, escribe directamente la anotación entre corchetes, por ejemplo `[numbering=arabic]`; no requiere escapes.

La correspondencia está basada en el JSON aportado de XMind: extensión `org.xmind.ui.numbering`, `pattern: numeral-arabic` y `tiered: true`.

## Principios

1. Mantener la wiki pública limitada a clases Astro y componentes hasta que se decida volver a publicar contenido de estudio.
2. Conservar para cada prueba un enlace a su componente, el MD/MDX fuente y el bloque base.
3. Preferir sintaxis legible por personas y modelos de IA; mantener semántica y presentación separadas.
4. Los componentes se compilan estáticamente cuando no se necesita interacción del lado del cliente.
5. Usar el sandbox para ver HMR y errores antes de integrar.
6. Documentar límites conocidos: StackBlitz es una copia aislada y no sincroniza ediciones con GitHub.

## Flujo

Leer `docs/09-continuation.md` al retomar. Revisar el SHA actual, los PRs y las Actions. Las comprobaciones de build deben pasar. La wiki se publica desde `main`; integrar solo cuando el encargo lo pida explícitamente y verificar después el deployment de Pages.
