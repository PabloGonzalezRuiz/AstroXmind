# Hoja de ruta

Estado de referencia: código de `main` auditado el 16-11-2026; nuevas propuestas declarativas registradas el mismo día.

## Hecho y verificado

- Wiki Astro/Starlight construible y desplegada en GitHub Pages.
- CI, wiki build, Pages deploy y dependency/license audit exitosos para el SHA de código auditado `f6fda9f743d038ab7ee08ee0b71ad65c790c34db`.
- Procesador remark con directivas personalizadas y tabla árbol renderizada en HTML.
- Galería con ejemplos ampliados de directivas y estilos.
- Sintaxis YAML `xmind` para transportar propiedades de hoja y nodo; estructura de tabla ejemplo `org.xmind.ui.treetable.toptitle`.
- Los encabezados admiten clases CSS específicas mediante atributos, por ejemplo `## Tema {.clase}`.
- Documentación de propiedades XMind: `docs/11-xmind-json-defaults.md`.

## Siguiente tramo

### AST-012 — pruebas y contrato estable del procesador
El PR #5 propone pruebas de regresión con `node:test` y el script `npm test`. Confirmar head y checks actuales antes de decidir integración. En `main` auditada no se encontraba integrado.

### AST-017 — clases CSS por nivel
Añadir una declaración de clases por nivel de nodo, conservando las clases explícitas por encabezado como sobrescritura/adición local. Propuesta inicial: bloque `yaml clases` dentro de `rootTopic`, con niveles numerados respecto a `rootTopic` (el nivel 1 es `##`). Valores pueden ser una clase o una lista. Las clases asignadas por nivel se añaden a la celda de cada nodo; las clases particulares del encabezado se mantienen. Separar este mapa CSS del bloque `yaml xmind`.

Criterios: ejemplo ejecutable en la galería; caso con niveles irregulares y ramas de distinta profundidad; pruebas de asignación y orden/deduplicación de clases; validación de clase y nivel.

### AST-013 — resolver presets y herencia XMind
Diseñar catálogo de presets por estructura XMind. Definir precedencia entre defaults del preset, defaults de tipo/nivel y propiedades declaradas localmente. Especificar fusión de objetos y arrays; validar con fixtures de XMind.

### AST-014 — validar y normalizar declaraciones
Añadir esquema/validación de YAML `xmind` y `clases`, mensajes de error útiles y normalización determinista. Mantener la presentación CSS y metadatos XMind como secciones separadas.

### AST-018 — compatibilidad de elementos MarkXMind/XMindMark
Tomar como referencia semántica MarkXMind para relaciones, límites, resúmenes, enlaces, notas y plegado. Definir primero un modelo intermedio de elementos, después una sintaxis AstroXmind explícita y conversiones. No asumir que sus marcadores con corchetes ni su parser generan el mismo layout, clases o estructura de tabla árbol. Evaluación documentada en `docs/12-markxmind-compatibility.md`.

### AST-015 — conversión de la representación intermedia
Diseñar la conversión de un ejemplo a XMind. No afirmar compatibilidad general hasta abrir, guardar y reabrir el resultado en XMind Desktop.

### AST-016 — contenido de estudio y pruebas
Ampliar contenido con referencias y licencias claras. La propuesta de cuadernos prácticos TAI en PR #2 requiere revisión de derechos y exposición porque el repositorio y Pages son públicos.

## Mantenimiento continuo

- Auditar dependencias y licencias en cada actualización relevante.
- Revisar enlaces internos y navegación de Pages.
- Actualizar continuidad tras cada hito.
- La actualización de dependencias Astro/Starlight está propuesta en PR #1; revisar conflictos, seguridad, compatibilidad y checks del SHA actual antes de integrarla.
