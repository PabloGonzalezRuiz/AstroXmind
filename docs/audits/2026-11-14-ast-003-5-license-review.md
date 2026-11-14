# AST-003.5 — Revisión de metadatos de licencias de la candidata

Fecha: 2026-11-14. Rama: `security/ast-003-5-dependency-upgrade`.

## Método y límites

Inspección directa del objeto `packages` de `package-lock.json` (blob `1254c0064fe98f959398b0a3fdc113d004e045bf`), excluyendo la raíz. Los metadatos del lockfile **no constituyen una revisión jurídica** de las licencias ni acreditan qué binarios o código se redistribuyen efectivamente en `dist/`. Los paquetes opcionales pueden ser específicos de plataforma y no instalarse todos en un mismo entorno.

## Inventario

- Paquetes: **442**.
- Metadatos de licencia ausentes: **0**.
- MIT: 367; ISC: 14; Apache-2.0: 17; BSD-2-Clause: 8; BSD-3-Clause: 4; BlueOak-1.0.0: 3; CC0-1.0: 2; 0BSD: 1.
- LGPL-3.0-or-later: 10; Apache-2.0 AND LGPL-3.0-or-later AND MIT: 1; Apache-2.0 AND LGPL-3.0-or-later: 3.
- MPL-2.0: 12.
- **26 entradas** requieren revisión adicional por ser licencias copyleft o expresiones compuestas: 14 variantes `@img/sharp-*` y 12 paquetes `lightningcss*`.
- De las 26, **25 son opcionales** según los metadatos; `lightningcss` no lo es. Esta clasificación no determina por sí sola qué se distribuye.

## Observaciones y riesgos

1. La licencia MIT del proyecto corresponde al código propio, copyright (c) 2026 Pablo González Ruiz. No relicencia dependencias.
2. Las variantes `@img/sharp-libvips-*` y `@img/sharp-*` incluyen LGPL-3.0-or-later en sus metadatos; revisar archivos LICENSE, avisos y obligaciones pertinentes si se distribuyen binarios.
3. `lightningcss` y variantes de plataforma declaran MPL-2.0; revisar qué archivos fuente cubiertos, si los hay, se distribuyen o modifican.
4. Antes de cerrar cumplimiento: inspeccionar los archivos LICENSE/NOTICE de las versiones instaladas, la composición real de `dist/`, avisos de atribución y la forma de distribución. Evitar asumir que dependencias de compilación se entregan a usuarios.
5. Resultado de seguridad distinto: run [43618220633](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43618220633) superó `npm audit --audit-level=low`; no es una certificación de licencias.

## Estado

**Inventario de metadatos terminado; revisión de obligaciones de redistribución pendiente.** AST-003.5 sigue abierta. No fusionar PR #1 ni publicar release únicamente sobre esta evidencia.
