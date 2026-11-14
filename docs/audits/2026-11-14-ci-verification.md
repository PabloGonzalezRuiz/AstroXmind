# AstroXmind — Auditoría de CI (2026-11-14)

## Objetivo
Verificar el primer paso de estabilización 0.1.0: workflow de integración continua.

## Evidencia confirmada
- Repositorio: PabloGonzalezRuiz/AstroXmind.
- Rama: main.
- Último commit consultado: `ffd2f1bb5fa8ee4179634c2f7c372e9fcf2ee63d`.
- Workflow existente: `.github/workflows/ci.yml`, blob SHA `85b1706a6bed9f931a2023de0120894e6baa588a`.
- Disparadores: push a main, pull_request y workflow_dispatch.
- Job validate: Ubuntu, Node 22, npm install, npm run check, npm run build y comprobación de dist/index.html.

## Limitación de verificación
La consulta de la página GitHub Actions no devolvió resultados accesibles en esta sesión. No se dispone de run ID, estado, conclusión, jobs ni logs. No se declara CI exitosa ni fallida.

## Riesgos detectados
- No existe `package-lock.json` en la raíz (consulta GitHub 404).
- Se utiliza `npm install` en lugar de `npm ci`; el proceso no es plenamente reproducible.
- `npm run check` puede requerir validación real en CI antes de aceptar la versión 0.1.0.

## Próximo paso obligatorio
1. Abrir https://github.com/PabloGonzalezRuiz/AstroXmind/actions y localizar el run de AstroXmind · CI correspondiente al commit ffd2f1bb.
2. Registrar run ID, conclusión y logs si falla.
3. Corregir incidencias y repetir la comprobación.
4. Generar package-lock.json y sustituir npm install por npm ci cuando se haya validado.
5. No publicar la release hasta tener pruebas verificadas.

## Política de continuidad
Mantener el punto de restauración previo; no mover etiquetas ni publicar release. Registrar evidencia verificable, no inferir resultados.

## Actualización — ejecución verificada
- Run: https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43613061945
- Job: https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43613061945/job/132502122911
- Run ID: 43613061945; Job ID: 132502122911.
- Estado del job: completed; conclusión: success.
- Commit ejecutado: `481f603eee29b8638c64f3f8b5088ab47fe39286`.
- Instalación: 443 paquetes, completada.
- `astro check`: 3 archivos, 0 errores, 0 warnings, 0 hints.
- `astro build`: 7 páginas generadas, completado.
- Pagefind: 6 páginas indexadas.
- `test -f dist/index.html`: éxito.
- Avisos no bloqueantes: deprecación de `tsconfck@3.1.6` y `punycode`.
- La ejecución demuestra compilación y validación técnica, pero no prueba todos los enlaces ni la experiencia de usuario en navegador.

## Decisión de auditoría
La comprobación de CI queda **cerrada con éxito** para el commit señalado. Siguiente paso: crear y registrar `package-lock.json`, cambiar a `npm ci` y volver a verificar CI. No publicar release todavía.

## Reproducibilidad — cambio aplicado (2026-11-14)
- Commit: `f6e259655734a1c68b7adf799d09d26044425607`.
- Workflow actualizado para generar `package-lock.json` en un push a main cuando no exista, guardarlo mediante github-actions[bot], exigir su presencia e instalar con `npm ci`.
- En pull requests el workflow no modifica el repositorio; exige un lockfile existente.
- Comprobación inmediata posterior al commit: `package-lock.json` aún no estaba disponible (404), por lo que **la ejecución del nuevo workflow y el commit automático siguen pendientes de confirmación**.
- Riesgo: si GitHub Actions no tiene permisos efectivos de escritura, el paso `git push` fallará. Investigar el job y corregir antes de declarar éxito.
- No publicar release hasta confirmar la ejecución y el lockfile.

## AST-003 — integración en main (2026-11-14)
- Workflow AST-003 run 43611676573, job 132497866389: **success**, pasos de generación, `npm ci`, compilación y commit completados.
- Lockfile original en `feature/ast-003-release-hardening`: commit `b6f1065`, blob SHA `3e298a7f8ace3a0a704cb12b83406f59b22ab02d`.
- Copia íntegra de `package-lock.json` a `main`: commit `946f9d69bac354d844676aceb585ee0802b1c355`.
- Simplificación de `.github/workflows/ci.yml` a permisos de solo lectura, comprobación de lockfile, `npm ci`, `astro check` y `astro build`: commit `d749ea5ff323ef5c55f3db34f6e10cdb146e30e1`.
- La generación automática del lockfile desde CI principal se retiró para evitar duplicar AST-003.
- **Pendiente:** comprobar el nuevo run de CI disparado por los commits de integración y su resultado; no se declara todavía validación post-integración.
- No se han publicado releases ni alterado el punto de restauración.

## Automatización del acceso a CI — 2026-11-14
- Verificación de integración: run `43614254452`, job `132505749295`, conclusión **success**; lockfile, `npm ci`, `astro check`, compilación y `dist/index.html` correctos.
- Limitación de la conexión GitHub: permite leer jobs/logs por run ID, pero no enumerar runs de push a main; consulta web de API pública tampoco accesible.
- Solución implementada: rama `automation/ci-run-index` con `ci/latest-run.json`, legible por GitHub fetch_file sin conocer el run ID.
- CI en main publica su `github.run_id`, URL, SHA y estado del job al terminar un push; no modifica main ni genera ejecuciones en bucle.
- Commit del workflow: `c5b969bce5537afe42ec3c111abeeddd99aa7a8f`.
- Publicación del índice configurada con `continue-on-error` para no falsear el resultado de compilación si falla la telemetría.
- **Validación pendiente:** la primera ejecución debe escribir un run ID no nulo en `automation/ci-run-index/ci/latest-run.json`. Hasta entonces no se afirma que la automatización funcione de extremo a extremo.
- Seguridad: escritura del token solo en eventos push; PR mantiene solo lectura.

## Corrección del índice automático — 2026-11-14
- El usuario observó en GitHub que los runs de CI de `c5b969b` y `a10d84e` fallaban con duración 0 s; no se dispuso del error de validación exacto. Se sospecha configuración del workflow, **sin atribuir causa definitiva**.
- Se restauró `.github/workflows/ci.yml` a la versión de solo lectura previamente validada: commit `dd6bd6c5f540cf846bd999db2768ef7edec83ade`.
- Se separó el índice en `.github/workflows/ci-run-index.yml`, activado por `workflow_run: completed` del workflow CI. Solo indexa ejecuciones de push a main, usando datos de evento sin ejecutar código del commit analizado: commit `c0d4c1e4eedf7125acba544972952749cb21019e`.
- El indexador escribe `ci/latest-run.json` en `automation/ci-run-index`; no modifica main ni desencadena CI recursivo.
- **Pendiente:** comprobar que CI vuelve a funcionar y que el workflow de índice escribe un `run_id` no nulo. Si GitHub Actions tiene bloqueada la escritura de GITHUB_TOKEN, el indexador puede fallar y requerir habilitar permiso de escritura del repositorio.
