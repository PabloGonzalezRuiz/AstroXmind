# Estado y continuidad — Estudio

22/11/2026. EST-00: estructura documental inicial. EST-01A es la próxima tarea: aún no existe automatización funcionando ni se ha publicado la wiki de convocatorias. Existe un prototipo externo de extracción de ocho programas a MD/YAML de cinco PDF, no integrado; no es un conversor F02 completo. Hay investigación de criterios, plazas y catálogo INAP, con algunos documentos pendientes de verificación. Los originales y materiales personales están fuera del repositorio público.

Referencia: BOE-A-2025-26262, publicado 22/12/2025; anexo V libre y VI PI. El perfil libre general contempla 844 plazas iniciales, 80 preguntas teóricas, 20 del supuesto elegido, 5 reservas por parte, 120 minutos, penalización 1/3, partes eliminatorias 50+50. Confirmar criterios posteriores de la CPS, cortes y resultados antes de declarar un simulador validado. Fuentes: [BOE](https://www.boe.es/buscar/doc.php?id=BOE-A-2025-26262), [normas TAI libre](https://sede.inap.gob.es/sites/sede/files/public/2025-12/TAILI.pdf), [criterios CPS](https://sede.inap.gob.es/sites/sede/files/public/2026-05/TAI%20LI%202025.pdf).

Al retomar: comprobar rama y documentación; ejecutar EST-01A con PDF de referencia, sin depender del nombre recibido. Registrar pruebas y limitaciones. Pendiente acordar publicación de originales, no mezclar datos privados. El motor de examen y la automatización de alertas aún no están implementados.

Decisión adicional del 22/11/2026: entrada principal desde la wiki, apartado «Añadir convocatoria»; carpeta por identidad formal, fuente recibida inmutable, excluida de procesamiento e índices, relación con copia canónica mediante hash y metadatos. Pendiente implementación integral y elección/validación de almacenamiento autenticado; no hay URL operativa de subida.

## Hito exclusivo EST-H01 (22/11/2026)
Primer importador CLI en estudio/scripts/ingesta_convocatoria.py, probado localmente con cinco PDF: tres BOE completos identificados (2018, 2023, 2025), dos extractos no oficiales o incompletos enviados a revisión sin renombrar. F00 conserva bytes; F01 extracción textual por páginas aún no validada visualmente. No se han subido PDF. Pendiente: entrada wiki autenticada, consulta de expediente, F01 y pruebas de integración. No dar por cerrado el hito.
