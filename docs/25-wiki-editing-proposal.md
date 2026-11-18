# Propuesta de edición desde la wiki

Estado propuesto. Primera prioridad de la [hoja de ruta](03-roadmap.md).

## Primera entrega

En un documento de prueba, abrir **Editar** desde su página, iniciar sesión, editar el Markdown, revisar una vista previa y guardar como borrador revisable. El editor conserva el texto del archivo, incluidas las anotaciones de TreeTable y las referencias. La primera entrega edita páginas existentes y mantiene sus IDs, clasificación y rutas. MDX con componentes queda para una ampliación tras comprobar el flujo Markdown.

## Guardado y publicación

GitHub sigue siendo la fuente de verdad y GitHub Pages sirve la wiki estática. Probar un servicio pequeño con sesión autenticada y una GitHub App de alcance limitado al repositorio. Tras comprobar el permiso editorial y que la página está autorizada, el servicio valida la ruta, el contenido y la revisión original y escribe en una rama de borrador. Credenciales de instalación solo en el servidor. El borrador se revisa mediante pull request. CI valida el cambio y Pages publica después de la integración autorizada. La aprobación editorial y la escritura a main se mantienen separadas del guardado.

La vista previa inmediata renderiza Markdown saneado. La comprobación fiel de TreeTable y referencias usa la compilación real del borrador en un entorno aislado. El primer recorrido usa un documento de prueba con plegado y una referencia interna. Si cambió la revisión base, avisar del conflicto y conservar el texto para comparar. El estado debe distinguir borrador guardado, revisión pendiente y publicación comprobada.

## Aceptación en la wiki

1. Abrir el documento de prueba y entrar en modo edición desde la propia página.
2. Cambiar un párrafo, una anotación de TreeTable y una referencia. Revisar el resultado compilado, incluyendo plegado y destino.
3. Guardar y reabrir el borrador. Comprobar que se conserva el texto y que se puede revisar el cambio.
4. Verificar que una sesión sin permisos no puede guardar y que dos ediciones simultáneas no se sobrescriben.
5. Tras la aprobación y despliegue, abrir la misma URL y comprobar el resultado publicado.

## Desarrollo posterior

El explorador usará el mismo mecanismo de borrador. Arrastrar cambiará `navigation.order` y, cuando corresponda, `navigation.parent`. Una operación actualizará el conjunto de hermanos afectado y el índice recalculará los ordinales. Conservar IDs, rutas y referencias. Validar ciclos y conflictos. Prever aquí controles de movimiento con teclado y una alternativa táctil. El arrastre en TreeTable se evaluará tras validar el explorador. El prototipo deberá preservar IDs de nodos, referencias, orden y plegado al reescribir la fuente.
