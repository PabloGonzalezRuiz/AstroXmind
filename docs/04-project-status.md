# Estado real del proyecto

Auditado el 17-11-2026 sobre main `2cdba361920b58a5002faa063e46660f22ff36ef`. La ampliación de ordenación se prepara en rama junto con la documentación integral previa; el producto publicado se mantiene en ese SHA. [Arquitectura](02-architecture.md), [reconstrucción](10-manual-reconstruccion.md), [historia](18-development-history.md).

## Implementado y publicado

Astro 5/Starlight/MDX, salida estática GitHub Pages bajo /AstroXmind. Diez páginas: cuatro técnicas originales, Navegación, una serie y cuatro artículos ficticios de prueba. Catorce referencias renderizadas y catorce demos Resultado/Código. No temario, backend, login, editor persistente ni paquete npm publicado.

| Área | Entregado |
|---|---|
| AST-017/022 | Clases por nivel/nodo y anotaciones entre corchetes sin escapes |
| AST-025/028 | Plegado heredable y estado inicial folded; botón compacto flotante |
| AST-026/031 | Numeración/tiered heredables, start local y ruta reiniciada tras padre sin número |
| AST-030 | Ejemplos con fuente única importada + ?raw y pestañas Resultado/Código |
| AST-032/033 | Fullscreen contextual, centrado si cabe y scroll accesible si excede |
| NAV-01 | IDs editoriales reservados, parent/order, árbol validado y navigation.json |
| NAV-02 | Migas arriba, árbol lateral y navegación contextual |
| NAV-03 | Referencias estables, IDs locales, DocLink, DocumentNavigator y revelado de destino plegado/pestaña |

La serie usa archivos distintos de una misma carpeta. Cambiar un parent mueve la rama completa sin mover archivos, cambiar IDs/URLs ni editar descendientes. Árbol de pertenencia y red de referencias permanecen separados.

## Evidencia por SHA

- [CI 44096661054](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44096661054): success en 2cdba36.
- [Wiki Build 44096660778](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44096660778): success en 2cdba36.
- [Pages 44096660802](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44096660802): success en 2cdba36.
- [Auditoría 44096660856](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44096660856): informe generado; no certifica ausencia de vulnerabilidades.
- Verificación HTTP/HTML/JSON de publicación: diez páginas correctas y catorce referencias/destinos. [Demo](https://pablogonzalezruiz.github.io/AstroXmind/navegacion/).

## Validación de instalación y limitaciones

Se repitieron npm ci/check/build y test:references:rebuild en la raíz del checkout limpio durante esta revisión. Las 48 pruebas pasan (32 + 15 + 1). CI ejecuta 47 sobre Node 22; la regresión adicional se lanza explícitamente. La ejecución local de esta revisión usa Node 24.22.1; no se presenta como una ejecución local Node 22.

Laboratorio: npm ci correcto. Se observó un fallo de tipos si se comprobaba mientras la raíz aún se preparaba; tras completar la raíz, check/build correctos. Sin tsconfig propio, su análisis puede alcanzar archivos raíz. Documentado como deuda de aislamiento, sin cambiar código. No hay revisión visual completa ni prueba acreditada de scroll real/fullscreen nativo/táctil. [Límites](19-operations-and-verification.md).

## Pendiente y separado

NAV-04 es el siguiente desarrollo: citas salientes y backlinks automáticos con contexto y salto al origen de cita; no autorizado todavía. NAV-05 retorno exacto; NAV-06 impresión/HTML autónomo; NAV-07 consulta lateral; NAV-08 grafo opcional. Después robustez/seguridad, Summary/Boundary aplazados, exportación XMind, editor y contenido. Biblioteca AST-027 último hito.

PRs abiertos verificados: #1 seguridad, #2 prácticos, #4 documentación antigua y #5 regresiones de línea anterior. No se han fusionado/cerrado. Prototipos Pandoc/Remark/Tabulator/Markmap no forman parte del pipeline activo. XMind es referencia, no exportador implementado.

## Implementado en rama: orden opcional y fechas YAML

El usuario autorizó omitir order, colocar esos hermanos al final por fecha, numerar solo órdenes explícitos y compartir número si order coincide. Aclaró que la fecha debe estar dentro del YAML junto al orden, con milisegundos. Se admiten created y modified; la primera tiene prioridad, la segunda es fallback. No se usan fechas físicas, Git, ledger ni hora del build. NavigationLabel añade numeración/marca de pendientes en todos los controles. Contrato: docs/20-navigation-ordering.md. No es NAV-04 ni está publicado.
