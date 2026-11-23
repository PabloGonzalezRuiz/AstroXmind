# Estado real de AstroXmind

**23-11-2026:** PRIVATE-01 publicado y menú confirmado por Pablo. CALL-01 revisión de identidad integrada en main (`f6d2f51`), 114 pruebas locales correctas: [alta de oposición](32-oposiciones.md) con ID inmutable, nombre corto, slug y alias, edición sin mover carpetas; pendiente prueba real. CALL-02 y F00 pendientes. No hay datos privados en el build público.

**Prioridad vigente (23-11-2026):** flujo privado de gestión documental. Primero validar autenticación y autorización para habilitar el menú privado; después alta de convocatoria por nombre, alta de edición por año y asistente secuencial de la edición 2025. Primer hito: recepción de PDF oficial, carpeta propia, extracción y validación de metadatos, nombre canónico sin modificar el original y enlace de acceso protegido. Detenerse tras F00 para aceptación. F01–F05 y temario quedan bloqueados; no publicar documentación privada ni credenciales. La especificación detallada y el prompt de conversión se conservan en los documentos maestros privados de continuidad.

Último commit observado antes de esta actualización documental: `37cfb00bb07d40fd73cb6dae9368a17e125af3be` (corrección de desplazamiento del inspector). Pendiente comprobar su despliegue y ejecución de pruebas. Las nuevas fases son requisitos, no funcionalidades implementadas.

**Auditoría del 22-11-2026:** HEAD de main `b78362d7809b0cbeeea0b994e520e51eec38987c`. CI, Wiki Build y Pages finalizados correctamente. La URL pública de TreeTable responde HTTP 200 y contiene diez FrameEjemplo. Comprobación local: 57 pruebas de dominio/catálogo/transformación y 44 de HTML/DOM, todas correctas; Astro check 71 archivos sin errores, avisos ni hints. [Evidencias](audits/2026-11-22-project-audit.md).

**Entrega FRAME-02 autorizada el 22-11-2026:** página exclusiva con marco vertical, editor superior y render inferior, declaración compacta y ID automático. Check/build locales correctos, 103 pruebas. Comprobar Pages y aceptación manual. Acciones bajo la navegación móvil de Starlight sigue pendiente de comprobación en iPhone. CTX-06/07 siguen pendientes tras FRAME-02.

Última entrega 19-11-2026: banco de pruebas universal FrameEjemplo. Las referencias Resultado/Código permanecen intactas; cada práctica permite seleccionar cualquiera de los diez ejemplos TreeTable, editarlo y restaurarlo. Sin persistencia ni cambios de los originales. [Contrato y verificación](29-frame-ejemplo.md). Consultar HEAD y Actions para confirmar el despliegue de esta entrega.

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

**Prioridad anterior (aplazada).** Editor contextual, seguido de reordenación persistente en el explorador y evaluación del arrastre en TreeTable. [Plan CTX](28-contextual-component-editor.md). CTX-01/02/03/04/05 implementados: catálogo, transformación, menú e inspectores de apertura y nodo; CTX-06 espera autorización. Después del editor, explorador y evaluación de arrastre TreeTable, HIST-01 queda aplazado. La implementación preliminar fue retirada de la versión activa, conservada en Git (`96c2930`). Biblioteca interna anticipada; distribución pública al final.

Validación CTX-03: guardado real `34b56b9` de Pablo conservado. Se corrige el acoplamiento de una prueba al contenido editable y se añade espera de publicación con recarga automática, documentada en [guardado GitHub Pages](27-editor-github-pages-pat.md). La revisión del guardado añade marca YAML, comparación con el último commit que modificó el documento, verificación por lectura exacta y estados de sincronización; el despliegue de esta revisión anterior al historial fue comprobado en GitHub Actions (`45c249a`).

El prototipo `d87deba` es histórico. El editor vigente guarda directamente mediante GitHub Contents API; no requiere backend propio. [Contrato vigente](27-editor-github-pages-pat.md). Inspectores de apertura y nodos implementados con procedencia del modelo; la numeración de nodo activa automáticamente su presentación si estaba oculta. Las demostraciones TreeTable cuentan con referencia de solo lectura y copia de práctica restablecible sin guardar en GitHub; Acciones permanece flotante. Pendiente integración y extensibilidad.
