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

## Tarea 1 — comprobación documental de licencias y avisos (2026-11-14)

Versiones fijadas en el lockfile: `sharp@0.35.5` (Apache-2.0), `@img/sharp-libvips-linux-x64@1.3.4` (LGPL-3.0-or-later), `lightningcss@1.33.0` (MPL-2.0), `lightningcss-linux-x64-gnu@1.33.0` (MPL-2.0). Las variantes de plataforma son opcionales, salvo el paquete principal `lightningcss`.

**Fuentes examinadas**:
- `sharp-libvips` publica avisos de terceros: https://github.com/lovell/sharp-libvips/blob/main/THIRD-PARTY-NOTICES.md ; el paquete npm `@img/sharp-libvips-linux-x64@1.3.4` declara LGPL-3.0-or-later y enumera bibliotecas de terceros: https://www.npmjs.com/package/%40img/sharp-libvips-linux-x64?activeTab=readme . No todas esas bibliotecas tienen licencia LGPL; hay también licencias permisivas y otras condiciones.
- `lightningcss` declara MPL-2.0 en su `package.json` oficial, versión 1.33.0: https://github.com/parcel-bundler/lightningcss/blob/master/package.json . Texto de licencia MPL-2.0: https://third-party-mirror.googlesource.com/lightningcss/+/refs/heads/master/LICENSE .

**Evaluación provisional**: No se ha identificado en estos metadatos una prohibición automática de publicar el código propio de AstroXmind bajo MIT. La licencia LGPL/MPL cubre los componentes correspondientes, y deben preservarse los avisos y condiciones aplicables cuando se redistribuyen. El repositorio fuente `main` de terceros puede cambiar: cotejar los archivos `LICENSE`/`NOTICE` incluidos en los paquetes exactos instalados antes de afirmar cumplimiento por versión.

**Pendiente para cerrar la tarea 1**: extraer e inspeccionar los archivos `LICENSE`, `NOTICE` y avisos empaquetados de las versiones npm concretas, y cruzarlos con el contenido realmente distribuido en `dist/` (tarea 2). No se ha hecho todavía inspección byte a byte de esos paquetes. **Estado: revisión documental iniciada, cierre pendiente.**
