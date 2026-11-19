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
