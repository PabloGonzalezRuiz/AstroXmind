# Reanudar AstroXmind

Primera prioridad: [editor contextual CTX-01 a CTX-07](28-contextual-component-editor.md). CTX-01 implementado; CTX-02 espera autorización. Conservar [guardado actual](27-editor-github-pages-pat.md); candidato Node/GitHub App son alternativas históricas.

La base funcional auditada es main `da19c5ba05c5ab2fd12353c3f86e22c49fedd78e`: NAV-01 a NAV-08, editor con GitHub, TreeTable inline y atajos publicados. CI y Pages correctos; [auditoría](audits/2026-11-19-editor-contextual.md).

1. Comprueba el HEAD de main y de la rama activa, las ejecuciones de GitHub Actions y los cambios sin guardar.
2. Lee las [reglas de continuidad](../AGENTS.md), el [prompt maestro](00-master-prompt.md), el [estado](04-project-status.md) y la [hoja de ruta](03-roadmap.md).
3. Usa la [guía del runtime](24-navigation-runtime.md) para localizar la capa afectada. Si el problema es de autoría o IDs, empieza por el [contrato](14-navigation-contract.md) y las [referencias](16-document-references.md).
4. Reproduce con `npm ci`, `npm run check` y `npm run build`. Para abrir la compilación, usa `npm run preview` o el paquete Windows. La guía de [operación](19-operations-and-verification.md) explica el despliegue.

El usuario validó **Mapa de conexiones** en Navegación y Artículo 2, y autorizó integrar NAV-08. Vincula la evidencia a la revisión que se prueba.

Las pruebas manuales de nuevas funciones se realizan en la wiki con enlaces directos a cada ejemplo. El ZIP de Windows sigue disponible como paquete local para quien lo necesite.

**Prioridad vigente.** Catálogo declarativo, transformación e inspector contextual, luego reordenación y arrastre. No implementar cambios funcionales al reanudar sin autorización concreta.
