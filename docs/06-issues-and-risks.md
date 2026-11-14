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

## INC-002 · Sidebar de guía (2026-11-14)

- Fallo en [43591525345](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43591525345): `AstroUserError: The slug "guia-estudio" specified in the Starlight sidebar config does not exist`.
- Corrección: `link: '/guia-estudio/'` en lugar de `slug: 'guia-estudio'`, commit `a3b61547957da4015fa7371af77a0bc298011cd4`.
- Estado: pendiente de confirmación de compilación posterior.

## INC-003 · GitHub Pages no habilitado (2026-11-14)

- Workflow [43592193295](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43592193295): build **success**, deploy **failure**.
- Error: `Failed to create deployment (status: 404)`; el log indica `Ensure GitHub Pages has been enabled`.
- Acción del propietario: abrir https://github.com/PabloGonzalezRuiz/AstroXmind/settings/pages y seleccionar `Build and deployment → Source → GitHub Actions`.
- Estado: bloqueada por configuración de GitHub Pages; después, repetir el workflow y verificar la URL publicada.

### Resolución INC-003

El usuario habilitó GitHub Pages; rerun [43592285017](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43592285017), intento 2, terminó con `success` en `build` y `deploy`. Incidencia de despliegue **resuelta**. Navegación visual aún por verificar.
