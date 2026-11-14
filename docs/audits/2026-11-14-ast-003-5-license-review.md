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

## Tarea 1 — contraste de fuentes versionadas (2026-11-14)

Se consultaron directamente en GitHub los archivos de las etiquetas **exactas** de las dependencias, no solo su rama principal:

- `lovell/sharp-libvips@v1.3.4`, `THIRD-PARTY-NOTICES.md`: blob `e6e343ff638ba6d444e1b5b2d66098bf0e9df098`, https://github.com/lovell/sharp-libvips/blob/v1.3.4/THIRD-PARTY-NOTICES.md . El documento identifica bibliotecas LGPLv3 (fribidi, glib, libexif, libheif, librsvg, libvips, pango, proxy-libintl), MPL-1.1 (cairo) y otras licencias permisivas o específicas. La lista evidencia que no basta con etiquetar todo el conjunto como LGPL.
- `parcel-bundler/lightningcss@v1.33.0`, `LICENSE`: blob `89fe5b2004873b5f5237874446f65df5c02f9dc2`, https://github.com/parcel-bundler/lightningcss/blob/v1.33.0/LICENSE . Contiene el texto Mozilla Public License 2.0. El paquete `lightningcss@1.33.0` declara MPL-2.0 en el lockfile.
- `sharp@0.35.5` declara Apache-2.0; `@img/sharp-libvips-linux-x64@1.3.4` declara LGPL-3.0-or-later. Son metadatos del lockfile, no inspección de archivos internos del tarball.

**Limitación de la comprobación:** se verificaron los documentos versionados del repositorio fuente, pero no se descargaron ni abrieron los tarballs npm exactos. La descarga desde el entorno de análisis no fue accesible. Por ello no se puede certificar que todos los avisos se incluyan efectivamente en cada paquete npm ni que se distribuyan en el sitio final.

**Resultado:** subcomprobación de fuentes versionadas completada. La tarea 1 sigue **abierta** para contrastar archivos dentro de los tarballs, cuando haya acceso, y confirmar obligaciones según la distribución real (tarea 2). Ninguna conclusión jurídica definitiva ni autorización de fusión/release.

## Automatización de evidencia exacta — 2026-11-14

Se incorporó el workflow `.github/workflows/ast-003-5-license-evidence.yml` y el script `scripts/license_distribution_evidence.py` a la rama candidata. La ejecución por push instala con `npm ci`, genera `dist/`, descarga con `npm pack --ignore-scripts` las versiones exactas de `sharp`, `@img/sharp-libvips-linux-x64`, `lightningcss` y `lightningcss-linux-x64-gnu`, registra rutas y hashes SHA256 de LICENSE/NOTICE y crea inventario del sitio estático. Publica el artefacto `ast-003-5-license-distribution-evidence` y resumen del job.

**Estado de la evidencia:** workflow y script incorporados en commits `3e6b2aa` y `6e366cc`; ejecución y artefacto **todavía no verificados**. Antes de cerrar tarea 1, comprobar jobs, logs y reporte; si fallan, corregir solo en rama candidata. No inferir éxito por el mero push.

## Incidencia CI 43619684157 y corrección — 2026-11-14

- Job [132522296359](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43619684157/job/132522296359): `npm ci` y `npm run build` correctos (7 páginas); se inventariaron 39 archivos de `dist/` y se publicó artefacto 14123143604.
- Hallazgo comprobado en el tarball exacto `@img/sharp-libvips-linux-x64@1.3.4`: 6 archivos, **ningún archivo LICENSE/NOTICE**. En los otros tres paquetes inspeccionados sí se encontró LICENSE.
- Causa del fallo: `scripts/license_distribution_evidence.py` trataba la falta de archivo como error de recopilación y terminaba con código 1. Se separó el hallazgo de cumplimiento (`findings`, no fatal) de los fallos técnicos reales (`issues`, fatal), en commit `fcc2b7e`. También se corrigió la representación de comillas Markdown en rutas/hashes.
- **Pendiente** verificar una nueva ejecución del workflow tras el commit y comprobar artefacto actualizado. La falta de LICENSE/NOTICE en el tarball sigue abierta como riesgo de cumplimiento; un workflow verde no la subsana.

## Verificación visual de la tercera ejecución — 2026-11-14
La captura facilitada por el usuario muestra **success** (marca verde) para la ejecución #3 del workflow `AST-003.5 · License and distribution evidence`, asociada al commit `fcc2b7e` y duración 26 s. La ejecución #2 y #1 permanecen fallidas históricamente. Esta comprobación visual confirma el resultado global del workflow, **no** acredita por sí sola el contenido del artefacto #3 ni resuelve el hallazgo de licencia ausente en el tarball `@img/sharp-libvips-linux-x64@1.3.4`. Queda pendiente contrastar los archivos del artefacto y sus conclusiones antes de cerrar AST-003.5.

## Ejecución #3 confirmada mediante GitHub — 2026-11-14
- Run: https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43619924759 ; job `132523070254`, `completed/success`, commit `fcc2b7e41455f60aba1f50174d00e656411dd062`.
- Todos los pasos correctos: checkout, setup-node, `npm ci`, build, inspección de tarballs, resumen y subida de evidencias.
- Artefacto publicado `ast-003-5-license-distribution-evidence`, ID `14123688008`, 16141 bytes, SHA256 del ZIP `9f863f58562af52597fb12e79c0ff615d67c00b621aff09601e6be089598827a`.
- Log confirma inventario de **39 archivos** en `dist/` (7 HTML, 13 JS, 6 CSS y otros 13 archivos). La inspección técnica concluyó correctamente.
- **Pendiente de aceptación**: revisar el informe completo del artefacto y resolver el hallazgo de LICENSE/NOTICE ausente en `@img/sharp-libvips-linux-x64@1.3.4`. Un resultado `success` no certifica cumplimiento jurídico ni ausencia de código de terceros en el sitio.
- Avisos no bloqueantes: acciones GitHub v4 con Node 20 obsoleto; `punycode` y `url.parse()` deprecados. Continuar con revisión de workflows y distribución.

## AST-003.5 — Inspección de la distribución ampliada (2026-11-14)
- Autorización recibida para continuar la auditoría técnica, sin autorización de merge o release.
- Script de evidencias ampliado en commit `6766bcf`: manifiesto `dist-manifest.json` con SHA-256 y tamaño por archivo; detección básica de cabeceras ELF, PE, WebAssembly y Mach-O en `dist/`.
- La ejecución #3 previa, run 43619924759, generó 39 archivos en `dist/` y artefacto 14123688008. Ese run **no incluye** el análisis de firmas ni los hashes incorporados posteriormente.
- **Pendiente** verificar el nuevo run y leer el informe/artefacto generado antes de concluir si hay binarios distribuibles. La ausencia de coincidencias no prueba ausencia de código embebido ni certifica cumplimiento.
- Riesgo abierto: el tarball `@img/sharp-libvips-linux-x64@1.3.4` carece de archivo LICENSE/NOTICE reconocido. Revisar avisos upstream y obligaciones si se redistribuye.

## Validación de ejecución #4 — 2026-11-14
- Run [43621113142](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43621113142), job [132526784815](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43621113142/job/132526784815), commit `6766bcf50537957fa72224f84f0eec65ca704dc4`: **completed/success** en todos los pasos.
- Artefacto `ast-003-5-license-distribution-evidence`, ID `14124261138`, 18588 bytes, SHA256 ZIP `c206a55850102594e456c48641097109a47b4dc2b18b38069756825427dbb098`. Enlace: https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43621113142/artifacts/14124261138 .
- Log confirma 39 archivos en `dist/` (7 HTML, 13 JS, 6 CSS y 13 otros) y comprobación de 4 tarballs exactos. Tres incluyen archivo LICENSE; `@img/sharp-libvips-linux-x64@1.3.4` no incluye LICENSE/NOTICE reconocido.
- El script ampliado genera un manifiesto SHA256 y examina cabeceras binarias, pero **no se ha inspeccionado aún el contenido completo del artefacto** para certificar el resultado de las firmas. No afirmar ausencia de binarios basándose solo en el estado verde.
- Aviso no bloqueante en los logs: actions v4 basadas en Node 20 obsoleto; programar actualización a versiones compatibles.
- Estado: validación técnica de workflow completada; hallazgo de avisos de tercero y evaluación final de redistribución pendientes. No merge/release.

## Mitigación de advertencias de Actions — 2026-11-14
Se verificaron los metadatos `action.yml` de versiones oficiales: `actions/checkout@v5` y `actions/setup-node@v5` usan Node 24; `actions/upload-artifact@v6` usa Node 24 (v5 todavía declara Node 20). Se actualizaron los workflows de la rama candidata: `.github/workflows/ast-003-5-license-evidence.yml` (commit `1c694da`) y `.github/workflows/security-upgrade-candidate.yml` (commit `d2d88f9`). **Pendiente** verificar la nueva ejecución y logs; no afirmar corrección definitiva hasta verificación. No se modificó `main`.
