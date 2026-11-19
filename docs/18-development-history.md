# Historia completa de desarrollo desde el proyecto vacío

Reconstruida el 17-11-2026 a partir del historial alcanzable desde main `2cdba361920b58a5002faa063e46660f22ff36ef`, archivos activos y auditorías versionadas. Las fechas/mensajes originales están en [registro completo de commits](history/commits-through-2cdba36.md). Esta narración agrupa cambios por finalidad; no afirma que cada prototipo siga activo.

## 1. Gobierno y primera instalación — 14-11-2026

El proyecto comenzó con documentación de objetivos, arquitectura, estado, riesgos, tareas, decisiones, prompt maestro y continuidad (a09cd2b y sucesores). Se eligió Astro/Starlight como wiki y se crearon package.json, astro.config.mjs, tsconfig.json, reglas de ignorado y páginas iniciales desde 2282c39. El scaffold inicial incluía guía y bloques de estudio; esos contenidos no forman parte del sitio técnico actual.

El primer CI de wiki se añadió en 0e1bc54. Se corrigieron valores de sidebar (5da231c/a3b6154) y se documentó cómo reconstruirlo manualmente (0d62695). No se trató un workflow verde como prueba suficiente de una portada funcional.

## 2. Pages, 404 y rutas bajo el repositorio

756a5d1 añadió el workflow Pages. Tras los primeros 404 se verificó que existiera un index.html generado. b1eb34d registró la colección documental de Starlight: sin esa pieza la salida no contenía las páginas esperadas. 66529dd y a4ea186 corrigieron enlaces de portada/hero para incluir la base /AstroXmind.

El usuario confirmó la portada y enlaces. Se creó el punto histórico backup/2026-11-14-wiki-funcional, que apunta a a4ea186; 8ba2b2b documentó la auditoría/restauración. Este punto prueba una wiki inicial funcional, no las capacidades añadidas después.

## 3. Instalación bloqueada, CI y descubrimiento de runs

ffd2f1b incorporó CI de validación. Se generó/integró el lockfile (f6e2596/946f9d6) y d749ea5 exigió lockfile versionado y npm ci. Se eliminaron prácticas de instalación variable en CI.

c5b969b inició el índice automático de ejecuciones. Tras fallos de permisos/diseño se restauró CI de solo lectura (dd6bd6c) y c0d4c1e separó la escritura del índice en un listener workflow_run. El resultado actual registra runs en una rama dedicada, sin convertir CI de build en un proceso que modifica main.

## 4. Auditoría de dependencias y licencias

9086eee/7027745 añadieron el script Python y workflow de auditoría. 9d60c1a indexó los runs y e35bf66 publicó el resumen en Actions. Se preparó una rama candidata de actualizaciones de seguridad y su validación aislada (ce22317/d0996d4).

La revisión de seguridad no se confundió con funcionalidad de la wiki. La automatización actual genera informes npm/metadata de licencias; no bloquea por el mero resultado no cero de npm audit ni demuestra que no existan avisos. La propuesta de actualización PR #1 sigue separada, sin fusionar automáticamente.

## 5. Exploración de autoría y tablas — 15/16-11-2026

Se probaron varias representaciones antes de elegir el componente actual:

| Línea explorada | Evidencia representativa | Resultado actual |
|---|---|---|
| Galerías de tablas y comparación de sintaxis | 9651f24, 34c0863, 6f111fb | Exploración histórica; no páginas activas de la wiki técnica |
| Markdown semántico y render previo | dfc8681, 46bc2e7 | Scripts/fuentes conservados, fuera del build actual |
| Galería semántica con búsqueda/backlinks de prototipo | 696345f | No equivale a NAV-04 implementado en el sitio actual |
| MyST y declaraciones temáticas | 1d0017c, 945d3b6 | Pruebas; algunas ramas independientes siguen separadas |
| Pandoc y demo legal real | c4e7e5c, 643662c, 895f89b, bd9d5c5 | Fuentes/script conservados; Pandoc no se instala en el pipeline actual |
| Markmap de Constitución | 85137cb, e8f1e37 | Galería histórica; el deploy comprueba ausencia de esa salida antigua |
| Remark/directivas semánticas | 4be4171, dca6f0e | Prototipo que precede al componente MDX actual |
| Tabulator | 857a67f, 740c395 | Exploración de tabla interactiva; no dependencia de cliente actual |
| Tabla nativa HTML/CSS generada desde Markdown | 4d2ca19, e3776db | Precedente del diseño; no renderer activo de la wiki |

Se añadieron Codespaces (7dcd51c), instalación de Remark y pruebas (1e14ee3), tablas anidadas (ff41f1d) y correcciones de legibilidad/anidación. 26d3bc6 y 81f9e81 alinearon ejemplos con JSON XMind y YAML indentado. Los fixtures examples/xmind/TablaArbol conservaron la muestra real como referencia.

El historial también registra referencias a alojamiento en ChatGPT Sites. El destino verificado actual de esta revisión es GitHub Pages; no asumir que un alojamiento antiguo es la wiki canónica. No se han revisado ni cambiado otros servicios durante este encargo.

## 6. Cambio a componentes Astro/MDX como arquitectura activa

fc7ed10 introdujo TreeTable MDX y el sandbox/laboratorio Astro. 5dd5273 corrigió cortes de palabras. 109e033/92eb104 centraron la wiki en clases/componentes y numeración, retirando el temario de su ámbito publicado.

Se consolidó una sola implementación TreeTable.astro dentro del laboratorio. La wiki la importa; no mantiene una copia diferente. El laboratorio tiene su propia aplicación, lockfile y vista previa. StackBlitz sigue siendo una copia para experimentar, sin sincronización automática.

Las anteriores galerías y scripts no se borraron todos, pero dejaron de ejecutarse en el build activo. La presencia de remark-directive o de scripts Pandoc en el repositorio no los convierte en requisitos actuales.

## 7. Lenguaje, herencia y representación de TreeTable

| Cambio | Commit | Comportamiento incorporado |
|---|---|---|
| Corchetes sin escapes | 6aff07e | Anotaciones legibles en MDX |
| Plegado por etiqueta y nodo | e5a81e7 | collapsible heredable, con excepciones por rama |
| Numeración heredable | 092618b | numbering/tiered; none para desactivar; start local por grupo |
| Clases por nivel y nodo | 1a80d4c | Clases semánticas explícitas/nivel/herencia; class=none |
| Estado inicial y botón compacto | a6bd581 | folded heredable; botón pequeño flotando arriba a la izquierda |
| Todos los ejemplos en pestañas | 428c62c | Resultado/Código usando una única fuente importable + ?raw |
| Corte de ruta tras padre sin número | 2d76b8c | Reactivar empieza en 1, no 1.1; sin rescatar prefijo del abuelo |
| Pantalla completa contextual | 4823ecc | Botón arriba a la derecha, salida/Escape y alternativa de viewport |
| Centrado y overflow accesible | 5f1a33f | Centrado si cabe y scroll desde origen cuando excede pantalla |

Se acordó aplazar Summary/Boundary, inspirados en elementos de MarkXMind, para priorizar estos comportamientos. No se incorporó compatibilidad general con ese lenguaje ni una biblioteca publicada de componentes.

## 8. Navegación documental — NAV-01/02/03

| Hito | Commit | Entrega |
|---|---|---|
| Plan de Navegación primero | 3b14131 | Identidad, contexto, referencias, backlinks, retorno, exportación, consulta y grafo opcional |
| NAV-01 | 1aa5a59 | navigation.id/parent/order, reserva de IDs, árbol validado y navigation.json |
| NAV-02 | e39254b | Migas, árbol, padre/hijos/recorrido y serie de artículos en una carpeta plana |
| NAV-03 | 238ce44 | Referencias estables a documentos/apartados/nodos, DocLink, DocumentNavigator y demostración |
| Publicación autorizada | 2cdba36 | Integración en main y despliegue de diez páginas/catorce referencias |

El usuario pidió que mover ramas no requiriera mover archivos. Se escogieron IDs neutrales, únicos por proyecto, y YAML explícito comprensible por una IA. Cambiar un parent mueve toda la rama; las URLs conservan su relación con archivos, no con la pertenencia lógica.

El usuario pidió además un componente que conozca su ubicación y navegación visible. DocumentNavigator calcula padre, hermanos, hijos y anterior/siguiente. Arriba se muestran migas; lateralmente el árbol con posición actual; abajo el navegador. La demo muestra también un árbol completo dentro del componente.

NAV-03 encontró un fallo real al renombrar archivos: el HTML Markdown cacheado mantenía la URL anterior. La solución vuelve a resolver por identidad al renderizar MarkdownContent y conserva una prueba de dos builds con caché. Otro detalle importante: TreeTable desprende celdas al plegar; revealTarget conserva acceso a ellas y abre solo sus antecesores antes de enfocar el destino.

Las demostraciones de Navegación mantienen Resultado/Código y fuentes únicas. No se implementaron de forma incidental backlinks automáticos, retorno exacto ni exportación offline.

## 9. Evidencia de cierre y trabajo separado

La publicación de 2cdba36 terminó correctamente: [CI 44096661054](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44096661054), [Wiki Build 44096660778](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44096660778) y [Pages 44096660802](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44096660802). La comprobación HTTP verificó diez páginas y catorce referencias. Ver [registro de publicación](17-navigation-publication.md).

PRs abiertos comprobados al preparar este informe: #1 seguridad, #2 prácticos TAI, #4 documentación de ubicaciones y #5 regresiones de la línea anterior. No se han fusionado/cerrado ni se atribuyen a la implementación activa solo por existir. La siguiente funcionalidad pendiente es NAV-04, con autorización propia. Biblioteca permanece al final.

## 10. Cómo contrastar o continuar esta historia

El registro enlazado incluye todos los commits alcanzables desde el SHA auditado; no incluye trabajo no integrado de otras ramas como si se hubiera publicado. Para inspeccionar un cambio: git show SHA; para su contexto: git log --reverse. Consultar el código/configuración del SHA antes de deducir una capacidad de un título de commit.

Los informes antiguos se conservan como evidencia de su fecha. La arquitectura/estado/continuidad actuales prevalecen para reanudar; no reabrir incidencias ya resueltas ni confundir un prototipo o plan con una función disponible.

## 11. FrameEjemplo — 19-11-2026

Pablo pidió sustituir las prácticas fijas por un marco reutilizable con ejemplo inicial, catálogo jerárquico, selección en ejecución y reset. Entrega autorizada hasta publicación; se reutiliza WikiEditor y se conservan originales compilados. Véase [contrato](29-frame-ejemplo.md) y changelog.
