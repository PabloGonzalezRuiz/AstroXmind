# Auditoría previa a integración — AST-003.5 / AST-003.6

Fecha: 2026-11-14. Alcance autorizado: **revisión y documentación, sin fusionar ni publicar**.

## Evidencia comprobada

- PR [#1](https://github.com/PabloGonzalezRuiz/AstroXmind/pull/1) sigue **abierto, draft**. HEAD de candidata al iniciar la revisión: `c99dc0640d2f97da354d6a4b6b9f948c26dd0ec9`. Base `main`: `f49cc08a4818e4e305de99e04bab19231192a328`.
- GitHub REST indica `mergeable=false`, `mergeable_state=dirty`, `rebaseable=false`: **existen conflictos de integración**. El API de PR no identifica por sí solo los bloques concretos; no afirmar una lista exacta de archivos conflictivos sin análisis adicional.
- PR modifica 19 archivos; entre ellos `astro.config.mjs`, `package.json`, `package-lock.json`, documentos de estado y workflows, y añade validación de navegación y recursos públicos.
- Seguridad: run [43622791281](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43622791281), **success**; `astro check` 0 errores/0 avisos y `npm audit` **0 vulnerabilidades** en ese run. La prueba es anterior al HEAD actual: no sustituye una validación integral del commit final.
- Licencias/distribución: run [43622787020](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43622787020), **success** en generación de evidencia. **No equivale a cumplimiento legal cerrado**: tarball `@img/sharp-libvips-linux-x64@1.3.4` sin archivo LICENSE/NOTICE reconocido; obligaciones de redistribución por evaluar. Avisos de deprecación `punycode` y `url.parse()` no bloqueantes.
- Navegación: run [43629646268](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43629646268), commit `57af432812456796f0930f7727986bbce697106a`, **success**: 5 tests de regresión, 8 páginas HTML, 144 referencias locales, **0 fallos**. Informe publicado como `ast-003-6-navigation-report`.
- La candidata **no está desplegada**; aceptación visual manual previa del usuario corresponde a `main`, no a la candidata.

## Bloqueos y plan de integración

1. **Resolver conflictos del PR #1 en rama candidata** contrastando los cambios de `main` (especialmente documentos de estado/tareas) y preservando expresamente AST-008 y la validación manual de la web publicada. Preparar resolución sin modificar `main`; solicitar autorización antes de aplicar cambios de integración si procede.
2. **Actualizar y repetir CI de seguridad, build, navegación y evidencias de licencias en un mismo HEAD final**. No extrapolar un run anterior a un commit posterior.
3. **Revisar obligaciones de redistribución** de dependencias LGPL/MPL con relación a los archivos efectivamente entregados en `dist/`; registrar conclusión y cualquier medida requerida. Una CI verde no certifica este punto.
4. **Validación visual y funcional de la candidata** antes de sustituir la wiki operativa; mantener el punto de restauración `backup/2026-11-14-wiki-funcional`.
5. Solicitar **autorización expresa e independiente** para fusionar PR #1, desplegar o publicar release.

## Decisión de auditoría

**NO LISTA PARA FUSIÓN.** La navegación automatizada está validada; los conflictos de Git y la revisión de cumplimiento siguen abiertos. No se ha fusionado, publicado ni alterado `main`.

## Trabajo futuro aparcado

AST-008: búsqueda académica indexada y preguntas tipo test con trazabilidad bidireccional entre contenido, preguntas, respuestas y explicaciones. Ya registrada en `main:docs/05-task-register.md` (commit `13dd0d5`); no iniciar hasta terminar el trabajo actual y consultar al usuario.
