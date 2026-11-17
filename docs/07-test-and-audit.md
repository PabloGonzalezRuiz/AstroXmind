# Verificación y auditoría vigentes

Base auditada: main publicado 2cdba361920b58a5002faa063e46660f22ff36ef, 17-11-2026. [Operación detallada](19-operations-and-verification.md). Los informes en audits/ conservan sus resultados históricos y no se reescriben.

## Matriz de comprobaciones

| Pruebas | Cantidad de referencia | Comportamiento comprobado |
|---|---|---|
| navigation.test + references.test | 32 | Árbol plano/lógico, orden/movimientos, ciclos/raíces, borradores, reservas, URLs, YAML, referencias/destinos/caché |
| navigation-rendered.test | 12 | Diez documentos, 404 sin contexto falso y demo/componentes con hermanos/IDs explícitos |
| reference-client.test | 3 | Bundles TreeTable/Starlight Tabs con celdas desprendidas, antecesores, rama ajena, foco, pestaña y hash directo/repetido |
| reference-rebuild.test | 1 | Dos builds reales con caché conservada; renombrar el destino mantiene ID/padre y actualiza href |

check ejecuta las primeras 32 y Astro check. build ejecuta la validación de rutas/destinos y las 15 pruebas HTML/DOM. test:references:rebuild se lanza aparte. Total 48; CI estándar solo 47. No cambiar esas cifras para aparentar cobertura si la revisión posterior añade/elimina contenido o pruebas.

## Repetición desde instalación limpia

Durante esta revisión se ejecutaron npm ci, check, build y test:references:rebuild en el checkout de la referencia, todos correctos. Runtime local Node 24.22.1; CI de publicación Node 22. Laboratorio: instalación correcta; su check inicial en paralelo con la preparación de raíz falló por App.Locals.starlightRoute en el middleware raíz. Tras completar la raíz, check sin errores/avisos y build de una página correctos. No se arregló código durante este encargo documental; se registró el aislamiento TypeScript pendiente.

## Evidencia publicada

[CI 44096661054](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44096661054), [Wiki Build 44096660778](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44096660778), [Pages 44096660802](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44096660802): success en 2cdba36. Publicación comprobada por HTTP/HTML/JSON: diez páginas y catorce referencias. No usar estos runs como validación de un futuro SHA.

Los builds negativos NAV-03 rechazaron destino eliminado, ID repetido e ID de tabla repetido; se restauraron las fuentes. Ver [auditoría NAV-03](audits/2026-11-17-nav-03-validation.md). La auditoría documental nueva contrasta código, workflows, historial completo y enlaces de documentación.

## Cobertura pendiente

No hay revisión visual completa, layout real, scroll/fullscreen nativo ni prueba táctil acreditada. jsdom no los sustituye. Revisar accesibilidad/móvil, árboles grandes, listas múltiples, ámbitos multilingües y aislamiento del laboratorio en robustez.

NAV-04 debe probar exactitud de citas/orígenes y exclusión de código raw; NAV-05/07, retorno/foco/teclado; NAV-06, rama completa, referencias/recursos y salida sin red/recortes. No afirmar esas capacidades antes de implementarlas. Auditoría npm/licencias verde significa informe generado, no ausencia de avisos ni certificación de conformidad; revisar ambos lockfiles según alcance.

## Ampliación de ordenación en rama

Contrato en [20-navigation-ordering.md](20-navigation-ordering.md). Se añaden nueve pruebas: order opcional, fechas YAML con milisegundos/offset, prioridad created y fallback modified, ausencia de fecha, invariancia frente a filesystem/ledger, duplicados con números iguales y corte de ruta tras padre sin order. El bloque de dominio pasa de 32 a 41 pruebas. Build mantiene 15; regresión de referencias añade una y test:navigation:ordering otra (Astro real con fechas distintas por 1 ms). Total de la rama: 58; check/build de CI ejecutaría 56. No se usan Git/ledger/reloj para ordenar ni se alteran las fechas automáticamente. La wiki publicada sigue en 2cdba36.
