# Editor contextual de componentes — fase propuesta

Decisión de Pablo, 19-11-2026. Esta fase tiene prioridad sobre el arrastre. No iniciar implementación hasta autorización del paso correspondiente.

## Objetivo

Seleccionar Markdown/MDX estructurado y transformarlo en un componente compatible sin escribir etiquetas o imports manualmente. Al pulsar la apertura de un componente o un nodo de su lista, mostrar un inspector en español, con sus propiedades actuales, opciones disponibles y restricciones. Mantener la fuente Markdown/MDX como verdad editorial.

## Arquitectura propuesta

- Biblioteca interna de componentes y catálogo declarativo versionado, independientes de la interfaz. Importar únicamente el componente empleado; no importar la biblioteca entera ni publicar npm por ahora. Reutilizar el laboratorio y su modelo compartido; no duplicar TreeTable.
- Cada descriptor define identidad estable, ruta de importación, tipos de contenido compatibles, apertura/cierre, propiedades globales y de nodo, tipos, valores, valores por defecto, documentación española, herencia, restricciones, opciones y referencias a clases conocidas. El catálogo debe ser legible por IA y permitir generar documentación y formularios sin ejecutar código introducido por el usuario.
- Analizar estructura y posiciones de fuente usando AST Markdown/GFM y escáner MDX seguro. Resolver imports relativos al archivo destino, evitar duplicados y colisiones de nombre, preservar YAML, listas, indentación y texto ajeno. Una transformación será atómica y reversible en una sola operación de deshacer. No envolver listas parciales ni crear anidamientos que el modelo no soporte; explicar por qué no se ofrece una opción.
- Inspector de etiqueta de apertura y de nodo, coordinados con el modelo semántico y sincronización actual de celdas. Las propiedades explícitas se pueden editar/eliminar; las heredadas se muestran marcadas, grises y deshabilitadas, con valor y origen (componente o nodo identificable, salto al origen si es posible). Acción explícita de personalizar cuando sea válida; al eliminarla vuelve la herencia. Valores por defecto diferenciados de heredados. No inventar clases: descubrir las clases registradas; aceptar solo las permitidas por el contrato.
- Validar antes de aplicar, actualizar vista previa inmediatamente, mantener teclado accesible y no guardar automáticamente. No evaluar MDX ni JS arbitrario en el navegador que conserva el token. El guardado actual seguirá usando revisión GitHub verificada.

## Primer componente: reglas reales que debe representar el catálogo

| Ámbito | Propiedad | Contrato actual |
|---|---|---|
| Apertura | numbering | none, siblings, path; controla modo de presentación, no activa numeración por nodo |
| Apertura | collapsible, folded | booleanos, valores heredables por rama; folded solo tiene efecto si puede plegarse |
| Apertura | levelClasses | asignaciones nivel:Clase, nivel 0 raíz; clase de nivel sobrescribe herencia |
| Nodo | numbering | arabic/none; heredable; none corta la ruta |
| Nodo | tiered | booleano heredable; requiere numeración activa propia o heredada |
| Nodo | start | entero positivo; no heredable; requiere numeración activa propia o heredada |
| Nodo | collapsible, folded | booleanos heredables con las reglas del componente |
| Nodo | class | clase CSS o none; prioridad explícita > nivel > padre > estilo base |
| Nodo | id | ref-nombre válido y único; no heredable |

El modelo actual resuelve valores, pero no devuelve de forma estructurada todos los orígenes de herencia. No inferirlos desde colores, texto o números del HTML; ampliar el modelo con procedencia explícita en la fase correspondiente. Para folded heredado y collapsible=false, mostrar el valor heredado pero explicar que no es efectivo en ese nodo.

## Secuencia y criterios de aceptación

| Paso | Entrega verificable |
|---|---|
| CTX-01 | Contrato del catálogo y primer descriptor TreeTable: esquema versionado, reglas españolas, tipos de contenido, rutas de import, propiedades, clases y dependencias; pruebas de consistencia frente al modelo real; sin menús todavía. |
| CTX-02 | Motor de transformación: selección de lista Markdown, envoltura en TreeTable, import automático único, preservación de fuente y deshacer único; pruebas de selección parcial, MDX existente, aliases y rutas. |
| CTX-03 | Menú contextual de selección: mostrar componentes compatibles y motivo de opciones no aplicables; accesibilidad teclado; vista previa y prueba wiki. |
| CTX-04 | Inspector de apertura: lectura de propiedades explícitas, valores predeterminados, formulario español con checks/desplegables y clases conocidas; aplicar cambios sin tocar cuerpo. |
| CTX-05 | Modelo de procedencia e inspector por nodo: herencia trazable, controles deshabilitados, personalizar/restaurar, restricciones coordinadas (start/tiered con numbering activo), salto al padre/origen. |
| CTX-06 | Integración y regresión: sincronización, undo, navegación, teclado, móvil, conflictos de guardado, seguridad y ejemplo wiki; actualizar guía y validación del usuario. |
| CTX-07 | Consolidar catálogo/biblioteca interna y extensibilidad mediante un segundo componente cuando se acuerde; generar referencia para humanos e IA. Empaquetado público AST-027 sigue al final. |

## CTX-01 — catálogo v1

Autorizado por Pablo el 19-11-2026. El catálogo se encuentra en [`components.json`](../examples/astro-component-lab/src/catalog/components.json), junto al [`esquema JSON v1`](../examples/astro-component-lab/src/catalog/components.schema.json). Contiene el descriptor `tree-table`, rutas relativas a la raíz del repositorio, sintaxis, contenido compatible, etiquetas y explicaciones en español, valores por defecto, modos de herencia, reglas y clases conocidas. Es un recurso de datos, no una biblioteca npm publicada.

Las reglas `requires` expresan una restricción de declaración; `effective-when` indica cuándo un valor tiene efecto (no invalida un valor declarado si no se cumple). Las condiciones se refieren a propiedades con ámbito `component.` o `node.`; `node.hasChildren` es un dato estructural derivado. `null` indica ausencia de valor explícito/predeterminado fijo, no el texto literal `null` en MDX. `start` sin valor explícito continúa su contador de hermanos, no toma el número del padre. Los descriptores de clases indican las hojas reales, pero los nombres CSS siguen siendo extensibles y no reservados. No se promete aplicar CSS inexistente.

El modelo compartido utiliza el catálogo para valores por defecto, nombres de propiedades, enumeraciones y patrones; la lógica semántica sigue en el modelo (no se interpreta una segunda implementación de las reglas). El escáner MDX usa el catálogo para identificar propiedades literales permitidas. El script `npm run test:catalog` valida el esquema, referencias internas, rutas CSS y coherencia semántica del modelo; forma parte de `npm run check`. No hay menú ni inspector todavía. CTX-02 requiere autorización posterior.

Verificación local: 6 pruebas del catálogo, 43 de navegación y 36 de HTML/DOM/editor (85 total); comprobación Astro y compilación de wiki y laboratorio correctas. No se cambia la experiencia visible de la wiki en este paso.

## CTX-02 — motor de transformación

Autorizado el 19-11-2026. `src/lib/wiki-editor-transform.mjs` expone `planComponentTransformation({source,start,end,path,componentId})`: analiza el AST MDX/GFM sin ejecutar código, comprueba que la selección abarca una única lista raíz completa y valida su contenido con el modelo TreeTable. Devuelve `{ok,reason}` si no es compatible o una transacción con `before/after` (fuente y selección), nombre utilizado e indicador de import añadido. El import se calcula desde la ruta real del documento, se inserta después del YAML, reutiliza imports existentes y sus alias válidos, y evita colisiones de nombres. Las fuentes raw no se confunden con el componente. Conserva el texto, espacios y finales de línea del documento; rechaza listas parciales, dentro de componentes, de bloques de código o de citas, y MDX incompleto. Validación no ejecutable del documento resultante.

`applyComponentTransaction` y `createComponentTransactionHistory` aplican/revierten el cambio completo como una unidad, con un evento input y selección coherente. Ctrl/⌘+Z y rehacer se ofrecen al conectar el adaptador; si existen cambios posteriores, no los sobrescriben. La previsualización reconoce alias de TreeTable y conserva demos ya publicadas cuando se añade el import necesario. No existe aún menú ni botón para ejecutar el motor en la wiki (CTX-03). En `.md` no se puede usar JSX/MDX: se devuelve un motivo explicativo; convertir/renombrar el archivo es una operación distinta que requerirá aprobación y conservación de IDs/URLs.

Pruebas `npm run test:transform`: selección, imports, alias, colisiones, rutas, rechazo de selecciones inválidas, CRLF y undo/redo. Una regresión postbuild comprueba el resultado en el editor real y que las demos importadas no desaparecen. CTX-03 deberá conectar el motor desde el menú contextual y probar el recorrido en navegador.

## CTX-03 — menú de creación

Validación real: Pablo creó y guardó la primera tabla en `34b56b9`. El despliegue se bloqueó por una prueba postbuild acoplada al texto editable. La prueba se independizó del contenido de la wiki y se incorporó confirmación de publicación y recarga automática; véase [contrato de guardado](27-editor-github-pages-pat.md). La tabla se conserva.

Autorizado e implementado el 19-11-2026. `src/lib/wiki-editor-context.mjs` conecta el catálogo y el motor al editor completo. Seleccionar una lista resalta **Crear**; para abrir las opciones se puede pulsar ese botón, hacer clic derecho sobre la selección o usar Mayús+F10. El menú muestra los componentes del catálogo, deshabilita las opciones incompatibles con su motivo, permite cerrar con Escape y devuelve el foco al editor. La operación comprueba que fuente y selección no hayan cambiado, aplica una única transacción y actualiza la vista previa sin guardar. Ctrl+Z deshace import y envoltura; Ctrl+Mayús+Z rehace. El menú está deshabilitado en modo Resultado. No se ejecuta MDX arbitrario ni se convierte `.md` a `.mdx` automáticamente.

Prueba manual: [Crear componentes desde Markdown](https://pablogonzalezruiz.github.io/AstroXmind/editar-prueba/#crear-componentes-desde-markdown). Seleccionar toda la lista de Proyecto de ejemplo, crear Tabla jerárquica, verificar import y resultado, deshacer. Seleccionar solo parte de la lista para ver el motivo de incompatibilidad. CTX-04 (inspector de apertura) espera autorización expresa. El historial integrado HIST-01 queda fuera de esta fase y se realizará después de los siguientes puntos previstos de la [hoja de ruta](03-roadmap.md).

Verificación local: 8 pruebas del motor, 6 del catálogo, 43 de navegación y 37 HTML/DOM/editor (94 total); `npm run check` y `npm run build` correctos.

## CTX-04 — inspector de apertura

Autorizado el 19-11-2026. `wiki-editor-inspector.mjs` localiza la apertura de TreeTable inline, incluida su alias de import real, y reutiliza el escáner de la vista previa, el catálogo y `buildTreeTableRows`. El cursor sobre la apertura muestra **Propiedades**; también se puede abrir desde la barra con el teclado. Cada propiedad tiene un check de declaración explícita, un valor editable solo cuando está marcada y su valor predeterminado explicado en español. Se ofrecen enumeraciones, booleanos y un mapa nivel:clase con selector de clases CSS registradas y nivel entero; los nombres personalizados siguen siendo compatibles con el contrato. Las dos clases conocidas se cargan en la wiki.

**Aplicar propiedades** valida el modelo, modifica únicamente la etiqueta, conserva su alias y deja el cuerpo intacto. Se comparte el historial transaccional con CTX-03: Ctrl+Z y rehacer revierten las operaciones en orden. El resultado se actualiza en directo; no se guarda automáticamente. Las aperturas inválidas, código cercado y componentes no importados por el catálogo no son editables por el inspector. Se conservan las limitaciones del escáner: apertura literal en una línea. CTX-05 llevará el inspector a cada nodo y explicará la procedencia de la herencia.

Prueba manual: [Inspector de propiedades](https://pablogonzalezruiz.github.io/AstroXmind/editar-prueba/#inspector-de-propiedades). Cambiar numeración, plegado y clases; probar Ctrl+Z. Las pruebas automatizadas emplean fuente aislada para no bloquear guardados de Pablo. CTX-05 espera autorización.

## CTX-05 — inspector de nodos y herencia

Autorizado el 19-11-2026. `buildTreeTableRows` emite opcionalmente un mapa `NodeInspection` con claves preorden, padre, nivel, etiqueta, hijos y propiedades resueltas. El mismo recorrido que calcula numeración, plegado y clases informa valor, origen (nodo, etiqueta, nivel, valor predeterminado o contador), declaración explícita, efectividad y valor/origen de retorno al retirar la declaración. No se infiere herencia del HTML ni se duplica el motor. `treeNodeRanges` comparte los rangos AST con sincronización y el inspector.

`wiki-editor-node-inspector.mjs` activa el inspector al pulsar una línea de nodo o su celda de vista previa sincronizada (no interfiere con controles de plegado o enlaces). Muestra siete propiedades del catálogo en español; las heredadas aparecen deshabilitadas y con origen, y **Ir al origen** selecciona el nodo o la apertura correspondiente. **Personalizar** permite sobrescribir; al desmarcar se recupera el valor de retorno. `start` y `tiered` no se pueden declarar sin numeración activa; plegado sin efecto se explica sin perder herencia. La clase ofrece opciones registradas y valor personalizado; `none` corta la herencia. Validación de IDs en tablas inline del documento y en compilación. Solo se cambia la anotación literal final del nodo, tras validar el modelo completo, y se conserva el resto de la fuente. El historial compartido permite deshacer y rehacer sin guardar automáticamente. Las demos importadas no se editan desde el documento anfitrión.

Prueba manual: [Inspector de nodos y herencia](https://pablogonzalezruiz.github.io/AstroXmind/editar-prueba/#inspector-de-nodos-y-herencia). Pulsar «Punto heredado», inspeccionar origen, personalizar numeración o clase, aplicar, deshacer y comprobar la excepción y el nodo sin numeración. CTX-06 (integración y regresión) espera autorización.
