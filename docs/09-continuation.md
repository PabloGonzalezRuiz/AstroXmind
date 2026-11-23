# Reanudar AstroXmind

PRIVATE-01 publicado y confirmado. CALL-01 inicial publicado; [revisión de identidad](32-oposiciones.md) en `feature/call-01-identidad`. Almacén privado creado; token debe incluir ambos repositorios con Contents lectura/escritura. Publicar tras autorización y comprobar alta/duplicado/renombrado/alias/recarga. Usar ID inmutable en futuras relaciones; la ruta física es independiente del nombre. No avanzar a CALL-02 o F00 hasta aceptación.

**Idioma:** español para comunicaciones, documentación, etiquetas de interfaz, comentarios y mensajes de commits; conservar identificadores técnicos cuando sea necesario.

**Cierre de sesión:** consultar los documentos maestros privados actualizados antes de desarrollar. Los requisitos posteriores de vinculación y seguimiento no alteran el punto de parada F00. Comprobar HEAD y CI al reanudar.

**Prioridad vigente (23-11-2026):** flujo privado de gestión documental. Primero validar autenticación y autorización para habilitar el menú privado; después alta de convocatoria por nombre, alta de edición por año y asistente secuencial de la edición 2025. Primer hito: recepción de PDF oficial, carpeta propia, extracción y validación de metadatos, nombre canónico sin modificar el original y enlace de acceso protegido. Detenerse tras F00 para aceptación. F01–F05 y temario quedan bloqueados; no publicar documentación privada ni credenciales. La especificación detallada y el prompt de conversión se conservan en los documentos maestros privados de continuidad.

Los siguientes puntos de continuidad son históricos y no ordenan la próxima sesión.

Punto de continuidad histórico 22-11-2026: [auditoría](audits/2026-11-22-project-audit.md) de main b78362d, publicada y con 101 pruebas correctas. La primera tarea es FRAME-02, no volver a implementar FrameEjemplo v1: preparar el banco vertical visible en lectura, declaración compacta en edición, selector/reset y pruebas de aislamiento; verificar Acciones en iPhone. Después CTX-06/07. No hay autorización para integrar el rediseño todavía. Las notas siguientes conservan contexto de la entrega anterior.

Punto de continuidad 19-11-2026: Pablo autorizó FrameEjemplo hasta su publicación y actualización documental. [Contrato](29-frame-ejemplo.md). Verificar primero HEAD, CI y Pages; probar selector, descarte y reset del ejemplo activo en TreeTable y Clases Astro. Después retomar CTX-06 cuando se autorice, sin perder las tareas posteriores del roadmap.

Primera prioridad: [editor contextual CTX-01 a CTX-07](28-contextual-component-editor.md). CTX-01/02/03/04/05 implementados; CTX-06 espera autorización. Conservar [guardado actual](27-editor-github-pages-pat.md); candidato Node/GitHub App son alternativas históricas.

La base funcional auditada es main `da19c5ba05c5ab2fd12353c3f86e22c49fedd78e`: NAV-01 a NAV-08, editor con GitHub, TreeTable inline y atajos publicados. CI y Pages correctos; [auditoría](audits/2026-11-19-editor-contextual.md).

1. Comprueba el HEAD de main y de la rama activa, las ejecuciones de GitHub Actions y los cambios sin guardar.
2. Lee las [reglas de continuidad](../AGENTS.md), el [prompt maestro](00-master-prompt.md), el [estado](04-project-status.md) y la [hoja de ruta](03-roadmap.md).
3. Usa la [guía del runtime](24-navigation-runtime.md) para localizar la capa afectada. Si el problema es de autoría o IDs, empieza por el [contrato](14-navigation-contract.md) y las [referencias](16-document-references.md).
4. Reproduce con `npm ci`, `npm run check` y `npm run build`. Para abrir la compilación, usa `npm run preview` o el paquete Windows. La guía de [operación](19-operations-and-verification.md) explica el despliegue.

El usuario validó **Mapa de conexiones** en Navegación y Artículo 2, y autorizó integrar NAV-08. Vincula la evidencia a la revisión que se prueba.

Las pruebas manuales de nuevas funciones se realizan en la wiki con enlaces directos a cada ejemplo. El ZIP de Windows sigue disponible como paquete local para quien lo necesite.

**Prioridad anterior (aplazada).** Catálogo declarativo, transformación e inspector contextual, luego reordenación y arrastre. No implementar cambios funcionales al reanudar sin autorización concreta.
