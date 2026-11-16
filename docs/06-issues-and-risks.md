# Incidencias y riesgos actuales

Base auditada: `6aff07e65b8cbd8e89f56a2f9a39d04f5a0af372`, 16-11-2026.

| Riesgo | Estado y acción |
|---|---|
| Documentación divergente | Esta rama corrige SHAs, PR #8, alcance y duplicidad AST-022; main conserva la documentación anterior hasta integrar |
| Dos implementaciones de árbol | TreeTable MDX activo frente a scripts Remark heredados; adaptar AST-017 al componente publicado |
| Clases por nivel | Hay clases fijas nivel-N; mapa configurable pendiente de adaptación y validación |
| Summary/Boundary | No implementados; diseñar agrupaciones, IDs y referencias antes del renderer |
| Seguridad | PR #1 abierto; auditoría anterior correcta no acredita el HEAD actual ni resuelve automáticamente el PR |
| Regresiones | PR #5 abierto sobre base anterior; CI actual comprueba tipos/build, no cobertura funcional completa |
| Presets y exportación | No implementados; YAML heredado no genera .xmind |
| Contenido TAI | PR #2 abierto y temario fuera de Pages; GitHub e historial siguen públicos |
| Sandbox | Copia aislada sin sincronización GitHub |

El workflow de Pages actual verifica las cuatro rutas de componentes. La deuda antigua sobre Tabulator no debe presentarse como una incidencia vigente sin volver a comprobar el archivo actual.

## Operación

No modificar main, abrir/fusionar PR ni publicar releases sin aprobación. Mantener los informes históricos como evidencia fechada, no como estado vigente.
