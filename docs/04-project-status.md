# Estado real de AstroXmind

**Prioridad vigente (23-11-2026):** Procesado de Temarios. CALL-01 y CALL-02 confirmados funcionalmente; CALL-03 genera el expediente oficial TAI 2025, con F00/F01/F02/F03/F05 ejecutadas y estado REVISION (F04 opcional). CALL-04 incorpora criterios oficiales CPS como documento separado, persistencia confirmada. Siguiente: confirmar visualización del Paso 3 y CALL-05, revisar evidencia, bases, programa y reglas; no inventar cortes reales. No desbloquear el temario hasta aceptación del expediente documental. No publicar datos privados ni credenciales.

Auditoría actual: `ce797d60` (23-11-2026). [Evidencias](audits/2026-11-23-procesado.md). Paso 3 CPS y resaltado implementados; CPS incorporado y verificado en GitHub, visualización pendiente. Build/Pages históricos verificados; aceptación y CI del HEAD exacto pendientes de verificación.

CALL-04: documento oficial CPS de TAI 2025 incorporado al almacén privado; original y tres derivados comprobados. El analizador de producción se probó con el PDF real mediante PDF.js 5.6.205 en Node (la wiki usa 4.10.38); persistencia verificada en GitHub sin alterar PDF ni bases. Falta confirmar visualización en la wiki y probar la subida desde su interfaz. Siguiente: CALL-05, revisión integral, rectificaciones y cortes oficiales sin inventar datos. No desbloquear temario antes de aceptación.

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
