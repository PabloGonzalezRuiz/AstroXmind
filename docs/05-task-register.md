# Registro de tareas — consolidado (2026-11-14)

## REGISTRO VIGENTE DE TAREAS — 2026-11-15
- **AST-011 · Tabla árbol declarativa MVP:** implementación de código realizada; **validación de build, despliegue y móvil pendiente**. Archivos: `src/tree-tables/constitucion.md`, `scripts/render-tree-table.mjs`, `package.json`, `src/content/docs/index.mdx`. Criterio: página publicada y plegado/temas/legibilidad verificados.
- **AST-012 · remark-directive / parser AST:** AST-012.0 parcialmente verificada en `test/remark-directive`; falta Actions, Codespaces Node 22 y aceptación visual móvil/escritorio. El parser completo sigue pendiente.
- **AST-013 · Temas CSS, roles y herencia:** pendiente. Clases semánticas, catálogo CSS, estilos por nivel, validación y accesibilidad.
- **AST-014 · IDs y referencias cruzadas:** pendiente. IDs estables, enlaces internos/externos entre archivos, resolución y validación.
- **AST-015 · Backlinks bidireccionales:** pendiente. Índice de referencias entrantes, interfaz para navegar en ambos sentidos.
- **AST-016 · Múltiples vistas/XMind:** futuro, no bloquear AST-011 a AST-015.
En `main`, la tabla árbol usa un parser manual y no depende de `remark-directive`; la rama `test/remark-directive` añade la dependencia y verifica la galería de directivas, pero no implementa el parser completo. `columns` aún no está implementado visualmente. Mantener AST-003 y demás tareas históricas sin marcarlas completadas. GitHub Pages es entorno de prueba; despliegue del HEAD actual no verificado. Véase `docs/10-declarative-language-architecture.md`.


## Decisión y tareas de continuidad — 2026-11-15
- **AST-009 · Galería de tablas árbol (en curso):** `src/content/docs/demo-tablas/galeria-arboles.md` creado en `main` (commit `34c0863fd064e5dfcf06e3922f2602cf1e4957de`). Pendiente validar presentación y plegado en el entorno de prueba; Tabulator/AG Grid aún no integrados. Priorizar estructuras generables por IA desde Markdown.
- **AST-010 · Alojamiento, privacidad e integración ChatGPT Sites (APARCADA hasta fase final):** la wiki utilizada es `https://astroxmind-pablo.mixedclef8.chatgpt.site`; GitHub almacena código. No se ha verificado conexión automática ni control de acceso. Objetivo futuro: acceso inicial solo del propietario, posibilidad de invitar a personas concretas. No ejecutar cambios de infraestructura ahora.
- **Regla transversal:** separar código confirmado en GitHub de funcionalidades realmente visibles en ChatGPT Sites; no confundir GitHub Pages con la wiki habitual.


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
