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


## Revisión de prioridades — 2026-11-14
1. **AST-003.5**: mantener candidata aislada y revisar licencias transitivas, warnings de build y acciones GitHub con deprecación Node 20. La auditoría npm y build ya pasaron en run 43618220633.
2. **AST-003.6**: incorporar pruebas de rutas, enlaces y navegación; validar Pages de la versión candidata sin sustituir prematuramente la web publicada.
3. Revisar PR #1 y documentar condiciones de integración. **No fusionar sin autorización**.
4. **AST-003.7**: preparar checklist y solicitar autorización antes de tag/release 0.1.0.
5. Mantener AST-004 a AST-007 fuera del alcance de la versión inicial.


## Repriorización auditada 2026-11-15
Fuente de verdad: [auditoría profunda](audits/2026-11-15-deep-audit-roadmap.md). Orden: (1) verificar corrección AST-003.6 y tests; (2) cerrar licencias AST-003.5; (3) aceptación técnica sobre mismo SHA; (4) validación visual; (5) preparar decisión release sin publicar; (6) AST-004 contenido TAI; (7) AST-008 búsqueda/tests aplazada. Estados pendientes no deben considerarse completados por el mero commit.


## Hoja de ruta vigente — decisión de producto 2026-11-15
Esta sección **sustituye el orden de prioridades anterior**, sin borrar el historial:
1. **AST-004 — AHORA:** estructura Markdown para contenidos TAI, primer tema piloto, fuentes y fecha de revisión; validar build/navegación.
2. **AST-005 — SIGUIENTE:** simplificar la preparación y edición de contenido, inicialmente mediante archivos Markdown versionados; editor web solo si aporta valor y con diseño previo.
3. **Experiencia de estudio:** navegación, enlaces, esquemas, repaso y búsqueda básica.
4. **AST-003 mantenimiento:** seguridad, copias y pruebas de funcionamiento; licencias de recursos realmente publicados. La auditoría amplia de paquetes/binarios no distribuidos queda diferida.
5. **AST-008 — APLAZADA:** búsqueda avanzada y trazabilidad de tests, cuando exista contenido suficiente.
6. **Publicación:** GitHub Pages para consulta personal, sin paquetes/instaladores; cualquier merge o despliegue requiere autorización específica.
