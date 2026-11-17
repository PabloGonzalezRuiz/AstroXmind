# Validación y auditoría

Estado contrastado el 17-11-2026 sobre main `5f1a33ff7a846a42914f33be61782adb0e5f8452`. Esta revisión parte del SHA publicado indicado y añade NAV-01/02 en la rama feature/nav-01-document-tree, sin cambiar main ni publicar.

## Evidencia publicada

SHA auditado: `5f1a33ff7a846a42914f33be61782adb0e5f8452`.

- [CI 44050305122 — éxito](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44050305122).
- [Wiki Build 44050305118 — éxito](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44050305118).
- [Pages Deploy 44050305192 — éxito](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44050305192).

La validación anterior incluyó builds de wiki/laboratorio, comprobaciones DOM dirigidas y lectura de la página/estilos publicados. No hubo revisión visual completa de navegador para las últimas mejoras; fullscreen nativo se probó con API simulada. CI acredita tipos/build, no accesibilidad visual ni ausencia de vulnerabilidades.

## Comprobaciones actuales

CI usa Node.js 22, npm ci, npm run check y npm run build. Sandbox tiene package/lockfile propios. Las comprobaciones DOM anteriores fueron dirigidas al comportamiento, no son una suite persistente integrada en main. PR #5 previo no debe presentarse como cobertura actual.

NAV-01 añade código y pruebas persistentes. npm run check valida estructura, ejecuta 24 pruebas de navegación y comprueba Astro (0 errores/avisos). npm run build genera las cuatro páginas y dist/navigation.json. Se comprobó que el build real falla por padre inexistente, restaurando la fuente antes del build válido final. No se ejecutaron Actions ni se publicó esta rama.

## Aceptación NAV-01 realizada

Probar árbol válido, ID duplicado, padre inexistente, ciclo/autopadre, raíz desconectada, orden inválido y estabilidad de pertenencia al cambiar ruta. Fixture pequeño y prueba de integración con las cuatro páginas existentes. Verificar generación de registro, tipos y build. No añadir pruebas que solo reflejen funciones internas sin validar comportamiento.

## Aceptación posterior

NAV-03/04: destinos y citas exactas, sin duplicar código raw; NAV-05/07: retorno/foco/teclado/móvil; NAV-06: rama completa, orden, referencias internas/externas, contenido desplegado y salida sin red. No afirmar que el PDF/HTML offline conserva una función no probada.

Las pruebas incluyen edición de un solo parent en archivos YAML de una carpeta plana, traslado de todos sus descendientes, estabilidad de IDs al cambiar URL y generador sobre registros temporales sin alterar IDs reales. No hay pruebas nuevas de interfaz visual porque NAV-01 no añade UI.

## NAV-02 validado en rama

26 pruebas persistentes de árbol/contexto en check, Astro check sin errores/avisos. Build genera nueve documentos y el 404 técnico; después ejecuta diez pruebas persistentes del HTML real: ruta/padre, hijos, árbol anidado y página actual, anterior/siguiente, portada splash y ausencia de contexto falso en 404. Esas pruebas contrastan cada página con navigation.json.

Prueba real adicional: editar solo parent del Artículo 2, reconstruir y verificar que Artículo 3 cambia de antecesores sin cambiar su propio padre ni URL; pruebas HTML correctas en la jerarquía trasladada. Restaurar el YAML y reconstruir el estado final. Servidor dev comprobado para reflejar el cambio sin reiniciarlo. No se ha realizado inspección visual completa ni prueba manual de teclado/táctil. Evidencia en audits/2026-11-17-nav-02-validation.md.
