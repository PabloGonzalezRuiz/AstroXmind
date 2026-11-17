# Estado actual del proyecto

Auditado el 17-11-2026 sobre `main`, commit `e7bfb8e7f41ec5637c685e62698eb12b7ab1b658`.

## Terminado y publicado

Wiki Astro + Starlight + MDX con cuatro páginas de contenido: inicio, clases/componentes Astro, TreeTable y laboratorio. No publica temario; el repositorio y su historial siguen públicos.

AST-017 (clases por nivel/nodo), AST-025 (plegado heredable), AST-026 (numeración heredable) y AST-022 (corchetes sin escapes) están integrados y publicados. Ya no son tareas pendientes de integración. Los commits funcionales recientes son e5a81e7, 092618b y 1a80d4c; e7bfb8e documenta la integración autorizada.

[TreeTable público](https://pablogonzalezruiz.github.io/AstroXmind/componentes/tree-table/).

## Evidencia remota

Para `e7bfb8e7f41ec5637c685e62698eb12b7ab1b658`:

- [CI: éxito, 43913208743](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43913208743).
- [Wiki Build: éxito, 43913208998](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43913208998).
- [Pages Deploy: éxito, 43913209250](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43913209250).
- La página pública TreeTable respondió y contiene los ejemplos de clases, plegado y numeración heredable. Esta lectura HTTP no sustituye una revisión visual/interactiva.

La auditoría de dependencias [43897812008](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43897812008) es anterior y corresponde a `109e033`, no al HEAD auditado. Su workflow genera un informe y no bloquea por severidad: éxito no significa cero vulnerabilidades.

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

## Pendiente inmediato

El estado inicial plegado/desplegado sigue sin implementarse. Boundary/Summary quedan aplazados antes de retomarlos. La biblioteca permanece al final de la hoja de ruta. Ver docs/03-roadmap.md para el orden completo.

Esta actualización documental se guarda en rama separada. No cambia main ni el sitio publicado.
