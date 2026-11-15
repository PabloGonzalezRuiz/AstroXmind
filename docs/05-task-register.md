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

## AST-003.6 — aceptación manual comunicada (2026-11-14)
- **Verificado por el usuario:** todos los enlaces de la wiki publicada funcionan. Se da por superada la comprobación manual reportada para la web actual.
- **Pendiente:** pruebas automatizadas de enlaces/rutas, accesibilidad básica y aceptación de la versión migrada de la rama candidata. No marcar AST-003.6 totalmente completada antes de estas verificaciones.

## Futuro — AST-008 · Búsqueda académica y trazabilidad de exámenes (registrado 2026-11-14)
**Estado: aparcado; no iniciar hasta terminar AST-003.5/AST-003.6 y proponerlo al usuario.**

- Indexación de contenidos de estudio, legislación, artículos, temas y conceptos; búsqueda textual de alta precisión y filtros por oposición/bloque/tema/norma/artículo.
- Sistema de preguntas tipo test vinculadas al contenido, incluyendo examen/convocatoria/año/pregunta, respuesta y explicación verificadas.
- **Relación bidireccional**: cada sección del temario muestra en qué preguntas/tests ha aparecido; cada pregunta, respuesta y explicación enlaza con los apartados concretos que la fundamentan.
- IDs persistentes y referencias trazables (incluida versión de norma y fecha de vigencia si procede); no asumir que una pregunta histórica sigue siendo válida sin revisar cambios normativos.
- Propuesta futura de índice estructurado, filtros y eventualmente búsqueda semántica; priorizar funcionalidad de búsqueda y trazabilidad antes que IA.
- **Recordatorio de continuidad:** al cerrar la fase actual, sugerir explícitamente al usuario comenzar AST-008, sin implementarlo automáticamente.

## Prioridad acordada — creación de contenido (2026-11-14)
**Decisión del usuario:** después de estabilizar la candidata, priorizar la incorporación de contenido real a AstroXmind antes de nuevas funcionalidades (editor, visor, IA, búsqueda avanzada o tests).

### Próxima línea de trabajo: AST-004 · Temario y contenido TAI
1. Definir estructura editorial mínima en Markdown: bloque, tema, sección, referencias normativas, fecha de revisión y fuentes verificables.
2. Crear un primer tema piloto completo, con fuentes contrastadas, revisión y criterios de aceptación.
3. Establecer un flujo repetible de incorporación, revisión, actualización y publicación del temario por bloques.
4. Incorporar progresivamente más temas y verificar navegación y búsqueda existente con contenido real.
5. Conservar identificadores estables de secciones para futuras relaciones bidireccionales con preguntas tipo test, **sin desarrollar aún** el sistema de tests.

**Orden de trabajo:** cerrar conflictos/validaciones de AST-003.5 y AST-003.6 → comenzar AST-004 de contenido → proponer AST-008 y restantes funcionalidades más adelante. No iniciar AST-008 automáticamente.


## AST-004.1 · Prácticos TAI — 2026-11-15
El usuario autoriza retomar fusión y copia; OneDrive queda fuera. Implementado en rama `content/tai-practicos-fusion`: 22 apartados adaptados de 5 cuadernos MIT, soluciones separadas y catálogo externo de 17 casos adicionales sin copiar. Check/build locales superados; CI remota pendiente. Véase `docs/audits/2026-11-15-practicos-fusion.md` y `docs/practicos-sources.json`. Repositorio comprobado privado. No fusionar hacia Pages sin comprobar privacidad efectiva del sitio; el workflow de main despliega automáticamente. No se ha publicado esta incorporación. PR #1 de dependencias y backup histórico intactos.


## AST-009 · Acceso privado para iPhone — 2026-11-15
Wiki privada publicada y verificada en https://astroxmind-pablo.mixedclef8.chatgpt.site. Manifiesto standalone, iconos y guía /iphone/ implementados; check/build y navegación de prácticos verificados. Proyecto Sites appgprj_6af97185a1d48191b9fc5f6eae308de5; reutilizarlo para próximas actualizaciones. Solo cuenta propietaria; sin acceso offline ni sincronización automática GitHub→Sites. Fuente y evidencia en docs/audits/2026-11-15-iphone-private-site.md. El usuario debe completar Añadir a pantalla de inicio en su iPhone. PR #2 conserva los cambios de fuente sin fusionar main; despliegue privado de Sites independiente del Pages público.
