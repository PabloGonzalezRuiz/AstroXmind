# Validación y auditoría

Estado contrastado el 17-11-2026 sobre main `5f1a33ff7a846a42914f33be61782adb0e5f8452`. Esta revisión solo cambia documentación en una rama separada.

## Evidencia publicada

SHA auditado: `5f1a33ff7a846a42914f33be61782adb0e5f8452`.

- [CI 44050305122 — éxito](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44050305122).
- [Wiki Build 44050305118 — éxito](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44050305118).
- [Pages Deploy 44050305192 — éxito](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44050305192).

La validación anterior incluyó builds de wiki/laboratorio, comprobaciones DOM dirigidas y lectura de la página/estilos publicados. No hubo revisión visual completa de navegador para las últimas mejoras; fullscreen nativo se probó con API simulada. CI acredita tipos/build, no accesibilidad visual ni ausencia de vulnerabilidades.

## Comprobaciones actuales

CI usa Node.js 22, npm ci, npm run check y npm run build. Sandbox tiene package/lockfile propios. Las comprobaciones DOM anteriores fueron dirigidas al comportamiento, no son una suite persistente integrada en main. PR #5 previo no debe presentarse como cobertura actual.

Este cambio es documental: enlaces locales, consistencia de fase/estados y diff sin código. No se han vuelto a ejecutar builds ni Actions para estos documentos, ni se ha desplegado la rama.

## Aceptación NAV-01, cuando se autorice

Probar árbol válido, ID duplicado, padre inexistente, ciclo/autopadre, raíz desconectada, orden inválido y estabilidad de pertenencia al cambiar ruta. Fixture pequeño y prueba de integración con las cuatro páginas existentes. Verificar generación de registro, tipos y build. No añadir pruebas que solo reflejen funciones internas sin validar comportamiento.

## Aceptación posterior

NAV-03/04: destinos y citas exactas, sin duplicar código raw; NAV-05/07: retorno/foco/teclado/móvil; NAV-06: rama completa, orden, referencias internas/externas, contenido desplegado y salida sin red. No afirmar que el PDF/HTML offline conserva una función no probada.
