# IDX-01 — Índice global de conocimiento

## Decisión aprobada 26-11-2026

Markdown + YAML mantienen la fuente canónica; el catálogo plano identifica documentos por UUID, no por título, ruta ni código de presentación. Una aparición contiene `convocatoriaId`, `versionId`, `aparicionId`, `padreAparicionId`, `orden`, `alias` y código opcional. Los vínculos `referencias` y `conceptos` del índice son proyecciones de relaciones explícitas por ID; no se deducen asociaciones semánticas ni se crean campos duplicados de autoridad en el corpus. La futura integración debe adaptar el modelo canónico de cada entidad, incluidas preguntas, a esta proyección.

## IDX-01A — Motor y consultas

`src/lib/indice-conocimiento.mjs` construye una instantánea por revisión mediante un único inventario global de documentos y pertenencias. Indexa UUID, convocatoria, versión, apariciones por documento, referencias entrantes y conceptos. Reutiliza `crearArbolConvocatoria` para organizar cada contexto: padres, hijos, hermanos, códigos y rutas. La validación de ciclos utiliza marcas por nodo en lugar de recorrer todos sus ancestros repetidamente. No mezcla versiones ni permite raíces ambiguas, padres ajenos u órdenes duplicados. Las consultas devuelven copias o nodos inmutables; regenerar tras un cambio confirmado. Cargar únicamente metadatos cuando se conecte el catálogo real; el contenido se lee bajo demanda.

Complejidad: inventario O(D + P + R) para documentos, pertenencias y relaciones, más ordenación por grupos de hermanos; búsqueda por ID promedio O(1), listar una convocatoria O(k), reconstruir ruta O(profundidad). La planificación de retirada visita únicamente los documentos afectados y sus pertenencias, preserva todas las demás, indica candidatos sin pertenencia y genera una copia histórica reversible. No borra archivos.

## IDX-01B — Operaciones masivas y persistencia

`planificarRetirada` es una simulación sin escritura. `retirarConvocatoria` requiere una revisión esperada y confirmación explícita para llamar al contrato `guardarRetiradaAtomica`. El contrato debe verificar la revisión actual y los metadatos anteriores, archivar las relaciones retiradas y actualizar los afectados en una sola transacción; devuelve revisión nueva únicamente tras confirmación. Se ha probado con un almacén simulado, no con el repositorio privado. No implementar una purga física automática ni cambiar originales/evidencia. La reactivación debe restaurar relaciones desde historial con validación de conflictos y nueva revisión. El adaptador real, la recuperación después de fallo de red y el índice persistente incremental siguen pendientes: dependen del catálogo real de conocimiento. Reutilizar el mecanismo de commit no forzado de ED-04B, sin almacenar una segunda fuente de verdad. La revisión del índice debe corresponder al HEAD/manifesto real del catálogo; no aceptar un índice obsoleto.

## IDX-01C — Rendimiento

Ejecutar `npm run benchmark:indice`. Prueba sintética en Node 24, catálogo plano con dos contextos, aproximadamente 1 % de documentos compartidos; no incluye carga de disco, red, escritura ni Markdown real. Mediciones orientativas de una ejecución local:

| Documentos | Afectados | Construcción | Consulta de convocatoria | Plan de retirada | Hijos del árbol |
|---:|---:|---:|---:|---:|---:|
| 10.000 | 100 | 115,17 ms | 0,035 ms | 1,77 ms | 0,25 ms |
| 100.000 | 1.000 | 1.098,48 ms | 0,048 ms | 8,84 ms | 0,41 ms |

No son garantías de producción. Repetir con relaciones densas, catálogo real y medición de memoria antes de importar corpus masivo.

## IDX-01D — Adaptador de almacenamiento privado

`abrirAlmacenConocimiento(window,token)` reutiliza la autenticación existente y el HEAD fijo del almacén privado. Contrato canónico: `Conocimiento/catalogo.yaml` contiene `schemaVersion: 1` y `documentos: [doc-UUID...]` (solo inventario); cada `Conocimiento/Documentos/doc-UUID/metadatos.yaml` contiene `schemaVersion`, `id`, `pertenencias`, referencias/conceptos opcionales y otros metadatos. La futura autoría Markdown queda independiente; el índice no necesita cargar cuerpos. Las retiradas archivan el plan en `Conocimiento/Historial/UUID.yaml` y actualizan un puntero de operación vigente por convocatoria en `Conocimiento/Retiradas/op-UUID-AAAA[-pi].yaml`; no duplican relaciones activas. La restauración obtiene exclusivamente el evento vigente desde la misma instantánea. Operaciones simuladas por defecto, confirmación explícita y revisión esperada, commit no forzado con metadatos afectados, archivo histórico y puntero; un fallo bloquea nuevos intentos hasta releer. No modifica ni elimina PDF, CPS, originales o expediente. No inicializa automáticamente un catálogo ausente.

Probado mediante respuestas GitHub simuladas: lectura, retirada, restauración y conflicto de ref; sin escritura real. Todavía no hay corpus canónico conectado ni UI de retirada: validar con catálogo ficticio aislado y desarrollar caché/regeneración incremental dentro de IDX-01 antes de TEM-01. El catálogo real se inicializará de forma controlada en TEM-01 tras aceptar CALL-05 e IDX-01. El inventario se lee por lotes de ocho archivos, no se ha medido el rendimiento remoto de 100.000 documentos.

## Secuencia

ED-05: el motor ya incluye planificación de restauración con archivo histórico, preservación de otras pertenencias actuales y validación global previa. El contrato `guardarRestauracionAtomica` debe cotejar revisión y metadatos anteriores y verificar la procedencia del archivo histórico confirmado. Las pruebas sintéticas ejecutan retirada y restauración de cada una de tres convocatorias, sin borrar documentos ni perder referencias/conceptos. El adaptador real sigue pendiente.

Continuar ED-04C y ED-05 sin alterar TAI 2025 durante desarrollo. Completar IDX-01 (conexión del catálogo, almacenamiento transaccional, regeneración/incremental y aceptación) antes de TEM-01/TEM-02. PROG-03 sigue después de COVER-01; no incorporar otra convocatoria real todavía. DIST-02 permanece al final.
