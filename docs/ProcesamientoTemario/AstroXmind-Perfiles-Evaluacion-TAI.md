# AstroXmind — Perfiles de evaluación y simulación TAI

Investigación inicial, 22 de noviembre de 2026. Complemento de la arquitectura maestra v0.3; pendiente de integrar en el motor Astro.

## Decisión de arquitectura

Cada convocatoria tiene un perfil de evaluación independiente del programa y del banco de preguntas. Un simulacro nuevo utilizará por defecto el último perfil oficial validado de ingreso libre (convocatoria publicada en diciembre de 2025, examen de mayo de 2026). Un examen histórico conservará su perfil original. El usuario podrá seleccionar cualquier perfil histórico o uno personalizado. No se presupone que una convocatoria futura mantenga las mismas reglas.

## Comparación de bases verificadas

| Perfil | Teoría + práctica | Reservas | Tiempo | Error | Agregación y mínimos |
|---|---:|---:|---|---|---|
| 2017-2018 libre, BOE-A-2018-1169 anexo V | 100 + 30 | 3 + 3 | 90 + 70 min | 1/3 | Dos ejercicios eliminatorios, 25/50 cada uno |
| 2017-2018 PI, anexo VI | 50 + 12 | 3 + 3 | 90 min | 1/4 | Dos partes eliminatorias, 25/50 cada una |
| 2019 libre, anexo VII aportado | 80 + 20 | 5 + 5 | 120 min | 1/3 | Dos partes eliminatorias, 25/50 cada una |
| 2022-2023 libre, BOE-A-2023-2175 anexo VI | 80 + 20 | 5 + 5 | 120 min | 1/3 | Acertar vale 1 y 4 respectivamente; total 160 directos; mínimo transformado 50/100 |
| 2022-2023 PI, anexo VII | 50 + 12 | 5 + 3 | 90 min | 1/4 | Valor 1 y 4; total 98 directos; mínimo 50/100 |
| 2024 libre, BOE-A-2024-14098 anexo V | 80 + 20 | 5 + 5 | 120 min | 1/3 | Valor 1 y 4; total 160 directos; mínimo 50/100 |
| 2024 PI, anexo VI | 50 + 12 | 5 + 3 | 90 min | 1/4 | Valor 1 y 4; total 98 directos; mínimo 50/100 |
| 2025 libre, BOE-A-2025-26262 anexo V | 80 + 20 | 5 + 5 | 120 min | 1/3 | Dos partes eliminatorias, 25/50 cada una; superar primera para corregir segunda |
| 2025 PI, anexo VI | 50 + 12 | 5 + 3 | 90 min | 1/4 | Dos partes eliminatorias, 25/50 cada una; concurso separado |

Se elige un único supuesto práctico, III o IV. El peso de ambos supuestos alternativos es el mismo; no confundir bloques temáticos con partes del examen. La distribución de preguntas de teoría entre bloques debe medirse empíricamente de cuestionarios reales; no asignar una cuota oficial fija sin fuente. Los blancos no penalizan. Las reservas sustituyen anuladas según orden y plantilla definitiva. Los números de preguntas son los previstos en bases (máximo en la primera parte). Las reglas de concurso de PI y desempates requieren perfiles adicionales.

## Puntuación y transformación

Directa = valor correcto × (aciertos − errores × fracción de penalización). Conservar fracciones exactas (1/3 no es 0,33). Registrar respuestas en blanco y no válidas, selección de supuesto y sustitución de anuladas. No duplicar reservas ni corregir ambos supuestos.

La nota transformada no es una regla de tres. La fórmula del INAP del 24/03/2025 (OEP 2023-2024) utiliza dos tramos: si d < M, t = (E/2) × d/M; si d ≥ M, t = (E/2) × [1 + (d−M)/(N−M)]. d es directa, M es corte fijado por la CPS, N es máxima directa, E es máxima transformada. Esta fórmula está verificada para esa edición; comprobar publicación específica al aplicarla a otras. El manejo de directa negativa y redondeos debe validarse con el documento de cada edición, no inventarse.

Para 2025 libre se han localizado cortes históricos de 24/80 en teoría y 9,67/20 en práctica para turno general, y 24/80 y 6/20 para discapacidad. Coinciden varias fuentes secundarias que enlazan el documento CPS del 29/10/2026, pero el acceso al PDF oficial devolvió 403; verificar los valores y precisión exacta antes de declarar la corrección idéntica a la oficial. Para simulacros futuros son referencia histórica, no predicción garantizada. En 2024 libre se informa de 48/160 para ambos cupos; verificar documento de corte original (enlace bloqueado). Para PI 2024 el INAP sí publica 29,40/98 para ambos cupos.

## Contrato YAML propuesto (perfil reciente)

```yaml
id: tai-libre-2025
exam_year: 2026
publication_date: '2025-12-22'
boe_id: BOE-A-2025-26262
access: libre
syllabus_id: tai-2025-libre
duration_minutes: 120
aggregation: separately_eliminatory
parts:
  - id: teoria
    questions_max: 80
    reserves: 5
    blocks: [1, 2, 3, 4]
    correct_value: 1
    error_fraction: '1/3'
    blank_value: 0
    transformed_max: 50
    transformed_pass: 25
  - id: practica
    questions: 20
    reserves: 5
    choose_one_of_blocks: [3, 4]
    correct_value: 1
    error_fraction: '1/3'
    blank_value: 0
    transformed_max: 50
    transformed_pass: 25
    requires_pass: teoria
cutoff:
  source_status: secondary_pending_primary
  general: {teoria: 24, practica: 9.67}
  discapacidad: {teoria: 24, practica: 6}
  rounding: pending_verification
block_distribution:
  source: empirical_exam_statistics
  quotas: null
```

En este contrato el valor unitario de acierto modela la escala directa de cada parte; los pesos de bloques del temario son estimaciones separadas. Para 2023/2024 se activa `aggregation: combined`, valor 4 para práctica (penalización de 4/3), corte conjunto y transformación única. Los simulacros pueden usar perfil histórico de corte o escenario estimado etiquetado.

## Investigación independiente y fuentes

Fuentes normativas (además de los PDF aportados):

- BOE 2018: https://www.boe.es/buscar/doc.php?id=BOE-A-2018-1169
- BOE 2023: https://www.boe.es/buscar/doc.php?id=BOE-A-2023-2175
- BOE 2024: https://www.boe.es/buscar/doc.php?id=BOE-A-2024-14098
- BOE 2025: https://www.boe.es/buscar/doc.php?id=BOE-A-2025-26262
- INAP fórmula de transformación 2024: https://sede.inap.gob.es/notas-inap/ficheros/Nota%20informativa%20F%C3%B3rmula%20Transformada-TAI-L.pdf
- INAP PI 2024: https://www.inap.es/documents/59312/2364118/PUNTUACIONES%2BMINIMAS%2BEJER%2BUNICO%2BTAI%2BPI.pdf/7ed869ab-b224-7b87-d1a2-aae153c7aa6d

Fuentes secundarias y herramientas (para contraste, no autoridad normativa):

- [OpoTAI Entrenador, repositorio GitHub](https://github.com/AcidClawX41/OpoTAI-Entrenador-Oposicion-TAI): documentación de corrección por convocatoria, reservas, esquemas antiguos con elección de bloque incluso en teoría, simulación y cronómetro. Investigar su código y pruebas antes de reutilizar; verificar licencia y procedencia de datos.
- [ForoCoches, hilo TAI página 42](https://forocoches.com/foro/index.php/showthread.php?p=487745962): discusión sobre ponderación 1:4 y corte sobre 160; confirma que es una dificultad real de comprensión, no sustituye bases oficiales.
- [OposicionTAI, calculadora](https://oposiciontai.com/pages/html/calculadora-nota-tai.html): ejemplo de visualización de los dos tramos y dos mínimos.
- [TaiLabs, histórico](https://tailabs.es/blog/nota-de-corte-tai) y [BaremoOposiciones](https://baremooposiciones.com/oposiciones/age-tai/resultados): contrastar cortes y localizar publicaciones originales.

## Siguiente fase de investigación

Incorporar las fuentes del usuario sin contaminar el contraste independiente; recopilar criterios CPS, plantillas definitivas y cortes por cupo; auditar el repositorio de entrenamiento y otros materiales; reconstruir cada perfil con evidencia por campo, incluyendo convocatorias anteriores a 2017. Importar cuestionarios y medir la composición de los bloques, dificultad, tipo de pregunta y elección de supuesto por edición. Validar retrospectivamente los resultados con ejemplos oficiales y casos límite (cortes, reservas, empate, no selección, errores y blancos). Solo entonces activar el motor de puntuación como oficialmente validado. Los perfiles de corrección se versionan y no modifican intentos históricos.
