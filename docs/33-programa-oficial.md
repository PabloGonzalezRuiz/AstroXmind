# PROG-01 · Contrato del programa oficial desglosado v1

Reanudación H-TEM-01, 24/11/2026. Esta entrega define y prueba el contrato; no importa documentación real, no modifica los expedientes privados ni habilita su reinicio.

## Entidades

| Entidad | Identidad | Contenido |
|---|---|---|
| Convocatoria (calls) | ID anual existente, con sufijo -pi para PI | Oposición, año, modalidad y versión aplicable |
| Versión (versions) | UUID de programa | Oposición, modalidad, revisión, predecesor, fuente oficial y estado draft/accepted |
| Fragmento (fragments) | UUID de evidencia | Texto literal, páginas PDF (1-based), apartado, hash SHA-256 del texto UTF-8 |
| Nodo (nodes) | UUID de ocurrencia, no reutilizado entre versiones | Padre, orden, código, tipo, título literal/editorial, evidencias, conceptos |
| Concepto (concepts) | UUID semántico permanente | Título, alias, estado activo/retirado, independiente de título, año y ruta |
| Pregunta (questions) | UUID de pregunta/ocurrencia | Examen y versión histórica; contrato completo de examen se hará en EXAM-01 |
| Asociación (questionConcepts) | UUID de relación | Pregunta, concepto, rol, nodos históricos, evidencia e historial |
| Correspondencia (nodeMappings) | UUID de relación | Versiones, conjuntos de nodos origen/destino, tipo, evidencia e historial |

Una convocatoria referencia la versión exacta del programa; varias pueden compartirla. La versión no se identifica por el año ni por la fecha del examen. Los IDs se asignan al crear entidades y se conservan en ediciones/reprocesamiento; no generar otro UUID en cada ejecución. El prefijo tipado de cada UUID ayuda a detectar cruces accidentales. El corpus de teoría permanece común a la oposición.

## Fuente y capas

La fuente oficial del BOE conserva prioridad. El parser actual devuelve bloques y temas numerados con texto corrido y página inicial: no permite inferir por sí solo cobertura literal de todos los subapartados ni páginas finales. PROG-02 deberá extraer fragmentos completos con páginas exactas, identidad del artefacto y hash real; CALL-05 verificará fidelidad de F02/F03. No dar por validado el contenido por superar únicamente el esquema.

- Bloque y tema: reproducir numeración, orden y texto oficial en el fragmento.
- Apartado/subapartado: profundidad variable; separar unidades semánticas sin partir abreviaturas, referencias jurídicas, fechas, enumeraciones internas o expresiones técnicas.
- Un título editorial es una etiqueta derivada, nunca sustituye el literal. Marcarlo con titleKind: editorial; titleKind: literal exige coincidencia exacta con una cita.
- Las citas contienen fragmentId, start (incluido), end (excluido), quote; los offsets son unidades UTF-16 de JavaScript sobre el texto exacto serializado. El hash usa UTF-8. No normalizar el texto sin crear nueva evidencia.
- El código visible se deriva de la posición entre hermanos (01.04.02.01); no se usa como ID. Cambiar orden en borrador cambia código, no identidad. Un nodo raíz es bloque, hijo de bloque tema y los niveles inferiores apartado. No exigir profundidad uniforme.

## YAML y edición

El YAML es canónico. El esquema JSON Draft-07 valida forma, y el validador comprueba invariantes referenciales y semánticas. El MD será una proyección editable numerada con marcadores inequívocos de ID de nodo, revisión y procedencia; sintaxis definitiva y reconciliación en PROG-02. No guardar dos fuentes independientes ni crear IDs a partir de la numeración; rechazar IDs duplicados o desconocidos durante la reconciliación. Los cambios de una versión aceptada se realizan como nueva revisión, con nuevos IDs de ocurrencia y correspondencias a la anterior.

Modelo serializado de un caso íntegramente ficticio: [fixture YAML](../tests/fixtures/programa-ficticio.yaml). Dos programas con temas desplazados, sección dividida y secciones fusionadas. Una pregunta está asociada a dos conceptos. No representa ninguna convocatoria oficial ni contiene material privado.

## Relaciones y revisión

Tipos de correspondencia: equivalent, renamed, moved (1:1), split (1:N), merged (N:1), added (0:N), removed (N:0), partial, modified, uncertain (N:M). Origen/destino son de versiones distintas de la misma oposición. Exigir evidencia de ambos lados existentes. No inferir automáticamente equivalencia ni vigencia de respuesta. Las asociaciones pueden estar vacías y mantenerse pendientes.

Las decisiones tienen status, origin, author, at, reason y confidence. El historial es cronológico y acumulativo; una decisión manual explícita validada/rechazada prevalece sobre las automáticas posteriores. Para corregir una relación con destino equivocado, rechazar la anterior y registrar la nueva relación conservando el historial; no reescribir el hecho histórico. Las relaciones pregunta/concepto no se duplican por edición o proyección: las estadísticas cuentan IDs de pregunta únicos y usan roles según métricas futuras. La evidencia de pregunta completa y las respuestas/plantillas se añadirán en EXAM-01; el contrato actual únicamente conserva la evidencia de clasificación en el programa histórico.

## Validación y límites

- [Esquema](../src/lib/programa-oficial.schema.json) y [validador](../scripts/validar-programa.mjs).
- npm run test:programa (incluido en npm run check): forma, identidades, referencias, árbol acíclico, orden/códigos, literal y hash, cardinalidades, modalidades, prevalencia manual, inmutabilidad de edición aceptada.
- validarTransicion compara dos snapshots canónicos, protege versiones aceptadas (nodos y fragmentos), identidades registradas e historial de relaciones. Las modificaciones de borradores deben superar validarPrograma; la validación no es una autorización para aceptar expedientes.
- En producción los datos permanecerán privados. No se añade acceso a GitHub ni UI ni conversión en este paso.

## Siguiente paso

PROG-02: generar los derivados del programa y la vista MD anidada reversible, primero con fixtures y después contrastar una copia de trabajo de TAI 2025 (33 temas en 4 bloques: 9/5/9/10). Validar cobertura y literal; no sobrescribir originales ni el expediente real. CALL-05 debe cerrar revisión documental, corregir F02 y proteger CPS ante reprocesamiento. PROG-03 verificará las correspondencias entre versiones reales y la proyección histórica. No incorporar corpus ni preguntas mientras el expediente siga en revisión.
