# Punto de reanudación de AstroXmind

Última revisión: 16-11-2026. Léase primero al retomar.

## Estado comprobado

- Repositorio: https://github.com/PabloGonzalezRuiz/AstroXmind; rama principal `main`.
- SHA de `main` usado como base de los prototipos: `7bf4535eed87f379f3a356425ef951868bc717ad`.
- Rama activa de la nueva alternativa: `feature/mdx-tree-table`; rama separada de clases por nivel: `feature/ast-017-level-classes`.
- Wiki: https://pablogonzalezruiz.github.io/AstroXmind/.
- `remark-directive`, plugin semántico, tablas árbol, clases particulares por encabezado y YAML `xmind` están en main.
- AST-017 está implementada en la rama separada `feature/ast-017-level-classes`, pendiente de validación.
- AST-019: `feature/mdx-tree-table` incluye aplicación Astro mínima `examples/astro-component-lab`, componente `TreeTable.astro`, página `.mdx` de ejemplo y enlace StackBlitz en la wiki. Permite editar y ver preview/errores en el navegador.
- PR borrador #6 abierto para `feature/mdx-tree-table` (head inicial `43a662e47bb1c1ed051607fa9dbef20b04a9a6d2`). Los dos workflows iniciales fallaron porque el orden de integraciones MDX/Starlight era incorrecto; se corrigió en `astro.config.mjs` en el commit `55ed577e519cfb61da8621c8bc39e0dac5c9e1e0`. Comprobar los workflows del head más reciente. El PR no está integrado ni desplegado.
- La conversión real a XMind y los presets completos con herencia aún no están implementados.
- Se contrastó el repositorio MarkXMind y la guía `XMindMark Syntax Guide.xmindmark` adjunta; ambos describen el mismo conjunto de elementos. Recomendación: modelo intermedio propio y posible adaptador futuro, no cambio de sintaxis base.
- En la base de código auditada, el script de pruebas del PR #5 no está integrado.

## Próximos pasos recomendados

1. Consultar los nuevos runs de `AstroXmind · CI` y `Wiki · Build` del PR #6; corregir fallos.
2. Abrir el laboratorio StackBlitz en Chrome, comprobar preview, errores y que se pueda editar el ejemplo/component.
3. Corregir el parser/algoritmo si falla el build o alguna rama desigual; después actualizar docs con SHA y checks observados.
4. Comparar AST-019 con `feature/ast-017-level-classes`; elegir el camino con menos duplicación y mejor edición.
5. Mantener la conversión XMind y los presets como tareas separadas. No publicar cambios a Pages hasta autorización de merge.

PR #6: https://github.com/PabloGonzalezRuiz/AstroXmind/pull/6. Borrador, creado para validar por PR. El primer intento detectó un error real de orden de integraciones, ya corregido; los runs del nuevo commit están pendientes.

## Workflows y despliegue

- `AstroXmind · CI` y `Wiki · Build` tienen disparador `pull_request`; permiten validar una rama mediante PR sin fusionar.
- `Wiki · Deploy GitHub Pages` se dispara con push a `main` o manualmente.
- Mergear a `main` es necesario para publicar el prototipo; el usuario no ha autorizado todavía ese paso.

## Riesgos y pendientes

- PR #1: reevaluar actualización Astro/Starlight, seguridad, conflicto y checks del head actual.
- PR #2: revisar licencia y procedencia del material TAI; repo y Pages son públicos.
- PR #4: verificar y reconciliar documentación heredada.
- PR #5: propuesta de pruebas, no asumir integrada hasta comprobar `main`.
- El workflow de Pages tiene deuda heredada que está anotada en el informe de auditoría anterior.

## Comandos locales

```sh
npm ci
npm run check
npm run build
```

Requiere Node.js 22.
