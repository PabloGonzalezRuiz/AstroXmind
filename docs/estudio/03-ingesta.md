# Contrato de entrada documental

Bandeja prevista: `estudio/entrada/convocatorias/`. Solo documentos aptos para publicación, puesto que el repositorio es público, incluso en ramas. No arrastrar material personal ni listados nominales. La automatización aún no está activa.

Al añadir un PDF, validar formato, calcular SHA-256, leer PDF Info/XMP y texto por páginas (Poppler; OCR solo si necesario). Clasificar convocatoria frente a normas específicas, examen, plantilla, criterios, resultados u otro. Si faltan datos, contrastar con BOE/INAP. Fecha de publicación de cabecera (no creación PDF), CVE del margen/Subject, cuerpo y modalidad del título/anexo. Resolver contradicciones con evidencia y dejar pendiente si no es posible. No inferir año de OEP/examen del nombre recibido.

Patrón: `AAAA-MM-DD_CUERPO_MODALIDAD_TIPO_REFERENCIA[_ALCANCE]__FASE.ext`. Ejemplo anexo oficial separado: `2025-12-22_TAI_LIBRE_CONVOCATORIA_BOE-A-2025-26262_ANEXO-V__F00-ORIGINAL.pdf`. El BOE completo multicuerpo: AGE_GENERAL, no TAI_LIBRE. Guardar fases F00-ORIGINAL, F01-TRANSCRIPCION, F02-LIMPIO, F03-SELECCION, F04-RESUMEN, F05-ESTRUCTURADO. Mismo nombre base y sufijo de fase. `__METADATOS.yaml`: identidad, nombre recibido/canónico, fechas, OEP, modalidad, alcance, URL directa oficial, página INAP, BOE, fecha de verificación, huella, evidencias por campo y linaje. No modificar el PDF original; si se pide metadato embebido, crear copia derivada claramente marcada con XMP, nunca sustituir original. Si URL localizada no se ha descargado, indicar que identidad binaria no está verificada.

Salida prevista por expediente en `estudio/convocatorias/<id>/`; excepciones se registran en `estudio/revision/`. No borrar ni sobrescribir originales. GitHub Actions futura: detectar entradas nuevas, validar y proponer resultados de forma idempotente, sin publicar si hay errores o datos ambiguos; aprobación de cambios y build de wiki. La salida F02 preserva íntegramente programa y reglas de corrección, con comprobación literal, numeración, cifras, tablas y origen.

## Entrada desde la wiki y expediente conservado

Ruta lógica de navegación: Estudio de oposiciones → Convocatorias → Añadir convocatoria. La pantalla explica clasificación, nombre canónico, conservación y metadatos antes de aceptar PDF mediante arrastre o selector. Mostrar progreso, propuesta de identidad, discrepancias y enlace al expediente. No requiere que el usuario conozca GitHub ni el nombre correcto. El almacenamiento y procesamiento persistentes requieren un servicio autenticado o flujo de trabajo autorizado; GitHub Pages por sí solo no recibe archivos. No exponer credenciales al cliente ni permitir publicación de documentos no autorizados. La interfaz y el servicio son pendientes, no funciones disponibles todavía.

El expediente se denomina exactamente con la identidad canónica sin fase ni extensión. Dentro: 

- `00-fuente/<nombre-recibido-saneado>.pdf`: copia de archivo recibido byte a byte, nombre original exacto registrado en YAML, inmutable, excluida de índices y procesamiento rutinario; recuperar únicamente por auditoría, verificación o regeneración explícita.
- `<id>__F00-ORIGINAL.pdf`: alias lógico o copia binaria canónica de la fuente, mismo SHA-256. No alterar los bytes ni las firmas. Si se necesitan metadatos PDF embebidos, generar `<id>__F00-ENRIQUECIDO.pdf` separado, declarando que es derivado no oficial.
- `<id>__METADATOS.yaml`: nombre recibido, rutas fuente/canónica, huellas y relación explícita, estados, evidencia, procedencia y protección `inmutable: true`, `indexar: false` para la fuente archivada. 
- Derivados F01–F05 con la misma identidad y sus respectivas extensiones. Procesar normalmente la copia canónica o la fase pertinente; no recorrer 00-fuente.

Deduplicar por SHA-256 sin borrar el registro de recepción. Si la identidad existe con diferente huella, conservar ambas recepciones y enviar el conflicto a revisión sin sobrescribir. La wiki muestra un enlace al original bajo «Fuente archivada» y fases en el árbol; la ocultación en el índice no equivale a control de acceso. La subida no se habilitará hasta comprobar privacidad, persistencia y permisos. 
