# Incidencias y riesgos vigentes

Contrastados el 18-11-2026 con main publicado f3e2259. [Estado](04-project-status.md), [operación](19-operations-and-verification.md). Distinguir límites observados de funcionalidades planificadas; no reabrir como pendientes los errores corregidos.

| Área | Situación y tratamiento |
|---|---|
| Estado documental anterior | Auditoría del 18-11 concilia SHA, pruebas y entregas ya publicadas; evitar apéndices de estados incompatibles y mantener una referencia actual única |
| Aislamiento TypeScript del laboratorio | Sin tsconfig propio; el check alcanzó middleware raíz y falló durante preparación paralela. Tras preparar raíz pasa. Documentar orden y resolver aislamiento en robustez, con alcance autorizado |
| Parser de listas TreeTable | Procesa la primera sublista por nodo; revisar listas múltiples y árboles grandes |
| Árbol vs referencias | Padre único/order para pertenencia; referencias cruzadas no crean hijos. Validación de ciclos/padres/IDs ya implementada |
| ID y URL | Identidad explícita estable; renombrar sigue resolviendo al reconstruir/renderizar. No existen redirecciones automáticas de URL antigua |
| Caché Markdown | Fallo de href antiguo corregido con resolución en MarkdownContent y regresión de dos builds; no retirar esa defensa |
| Reserva de IDs entre ramas | El bloqueo protege un registro local, no reservas distribuidas. Evitar colisiones al integrar y no reutilizar IDs publicados/retirados |
| Escala y locales | Relectura del registro por render y ámbito root locale; medir antes de prometer rendimiento multilingüe o árboles muy grandes |
| IDs repetidos y destinos ausentes | Validación de tabla/HTML real ya activa. Para exportar varias páginas hará falta namespace por documento |
| Retorno al origen | Hash y foco de destino implementados; restaurar scroll/pestaña/plegado de origen sigue pendiente NAV-05 |
| Impresión y offline | No implementados: evitar tablas recortadas, referencias ambiguas y prometer que dist funciona autónomo sin red |
| Interacción visual | DOM no acredita scroll real, fullscreen nativo, móvil/táctil o revisión visual completa; mantener esa cobertura pendiente |
| Publicación automática | Push autorizado de main dispara workflows; Pages depende de su build, no del workflow CI independiente. Verificar ambos y HTTP |
| Auditoría informativa | Verde no significa cero avisos. Script analiza metadatos/avisos raíz; laboratorio necesita revisión propia |
| Licencia de raíz | Sin LICENSE versionado ni campo license en package.json auditado; no describir una certificación inexistente ni bloquear este encargo documental con trabajo de distribución |
| Scripts y fuentes históricas | Pandoc/Remark/galerías permanecen fuera del pipeline; no activarlos para instalar la versión vigente |
| PRs/ramas antiguos | #1, #2, #4 y #5 abiertos; no fusionar/cerrar ni atribuirles capacidades actuales automáticamente |
| Editor/StackBlitz | Copia aislada sin persistencia en la wiki ni sincronización automática con GitHub |

Corregidos y publicados: 404 por colección ausente, enlaces sin base, numeración reactivada con prefijo erróneo y URLs de referencias cacheadas tras renombrado y prefijos literales de order en navegación (10/30.30 → ordinales consecutivos). Summary/Boundary y backlinks automáticos siguen pendientes; IDs locales y referencias a nodos ya están publicados.
