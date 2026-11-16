# ADR-002: laboratorio Astro aislado con MDX y TreeTable

- Fecha: 2026-11-16
- Estado: En evaluación
- Rama: `feature/mdx-tree-table`

## Contexto

AstroXmind necesita un modo rápido de experimentar con componentes, observar el renderizado y corregir errores antes de integrar cambios. El prompt alternativo propone derivar una tabla árbol de una lista Markdown en el slot de un componente Astro.

## Decisión provisional

Crear una aplicación Astro mínima en `examples/astro-component-lab`, con MDX y `TreeTable.astro`. La wiki ofrece un enlace a una copia editable en StackBlitz. El componente obtiene el HTML del slot en el servidor, interpreta la lista con `node-html-parser`, calcula los spans por número de hojas y emite HTML estático. Se conserva negrita, énfasis, código y enlaces seguros en las etiquetas.

El procesador del laboratorio MDX no hereda los plugins Remark/Rehype de la wiki. El sitio principal conserva su pipeline actual para los documentos existentes.

## Consecuencias

- Se pueden editar el componente y el caso MDX en el navegador con vista previa Vite y terminal.
- La importación StackBlitz abre solo la carpeta del laboratorio; no necesita compilar Starlight ni instalar Pandoc.
- El contenido de ejemplo es `.mdx` porque importa el componente; los temas de estudio existentes pueden continuar en `.md`.
- Una copia de StackBlitz no guarda los cambios de vuelta en GitHub automáticamente.
- La importación de slot HTML puede depender del HTML que genera MDX. Se debe mantener un caso con ramas desiguales y contenido enriquecido.
- El prototipo no reemplaza remark ni cambia la wiki pública hasta superar revisión y validación.

## Alternativas consideradas

1. Mantener únicamente el procesador Remark/Rehype: ya cubre contenido `.md`, pero no ofrece por sí solo un espacio online editable para el componente.
2. Usar un playground construido dentro de Pages: requeriría compilar Astro en el navegador o una herramienta de edición propia.
3. Crear otro repositorio: duplica la configuración y retrasa la prueba de integración; se puede reconsiderar si el laboratorio se convierte en herramienta independiente.

## Validación e integración

- Validar el build del sitio mediante el workflow de PR.
- Probar el laboratorio con Chrome, verificar vista previa y errores.
- No fusionar a `main` ni desplegar Pages sin autorización explícita del usuario.
