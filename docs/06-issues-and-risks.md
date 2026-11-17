# Incidencias y riesgos

Auditado el 17-11-2026 sobre `main`, commit `e7bfb8e7f41ec5637c685e62698eb12b7ab1b658`.

| Hallazgo | Evidencia | Acción pendiente |
|---|---|---|
| Documentación contradictoria | Notas de integración junto a textos no publicado | Sustituida por estado consolidado en esta rama |
| Estado inicial no configurable | Props/parser sin folded; collapsed empieza vacío | AST-028 primero |
| Pruebas funcionales no persistentes en main | CI comprueba tipos/build; PR #5 antiguo abierto | Adaptar cobertura a MDX |
| Revisión visual/teclado pendiente | HTTP y DOM no acreditan interacción visual/accesible completa | Revisar foco al reconstruir tbody, móvil y árboles grandes |
| Parser parcial | parseList toma solo primera lista anidada; anotación con solo claves desconocidas no se reconoce | Especificar/rechazar casos para no perder contenido silenciosamente |
| Auditoría informativa | npm audit captura código; script genera informe sin fallar por severidad | Revisar PR #1 y política de bloqueo; no afirmar cero vulnerabilidades |
| Dos lockfiles | Raíz y laboratorio independiente | Incluir ambos en futuras auditorías |
| Ramas y PRs heredados | PRs #1, #2, #4 y #5 siguen abiertos | Reconciliar antes de integrar, sin cerrar automáticamente |
| Semántica XMind pendiente | Sin exportador ni modelo Summary/Boundary | Mantener como fases futuras |
| Visibilidad de fuentes | Pages limitado pero GitHub público | No tratar retirada de rutas como privatización |

Esta auditoría no cambia código, dependencias, ramas existentes, PRs ni publicación. Los límites del parser se deducen por lectura del código y no se presentan como fallos reproducidos en navegador.
