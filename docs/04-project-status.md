# Estado real del proyecto

Auditado el 18-11-2026 sobre main `f3e2259d76ff62c2949b29a01292cd988b4b3e99`, sin cambios posteriores a la corrección de numeración. La wiki y la corrección están publicadas. Esta revisión solo actualiza documentación en rama; no añade funcionalidad ni despliega. [Informe](audits/2026-11-18-application-state.md).

## Entregado y comprobado

Wiki estática Astro/Starlight/MDX: diez documentos técnicos/de prueba, catorce referencias y catorce demos Resultado/Código. TreeTable incluye clases por nivel/nodo, plegado heredable, estado folded, numeración heredable con start local, reinicio tras padre sin número y pantalla completa centrada con scroll. NAV-01/02/03 publicados: IDs permanentes, jerarquía independiente de carpetas, migas, árbol, DocumentNavigator y referencias a documentos/apartados/nodos plegados.

order es opcional y determina posición, no el número literal. 10/20/30 se muestra 1/2/3 y 10/10/30 se muestra 1/1/2. Empates por created o fallback modified exclusivamente YAML con milisegundos/zona y finalmente ID. Pendientes al final y sin número; raíz neutra; padre sin order corta el prefijo. [Contrato](20-navigation-ordering.md).

| Documento | Número publicado |
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

## Evidencia

[CI 44130965495](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44130965495), [Wiki Build 44130965520](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44130965520) y [Pages 44130965464](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44130965464): completed/success, todos sobre f3e2259.

Comprobación pública del 18-11: diez rutas HTTP 200; navigation.json schemaVersion 2 con los números anteriores y references.json con catorce referencias. Reinstalación limpia y check/build locales correctos: 43 pruebas de dominio, 16 HTML/DOM y Astro check sin errores, avisos ni hints. Las dos integraciones adicionales completan 61 pruebas. Detalle y límites en [validación](07-test-and-audit.md).

## Pendiente

NAV-04 está publicado en d8cb7aa y el usuario confirmó su funcionamiento: enlaces salientes y backlinks con contexto y salto a la cita. [Guía de prueba](23-reference-relations.md). NAV-05 recupera posición, foco, pestañas y plegado al volver de una cita. El usuario confirmó el recorrido de retorno desde Artículo 2 a la cita de TreeTable en Navegación. Publicado en 3b2739c y confirmado por el usuario. NAV-06 genera HTML autónomo para la rama y permite imprimir desde el navegador. El usuario confirmó su funcionamiento en la copia local de Windows. Integrado en main tras la autorización del usuario. Después: consulta lateral y grafo opcional. [Hoja de ruta](03-roadmap.md).

Deudas: aislamiento TypeScript del laboratorio; validación visual/móvil/fullscreen real; listas múltiples y escala; revisión de ambos lockfiles. PRs #1/#2/#4/#5 siguen abiertos y separados. Summary/Boundary aplazados; biblioteca de componentes al final. Editor persistente, login, exportador XMind siguen pendientes.
