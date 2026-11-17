# Registro de tareas

Auditado el 17-11-2026 sobre `main`, commit `e7bfb8e7f41ec5637c685e62698eb12b7ab1b658`.

| ID | Tarea | Estado |
|---|---|---|
| AST-001 / 019 / 020 | Wiki, TreeTable y laboratorio | Publicados |
| AST-021 / 022 | Numeración y corchetes sin escapes | Publicados |
| AST-025 | Plegado heredable | Publicado |
| AST-026 | Numeración heredable, start local | Publicada |
| AST-017 | Clases por nivel y nodo | Publicadas en MDX; rama Remark antigua no integrada |
| AST-028 | Estado inicial plegado/desplegado | Implementada en rama; pendiente de integración |
| AST-029 | Revisión de interacción, móvil y parser | Pendiente |
| AST-012 | Regresiones persistentes adaptadas a MDX | PR #5 anterior, no integrado |
| AST-003.5 | Seguridad y dependencias | PR #1 pendiente de reevaluación |
| AST-018 | Summary y Boundary | Aplazados hasta después de AST-028 |
| AST-023 | Presets/exportación XMind | No implementados |
| AST-024 | Publicación de temario | Aplazada |
| AST-027 | Biblioteca reutilizable | Último hito de la hoja de ruta |
| DOC-001 | Auditoría documental 17-11 | Preparada en rama separada; no integrada por este encargo |

AST-021 no se reasigna al estado inicial aunque aparezca en el nombre de su rama. AST-022 no se reasigna a metadatos semánticos. AST-028 identifica el estado inicial sin colisión.

## PRs abiertos

| PR | Tema | Estado comprobado | Tratamiento |
|---|---|---|---|
| #1 | Actualización de seguridad Astro/Starlight | Borrador; head 9009ca9 | Revalidar sobre base actual |
| #2 | Prácticos TAI | Borrador; head 12e6279 | Aplazado fuera de Pages |
| #4 | Documentación de arquitectura | Abierto; head 813456e | Reconciliar con arquitectura vigente |
| #5 | Regresiones Markdown | Borrador; head 51c9b69 | Evaluar cobertura del TreeTable MDX |

No se han modificado PRs ni disparado Actions en esta auditoría. No se ha comprobado mergeabilidad; abierto no implica ausencia ni presencia de conflictos.

## AST-028 · Estado inicial y botón compacto — implementación en rama

Implementado el 17-11-2026 en feature/ast-028-folded-compact-toggle. No integrado ni publicado por este encargo.

- Prop global folded=true/false (booleano o cadena true/false); valor predeterminado false. Sufijo de nodo [folded=true] o [folded=false], heredable y sobrescribible.
- Collapsible sigue siendo la capacidad de plegado. False mantiene el nodo abierto, aunque folded continúa siendo configuración heredable para descendientes que reactiven collapsible=true. Las hojas no tienen botón. Un hijo abierto bajo un padre cerrado aparece al abrir ese padre.
- Se genera toda la tabla en servidor; el cliente lee los estados efectivos y recalcula filas al iniciar. Sin JavaScript se conserva todo el contenido, sin botones inactivos.
- Botón absoluto arriba a la izquierda (0.2rem), tamaño visual 1rem, símbolo 0.75rem. Reserva superior para evitar solapamiento con texto; no ocupa espacio en línea. Se conserva/restaura foco del botón al reconstruir filas.
- Ejemplos en página TreeTable y sandbox; numeración y clases conservadas. Summary/Boundary aplazados; biblioteca sigue al final.
- Check Astro: 0 errores/avisos. Builds de wiki y laboratorio correctos. Comprobación DOM de estado inicial, herencia, excepciones, collapsible=false, restauración de estado/foco, celdas, aislamiento entre tablas y fallback sin JS correcta. CSS compacto verificado por lectura; no revisión visual en navegador porque Chromium falló al iniciar (socket no permitido). No se ha ejecutado Actions de esta rama.

| AST-030 | Ejemplos de componentes en pestañas Resultado/Código | Implementado y validado localmente; publicar con este cambio |

AST-028 está publicado en main a6bd581 desde el despliegue 44042997074; no está pendiente de integración.

AST-032: pantalla completa por tabla, implementada y validada localmente; integración solicitada como mejora de wiki.
