# Punto de reanudación de AstroXmind

Última revisión: 16-11-2026. Léase primero al retomar.

## Estado comprobado

- Repositorio: https://github.com/PabloGonzalezRuiz/AstroXmind; rama principal `main`.
- `main` al iniciar AST-017: `7bf4535eed87f379f3a356425ef951868bc717ad`.
- Rama de trabajo: `feature/ast-017-level-classes`; commits y archivos de estado están en esa rama.
- Wiki: https://pablogonzalezruiz.github.io/AstroXmind/.
- `remark-directive`, plugin semántico, tablas árbol, clases particulares por encabezado y YAML `xmind` están en main.
- AST-017 está implementada en la rama: `yaml clases` asigna clases CSS por nivel, fusiona clases locales sin duplicados y rechaza niveles o nombres de clase mal formados. Se añadió un ejemplo de galería.
- Esta rama todavía no se ha compilado ni validado en Actions; no está integrada y no cambia la wiki publicada.
- La conversión real a XMind y los presets completos con herencia aún no están implementados.
- Se contrastó el repositorio MarkXMind y la guía `XMindMark Syntax Guide.xmindmark` adjunta; ambos describen el mismo conjunto de elementos. Recomendación: modelo intermedio propio y posible adaptador futuro, no cambio de sintaxis base.
- En la base de código auditada, el script de pruebas del PR #5 no está integrado.

## Próximos pasos recomendados

1. Revisar AST-017 en `feature/ast-017-level-classes`; confirmar sintaxis, edge cases, CI y compilación. Solo después decidir integración.
2. PR #5 sigue en borrador; ambos checks pasaron para el SHA `51c9b694dd16edc758d9ed39e810330817005039`, pero no se ha integrado.
3. Después modelar los elementos MarkXMind de AST-018 a partir de `docs/12-markxmind-compatibility.md`.
4. Mantener AST-013 de presets XMind y AST-015 de exportación como tareas separadas; no suponer que MarkXMind resuelve la fidelidad de nuestra tabla árbol.
5. Revisar y actualizar estado, registro, hoja de ruta y continuidad al cerrar cada paso.

## Riesgos y pendientes

- PR #1: reevaluar actualización Astro/Starlight, seguridad, conflicto y checks del head actual.
- PR #2: revisar licencia y procedencia del material TAI; repo y Pages son públicos.
- PR #4: verificar y reconciliar documentación heredada.
- PR #5: borrador no integrado; checks exitosos para el SHA indicado, base anterior a `main` actual.
- El workflow de Pages tiene deuda heredada que está anotada en el informe de auditoría anterior.

## Comandos locales

```sh
npm ci
npm run check
npm run build
```

Requiere Node.js 22.
