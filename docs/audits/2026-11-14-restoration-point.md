# Auditoría y punto de restauración — 2026-11-14

## Alcance y evidencia
- Repositorio: `PabloGonzalezRuiz/AstroXmind`; rama auditada: `main`.
- Commit funcional exacto: `a4ea18658aa90323c5a2f83116d6130229b8cd96`.
- Punto de restauración creado y comprobado: rama `backup/2026-11-14-wiki-funcional`, apuntando al SHA anterior.
- Git tree recursivo completo (`truncated=false`); estructura de Astro, Starlight, seis documentos de contenido, dos workflows y documentación presente.
- Runs del commit: [Wiki Build 43610712895](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43610712895) **success**; [Wiki Deploy 43610712857](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43610712857) **success**.
- Usuario confirmó portada y enlaces de los cuatro bloques funcionales en navegador.
- Configuración: Astro 5, Starlight 0.36, base `/AstroXmind`, colección docs registrada en `src/content.config.ts`, enlaces de portada con prefijo de base.

## Resultado
**Fase 1 AST-002: cerrada funcionalmente** con verificación de usuario. **AST-003: publicación operativa, release estable 0.1.0 pendiente**. Sin temario TAI completo, editor ni PMD/XMind; no se ha validado `npm run check`, cobertura de pruebas ni seguridad de dependencias. La compilación usa `npm install` y no hay `package-lock.json`: la resolución de versiones no es reproducible; priorizar lockfile y `npm ci` en fase siguiente. La rama de copia no está protegida por reglas de GitHub; no moverla ni eliminarla.

## Restauración manual desde GitHub
1. Abrir la rama [backup/2026-11-14-wiki-funcional](https://github.com/PabloGonzalezRuiz/AstroXmind/tree/backup/2026-11-14-wiki-funcional) y verificar su SHA `a4ea18658aa90323c5a2f83116d6130229b8cd96`.
2. Si se necesita recuperar código, crear una rama nueva desde esa copia mediante GitHub; comparar con `main` y abrir PR para revisión, sin sobrescribir `main` directamente.
3. Ejecutar los workflows de build y Pages sobre el commit restaurado y comprobar la web y sus enlaces.
4. No eliminar ni mover la rama backup; no confundir un punto Git con una copia independiente fuera de GitHub.

## Incidencias corregidas
- 404 inicial: faltaba `src/content.config.ts`; corregido y verificado con generación de `dist/index.html`.
- Enlaces de tarjetas: necesitaban prefijo `/AstroXmind/`; usuario confirmó su funcionamiento.

## Límites de la auditoría
Auditoría de repositorio, configuración, historial de Actions y comprobación de usuario. No equivale a una auditoría de seguridad profunda, prueba E2E automatizada ni a una release estable.
