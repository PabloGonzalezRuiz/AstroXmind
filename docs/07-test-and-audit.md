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
