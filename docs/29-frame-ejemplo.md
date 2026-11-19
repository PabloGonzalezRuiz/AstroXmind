# FrameEjemplo · banco de pruebas reutilizable

## Contrato (19-11-2026)

`<FrameEjemplo example="tree-table/base" id="mi-practica" />` en MDX, importando `src/components/FrameEjemplo.astro`. `example` identifica el ejemplo inicial sin extensión (por defecto `tree-table/base`); `id` distingue instancias de una misma página y debe ser único. Un ejemplo desconocido falla en compilación.

El catálogo se genera al compilar desde `src/examples/tree-table/**/*.mdx`: cada archivo es una entrada y sus directorios forman el grupo navegable del selector. No se copia el contenido de los ejemplos. Actualmente se ofrecen los diez ejemplos de TreeTable; Panel y navegación no se anuncian como editables porque aún carecen de renderizador en directo. Al habilitar un nuevo tipo se deberá incorporar su categoría y reutilizar el modelo de vista previa; nunca evaluar MDX arbitrario.

`ComponentExample practice` conserva el original compilado Resultado/Código y delega su zona de pruebas a FrameEjemplo, que incorpora el mismo WikiEditor e inspector contextual. No se duplican renderizadores. Cada marco tiene un estado separado, sin token, guardado remoto ni almacenamiento persistente. La ruta efectiva del archivo se actualiza al seleccionar un ejemplo, permitiendo resolver imports. El selector confirma el descarte de cambios sin guardar. Restablecer recupera el original de la selección actual, vacía el historial contextual y reconstruye la vista previa. Descargar Markdown sigue disponible.

## Verificación

Prueba manual: https://pablogonzalezruiz.github.io/AstroXmind/componentes/tree-table/ (abrir Banco de pruebas debajo de una demostración). Cambiar a otro ejemplo, editar, restablecer, cambiar con cambios pendientes y cancelar; comprobar que el original y otro marco no cambian. Verificar también https://pablogonzalezruiz.github.io/AstroXmind/clases-astro/.

La prueba de HTML compilado `tests/wiki-editor.test.mjs` comprueba selección inicial, catálogo, vista previa, confirmación, reset sobre la selección y ausencia de peticiones GitHub. No acredita por sí sola interacción real táctil ni el layout.
