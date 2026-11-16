# Decisiones, incidencias y riesgos

Actualizado el 16-11-2026.

## Decisiones vigentes

- La wiki oficial del proyecto es GitHub Pages: https://pablogonzalezruiz.github.io/AstroXmind/.
- El lenguaje de entrada sigue siendo Markdown con extensiones declarativas; las propiedades de XMind se expresan en un bloque YAML `xmind`, no como JSON largo escrito a mano.
- CSS controla la presentación web. Las propiedades `xmind` describen configuración destinada a conversión futura.
- `org.xmind.ui.treetable.toptitle` es la clase de estructura predeterminada usada en el ejemplo de tabla árbol.
- La conversión a `.xmind` aún no está implementada en AstroXmind.

## Riesgos y estado

| Riesgo | Estado | Acción |
|---|---|---|
| Documentación de continuidad obsoleta o contradictoria | Mitigado por esta actualización; seguir revisando | Usar docs/09 y auditoría con SHA fechado |
| Dependencias con alertas previas | Hay PR #1 para actualización; requiere revisión sobre head actual | Revisar advisories, lockfile, licencias, cambios de rutas y Actions |
| Dependencia de estilos globales de la galería | Confirmada | Definir organización de CSS antes de crecer |
| YAML de propiedades sin esquema estable | Pendiente | Validar estructura, tipos y errores |
| Defaults/herencia solo parcialmente diseñados | Pendiente | Definir presets y precedencia con fixtures |
| Sin conversión real a XMind | Pendiente de producto | Construir modelo intermedio y validar con XMind Desktop |
| Material TAI propuesto en PR #2 | Alto: sitio/repositorio públicos | Verificar fuentes, derechos y licencias antes de integrar |
| Workflow Pages con pasos heredados | Deuda técnica | Revisar instalación redundante de remark-directive y comprobación de página Tabulator heredada |

## Incidencia resuelta

En el commit de funcionalidad previo, `package-lock.json` quedó truncado y `npm ci` falló. El lockfile se reparó posteriormente; CI y los flujos asociados aparecen satisfactorios en el SHA auditado. Evitar transferir archivos grandes por una salida de terminal truncable; comprobar tamaño/contenido completo antes de publicar.

## Reglas de seguridad operativa

No publicar releases, fusionar PRs ni integrar material de terceros sin una revisión concreta. No incluir secretos ni datos personales en la wiki pública.
