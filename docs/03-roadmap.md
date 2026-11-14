# Hoja de ruta

| Fase | Objetivo | Estado | Criterio de salida |
|---|---|---|---|
| 0 | Gobierno documental y continuidad | Cerrada (AST-001) | 15 archivos leídos y verificados en GitHub |
| 1 | Astro + Starlight y tema de ejemplo | Pendiente | Compilación y navegación verificadas |
| 2 | CI, despliegue y versión 0.1.0 | Pendiente | Pruebas y URL desplegada comprobadas |
| 3 | Catálogo e incorporación controlada de temario TAI | Pendiente | Licencias y contenido contrastados |
| 4 | Editor Markdown | Pendiente | Guardado versionado y pruebas |
| 5 | PMD/XMind y visor | Pendiente | Compatibilidad y seguridad verificadas |
| 6 | Sincronización y herramientas de estudio | Pendiente | Pruebas end-to-end |

Las fases posteriores requieren autorización. Las fechas no son compromisos hasta acordarlas.

## Actualización de ejecución 2026-11-14
- Fase 1 AST-002: **cerrada** con validación de usuario de portada y cuatro tarjetas.
- Fase 2 AST-003: **autorizada e iniciada**. Primer objetivo: reproducibilidad de dependencias, prueba `npm ci`, build y verificación de `dist/index.html` en rama aislada `feature/ast-003-release-hardening`.
- A continuación: actualizar CI a `npm ci`, comprobaciones de rutas, auditoría de dependencias y revisión antes de release `0.1.0`.
- No crear etiqueta ni release sin pasar controles; mantener `backup/2026-11-14-wiki-funcional` intacta.
