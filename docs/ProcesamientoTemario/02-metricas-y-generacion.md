# KNOW-06/09 · Métricas y generación

## Métricas calculadas

Los campos derivados nunca son fuente de autoría. El cálculo debe ser determinista, reproducible, versionado y acompañado por datos suficientes para explicar el resultado. Los recuentos de exámenes son evidencia; las ponderaciones son heurísticas, no una probabilidad oficial de aparición futura.

| Métrica | Escala propuesta | Significado |
|---|---|---|
| `exam_weight` | 0–10 | Peso histórico combinado |
| `difficulty_score` | 0–10 | Dificultad estimada u observada, indicando origen |
| `coverage_score` | 0–100 | Cobertura de material disponible |
| `study_priority` | 0–10 | Prioridad recomendada en función de peso, dificultad y carencia de cobertura |

Fórmula inicial del documento de Pablo para `exam_weight`: 40 % frecuencia + 25 % recencia + 20 % conectividad + 15 % relación con conceptos importantes. Normalizar cada factor, establecer corpus, periodo, fecha de corte, filtros y manejo de datos faltantes. Evitar autocircularidad del último factor (usar peso base o cálculo de convergencia definido); contar preguntas únicas y no penalizar artificialmente conceptos con pocos enlaces. Separar roles evaluados de relacionados y distractores. Las preguntas generadas no incrementan frecuencia de examen oficial. La fórmula final y su configuración se acuerdan en KNOW-06.

Dificultad puede empezar como estimación marcada de IA y evolucionar a observaciones de test con tamaño de muestra y fecha. Cobertura considera teoría, fuentes, preguntas oficiales/generadas y ejemplos validados. Diferenciar cobertura del material de dominio personal; un concepto documentado puede no estar aprendido. Si no hay evidencia suficiente, mostrar desconocido o nivel de confianza, no un cero arbitrario.

## Generación basada en evidencia

1. Seleccionar conceptos y preguntas oficiales verificadas del ámbito.
2. Extraer patrones de evaluación, distractores y complejidad, sin confundir patrón con respuesta correcta.
3. Combinar teoría revisada y patrones para producir preguntas nuevas vinculadas a conceptos y ejemplos de referencia.
4. Validar enunciado, opciones, respuesta, explicación, no duplicación y fuentes; guardar como generada/propuesta hasta revisión.
5. Incorporar estadísticas de test sin alterar el corpus oficial.

La generación tiene su propio identificador y procedencia, modelo/versión o proceso, fecha y estado de revisión. Nunca etiquetar una pregunta sintética como oficial. El sistema debe poder mostrar por qué una pregunta fue sugerida y qué conceptos pretende evaluar. No generar masivamente desde temario aislado.
