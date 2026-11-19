# Estado real de AstroXmind

19-11-2026: editor de página completa con token persistente, configuración centralizada, carga automática y guardado directo en main aprobado por Pablo. El usuario confirmó el editor, vista MDX (`0561bae`) y sincronización de paneles (`a6d645a`). TreeTable inline editable con modelo compartido y sincronización por celda (`125f095`). Se añade teclado de edición: Tab/Mayús+Tab (dos espacios), Enter continúa listas y Esc+Tab permite navegar. Pendiente la edición de demos importadas como archivos independientes. [Prueba y configuración](27-editor-github-pages-pat.md).

Base funcional verificada el 19-11-2026 en main `da19c5ba05c5ab2fd12353c3f86e22c49fedd78e`. NAV-01 a NAV-08 publicados y confirmados. CI y Pages correctos; 79 pruebas. [Auditoría](audits/2026-11-19-editor-contextual.md).

| Área | Estado |
|---|---|
| Wiki | Astro, Starlight y MDX. Once documentos, catorce citas y demostraciones Resultado/Código. |
| Editor | Edición MD/MDX, guardado autenticado GitHub, sincronización bidireccional, TreeTable inline y teclado. |
| TreeTable | Fuente única compartida con el laboratorio. Anotaciones con diagnóstico de nodo, clases, numeración, varias sublistas, plegado global y barra flotante de pantalla completa. |
| NAV-01/02/03 | IDs estables, jerarquía separada de las carpetas, numeración y enlaces a documentos, secciones y nodos. |
| NAV-04/05 | Citas salientes y backlinks con contexto. Retorno con foco, scroll, pestañas y estado de las tablas. |
| NAV-06 | Once exportaciones HTML de rama. Impresión y PDF desde el navegador. |
| NAV-07 | Extracto lateral y apertura del documento completo con retorno al origen. |
| NAV-08 | Mapa de conexiones directas, SVG y lista navegable. Publicado y confirmado en la wiki. |

[Auditoría](audits/2026-11-18-maintenance-baseline.md) · [Guía del runtime](24-navigation-runtime.md) · [Hoja de ruta](03-roadmap.md) · [Registro de tareas](05-task-register.md)

La revisión de robustez está publicada. La guía de plegado está publicada y verificada en el HTML de la wiki. Seguridad y mantenimiento queda en seguimiento: se auditaron ambos lockfiles, y el flujo de doble ámbito está preparado en rama. Summary/Boundary queda aplazado y AST-027 sigue siendo el último hito.

**Prioridad vigente.** Editor contextual, seguido de reordenación persistente en el explorador y evaluación del arrastre en TreeTable. [Plan CTX](28-contextual-component-editor.md). CTX-01/02/03 implementados: catálogo, motor con import/undo y menú contextual; CTX-04 espera autorización. Biblioteca interna anticipada; distribución pública al final.

Validación CTX-03: guardado real `34b56b9` de Pablo conservado. Se corrige el acoplamiento de una prueba al contenido editable y se añade espera de publicación con recarga automática, documentada en [guardado GitHub Pages](27-editor-github-pages-pat.md).

El prototipo `d87deba` es histórico. El editor vigente guarda directamente mediante GitHub Contents API; no requiere backend propio. [Contrato vigente](27-editor-github-pages-pat.md). Pendiente: inspectores contextuales de apertura y de nodos, integración y extensibilidad.
