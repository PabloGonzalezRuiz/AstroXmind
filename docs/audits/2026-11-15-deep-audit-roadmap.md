# Auditoría de continuidad — 2026-11-15

## Alcance y fuentes
PR #1, rama candidata, package.json, README, AGENTS.md, prompt maestro, estado, hoja de ruta, tareas, continuidad, scripts de navegación y tests; logs del job 132550706248 (run 43628843256). No se ha desplegado ni probado visualmente la candidata. La documentación histórica puede estar desfasada respecto a la rama.

## Estado verificado
- PR #1 abierto, draft, mergeable; main permanece separado. HEAD consultado al inicio: 15b717566720124f2abd1ea0ee34950460f5f27c. Los commits posteriores de esta auditoría deben verificarse de nuevo.
- package.json candidata: astro ^7.4.12, @astrojs/starlight ^0.43.1, Node >=22, versión 0.1.0-dev, MIT propia. README sigue mencionando Astro 5/Starlight 0.36: descripción histórica de main, no de la candidata.
- Run de navegación 43628843256: npm ci, build y cinco tests correctos; validación de 142 referencias con ocho fallos: siete favicon y un enlace canónico /AstroXmind/404/. Logs: https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43628843256/job/132550706248 .
- La compilación genera dist/404.html. La existencia de public/favicon.svg en Git no acredita su ubicación final en dist/. Se ha añadido soporte condicional para assets en dist/AstroXmind/ y 404.html, sin ignorar rutas ausentes. Si el fichero no existe en ninguna ubicación, la comprobación debe seguir fallando.
- Licencias: inventario y tarballs auditados parcialmente; ausencia de LICENSE/NOTICE reconocidos en @img/sharp-libvips-linux-x64@1.3.4; Pagefind gzip/WASM bajo revisión. Un CI verde no cierra cumplimiento.
- La aceptación visual de la wiki actualmente publicada no acredita la candidata no desplegada. AST-004 contenido TAI es la prioridad tras estabilizar; AST-008 búsqueda/tests queda aplazada.

## Hoja de ruta por prioridad
1. AST-003.6: ejecutar tests y workflow de navegación sobre HEAD tras la corrección; comprobar artefacto, rutas y favicon real. Si falla, inspeccionar logs y corregir sin silenciar errores. **En curso, no verificado**.
2. AST-003.5: cerrar matriz de componentes efectivamente distribuidos, licencias/avisos exactos de Pagefind y sharp/libvips, obligaciones y evidencias. **Abierto**.
3. AST-003 aceptación: ejecutar check, build, npm audit, navegación, seguridad y licencias sobre el mismo SHA. **Abierto**.
4. Validación visual de candidata: portada, guía, cuatro bloques, móvil/escritorio, menú, 404 y recursos estáticos; registrar capturas y aprobación. **Pendiente**.
5. Preparar release 0.1.0 y checklist de decisión; no merge, deploy, tag o release sin autorización expresa.
6. AST-004: estructura editorial Markdown y primer tema TAI completo con referencias y revisión normativa.
7. AST-008: búsqueda avanzada y trazabilidad de tests, **aplazada**. AST-005/006/007 futuros.

## Cambios ejecutados
- scripts/check_navigation.py: resolución de 404.html y fallback comprobado de assets bajo base.
- scripts/test_check_navigation.py: regresiones de 404, asset prefijado y favicon inexistente.
- Verificación pendiente: el éxito de CI tras estos commits, la presencia efectiva de favicon y la compatibilidad de los cambios.

## Continuidad
Consultar PR https://github.com/PabloGonzalezRuiz/AstroXmind/pull/1 y Actions https://github.com/PabloGonzalezRuiz/AstroXmind/actions . Leer este informe junto con docs/09-continuation.md. No atribuir resultados antiguos al nuevo HEAD. Mantener intacto backup/2026-11-14-wiki-funcional. No trabajo continuo implícito.
