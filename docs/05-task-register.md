# Registro de tareas — consolidado (2026-11-14)

| ID | Tarea | Estado | Evidencia / pendiente |
|---|---|---|---|
| AST-001 | Gobierno documental y continuidad | Cerrada inicialmente; mantenimiento | `AGENTS.md`, `docs/00-master-prompt.md`, `docs/09-continuation.md` |
| AST-002 | Wiki Astro + Starlight inicial | **Cerrada** | Navegación confirmada por usuario; CI/deploy del backup verificados |
| AST-003 | Estabilización y release 0.1.0 | **En curso** | Lockfile, CI e índice correctos; faltan seguridad, aceptación y release autorizada |
| AST-004 | Catálogo de fuentes TAI | Pendiente | Tres fuentes candidatas; sin auditoría de licencias |
| AST-005 | Editor Markdown | Futuro | No implementado |
| AST-006 | PMD/XMind y visor | Futuro | No implementado |
| AST-007 | Sincronización y herramientas | Futuro | No implementado |

## Subtareas AST-003
| ID | Entregable | Estado |
|---|---|---|
| AST-003.1 | `package-lock.json` + `npm ci` | **Verificado** (run 43615034825) |
| AST-003.2 | CI con check/build y entrada HTML | **Verificado** (run 43615164608) |
| AST-003.3 | Índice automático de runs | **Verificado** (archivo `automation/ci-run-index/ci/latest-run.json`) |
| AST-003.4 | Despliegue Pages | Operativo previamente; sin prueba nueva en esta auditoría |
| AST-003.5 | Auditoría de dependencias, licencias y workflows | **En curso**: workflows de build/Pages usan npm ci; reporte automatizado creado; resultados npm audit/licencias pendientes |
| AST-003.6 | Pruebas de navegación/rutas y checklist de aceptación | **Pendiente** |
| AST-003.7 | Etiqueta y release 0.1.0 | **Pendiente; requiere autorización expresa** |

No reutilizar IDs. No confundir tareas completadas con tareas verificadas. Punto de restauración: `backup/2026-11-14-wiki-funcional` (SHA `a4ea18658aa90323c5a2f83116d6130229b8cd96`).


## Reconciliación de tareas — 2026-11-14
- **AST-003.5**: validación técnica de actualización de dependencias **verificada en rama candidata** (run 43618220633); licencia MIT propia incorporada (copyright 2026 Pablo González Ruiz). **Abierta** hasta terminar revisión de licencias de terceros, advertencias de workflows y verificación tras integración.
- **AST-003.6**: **pendiente** prueba sistemática de rutas/enlaces, accesibilidad básica y Pages con Astro 7/Starlight 0.43.
- **AST-003.7**: **pendiente**, sin tag ni release; autorización explícita requerida.
- **AST-003**: **en curso**; no fusionar ni desplegar la rama candidata por asumir que el build verde implica aceptación final.
- PR de candidata: https://github.com/PabloGonzalezRuiz/AstroXmind/pull/1 ; último run validado: https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43618220633 .
