# Hoja de ruta

Estado base revisado el 16-11-2026 contra `main` en `f6fda9f743d038ab7ee08ee0b71ad65c790c34db`. La lista se ordena por dependencias.

## Hecho y verificado

- Wiki Astro/Starlight construible y desplegada en GitHub Pages.
- CI, wiki build, Pages deploy y dependency/license audit exitosos en el SHA auditado.
- Procesador remark con directivas personalizadas y tabla árbol renderizada en HTML.
- Galería con ejemplos ampliados de directivas y estilos.
- Sintaxis YAML `xmind` para transportar propiedades de hoja y nodo; clase de estructura predeterminada `org.xmind.ui.treetable.toptitle`.
- Documentación de propiedades XMind: `docs/11-xmind-json-defaults.md`.

## Siguiente tramo

### AST-012 — pruebas y contrato estable del procesador
El PR #5 añade pruebas de regresión con `node:test` y el script `npm test`. Está abierto en borrador; sus ejecuciones CI y Wiki Build observadas resultaron satisfactorias para el SHA del PR. Revisar el diff y el SHA actual antes de decidir integración. No describir estas pruebas como integradas en `main` hasta que lo estén.

### AST-013 — resolver presets y herencia
Diseñar un catálogo versionado de presets por estructura XMind. Definir precedencia: defaults del preset, defaults de tipo/nivel, propiedades declaradas localmente. Especificar comportamiento de objetos anidados, arrays y claves desconocidas; después validar con fixtures extraídos de XMind.

### AST-014 — validar y normalizar declaraciones
Añadir esquema/validación del bloque YAML `xmind`, errores comprensibles y normalización determinista. Mantener extensiones no reconocidas recuperables o emitir avisos explícitos.

### AST-015 — conversión de la representación intermedia
Diseñar un modelo intermedio desacoplado del HTML y una primera conversión de ejemplo a estructura de documento XMind. No afirmar compatibilidad general hasta probar abrir, guardar y reabrir el archivo en XMind Desktop.

### AST-016 — contenido de estudio y pruebas
Ampliar contenido con referencias y licencias claras. La propuesta de cuadernos prácticos TAI en PR #2 requiere revisión de derechos y exposición porque el repositorio y Pages son públicos.

## Mantenimiento continuo

- Auditar dependencias y licencias en cada actualización relevante.
- Revisar enlaces internos y navegación de Pages.
- Actualizar documentación de continuidad tras cada hito.
- La actualización de dependencias Astro/Starlight está propuesta en PR #1; revisar conflictos, seguridad, compatibilidad y checks del SHA actual antes de integrarla.
