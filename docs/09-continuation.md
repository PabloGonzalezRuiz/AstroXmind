# Reanudar AstroXmind

Primera prioridad: [validar el guardado directo en GitHub Pages](27-editor-github-pages-pat.md), después la demo compleja de TreeTable. Conservar el candidato Node y la instalación GitHub App como alternativa.

La referencia de producción vigente es main `d87deba886e1c61a6ce18d915c89e0fb79cc511f`: NAV-01 a NAV-08 y el editor Markdown en la wiki están publicados. CI y despliegue Pages del editor terminaron correctamente. El editor guarda localmente; autenticación y escritura a GitHub siguen pendientes.

1. Comprueba el HEAD de main y de la rama activa, las ejecuciones de GitHub Actions y los cambios sin guardar.
2. Lee las [reglas de continuidad](../AGENTS.md), el [prompt maestro](00-master-prompt.md), el [estado](04-project-status.md) y la [hoja de ruta](03-roadmap.md).
3. Usa la [guía del runtime](24-navigation-runtime.md) para localizar la capa afectada. Si el problema es de autoría o IDs, empieza por el [contrato](14-navigation-contract.md) y las [referencias](16-document-references.md).
4. Reproduce con `npm ci`, `npm run check` y `npm run build`. Para abrir la compilación, usa `npm run preview` o el paquete Windows. La guía de [operación](19-operations-and-verification.md) explica el despliegue.

El usuario validó **Mapa de conexiones** en Navegación y Artículo 2, y autorizó integrar NAV-08. Vincula la evidencia a la revisión que se prueba.

Las pruebas manuales de nuevas funciones se realizan en la wiki con enlaces directos a cada ejemplo. El ZIP de Windows sigue disponible como paquete local para quien lo necesite.

**Prioridad vigente.** Completar la edición persistente desde la wiki; después, reordenar documentos desde el explorador y evaluar el arrastre en TreeTable. AST-035 recopila patrones de repositorios Astro públicos como investigación de apoyo; revisar su informe antes de elegir backend. [Propuesta](25-wiki-editing-proposal.md) · [investigación](26-astro-editing-patterns.md). No implementar cambios funcionales al reanudar sin autorización concreta.
