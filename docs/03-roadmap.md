# Hoja de ruta — estado consolidado (2026-11-14)

## Codespaces preparado — 2026-11-15
Se ha creado `.devcontainer/devcontainer.json` en `main` (commit `7dcd51c005f62a635a7343927c2fed22f4a2100b`) con Node 22, extensiones Astro/Markdown y puerto 4321. **Aún no se ha iniciado Codespace, instalado remark-directive ni ejecutado pruebas.** El usuario debe crear Codespace desde GitHub. Después crear rama `test/remark-directive`, ejecutar `npm install remark-directive`, `npm run build`, `npm run dev -- --host 0.0.0.0` y verificar la galería; no avanzar fases sin evidencia.


## PUERTA OBLIGATORIA · AST-012.0 — instalar y probar Remark (2026-11-15)
**Prioridad absoluta y bloqueo explícito:** no avanzar AST-011 (ampliaciones), AST-012 (parser), AST-013 (CSS), AST-014 (referencias) ni AST-015 (backlinks) hasta completar y verificar AST-012.0. Se permite únicamente corregir fallos necesarios para la instalación y prueba.

**Hallazgo real:** `astro.config.mjs` ya importa `remark-directive` y `scripts/remark-semantic.mjs`, y hay una galería `src/content/docs/demo-tablas/galeria-remark-directive.md`. Pero `package.json` y la raíz de `package-lock.json` no declaran `remark-directive`. Esto es una **integración incompleta**, no una instalación validada.

**Pasos de aceptación (en orden):**
1. Instalar `remark-directive` como dependencia explícita compatible con Astro y actualizar `package-lock.json` con npm, sin editar a mano el lockfile ni añadir dependencias arbitrarias.
2. Ejecutar `npm ci` desde cero y `npm run build`; registrar resultado, SHA y errores si los hay.
3. Probar directivas reales en Astro/Starlight (ej.: `:::definicion`, `:::articulo`, `:::plegable`), sus clases HTML, atributos e interacción.
4. Verificar que el sitio se publica, que la galería se ve correctamente y que no hay errores de rutas. Comprobar en móvil.
5. Registrar evidencia reproducible y aceptación; solo entonces desbloquear la siguiente fase.

**Estado al registrar:** **BLOQUEADA / NO VERIFICADA**. El código de configuración existente no demuestra que npm instale el paquete. No declarar la fase completada sin instalación reproducible y prueba de renderizado. Las prioridades de la hoja de ruta histórica de abajo quedan subordinadas a esta puerta.

## HOJA DE RUTA FUNCIONAL ACTUAL — 2026-11-15 (prioridad sobre la secuencia histórica)
1. **AST-011 · Tabla árbol declarativa MVP — código implementado, aceptación pendiente.** Validar `src/tree-tables/constitucion.md` → `scripts/render-tree-table.mjs` → `public/tree-table/index.html` → GitHub Pages; comprobar móvil, plegado, tres temas y enlaces de portada. La salida publicada aún requiere verificación independiente.
2. **AST-012 · Parser de Markdown robusto — pendiente.** Integrar remark/remark-directive con AST real y reglas de alcance, jerarquía, clases y atributos; sustituir el parser manual de demostración. Mantener compatibilidad y documentar sintaxis para IA.
3. **AST-013 · Temas CSS y semántica — pendiente.** Separar CSS del generador, definir catálogo de roles (ley, título, capítulo, artículo, apartado, nota), temas y herencia, validación de atributos y accesibilidad. `columns` aún no implementa diseño multicolumna.
4. **AST-014 · Referencias cruzadas — pendiente.** IDs estables, enlaces entre documentos, resolución de destinos y comprobación de enlaces rotos.
5. **AST-015 · Navegación bidireccional — pendiente.** Índice de referencias entrantes/backlinks por compilación y navegación en tabla y documento.
6. **AST-016 · Varias vistas — futuro.** Documento, tabla árbol y mapa desde un mismo contenido; eventual exportación XMind, sin condicionar la fase inicial.
**Separación de prioridades:** mantener AST-003 (seguridad/release) abierta y la hoja histórica como antecedentes, pero priorizar aceptación del MVP y lenguaje declarativo. Pandoc no es requisito de renderizado. Desarrollo/pruebas en GitHub Pages; ChatGPT Sites no sincronizado de forma comprobada. Detalle: `docs/10-declarative-language-architecture.md`.


## Repriorización acordada — 2026-11-15
**Ahora:** desarrollo funcional y editorial de AstroXmind, especialmente galería de tablas árbol y formatos fáciles de generar por IA a partir de Markdown. **Más adelante, al final:** decidir alojamiento definitivo, privacidad, autenticación, invitados y sincronización/despliegue. La wiki habitual es ChatGPT Sites; GitHub es repositorio de trabajo. GitHub Pages permanece configurado técnicamente pero no debe presentarse como la wiki que utiliza el usuario. No hay integración GitHub → ChatGPT Sites verificada. Esta decisión actualiza el orden práctico de prioridades sin declarar completadas las tareas anteriores ni autorizar releases o fusiones.


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
