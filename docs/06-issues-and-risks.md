# Incidencias y riesgos vigentes

Actualización 22-11-2026: FrameEjemplo conserva aislamiento por instancia y separación entre fuente de documento y práctica; no persistir prácticas ni clonar editores interactivos en la vista previa documental. Scroll del inspector corregido y aceptado; mejora futura CTX-08 al final. Acciones móvil tiene corrección CSS publicada, pendiente aceptación en iPhone. [Hito](30-milestone-20261122.md).

Contrastados el 18-11-2026 con main publicado 6734829. [Estado](04-project-status.md), [operación](19-operations-and-verification.md). Distinguir límites observados de funcionalidades planificadas; no reabrir como pendientes los errores corregidos.

| Área | Situación y tratamiento |
|---|---|
| Estado documental anterior | Auditoría del 18-11 concilia SHA, pruebas y entregas ya publicadas; evitar apéndices de estados incompatibles y mantener una referencia actual única |
| Editor contextual | Evitar duplicar semántica entre catálogo/modelo, modificación de rangos incorrectos, imports duplicados, pérdida de herencia, undo parcial y ejecución de MDX arbitrario. Validar con fixtures y navegador antes de integrar; [plan](28-contextual-component-editor.md). |
| Aislamiento TypeScript del laboratorio | Resuelto en la rama de robustez mediante tsconfig propio y un trabajo CI separado. Comprobar también la integración de TreeTable en la wiki |
| Parser de listas TreeTable | La candidata conserva todas las sublistas directas en orden. Plegado y numeración verificados en DOM con 504 nodos. Falta revisión visual de desplazamiento |
| Árbol vs referencias | Padre único/order para pertenencia; referencias cruzadas no crean hijos. Validación de ciclos/padres/IDs ya implementada |
| ID y URL | Identidad explícita estable; renombrar sigue resolviendo al reconstruir/renderizar. No existen redirecciones automáticas de URL antigua |
| Caché Markdown | Fallo de href antiguo corregido con resolución en MarkdownContent y regresión de dos builds; no retirar esa defensa |
| Reserva de IDs entre ramas | El bloqueo protege un registro local, no reservas distribuidas. Evitar colisiones al integrar y no reutilizar IDs publicados/retirados |
| Escala y locales | Relectura del registro por render y ámbito root locale; medir antes de prometer rendimiento multilingüe o árboles muy grandes |
| IDs repetidos y destinos ausentes | Validación de tabla/HTML real ya activa. Las exportaciones prefijan las anclas con el ID del documento |
| Retorno al origen | Restauración implementada en NAV-05 y limitada a la sesión de la pestaña |
| Impresión y offline | NAV-06 publicado. Revisar tablas anchas e impresión física en varios navegadores |
| Interacción visual | DOM no acredita scroll real, fullscreen nativo, móvil/táctil o revisión visual completa; mantener esa cobertura pendiente |
| Publicación automática | Push autorizado de main dispara workflows; Pages depende de su build, no del workflow CI independiente. Verificar ambos y HTTP |
| Auditoría informativa | Verde no significa cero avisos. Script analiza metadatos/avisos raíz; laboratorio necesita revisión propia |
| Licencia de raíz | Sin LICENSE versionado ni campo license en package.json auditado; no describir una certificación inexistente ni bloquear este encargo documental con trabajo de distribución |
| Scripts y fuentes históricas | Pandoc/Remark/galerías permanecen fuera del pipeline; no activarlos para instalar la versión vigente |
| PRs/ramas antiguos | #1, #2, #4 y #5 abiertos; no fusionar/cerrar ni atribuirles capacidades actuales automáticamente |
| Editor/StackBlitz | Copia aislada sin persistencia en la wiki ni sincronización automática con GitHub |

Corregidos y publicados: 404 por colección ausente, enlaces sin base, numeración reactivada con prefijo erróneo y URLs de referencias cacheadas tras renombrado y prefijos literales de order en navegación (10/30.30 → ordinales consecutivos). Summary/Boundary sigue pendiente. IDs locales, referencias a nodos y backlinks están publicados.
