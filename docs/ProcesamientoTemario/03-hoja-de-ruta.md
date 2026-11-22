# Hoja de ruta · ProcesamientoTemario

Estado 22-11-2026: planificación aprobada como dirección, no implementación. El primer paso ejecutable es KNOW-01 después de autorización concreta. No iniciar tareas previas de AstroXmind; CTX-08 continúa al final del backlog general.

| ID | Incremento | Criterio de salida |
|---|---|---|
| KNOW-01 | Modelo declarativo | Contrato acordado de conceptos, exámenes, preguntas, IDs y roles; cinco conceptos y diez preguntas de prueba expresamente sintéticas; ejemplos de navegación esperada; sin importación masiva |
| KNOW-02 | Registro central y validación | Índice derivado reproducible, unicidad, referencias, backlinks tipados y diagnósticos con fixtures |
| KNOW-03 | Importación de temario y exámenes | Pipeline por lotes PDF/DOCX/MD, trazabilidad, deduplicación, revisión y respuestas verificadas |
| KNOW-04 | Vinculación asistida por IA | Propuestas semánticas con roles, evidencia, revisión y resolución de alias |
| KNOW-05 | Navegación teoría/preguntas | Enlaces bidireccionales reales en wiki; preservación de IDs, URLs y jerarquía existente |
| KNOW-06 | Motor de métricas | Cálculo versionado, explicable, filtrable por corpus y probado con casos límite |
| KNOW-07 | Panel de prioridades y lagunas | Vistas por concepto, tema y convocatoria; métricas explicables y filtros |
| KNOW-08 | Componente de test | Preguntas interactivas, respuesta/explicación y acceso al concepto; ejemplo FrameEjemplo si procede |
| KNOW-09 | Generación basada en patrones oficiales | Preguntas generadas con procedencia, revisión y separación del corpus oficial |
| KNOW-10 | Seguimiento del aprendizaje | Dominio personal, historial de resultados y recomendaciones; definir almacenamiento y privacidad antes de implementar |

## Primera entrega experimental

KNOW-01 propone cinco conceptos del entorno de redes (DNS, DHCP, IPv4, IPv6 y UDP) y diez preguntas sintéticas, con relaciones tipificadas y una representación de ejemplo del enlace concepto/pregunta. No asumir que un ID ilustrativo representa un examen oficial. Validar el esquema y decidir cuándo un concepto merece página propia. No incluir aquí scraping, descarga de exámenes, modelos de IA, interfaz completa ni estadísticas definitivas. Los enlaces automáticos y UI corresponden a KNOW-02/05. Si Pablo aporta datos reales, incorporarlos solo tras acordar derechos, formato y revisión.

## Forma de trabajo

Cada incremento tiene aprobación, pruebas de regresión, evidencia y enlace directo a wiki cuando corresponda. Trabajar en rama, preservar M-20261122, no modificar main ni desplegar sin autorización concreta. Revisar el modelo con el usuario antes de escalar. El código y los archivos publicados siguen intactos durante esta planificación.
