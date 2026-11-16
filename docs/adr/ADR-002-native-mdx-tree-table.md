# ADR-002: laboratorio Astro aislado con MDX y TreeTable

- Fecha: 2026-11-16
- Estado: Implementada como prototipo
- Integración: PR #7; commit principal `109e0338b4a72c79f6796b6d66486d188c65486c`

## Contexto

AstroXmind necesita un modo de probar componentes, observar el resultado y corregir errores antes de ampliar el lenguaje. TreeTable convierte una lista Markdown jerárquica dentro de MDX en tabla HTML estática.

## Decisión

Mantener una aplicación Astro mínima en `examples/astro-component-lab`, con MDX y `TreeTable.astro`. La página de la wiki reutiliza el componente; StackBlitz abre una copia editable con vista previa Vite y terminal.

El componente interpreta en servidor el HTML de la lista, calcula los spans y emite HTML estático. Usa clases CSS por nivel y admite numeración por nodo con marcadores inspirados en `org.xmind.ui.numbering`, escritos como texto literal entre corchetes sin escapes MDX: `[numbering=arabic]`, `[numbering=arabic; tiered=true]`, `[numbering=arabic; start=N]`.

## Consecuencias

- El ejemplo público enlaza a la implementación, al MDX completo y al MD base.
- StackBlitz es un entorno de prueba y no guarda cambios de vuelta a GitHub.
- El build de la wiki ya no depende de los generadores de galerías antiguas.
- El prototipo no convierte todavía los nodos a un archivo `.xmind`.
- La tabla no recibe JavaScript de hidratación.

## Verificación

Para el commit `109e0338b4a72c79f6796b6d66486d188c65486c`, CI, Wiki Build, auditoría y Pages Deploy finalizaron correctamente. La ruta antigua del Bloque I devuelve 404.
