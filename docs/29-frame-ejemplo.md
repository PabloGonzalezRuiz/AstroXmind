# FrameEjemplo · banco de pruebas reutilizable

## FRAME-02 — Publicado y aceptado para el cierre de etapa (22-11-2026)

Corrección del inspector (22-11-2026): panel de propiedades limitado al ancho del editor y a la altura visible, con desplazamiento independiente y acciones accesibles. Usa la capa superior del navegador cuando admite popover y posicionamiento limitado como alternativa. 104 pruebas automatizadas correctas; Pages correcto y scroll aceptado por Pablo. Mejoras de ergonomía del cuadro aplazadas como CTX-08 al final de la hoja de ruta. [Hito de cierre](30-milestone-20261122.md).

**Entrega publicada el 22-11-2026:** página exclusiva [FrameEjemplo](https://pablogonzalezruiz.github.io/AstroXmind/frame-ejemplo/), con un solo marco visible y acceso a los diez ejemplos mediante su selector. La fuente MDX declara únicamente el import y `<FrameEjemplo example="tree-table/base" />`; el editor documental muestra una representación compacta. Los marcos de las demostraciones existentes conservan su desplegable por compatibilidad. Check/build y Pages correctos.

En lectura normal, el marco muestra selector, código editable arriba y resultado renderizado debajo, con actualización en tiempo real. No exige abrir un desplegable ni usar el editor de página completa. La disposición vertical se mantiene también en escritorio para facilitar el uso móvil. Reset restaura el ejemplo seleccionado; cambiar la selección no modifica el valor inicial del documento ni GitHub. Mantener confirmación al descartar cambios y aislamiento entre marcos.

En edición de la página, el código fuente contiene únicamente la declaración `<FrameEjemplo example="tree-table/base" />` (más su import cuando corresponda), no el contenido expandido del ejemplo. El editor de página debe reconocer la etiqueta y mostrar una representación compacta, sin inicializar otro editor interactivo dentro de la previsualización. El identificador interno de instancia se obtiene automáticamente; preservar compatibilidad con `id` existente. Guardar la página solo guarda su declaración, nunca los cambios temporales del marco.

Conservar las referencias Resultado/Código de solo lectura y reutilizar los diez archivos existentes y el renderizador compartido. No introducir evaluación arbitraria de MDX. Criterios de aceptación: probar selector, dos instancias independientes, edición en directo, reset, descarte, ausencia de guardado remoto, etiqueta compacta y accesibilidad de teclado y táctil; verificar Acciones en iPhone. No dar por aprobada la interacción móvil por una prueba DOM.

Lo que sigue conserva el contrato original del 19-11; `id` es opcional desde FRAME-02 y la declaración directa es visible por defecto.

## Contrato (19-11-2026)

`<FrameEjemplo example="tree-table/base" id="mi-practica" />` en MDX, importando `src/components/FrameEjemplo.astro`. `example` identifica el ejemplo inicial sin extensión (por defecto `tree-table/base`); `id` distingue instancias de una misma página y debe ser único. Un ejemplo desconocido falla en compilación.

El catálogo se genera al compilar desde `src/examples/tree-table/**/*.mdx`: cada archivo es una entrada y sus directorios forman el grupo navegable del selector. No se copia el contenido de los ejemplos. Actualmente se ofrecen los diez ejemplos de TreeTable; Panel y navegación no se anuncian como editables porque aún carecen de renderizador en directo. Al habilitar un nuevo tipo se deberá incorporar su categoría y reutilizar el modelo de vista previa; nunca evaluar MDX arbitrario.

`ComponentExample practice` conserva el original compilado Resultado/Código y delega su zona de pruebas a FrameEjemplo, que incorpora el mismo WikiEditor e inspector contextual. No se duplican renderizadores. Cada marco tiene un estado separado, sin token, guardado remoto ni almacenamiento persistente. La ruta efectiva del archivo se actualiza al seleccionar un ejemplo, permitiendo resolver imports. El selector confirma el descarte de cambios sin guardar. Restablecer recupera el original de la selección actual, vacía el historial contextual y reconstruye la vista previa. Descargar Markdown sigue disponible.

## Verificación

Prueba manual: https://pablogonzalezruiz.github.io/AstroXmind/componentes/tree-table/ (abrir Banco de pruebas debajo de una demostración). Cambiar a otro ejemplo, editar, restablecer, cambiar con cambios pendientes y cancelar; comprobar que el original y otro marco no cambian. Verificar también https://pablogonzalezruiz.github.io/AstroXmind/clases-astro/.

La prueba de HTML compilado `tests/wiki-editor.test.mjs` comprueba selección inicial, catálogo, vista previa, confirmación, reset sobre la selección y ausencia de peticiones GitHub. No acredita por sí sola interacción real táctil ni el layout.
