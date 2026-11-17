# Punto de reanudación

Referencia verificada el 17-11-2026: main publicado `2cdba361920b58a5002faa063e46660f22ff36ef`. Esta revisión es documental y se guarda en rama; no actualiza main ni despliega. Confirmar GitHub al retomar por si hubo cambios posteriores.

## Lectura inicial

[Índice](README.md), [prompt maestro](00-master-prompt.md), [estado](04-project-status.md), [arquitectura](02-architecture.md), [instalación limpia](10-manual-reconstruccion.md), [hoja de ruta](03-roadmap.md), [contratos NAV-01/02/03](16-document-references.md), [historia](18-development-history.md) y [operación](19-operations-and-verification.md).

## Trabajo terminado

Clases por nivel/nodo, corchetes sin escapes, numeración/start y reinicio tras padre sin número, collapsible/folded, botón compacto, ejemplos Resultado/Código, fullscreen centrado con scroll. NAV-01/02/03 ya publicados, no volver a pedir autorización ni implementar esas funciones como nuevas.

DocumentNavigator lee el contexto de la página, con padre/hermanos/hijos/anterior/siguiente; árbol completo opcional. Migas arriba, árbol lateral. /AstroXmind/navegacion/ muestra tres demos con fuente única y la serie de artículos de una misma carpeta. Diez documentos y catorce referencias; no temario público. El parent de serie es doc-000010, no directamente inicio.

La raíz pasa 32 pruebas de dominio/referencias, 15 de HTML/DOM y una reconstrucción adicional con dos builds/cache. CI normal ejecuta 47, no la adicional. La instalación local auditada usa Node 24.22.1; CI usa Node 22. Laboratorio check/build pasa tras preparar la raíz; el check no está completamente aislado de su TypeScript y falló al ejecutarlo durante preparación paralela. Registrar esa deuda, no ocultarla.

## Siguiente desarrollo

Explicar NAV-04 y solicitar autorización antes de implementar: referencias salientes y backlinks automáticos con contexto y salto al punto de cita. references.json ya contiene source/target/fragment/href, pero no una UI de backlinks ni un ancla estable para cada cita. No confundir el botón Atrás del navegador con NAV-05 de retorno exacto.

Summary/Boundary siguen aplazados; biblioteca al final. No iniciar una funcionalidad para aprovechar el encargo de documentación. La aprobación anterior de publicar NAV-01/02/03 no es permiso para futuras modificaciones de main, PRs o releases.

## Fuentes críticas

- TreeTable: examples/astro-component-lab/src/components/TreeTable.astro, compartido por ambas aplicaciones; no copiarlo a src/components.
- demos: src/examples y ComponentExample con import normal + ?raw; CSS semántico global donde se necesite.
- árbol: src/lib/navigation, scripts/navigation*.mjs, src/content.config.ts y navigation-ids.json; docs/ no pertenece al árbol público.
- UI: src/navigation-middleware.ts, DocumentNavigator y overrides de src/components/navigation.
- referencias: remark-document-references, references.mjs, rendered-references y override MarkdownContent; resolución por ID también al renderizar, porque Content Layer puede cachear href antiguo.
- destinos cerrados: TreeTable.revealTarget debe buscar celdas desprendidas del DOM y abrir únicamente el camino; reference-client activa pestaña y foco.
- build: valida rutas y HTML final y genera ambos JSON; no editar dist para corregir fuentes.
- pruebas: tests/navigation*, references, reference-client y reference-rebuild; este último copia fuentes y conserva caché sin modificar el checkout.

## Evidencia y permisos

[CI 44096661054](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44096661054), [Wiki Build 44096660778](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44096660778), [Pages 44096660802](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44096660802): success, SHA 2cdba36. Diez páginas/catorce referencias HTTP verificadas. Reseña y límites en docs/17, 19 y auditoría de esta revisión.

Conservar informes históricos, ramas antiguas y PRs abiertos #1/#2/#4/#5. No afirmar que una licencia/auditoría informativa verde resuelve toda la distribución. No hay revisión visual completa. No programar seguimientos posteriores sin petición. Para desarrollo/edición crear rama desde el estado remoto confirmado y compartir evidencia por SHA; publicar solo con autorización aplicable.
