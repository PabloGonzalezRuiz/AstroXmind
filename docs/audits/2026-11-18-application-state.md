# Auditoría de estado — 18-11-2026

## Fuente y alcance

Repositorio PabloGonzalezRuiz/AstroXmind, main `f3e2259d76ff62c2949b29a01292cd988b4b3e99`, árbol 1595b8f6603363cda33c285dbd7ca8f04bf71369. HEAD remoto no ha cambiado desde la corrección de numeración del 17-11. Revisión de código/configuración, documentación operativa, PRs, Actions, reinstalación y build local e índices/rutas publicados. Esta entrega solo modifica documentación e instrucciones de continuidad en rama; no main, código funcional, dependencias, PRs, releases ni Pages.

## Hallazgos

1. La corrección de numeración está publicada: order 10/20/30 produce 1/2/3; 10/10/30 produce 1/1/2. Los metadatos permanecen intactos. No queda una integración pendiente.
2. La documentación operativa mezclaba estados históricos (2cdba36, ampliación en rama, aprobación pendiente, recuentos 48/58) con el estado actual. Se concilian estado, roadmap, tareas, prompt, continuidad, instrucciones, arquitectura, reconstrucción, pruebas y operación; los informes históricos no se reescriben.
3. NAV-01/02/03 implementados. references.json contiene source/target/fragment/href, pero falta contexto y ancla de cita para backlinks. NAV-04 es el siguiente paso coherente y aún requiere autorización.
4. Diez documentos y catorce referencias publicados; catorce demos Resultado/Código. No se confunde contenido técnico/de prueba con un temario de estudio completo.
5. PRs abiertos confirmados: #1 seguridad, #2 prácticos TAI, #4 documentación antigua, #5 regresiones antiguas. Su código no se atribuye a main ni se integra.

## Verificación repetida

[CI 44130965495](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44130965495), [Wiki Build 44130965520](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44130965520) y [Pages 44130965464](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44130965464): completed/success, todos sobre f3e2259.

Local limpio: Node 24.22.3/npm 11.9.0; npm ci, check y build correctos. Check: 43 pruebas y 43 archivos Astro sin errores/avisos/hints; build: 16 pruebas HTML/DOM. Integraciones de ordenación y caché/renombrado: una cada una, ambas correctas. Total 61. CI habitual usa Node 22 y ejecuta 59.

HTTP público: diez páginas con estado 200; navigation.json schemaVersion 2, diez IDs con numeración esperada (1, 1.1, 2, 3, 3.1, 3.1.1, 3.1.1.1, 3.1.1.1.1, 3.1.2; raíz neutra); references.json con catorce referencias. No se realizó inspección visual de navegador ni prueba real de fullscreen/táctil.

## Riesgos y siguiente cambio

Persisten aislamiento TypeScript del laboratorio, listas múltiples/escala, validación visual/accesible/móvil y revisión de ambos lockfiles. El informe de dependencias previo es informativo; no se ejecuta una remediación ni se certifica seguridad en esta auditoría.

Propuesta NAV-04: derivar referencias salientes y entrantes del registro, añadir contexto textual y ancla al punto de cita, renderizar ambas listas con enlaces normales y validar citas a documento/apartado/nodo, citas múltiples y exclusión de código raw. Conservar referencias por ID y resolución tras caché. Definir el ancla de cita antes de implementar NAV-05. Autorización de desarrollo/publicación por solicitar; esta auditoría no inicia ese cambio.

Orden posterior: NAV-05 retorno exacto; NAV-06 impresión/HTML autónomo de rama; NAV-07 consulta lateral; NAV-08 grafo opcional; robustez, seguridad, Summary/Boundary aplazados, presets/XMind, editor, contenido y biblioteca AST-027 al final.

Laboratorio repetido el 18-11 tras preparar la raíz: npm ci correcto, Astro check de 43 archivos sin errores/avisos/hints y build de una página correcto. Se conserva la deuda de aislamiento TypeScript; no se modifica su configuración.
