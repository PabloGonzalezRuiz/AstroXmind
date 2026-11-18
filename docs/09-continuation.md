# Punto de reanudación

Auditado el 18-11-2026: main `f3e2259d76ff62c2949b29a01292cd988b4b3e99`, publicado y verificado por Actions y HTTP. NAV-01/02/03, ampliación de orden/fechas y corrección de números están terminados. No queda una publicación pendiente de esa entrega. [Estado](04-project-status.md), [informe](audits/2026-11-18-application-state.md).

## Lectura y fuentes

Leer AGENTS.md, [prompt](00-master-prompt.md), [roadmap](03-roadmap.md), [arquitectura](02-architecture.md) y [operación](19-operations-and-verification.md). Contratos de IDs/contexto/referencias: documentos 14/15/16; orden y fechas: 20; corrección: 22. Auditorías históricas y registros de publicación conservan su contexto original.

TreeTable vive en examples/astro-component-lab/src/components/TreeTable.astro y se comparte con la wiki. Demos con componente y ?raw de la misma fuente. Páginas en src/content/docs; docs/ es mantenimiento fuera del árbol público. Árbol derivado de YAML y ledger navigation-ids.json; no editar dist. Mantener resolución por ID en MarkdownContent además de Remark por la caché de Astro. revealTarget busca también celdas plegadas desprendidas del DOM.

## Contrato vigente

order opcional, grupos 10/20/30 → 1/2/3; duplicados comparten ordinal. Pendientes al final, sin número; padre sin order corta ruta; raíz sin prefijo. created y modified opcionales dentro de navigation, con tres decimales y zona; created preferido, modified fallback, ID al final. No usar filesystem/Git/ledger/reloj. Cambiar parent mueve la rama lógica sin mover archivos.

## Verificación

[CI 44130965495](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44130965495), [Wiki Build 44130965520](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44130965520) y [Pages 44130965464](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44130965464): completed/success, todos sobre f3e2259.

Diez páginas públicas HTTP 200 y catorce referencias; navigation.json versión 2. Check/build: 43 + 16 = 59 pruebas; las dos integraciones explícitas completan 61. npm run test:navigation:ordering y npm run test:references:rebuild no se ejecutan en CI estándar. Preparar raíz antes del laboratorio por su deuda de aislamiento TypeScript. DOM no acredita layout/fullscreen nativo/táctil.

## Siguiente desarrollo y permisos

NAV-04 sigue pendiente de autorización: salientes y backlinks con contexto y ancla de cita. references.json ya ofrece source/target/fragment/href, sin contexto ni ancla de origen. Después NAV-05 retorno exacto, NAV-06 impresión/HTML autónomo, NAV-07 consulta lateral, NAV-08 grafo opcional. Summary/Boundary aplazados y biblioteca AST-027 última.

El encargo del 18-11 autoriza auditar y actualizar documentación; preparar en rama sin modificar main, desplegar, abrir/fusionar/cerrar PR ni publicar release. Las aprobaciones antiguas de publicación ya se consumaron. PRs #1/#2/#4/#5 confirmados abiertos; conservarlos. No iniciar funcionalidad como efecto secundario de documentar.
