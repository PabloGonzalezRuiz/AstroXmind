# Estado real del proyecto

## Prioridad vigente — decisión del 17-11-2026

Esta decisión sustituye el orden de prioridades anterior que situaba NAV-04 como siguiente desarrollo. Inicio previsto al retomar el 18-11-2026 (Europe/Madrid); no hay ejecución automática ni recordatorio programado.

1. **Edición desde la wiki:** resolver autenticación y permisos; abrir un documento existente, editar contenido, previsualizar y guardar el cambio en el repositorio. Verificar el commit y distinguir guardado de publicación; comprobar el resultado publicado si se autoriza desplegar. Aún no implementado.
2. **Movimiento visual persistente:** solo después de verificar la edición normal. Botón «Mover» en cabecera, árbol con documento resaltado y flechas: arriba/abajo entre hermanos; izquierda promueve al nivel del padre, después de él; derecha convierte en hijo del hermano anterior, mostrando el destino. Trasladar la rama completa conservando IDs y relaciones internas; previsualizar numeración, deshacer/cancelar y guardar los cambios en el repositorio. Desactivar operaciones imposibles y rechazar ciclos. Aún no implementado.

El arrastre queda como alternativa posterior. NAV-04 y el resto de ampliaciones se posponen; conservar su registro sin iniciarlas. No adoptar ahora nuevas claves de orden ni migraciones del modelo. La lógica de movimiento debe ser independiente de Actions; el acceso autorizado guarda, y el proceso de build valida/publica. Conservar order opcional, empates con mismo número y fechas exclusivamente YAML.

Alcance autorizado en esta conversación: actualizar la planificación y continuidad; no implementar hoy estas funciones ni desplegarlas. La próxima sesión empieza por revisar el estado remoto y concretar la primera edición completa desde la wiki. No presentar esta fecha como una tarea autónoma programada.


Actualización 17-11-2026: corrección autorizada de numeración consecutiva, desde main f9272968aaff825baf969d6673fb6c328799074d. El usuario pidió continuar hasta publicarla y actualizar este estado. [Registro y validación](22-consecutive-numbering-fix.md). Confirmar despliegue por el SHA de esta entrega, no reutilizar el run de f927296 como prueba del cambio nuevo.

## Entregado

Wiki estática Astro/Starlight/MDX, diez documentos técnicos/de prueba, catorce referencias y catorce demos Resultado/Código. Clases por nivel/nodo, plegado/folded, numeración TreeTable, fullscreen, NAV-01/02/03, DocumentNavigator y fechas YAML con milisegundos. [Arquitectura](02-architecture.md) y [contrato de navegación](20-navigation-ordering.md).

order es opcional y solo determina posición. Sucesiones 10/20/30 se muestran como 1/2/3; 10/10/30 como 1/1/2. Los duplicados comparten número y se desempatan por created o fallback modified, exclusivamente YAML con milisegundos/zona. Los pendientes quedan al final y sin número. Raíz neutra y padre sin order corta el prefijo. La numeración de TreeTable no se cambia.

## Resultado esperado de la corrección

| Documento | Número visible |
|---|---|
| Inicio | Sin número |
| Clases y componentes | 1 |
| TreeTable | 1.1 |
| Laboratorio | 2 |
| Navegación | 3 |
| Artículos de prueba | 3.1 |
| Artículo 1 | 3.1.1 |
| Artículo 2 | 3.1.1.1 |
| Artículo 3 | 3.1.1.1.1 |
| Artículo 4 | 3.1.2 |

IDs, títulos, URLs, orders y fechas no se alteran. No se añade una nueva identidad a partir de los números. El índice conserva schemaVersion:2 y los enlaces mantienen sus destinos.

## Verificación y publicación

61 pruebas persistentes: 43 de dominio/referencias, 16 HTML/DOM y dos integraciones adicionales (fechas/ordenación y caché/renombrado). Astro check/build y ambas integraciones se ejecutan para esta corrección. CI normal ejecuta 59; las dos integraciones se lanzan aparte. La inspección del HTML contiene una regresión explícita para la jerarquía de la captura que señaló el usuario; no se limita a comparar UI e índice producido por el mismo cálculo.

La aprobación cubre integrar/publicar esta corrección sin PR/release. Workflows y comprobación pública se registran por el SHA de entrega. La publicación anterior f927296 tenía CI/Pages verdes pero una semántica de numeración errónea: esa evidencia técnica no sustituía validar el resultado que esperaba el usuario.

## Pendiente

NAV-04 (backlinks/citas con contexto) requiere autorización propia; después retorno exacto, impresión/HTML autónomo, consulta y grafo opcional. Summary/Boundary aplazados y biblioteca al final. PRs #1/#2/#4/#5 separados. Deudas conocidas: aislamiento TypeScript del laboratorio, revisión visual/móvil/fullscreen real y escala. No hay editor persistente, login o exportador XMind activo.
