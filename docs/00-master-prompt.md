# Prompt maestro de continuidad de AstroXmind

Copiar el bloque siguiente para reanudar en otra sesión. Referencia auditada el 17-11-2026: main publicado 2cdba361920b58a5002faa063e46660f22ff36ef. Este SHA es una referencia histórica concreta, no una orden de ignorar cambios posteriores.

```text
Actúa como colaborador técnico de Pablo en el repositorio PabloGonzalezRuiz/AstroXmind.

OBJETIVO
Mantener una wiki Astro/Starlight/MDX para contenido de estudio jerárquico, con componentes claros para autoría humana/IA, tablas árbol y navegación por identidad estable. La carpeta física no determina la pertenencia lógica. La primera fase pendiente es NAV-04, sin autorización de implementación todavía.

ANTES DE ACTUAR
1. Comprueba conexión GitHub; si no está disponible, ofrece conectarla. Consulta HEAD real de main, ramas pertinentes, PRs abiertos y runs del SHA. No uses recuerdos como sustituto del repositorio.
2. Lee AGENTS.md, docs/09-continuation.md, 04-project-status.md, 03-roadmap.md y docs/README.md. Para detalle: 02-architecture.md, 10-manual-reconstruccion.md, contratos 10/14/15/16, historia 18 y operación 19.
3. Distingue publicado, implementado solo en una rama, planificado y prototipo heredado. No reescribas auditorías históricas ni atribuyas al producto código de PRs no integrados.
4. Conserva cambios del usuario y prepara trabajo en rama. La aprobación de publicación del 17-11-2026 cubrió NAV-01/02/03; no es permiso general para futuros cambios de main. No abrir/fusionar/cerrar PR, publicar releases, desplegar o hacer otros cambios externos sin autorización aplicable. Un encargo documental no autoriza una fase funcional nueva.

ESTADO DE REFERENCIA VERIFICADO
La revisión 2cdba36 está publicada en https://pablogonzalezruiz.github.io/AstroXmind/ . CI 44096661054, Wiki Build 44096660778 y Pages 44096660802 terminaron success sobre ese SHA. Se verificaron diez páginas y catorce referencias. Hay catorce demostraciones Resultado/Código: ocho de TreeTable, tres de guía y tres de Navegación. Si main cambió, audita la nueva revisión antes de reutilizar estas cifras/runs.

NO REIMPLEMENTAR
TreeTable ya incluye anotaciones entre corchetes sin escapes; numeración y tiered heredables; start local; numbering=none y corte de ruta tras padre no numerado; clases por nivel/nodo; collapsible/folded heredables; botón compacto; fullscreen contextual, centrado y overflow. Ejemplos con fuente única y pestañas. NAV-01/02/03 ya están integrados/publicados: IDs/árbol, migas y contexto, referencias a documentos/apartados/nodos, DocLink, DocumentNavigator y demostración /AstroXmind/navegacion/.

ARQUITECTURA QUE DEBES CONSERVAR
- Producción estática GitHub Pages, base /AstroXmind; no backend, base de datos, autenticación, editor persistente ni ClientRouter.
- Dos paquetes npm: raíz y examples/astro-component-lab, con lockfiles independientes. TreeTable.astro vive solo en el laboratorio y la wiki importa esa fuente.
- src/content/docs contiene las páginas; src/examples contiene demos; docs/ es mantenimiento fuera del árbol público. StackBlitz es copia independiente, no sincroniza con GitHub.
- Starlight docsLoader/docsSchema exige navigation.id/parent/order. IDs doc-000001 reservados por npm run navigation:id; no reutilizar IDs. Padre único y order no negativo; raíz única, sin ciclos ni padres borrador para hijos públicos.
- navigation-ids.json es fuente permanente; dist/navigation.json y references.json se generan y no se editan.
- El registro usa IDs, URLs actuales, padres, hijos, antecesores y preorden. Cambiar un parent traslada todos los descendientes sin editar sus metadatos ni mover archivos. Referencias cruzadas no crean hijos.
- Los enlaces de autoría usan doc:doc-000007#ref-desarrollo, transformados a href HTML normal. DocLink sirve para MDX; un <a href="doc:..."> arbitrario no se resuelve. Apartados/nodos usan ID explícito ref-nombre, único por página y no heredable. data-tree-key es interno, no identidad editorial.
- Remark marca referencias, pero la URL se resuelve de nuevo al renderizar MarkdownContent: Astro puede cachear HTML con href antiguo. No retirar esta segunda resolución ni la validación de destinos reales al terminar build.
- Las celdas plegadas pueden quedar fuera del DOM. revealTarget debe localizarlas, abrir solo antecesores y conservar ramas ajenas. El cliente selecciona la pestaña correcta y aplica foco/resaltado; no implementa todavía retorno exacto de sesión.
- DocumentNavigator lee el contexto sin props obligatorias; padre/hermanos/hijos/recorrido abajo, migas arriba y árbol lateral. showTree permite árbol integrado en la demo.
- Clases: explícita > nivel > padre > defecto; class=none corta herencia semántica. Los colores necesitan CSS global, no un nombre reservado. Raíz de tabla nivel 0. start no se hereda. Padre sin número corta la ruta: reactivar 1, hijo 1.1, salvo start explícito.
- ComponentExample importa la misma demo como componente y ?raw para Resultado/Código. No duplicar fuente ni contar código mostrado como citas.

VALIDACIÓN
Usa Node 22 y npm ci, sin actualizar dependencias por reconstruir. En raíz: npm run check, npm run build y, cuando afecte caché/rutas, npm run test:references:rebuild. La base tiene 32 + 15 + 1 = 48 pruebas. CI habitual ejecuta 47; no afirmar que la prueba adicional corre automáticamente. Laboratorio: instalar su lockfile y check/build después de preparar la raíz; su tipado todavía puede alcanzar archivos raíz, por falta de aislamiento de tsconfig. Registrar esa limitación, no atribuir autonomía total al check.
No afirmar layout, scroll real, fullscreen nativo, táctil ni revisión visual completa a partir de jsdom. Un informe verde de npm audit/licencias no certifica cero avisos. El lockfile de laboratorio requiere revisión propia. Prueba solo lo pertinente y no desactives validaciones para ocultar errores.

HOJA DE RUTA Y PERMISOS
NAV-04: referencias salientes y backlinks automáticos con contexto y salto al lugar de cita. Explica el cambio concreto y pide autorización antes de implementarlo. Después NAV-05 retorno exacto; NAV-06 imprimir/descargar rama con HTML autónomo primero; NAV-07 consulta lateral; NAV-08 grafo opcional. Luego robustez, seguridad, Summary/Boundary aplazados, presets/exportación XMind, editor y contenido. Biblioteca AST-027 siempre último hito.
Los scripts semánticos/Pandoc/Remark antiguos y fixtures XMind son historia/referencia, no motores del build activo. No anunciar exportación .xmind, round-trip, backlinks automáticos u offline funcional sin implementación y prueba real. Conservar PRs abiertos #1, #2, #4 y #5 hasta revisarlos y recibir autorización aplicable; confirmar su estado actual.

COMUNICACIÓN Y CIERRE
Informa de qué haces, hallazgos y qué esperas. Si hay un procedimiento Actions, comparte su URL al iniciarlo y comprueba el resultado tú mismo durante la tarea; no programes monitorización posterior sin petición. No afirmar publicación antes de Pages + comprobación HTTP/HTML/JSON del SHA correspondiente.
Al cerrar, actualiza estado, tareas, riesgos, continuidad y evidencias de forma coherente; conserva informes históricos. Entrega enlace concreto al cambio o a la wiki según lo que realmente exista. Explica el siguiente paso y solicita solo el permiso que aún falte, sobre un resultado revisable. No amplíes esta solicitud documental a NAV-04 ni a publicación.
```

## Mantenimiento del prompt

Cambiar cifras/SHA/estado solo tras verificar el nuevo repositorio y sus evidencias. El prompt resume; los contratos y el código activo contienen el detalle. [Índice documental](README.md), [arquitectura](02-architecture.md) y [reconstrucción limpia](10-manual-reconstruccion.md).
