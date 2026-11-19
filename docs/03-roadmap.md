# Hoja de ruta

Prioridad de edición del 19-11-2026: [guardado directo de páginas en main con token de grano fino](27-editor-github-pages-pat.md). Editor de página y vista MDX confirmados; validar sincronización bidireccional de paneles y ampliar después la edición de fuentes de demos y tablas nuevas.

Estado verificado el 18-11-2026: main `d87deba886e1c61a6ce18d915c89e0fb79cc511f`; CI y despliegue Pages correctos. [Estado](04-project-status.md) · [Propuesta](25-wiki-editing-proposal.md) · [Investigación comparativa](26-astro-editing-patterns.md).

## Próximos desarrollos, en orden

1. **Edición persistente desde la wiki.** Primera prioridad. El editor Markdown con vista previa y borradores locales ya está publicado; falta autenticación y guardado seguro en GitHub. [Propuesta](25-wiki-editing-proposal.md). La investigación comparativa AST-035 se ejecuta en segundo plano antes de elegir backend. [Patrones iniciales](26-astro-editing-patterns.md).
2. **Reordenar documentos desde el explorador.** Arrastrar entre hermanos o ramas, guardar el nuevo orden, recalcular la numeración y conservar IDs, URLs y referencias. Reutilizar el guardado del editor.
3. **Evaluar el arrastre en TreeTable.** Decidir tras validar el explorador. Si procede, probar movimientos de nodos que actualicen la fuente conservando referencias y opciones de plegado.
4. **Seguridad y mantenimiento.** Retomar la actualización de dependencias desde la auditoría ya preparada.
5. **Summary y Boundary** (aplazados), **presets y exportación XMind**, **contenido de estudio** (aplazado) y **biblioteca de componentes** como último hito.

## Fase «Navegación» — AST-034 (completada)

Objetivo: árbol documental fuerte, referencias bidireccionales rápidas y base compartida para wiki, consulta e impresión/descarga de ramas. Inspirarse en patrones de notas enlazadas, sin reproducir la aplicación Obsidian ni adoptar una dependencia de su formato.

| Paso | Funcionalidad | Viabilidad y alcance |
|---|---|---|
| NAV-01 | Identidad y árbol documental | Alta. ID estable, padre único y orden; índice derivado en build y validación de árbol. Base de todo lo demás. |
| NAV-02 | Navegación jerárquica contextual | Alta tras NAV-01. Ruta de ubicación, subir al padre, hijos, anterior/siguiente y árbol con posición actual. |
| NAV-03 | Referencias a documentos, apartados y nodos | Alta/media. Destinos con ID estable y enlaces normales; revelar antecesores plegados, seleccionar Resultado si corresponde y resaltar destino. |
| NAV-04 | Enlaces entrantes y salientes | Alta tras NAV-03. Generar backlinks con contexto y salto al punto de cita, sin escribir el enlace inverso a mano. |
| NAV-05 | Ida/vuelta rápida | Media. Volver al origen exacto con posición, foco, pestaña y plegado; historial reciente limitado a la sesión y fallback sin historial. |
| NAV-06 | Imprimir y descargar una rama | Media. Recorrer descendientes en orden; vista continua desplegada con índice y enlaces internos. Primera descarga: HTML autónomo por rama; impresión del navegador/PDF con estilos adecuados. |
| NAV-07 | Consulta sin abandonar el origen | Media. Vista previa accesible y panel lateral de referencia, con abrir documento y retorno; teclado y táctil, no solo hover. |
| NAV-08 | Mapa local de conexiones | Opcional, tras lo anterior. Grafo del documento y sus enlaces cercanos; no sustituye el árbol ni condiciona impresión/offline. Se genera con los índices existentes, sin dependencias adicionales. |

NAV-01/02/03 están integrados y publicados en f3e2259, con CI/build/Pages y HTTP verificados. NAV-04 publicado y confirmado por el usuario. NAV-05 integrado tras la confirmación en Windows del retorno desde el Artículo 2 a la cita de TreeTable en Navegación (18-11-2026). El usuario confirmó también el funcionamiento de NAV-05 en la wiki pública. NAV-06 validado en Windows y confirmado por el usuario en la wiki pública después del [despliegue](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44271236001). NAV-07 publicado y confirmado por el usuario. NAV-08 publicado y confirmado por el usuario. La fase de navegación queda completada. Orden de trabajo NAV-01 → NAV-02 → NAV-03 → NAV-04 → NAV-05 → NAV-06 → NAV-07; NAV-08 opcional. Las pruebas se añaden con cada comportamiento, no se posponen a la fase de robustez. Detalle en [docs/13-navigation-phase.md](13-navigation-phase.md).

**NAV-04 validado.** El usuario confirmó en Windows el arranque con PowerShell y el recorrido de ida y vuelta a la cita plegada. También confirmó las cuatro citas del Artículo 2 y el salto a dos puntos distintos de Navegación. [Despliegue verificado](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44264899513). El retorno de NAV-05 está validado en Windows y en la [wiki pública](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44267671415). [Guía de aceptación](23-reference-relations.md).

## Robustez y accesibilidad — AST-029 / AST-012

Publicados: acceso a pantalla completa con Tab, laboratorio independiente, varias sublistas por nodo, plegado global, barra flotante y diagnósticos de anotaciones. Pablo confirmó los recorridos de teclado y móvil, y el desplazamiento con la barra flotante. La prueba automatizada de la tabla grande cubre el plegado con 504 nodos.

La referencia de plegado y el ejemplo interactivo de Sintaxis del lenguaje están publicados. El despliegue y el HTML se han comprobado. El PR #5 conserva su revisión separada.

## Seguridad y mantenimiento — AST-003.5

En curso. Auditoría inicial de ambos lockfiles completada. Flujo CI de doble ámbito preparado en rama. Siguiente tarea: preparar una actualización compatible de Astro, MDX y Starlight y reevaluar el PR #1 desde la base actual. El PR #4 se revisa por separado.

## Summary y Boundary — AST-018 (aplazados)

Modelo semántico de grupos, referencias e IDs; considerar el contrato de IDs introducido por Navegación, sin implementarlo prematuramente en esa fase.

## Presets y exportación XMind — AST-023

Modelo intermedio, fixtures reales y round-trip en Desktop. No confundir exportación HTML/PDF de NAV-06 con exportación .xmind.

## Contenido de estudio — AST-024 (aplazado)

Decidir acceso, fuentes/licencias antes de publicar. PR #2 permanece separado.

## Biblioteca de componentes — AST-027 (último hito)

Agrupar componentes y tema compartido, evaluar paquete interno, mantener wiki como catálogo. No publicar npm ni crear repositorios hasta acordarlo.

## Ya completado

Wiki/laboratorio Astro; corchetes sin escapes; clases por nivel y nodo; plegado y estado inicial heredables; numeración heredable/start local y reinicio tras padre sin número; 14 demos Resultado/Código; NAV-01/02/03; pantalla completa con centrado y scroll. Ver estado y contrato, no volver a implementarlos.

## Ampliación de NAV-02 completada

Orden opcional, fechas YAML con milisegundos, pendientes al final y numeración consecutiva por grupos de order están implementados y publicados en f3e2259. Duplicados comparten número. [Contrato](20-navigation-ordering.md) y [corrección](22-consecutive-numbering-fix.md). No queda una integración pendiente de esta ampliación.

La primera entrega de edición incluye Markdown y resultado en dos paneles, con actualización en directo. En móvil se alternan con pestañas. [Detalles y prueba de aceptación](25-wiki-editing-proposal.md#edición-con-vista-previa-en-directo).

El editor Markdown en directo y los borradores locales están publicados en [Prueba del editor](https://pablogonzalezruiz.github.io/AstroXmind/editar-prueba/). El commit `d87deba` y sus comprobaciones de Pages confirman esta entrega. Pendiente: autenticación, guardado seguro en GitHub y vista previa fiel de MDX/TreeTable. AST-035 compara la práctica de otros repositorios Astro; no retrasa la prioridad de edición persistente.
