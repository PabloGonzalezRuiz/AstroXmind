# Propuesta de edición desde la wiki

Primera prioridad de la [hoja de ruta](03-roadmap.md). El prototipo de edición en directo se prueba en [/editar-prueba/](https://pablogonzalezruiz.github.io/AstroXmind/editar-prueba/#editar-markdown).

El prototipo renderiza Markdown y tablas GFM mientras se escribe, permite guardar y recuperar en el mismo navegador y exportar el texto como Markdown. Avisa si otra pestaña cambió el borrador. Quedan pendientes la autenticación, el guardado persistente en GitHub y la validación compilada de TreeTable/MDX.

## Primera entrega

En un documento de prueba, abrir **Editar** desde su página, iniciar sesión, editar el Markdown con vista previa en directo y guardar como borrador revisable. El editor conserva el texto del archivo, incluidas las anotaciones de TreeTable y las referencias. La primera entrega edita páginas existentes y mantiene sus IDs, clasificación y rutas. MDX con componentes queda para una ampliación tras comprobar el flujo Markdown.

## Guardado y publicación

GitHub sigue siendo la fuente de verdad y GitHub Pages sirve la wiki estática. Probar un servicio pequeño con sesión autenticada y una GitHub App de alcance limitado al repositorio. Tras comprobar el permiso editorial y que la página está autorizada, el servicio valida la ruta, el contenido y la revisión original y escribe en una rama de borrador. Credenciales de instalación solo en el servidor. El borrador se revisa mediante pull request. CI valida el cambio y Pages publica después de la integración autorizada. La aprobación editorial y la escritura a main se mantienen separadas del guardado.

## Edición con vista previa en directo

En escritorio, Markdown a la izquierda y resultado a la derecha. El resultado se actualiza mientras se escribe, tras una breve pausa, y renderiza encabezados, listas, enlaces y tablas Markdown con los estilos de la wiki. En móvil, usar pestañas **Editar** y **Resultado** con el mismo borrador. La vista previa renderiza Markdown saneado y mantiene visible el texto original si hay errores. Guardar sigue siendo una acción explícita.

La comprobación fiel de TreeTable y referencias usa la compilación real del borrador en un entorno aislado. El primer recorrido usa un documento de prueba con plegado y una referencia interna. Si cambió la revisión base, avisar del conflicto y conservar el texto para comparar. El estado debe distinguir borrador guardado, revisión pendiente y publicación comprobada.

## Aceptación en la wiki

1. Abrir el documento de prueba y entrar en modo edición desde la propia página.
2. Cambiar un título y una tabla Markdown. Confirmar que el panel Resultado se actualiza sin guardar ni recargar. En móvil, alternar entre Editar y Resultado y comprobar que se conserva el texto.
3. Cambiar una anotación de TreeTable y una referencia. Revisar el resultado compilado, incluyendo plegado y destino.
4. Guardar y reabrir el borrador. Comprobar que se conserva el texto y que se puede revisar el cambio.
5. Verificar que una sesión sin permisos no puede guardar y que dos ediciones simultáneas no se sobrescriben.
6. Tras la aprobación y despliegue, abrir la misma URL y comprobar el resultado publicado.

## Desarrollo posterior

El explorador usará el mismo mecanismo de borrador. Arrastrar cambiará `navigation.order` y, cuando corresponda, `navigation.parent`. Una operación actualizará el conjunto de hermanos afectado y el índice recalculará los ordinales. Conservar IDs, rutas y referencias. Validar ciclos y conflictos. Prever aquí controles de movimiento con teclado y una alternativa táctil. El arrastre en TreeTable se evaluará tras validar el explorador. El prototipo deberá preservar IDs de nodos, referencias, orden y plegado al reescribir la fuente.

El servicio de autenticación y guardado se prepara en rama. [Configuración y prueba real](26-wiki-editor-github.md).
