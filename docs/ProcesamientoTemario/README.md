# ProcesamientoTemario

Subproyecto de AstroXmind iniciado el 22-11-2026, después del [hito M-20261122](../30-milestone-20261122.md). Objetivo: transformar temarios y exámenes oficiales en conocimiento estructurado, navegable, medible y reutilizable para el estudio de oposiciones (TAI como primer ámbito previsto, sin limitar el modelo a una oposición).

Estado: **diseño aprobado como dirección de trabajo; implementación aún no autorizada**. No modificar la aplicación ni publicar datos de examen mientras no se acuerde el primer incremento. La cola anterior de AstroXmind permanece en pausa; CTX-08 sigue al final.

## Documentación propia

| Documento | Contenido |
|---|---|
| [Especificación original de Pablo](VinculacionPreguntasRespuesta.md) | Requisitos de partida, conservados sin reinterpretarlos como código |
| [01 · Modelo y arquitectura](01-modelo-y-arquitectura.md) | Entidades, relaciones, identificación, fuentes, validación e integración con AstroXmind |
| [02 · Métricas y generación](02-metricas-y-generacion.md) | Cálculo, trazabilidad, prioridades y límites de la generación |
| [03 · Hoja de ruta KNOW](03-hoja-de-ruta.md) | Incrementos, dependencias y aceptación |
| [04 · Prompt de continuidad](04-prompt-continuidad.md) | Instrucciones para IA y colaborador técnico |

## Principios de diseño

- Conceptos atómicos y reutilizables; una pregunta referencia conceptos y no un tema entero.
- Diferenciar pertenencia jerárquica de relaciones semánticas y evidencia de examen.
- Conocimiento independiente de Astro, con representación declarativa y salidas derivadas; AstroXmind aporta visualización, edición y estudio.
- Preguntas oficiales y respuestas verificadas trazables a su fuente; preguntas generadas identificadas como tales.
- Una sola fuente autoritativa por relación; backlinks y estadísticas derivados automáticamente.
- La IA propone enlaces y generación; la validación estructural es determinista. No convertir inferencias en hechos oficiales.

Las propuestas concretas de los documentos siguientes son una base para acordar KNOW-01, no un esquema ya implementado ni una obligación de adoptar cada campo sin revisión.
