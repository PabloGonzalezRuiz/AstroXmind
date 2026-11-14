# Incidencias y riesgos

| ID | Riesgo | Estado | Mitigación |
|---|---|---|---|
| RSK-001 | Documentación desactualizada | Abierto | Comprobar Git y actualizar continuidad en cada tarea |
| RSK-002 | Contenido TAI desactualizado o sin licencia clara | Abierto | Auditoría previa a la importación |
| RSK-003 | Incompatibilidad entre PMD y visor XMind | Futuro | Prototipo aislado y pruebas con archivos reales |
| RSK-004 | Confundir CI verde con producto estable | Abierto | Criterios de aceptación y pruebas de despliegue |

Incidencias nuevas: registrar síntoma, reproducción, impacto, causa conocida o desconocida, solución, evidencia y fecha de cierre.

## INC-001 · Sidebar Starlight (2026-11-14)

- Síntoma: build [43591434053](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43591434053) falló con `AstroUserError: The slug "" specified in the Starlight sidebar config does not exist`.
- Causa: entrada de portada con `slug: ''`.
- Corrección aplicada: reemplazo por `link: '/'` en `astro.config.mjs`, commit `5da231c9382b2a47dcc9866ceb837bb8f1e9ddf4`.
- Estado: corrección implementada, pendiente de verificar en CI [43591505229](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43591505229).
