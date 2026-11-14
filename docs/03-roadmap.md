# Hoja de ruta — estado consolidado (2026-11-14)

| Fase | Objetivo | Estado real | Criterio de salida |
|---|---|---|---|
| 0 · AST-001 | Gobierno documental inicial | Cerrada; actualización continua | Documentación y continuidad |
| 1 · AST-002 | Wiki Astro/Starlight navegable | **Cerrada** | Compilación, despliegue y enlaces confirmados por usuario |
| 2 · AST-003 | CI, reproducibilidad y versión 0.1.0 | **En curso**: CI, lockfile, despliegue e índice verificados; release pendiente | Checklist final, revisión de seguridad, release autorizada y comprobación |
| 3 · AST-004 | Catálogo y temario TAI | Pendiente | Licencias, atribuciones y vigencia comprobadas |
| 4 · AST-005 | Editor Markdown | Futuro | Persistencia versionada y pruebas |
| 5 · AST-006 | Integración PMD/XMind y visor | Futuro | Compatibilidad y seguridad verificadas |
| 6 · AST-007 | Sincronización y herramientas de estudio | Futuro | Pruebas de extremo a extremo |

## Próximos pasos propuestos dentro de AST-003
1. Revisar versiones y alertas de dependencias; comprobar `npm audit` y licencias, sin actualizaciones masivas automáticas.
2. Revisar workflows de build/Pages, permisos y duplicidades; valorar migración de `actions/checkout@v4` y `actions/setup-node@v4` tras pruebas.
3. Añadir pruebas de enlaces/rutas publicadas y un checklist de aceptación de 0.1.0.
4. Documentar una candidata de release, verificar despliegue y solicitar autorización expresa para etiquetar/publicar.

No confundir la wiki publicada con una release 0.1.0. Las fases siguientes requieren autorización.
