# Verificación y auditoría vigentes

Hito de cierre [M-20261122](30-milestone-20261122.md): base 37cfb00, 104 pruebas locales, CI/Build/Pages correctos, scroll aceptado por Pablo; iPhone pendiente de prueba específica. Registros inferiores históricos.

Auditoría actual: [22-11-2026](audits/2026-11-22-project-audit.md), main b78362d, 101 pruebas correctas y CI/Pages success. Aceptación visual de FrameEjemplo y Acciones en iPhone pendiente. Los registros inferiores conservan sus fechas originales.

[Auditoría vigente del editor y propuesta contextual](audits/2026-11-19-editor-contextual.md). Base `da19c5b`: 79 pruebas, CI y Pages correctos; atajos comprobados en navegador. Las cifras siguientes son históricas; [NAV-08](audits/2026-11-18-nav08-handoff.md).


Revisión auditada el 18-11-2026: main `f3e2259d76ff62c2949b29a01292cd988b4b3e99`. [Informe](audits/2026-11-18-application-state.md). Los informes anteriores conservan sus resultados históricos.

| Comprobación local repetida | Resultado |
|---|---|
| npm ci | Instalación bloqueada correcta, sin cambiar lockfile |
| npm run check | 43 pruebas de dominio/referencias/ordenación; Astro check de 43 archivos sin errores, avisos ni hints |
| npm run build | Diez páginas más 404; catorce referencias validadas; 16 pruebas HTML/DOM correctas |
| npm run test:navigation:ordering | Una integración Astro real con orden ausente/duplicado y fechas separadas por 1 ms; correcta |
| npm run test:references:rebuild | Una integración con dos builds, caché y renombrado; correcta |

Total 61 pruebas; CI estándar ejecuta 59, las otras dos se lanzan explícitamente. Runtime local de esta auditoría: Node 24.22.3/npm 11.9.0; CI usa Node 22. Las regresiones comprueban ordinales consecutivos y la jerarquía real, además de invariancia frente a filesystem/ledger y exactitud de timestamps YAML.

## Evidencia remota y pública

[CI 44130965495](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44130965495), [Wiki Build 44130965520](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44130965520) y [Pages 44130965464](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44130965464): completed/success, todos sobre f3e2259.

Diez páginas HTTP 200 el 18-11; navigation.json versión 2 con 1, 1.1, 2, 3, 3.1 y descendientes; references.json con catorce referencias. No se ejecuta ni se atribuye un despliegue nuevo a esta revisión documental.

## Límites y pendientes

jsdom comprueba bundles reales, DOM, foco/pestañas y apertura selectiva de celdas plegadas; no acredita layout, scroll real, fullscreen nativo o táctil. La inspección pública de hoy comprueba rutas e índices; no sustituye pruebas visuales. La validación completa de fragmentos se repite en build local.

Laboratorio: preparar raíz primero; check sin tsconfig propio puede alcanzar middleware raíz. Mantener deuda de aislamiento. Árboles grandes, listas múltiples, accesibilidad móvil y locales requieren revisión específica. No se repite ni remedia npm audit en este encargo; el workflow informativo previo no equivale a ausencia de vulnerabilidades.

NAV-04 debe probar contexto/ancla de cita y exclusión de código raw; NAV-05/07, retorno/foco/teclado; NAV-06, rama completa y salida sin red. Estas funciones ya están publicadas. La [auditoría más reciente](audits/2026-11-18-nav08-handoff.md) marca el alcance comprobado.

Laboratorio repetido el 18-11 tras preparar la raíz: npm ci correcto, Astro check de 43 archivos sin errores/avisos/hints y build de una página correcto. Se conserva la deuda de aislamiento TypeScript; no se modifica su configuración.
