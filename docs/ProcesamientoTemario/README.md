# ProcesamientoTemario

Subproyecto de AstroXmind iniciado el 22-11-2026, después del [hito M-20261122](../30-milestone-20261122.md). Objetivo: transformar temarios y exámenes oficiales en conocimiento estructurado, navegable, medible y reutilizable para el estudio de oposiciones (TAI como primer ámbito previsto, sin limitar el modelo a una oposición).

Estado al cierre del 22-11-2026: **arquitectura maestra v0.9 documentada; investigación y prototipo externo disponibles; integración pendiente**. Prioridad: Fase 01, paso 01.1 (convocatoria 2025 libre). No modificar la aplicación ni publicar materiales aportados sin autorización. La cola anterior permanece en pausa; CTX-08 sigue al final.

## Documentación propia

| Documento | Contenido |
|---|---|
| [Arquitectura maestra v0.9](AstroXmind-Arquitectura-Maestra.md) | Fuente de verdad: cuatro pilares, fases F/N, programa versionado y hoja de ruta 01–12 |
| [Catálogo INAP TAI](AstroXmind-Catalogo-INAP-TAI.md) | Fuentes oficiales y simulación de plaza |
| [Perfiles de evaluación TAI](AstroXmind-Perfiles-Evaluacion-TAI.md) | Reglas por edición, cálculos y límites de verificación |
| [05 · Cierre y continuidad](05-cierre-20261122.md) | Estado, insumos y siguiente paso |
| [Especificación original de Pablo](VinculacionPreguntasRespuesta.md) | Requisitos de partida, conservados sin reinterpretarlos como código |
| [01 · Modelo y arquitectura](01-modelo-y-arquitectura.md) | Entidades, relaciones, identificación, fuentes, validación e integración con AstroXmind |
| [02 · Métricas y generación](02-metricas-y-generacion.md) | Cálculo, trazabilidad, prioridades y límites de la generación |
| [03 · Hoja de ruta maestra](03-hoja-de-ruta.md) | Fases 01–12 y desglose de Fase 01 |
| [04 · Prompt de continuidad](04-prompt-continuidad.md) | Instrucciones para IA y colaborador técnico |

## Principios de diseño

- Conceptos atómicos y reutilizables; una pregunta referencia conceptos y no un tema entero.
- Diferenciar pertenencia jerárquica de relaciones semánticas y evidencia de examen.
- Conocimiento independiente de Astro, con representación declarativa y salidas derivadas; AstroXmind aporta visualización, edición y estudio.
- Preguntas oficiales y respuestas verificadas trazables a su fuente; preguntas generadas identificadas como tales.
- Una sola fuente autoritativa por relación; backlinks y estadísticas derivados automáticamente.
- La IA propone enlaces y generación; la validación estructural es determinista. No convertir inferencias en hechos oficiales.

Precedencia: arquitectura maestra v0.9 y hoja de ruta actual sobre KNOW inicial; especificación de vinculación y modelos previos son antecedentes. La fase 01 empieza por estructura oficial versionada, no por el microprototipo de conceptos. Nada implica integración del motor.
