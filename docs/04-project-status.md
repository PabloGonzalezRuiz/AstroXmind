# Estado real de AstroXmind

19-11-2026: editor de página completa con token persistente, configuración centralizada, carga automática y guardado directo en main aprobado por Pablo. El usuario confirmó el editor, vista MDX (`0561bae`) y sincronización de paneles (`a6d645a`). TreeTable inline editable con modelo compartido y sincronización por celda (`125f095`). Se añade teclado de edición: Tab/Mayús+Tab (dos espacios), Enter continúa listas y Esc+Tab permite navegar. Pendiente la edición de demos importadas como archivos independientes. [Prueba y configuración](27-editor-github-pages-pat.md).

Producción verificada el 18-11-2026 en main `d87deba886e1c61a6ce18d915c89e0fb79cc511f`. NAV-01 a NAV-08 están publicados y confirmados; el editor Markdown local también está desplegado. CI y Pages terminaron correctamente para este SHA.

| Área | Estado |
|---|---|
| Wiki | Astro, Starlight y MDX. Once documentos, catorce citas y demostraciones Resultado/Código. |\n| Editor | Prueba de edición Markdown en la propia wiki, vista previa en directo, borrador local y descarga. Aún no guarda en GitHub ni autentica. |
| TreeTable | Fuente única compartida con el laboratorio. Anotaciones con diagnóstico de nodo, clases, numeración, varias sublistas, plegado global y barra flotante de pantalla completa. |
| NAV-01/02/03 | IDs estables, jerarquía separada de las carpetas, numeración y enlaces a documentos, secciones y nodos. |
| NAV-04/05 | Citas salientes y backlinks con contexto. Retorno con foco, scroll, pestañas y estado de las tablas. |
| NAV-06 | Diez exportaciones HTML de rama. Impresión y PDF desde el navegador. |
| NAV-07 | Extracto lateral y apertura del documento completo con retorno al origen. |
| NAV-08 | Mapa de conexiones directas, SVG y lista navegable. Publicado y confirmado en la wiki. |

[Auditoría](audits/2026-11-18-maintenance-baseline.md) · [Guía del runtime](24-navigation-runtime.md) · [Hoja de ruta](03-roadmap.md) · [Registro de tareas](05-task-register.md)

La revisión de robustez está publicada. La guía de plegado está publicada y verificada en el HTML de la wiki. Seguridad y mantenimiento queda en seguimiento: se auditaron ambos lockfiles, y el flujo de doble ámbito está preparado en rama. Summary/Boundary queda aplazado y AST-027 sigue siendo el último hito.

**Prioridad vigente.** Edición desde la wiki, seguida de reordenación persistente en el explorador y de una evaluación del arrastre en TreeTable. Seguridad y mantenimiento conserva su auditoría en la rama de origen y pasa a seguimiento después de estos desarrollos. [Propuesta](25-wiki-editing-proposal.md).

La prueba publicada del editor valida la interfaz Markdown y la previsualización, con borradores locales y descarga. CI y despliegue de `d87deba` correctos. No implementa autenticación ni persistencia remota. Pendientes: comparar opciones de backend (AST-035), guardar mediante una API autenticada y previsualizar de forma compilada TreeTable/MDX. [Propuesta](25-wiki-editing-proposal.md) · [patrones](26-astro-editing-patterns.md).
