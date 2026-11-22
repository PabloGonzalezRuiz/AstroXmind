# Reanudar AstroXmind

Punto de continuidad vigente 22-11-2026: [hito M-20261122](30-milestone-20261122.md), base publicada 37cfb00, 104 pruebas correctas y aceptación de Pablo. FRAME-02 cerrado. Nuevo subproyecto [ProcesamientoTemario](ProcesamientoTemario/README.md), diseño documentado y KNOW-01 pendiente de autorización; leer su prompt propio. Conservar backlog en pausa y CTX-08 como última tarea. Las notas siguientes conservan contexto histórico, no instrucciones activas.

Punto de continuidad 19-11-2026: Pablo autorizó FrameEjemplo hasta su publicación y actualización documental. [Contrato](29-frame-ejemplo.md). Verificar primero HEAD, CI y Pages; probar selector, descarte y reset del ejemplo activo en TreeTable y Clases Astro. Después retomar CTX-06 cuando se autorice, sin perder las tareas posteriores del roadmap.

Primera prioridad: [editor contextual CTX-01 a CTX-07](28-contextual-component-editor.md). CTX-01/02/03/04/05 implementados; CTX-06 espera autorización. Conservar [guardado actual](27-editor-github-pages-pat.md); candidato Node/GitHub App son alternativas históricas.

La base funcional auditada es main `da19c5ba05c5ab2fd12353c3f86e22c49fedd78e`: NAV-01 a NAV-08, editor con GitHub, TreeTable inline y atajos publicados. CI y Pages correctos; [auditoría](audits/2026-11-19-editor-contextual.md).

1. Comprueba el HEAD de main y de la rama activa, las ejecuciones de GitHub Actions y los cambios sin guardar.
2. Lee las [reglas de continuidad](../AGENTS.md), el [prompt maestro](00-master-prompt.md), el [estado](04-project-status.md) y la [hoja de ruta](03-roadmap.md).
3. Usa la [guía del runtime](24-navigation-runtime.md) para localizar la capa afectada. Si el problema es de autoría o IDs, empieza por el [contrato](14-navigation-contract.md) y las [referencias](16-document-references.md).
4. Reproduce con `npm ci`, `npm run check` y `npm run build`. Para abrir la compilación, usa `npm run preview` o el paquete Windows. La guía de [operación](19-operations-and-verification.md) explica el despliegue.

El usuario validó **Mapa de conexiones** en Navegación y Artículo 2, y autorizó integrar NAV-08. Vincula la evidencia a la revisión que se prueba.

Las pruebas manuales de nuevas funciones se realizan en la wiki con enlaces directos a cada ejemplo. El ZIP de Windows sigue disponible como paquete local para quien lo necesite.

**Prioridad vigente.** ProcesamientoTemario, pendiente autorización de KNOW-01. No implementar cambios funcionales al reanudar sin autorización concreta.
