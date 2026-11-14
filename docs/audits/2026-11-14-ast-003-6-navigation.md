# AST-003.6 — Auditoría automatizada de navegación

Fecha de inicio: 2026-11-14.

## Alcance

- La validación manual de enlaces de la **wiki actualmente publicada** fue confirmada por el usuario y registrada en `main`.
- La migración Astro 7 / Starlight 0.43 está todavía en `security/ast-003-5-dependency-upgrade`, PR #1, sin fusionar ni publicar.
- El script `scripts/check_navigation.py` analiza HTML de `dist/`, comprueba destinos locales y fragmentos (anchors), y respeta el prefijo `/AstroXmind`.
- El workflow `.github/workflows/ast-003-6-navigation.yml` ejecuta `npm ci`, `npm run build`, el validador, y publica `ast-003-6-navigation-report`.

## Límites

No inspecciona enlaces externos ni rutas generadas dinámicamente por JavaScript. La ausencia de errores en `dist/` no demuestra que GitHub Pages ya haya desplegado la versión candidata ni sustituye la aceptación visual posterior.

## Estado

**Implementado, ejecución CI pendiente de verificar.** No declarar AST-003.6 completada hasta comprobar el run, el informe y los casos de error. En caso de fallo, revisar logs y corregir en la rama candidata; no modificar `main` ni publicar release sin autorización.

## Pruebas de regresión añadidas — 2026-11-14
Se incorporó `scripts/test_check_navigation.py` con cinco casos aislados: enlace interno válido y fragmento, destino inexistente, fragmento inexistente, enlace externo ignorado y recurso JS existente. El workflow ejecuta estas pruebas antes del validador de `dist/` (commits `7bb67ce`, `6f23152`). **Pendiente** comprobar el resultado del workflow y leer el informe generado. No declarar AST-003.6 cerrada antes de verificar el run y el resultado de la rama candidata.

## Diagnóstico del primer run y correcciones — 2026-11-14
- Run [43628843256](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43628843256), job 132550706248: **failure** en validación del sitio. Instalación, build, cinco pruebas de regresión y publicación del informe: correctos.
- Evidencia: **7 HTML, 142 referencias locales, 8 errores**: siete referencias a `/AstroXmind/favicon.svg` sin archivo, y una referencia desde `404.html` a `/AstroXmind/404/` sin destino.
- Correcciones en rama candidata: `public/favicon.svg` (commit `7873f76`); `public/404/index.html` (commit `eb0fbb5`) para que exista la ruta referenciada por la página de error y redirija a inicio.
- **Pendiente** comprobar nuevo run AST-003.6; no declarar resueltos los ocho errores hasta verificar el resultado y el informe. No se ha modificado `main` ni desplegado la candidata.
