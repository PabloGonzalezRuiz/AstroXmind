# Auditoría de continuidad · 23-11-2026

Base inspeccionada: main `ce797d60d305a377a5a32d58265c7d06fd4e5869`. Inspección de código de `src/pages/privado.astro`, `src/lib/oposiciones.mjs`, `tests/oposiciones.test.mjs` y del registro anual privado (solo lectura). No se modificaron datos ni código.

## Evidencias

- [Ejecución Pages 45171108937](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/45171108937): build y deploy correctos. Es evidencia histórica, no acredita el HEAD posterior.
- Registro anual: fase REVISION, fases ejecutadas F00, F01, F02, F03 y F05. PDF original y siete derivados registrados. YAML de reglas leído y con estado pendiente_revision. No figura criteriosCPS en el registro anual.
- Código actual: import de lector CPS, guardado independiente sin alterar bases, protección de borrado con criterios vinculados, formulario Paso 3 y función destacarProcesar. Hay prueba de asociación CPS al año correcto, sin sobrescribir bases; no se reejecutaron aquí.
- Riesgos/pendientes: validar visualmente resaltado y Paso 3; cotejar fuentes y derivados; no confundir mínimos transformados con cortes reales; soporte de parser limitado a TAI 2025; sin OCR. El código no sustituye autorizaciones reales de GitHub. No se verificó nuevamente todo el conjunto de pruebas ni el despliegue del HEAD en esta auditoría.

Siguiente actuación: prueba guiada de Paso 3 en la wiki, sin borrar ni alterar el PDF ya validado de recepción. Mantener la aceptación integral pendiente antes de incorporar temario. [Hoja de ruta](../03-roadmap.md).
