# Auditoría y pruebas

## Fase 0
Quince documentos iniciales recuperados y leídos desde GitHub; auditoría de presencia y legibilidad, no de software.

## Fase 1 — 2026-11-14
- Implementación de la estructura Astro/Starlight en main.
- CI de compilación creado en `.github/workflows/wiki-ci.yml` con Node 22 y `npm install` + `npm run build`.
- Primera ejecución: [43591434053](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43591434053); **primera ejecución fallida**. Posteriormente el build [43591621032](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43591621032) terminó con **success** tras corregir dos entradas de sidebar.
- La compilación está verificada en CI; todavía no hay prueba de navegación en navegador ni despliegue verificado.

Antes de cerrar AST-002: comprobar build, artefacto y enlaces de navegación; documentar incidencias.

## Comprobación de usuario (2026-11-14)
El usuario confirmó «Funciona» tras abrir la portada pública. El run [43609742100](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43609742100) verificó la generación de seis archivos HTML (portada, guía, cuatro bloques) y el despliegue exitoso. No se ha recibido aún confirmación de cada enlace del menú.

## AST-003 · Reproducibilidad (2026-11-14)
- Trabajo aislado en `feature/ast-003-release-hardening`; backup funcional `backup/2026-11-14-wiki-funcional` sin cambios.
- Primera ejecución [43611599390](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43611599390): `npm ci` y build correctos, pero `git push` falló por non-fast-forward durante actualización documental simultánea.
- Reejecución [43611676573](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43611676573): **success**, `package-lock.json` generado y guardado en rama, `npm ci` y `npm run build` correctos, `dist/index.html` presente.
- Los workflows de build y Pages de la rama ahora usan `npm ci`; CI comprueba portada, guía y cuatro bloques. Pendiente verificar estas modificaciones en una ejecución de CI y auditar dependencias antes de publicar release.
