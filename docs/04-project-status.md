# Estado real del proyecto

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
