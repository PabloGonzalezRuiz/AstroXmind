# Reanudar AstroXmind

La referencia de producción de esta revisión es `673482972c81e17438f6aa1ed77442ad99db0f2d`, con NAV-01 a NAV-07. El usuario confirmó que NAV-07 funciona en la wiki pública. La candidata NAV-08 incorpora mapa local y la actualización documental.

1. Comprueba el HEAD de main y de la rama activa, las ejecuciones de GitHub Actions y los cambios sin guardar.
2. Lee las [reglas de continuidad](../AGENTS.md), el [prompt maestro](00-master-prompt.md), el [estado](04-project-status.md) y la [hoja de ruta](03-roadmap.md).
3. Usa la [guía del runtime](24-navigation-runtime.md) para localizar la capa afectada. Si el problema es de autoría o IDs, empieza por el [contrato](14-navigation-contract.md) y las [referencias](16-document-references.md).
4. Reproduce con `npm ci`, `npm run check` y `npm run build`. Para abrir la compilación, usa `npm run preview` o el paquete Windows. La guía de [operación](19-operations-and-verification.md) explica el despliegue.

El usuario validó **Mapa de conexiones** en Navegación y Artículo 2, y autorizó integrar NAV-08. La hoja de ruta pasa a robustez y accesibilidad. Vincula la evidencia a la revisión que se prueba.
