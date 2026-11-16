# Punto de reanudación de AstroXmind

Última auditoría y propuestas revisadas: 16-11-2026. Léase primero al retomar.

## Estado comprobado

- Repositorio: https://github.com/PabloGonzalezRuiz/AstroXmind; rama principal `main`.
- HEAD al comenzar esta actualización: `55599776c7e1a2a93456c5c8fec730039eafa634`.
- Base de código auditada: `f6fda9f743d038ab7ee08ee0b71ad65c790c34db`; los cambios posteriores hasta este punto son documentales.
- Wiki: https://pablogonzalezruiz.github.io/AstroXmind/.
- `remark-directive`, plugin semántico, tablas árbol, clases particulares por encabezado y YAML `xmind` están en main.
- Las clases por profundidad automática aún no están implementadas.
- La conversión real a XMind y los presets completos con herencia aún no están implementados.
- MarkXMind se evaluó como referencia para relaciones, límites, resúmenes, enlaces, notas y plegado; recomendación: modelo intermedio propio y posible adaptador futuro, no cambio de sintaxis base.
- En la base de código auditada, el script de pruebas del PR #5 no está integrado.

## Próximos pasos recomendados

1. Comprobar estado actual de main, Pages, Actions y PRs #1, #2, #4 y #5.
2. Revisar PR #5 y sus checks sobre el SHA actual antes de decidir integración.
3. Si las pruebas están asentadas, implementar AST-017: mapa de clases por nivel separado de `yaml xmind`. Nivel 1 = encabezados `##` debajo del título raíz `#`; clases del encabezado se agregan a las predeterminadas.
4. Después implementar el modelo semántico de AST-018 a partir del análisis en `docs/12-markxmind-compatibility.md`.
5. Mantener AST-013 de presets XMind y AST-015 de exportación como tareas separadas; no suponer que MarkXMind resuelve la fidelidad de nuestra tabla árbol.
6. Actualizar estado, registro, hoja de ruta y continuidad al cerrar cada paso.

## Riesgos y pendientes

- PR #1: reevaluar actualización Astro/Starlight, seguridad, conflicto y checks del head actual.
- PR #2: revisar licencia y procedencia del material TAI; repo y Pages son públicos.
- PR #4: verificar y reconciliar documentación heredada.
- PR #5: propuestas de pruebas, no asumir integradas hasta comprobar main.
- El workflow de Pages tiene deuda heredada que está anotada en el informe de auditoría anterior.

## Comandos locales

```sh
npm ci
npm run check
npm run build
```

Requiere Node.js 22.
