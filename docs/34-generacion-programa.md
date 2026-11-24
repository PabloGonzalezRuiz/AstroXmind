# PROG-02 · Generación y edición reversible del programa

**PROG-02 · Vista wiki (24-11-2026):** el candidato real se incorporó al almacén privado bajo `Programa/<versionId>/`, con YAML, MD e informe y referencia en `convocatoria.yaml`. El paso 3 muestra el árbol de solo lectura, plegado/desplegado y enlaces a los archivos privados, tras autorización. Estado BORRADOR y expediente REVISION; sin aceptación ni desbloqueo del temario. 142 pruebas principales locales. Pendiente CALL-05 (revisión integral, edición y validación). [Abrir el programa en la wiki](https://pablogonzalezruiz.github.io/AstroXmind/oposiciones/?o=tai&anio=2025#programa-desglosado).

Entrega 24/11/2026, continuidad [PROG-01](33-programa-oficial.md).

## Uso

El analizador del PDF conserva las líneas normalizadas, con páginas de origen, de cada bloque y tema. El programa se genera **en borrador**, sin tocar el expediente privado. La herramienta de desarrollo trabaja en local con PDF.js 4.10.38 (misma versión de dependencia que la wiki):

```bash
node scripts/procesar-programa.mjs generar PDF OP_ID AÑO MODALIDAD ARTIFACT_ID DIRECTORIO_NUEVO [YAML_PREVIO]
node scripts/procesar-programa.mjs editar YAML VERSION_ID MD DIRECTORIO_NUEVO
```

El directorio de destino debe no existir; se crean programa.yaml, programa.md y validacion.json. El YAML previo permite repetir la generación en otro directorio conservando IDs y ediciones; se rechaza cambiar la fuente del expediente existente de manera implícita. No hay escritura de GitHub. La integración en el flujo privado y la aceptación real quedan para el siguiente hito CALL-05; no se ha cambiado el estado de la convocatoria.

## Reglas de desglose

- Cada fragmento conserva número oficial, texto extraído con espacios normalizados, lista exacta de páginas PDF (base uno), huella y citas UTF-16.
- El bloque tiene el título oficial; el tema toma como etiqueta el primer tramo literal. Los apartados son candidatos de atomización: detectar punto final (sin partir decimales, abreviaturas, dominios como plataforma.NET ni referencias internas); los dos puntos seguidos de espacio identifican grupos y el punto y coma separa subapartados dentro del grupo. No separar listas por coma de forma automática, para no romper fechas, referencias ni sintagmas.
- La jerarquía editorial puede tener profundidad variable. La numeración visible se calcula por orden de hermanos y no cambia la identidad. El prefijo oficial y el literal íntegro quedan en el fragmento; los títulos no los sustituyen. No se crean conceptos ni asociaciones de preguntas por inferencia.
- La cobertura comprueba cada carácter no blanco del cuerpo oficial mediante intervalos de evidencia de los apartados, y coteja número/orden de bloques y temas y páginas y texto de cada fragmento contra la entrada. No supone validación semántica de la granularidad.

## Markdown editable

La cabecera incluye ID de versión y huella del snapshot YAML. Cada línea contiene código, etiqueta y comentario con ID de nodo. No eliminar comentarios; mover líneas e indentar con dos espacios por nivel; los códigos se recalculan al importar, sin reasignar IDs. Se pueden renombrar títulos (se marcan editoriales salvo cita exacta), reordenar y reorganizar apartados dentro del tema. El bloque y tema oficiales conservan posición/parent. La versión base debe ser borrador; se rechazan edición obsoleta, IDs ausentes, nuevos o repetidos, saltos de nivel, cruces de tema, pérdida de literal y versiones aceptadas. El procedimiento de alta/baja o división manual de nodos tendrá su propia operación explícita, no se infiere silenciosamente desde MD. Al importar se preservan todos los demás campos YAML, relaciones y evidencia. La edición todavía es local, no hay nueva interfaz ni guardado del borrador en el repositorio privado.

## Prueba real sin cambios de datos

Fuente oficial BOE-A-2025-26262, anexo V, PDF de la resolución general. SHA-256 de la descarga externa coincide con el registrado en el expediente TAI 2025. Se contrastaron visualmente las páginas PDF 45–47 (BOE 170749–170751), con extracción de PDF.js y una segunda extracción independiente Poppler: los 5.387 caracteres no blancos de la sección Programa, tras retirar únicamente cabeceras/pies identificados y el encabezado, coinciden exactamente. No equivale a revisión completa de F02, reglas o todos los documentos.

| Bloque | Temas |
|---|---:|
| I | 9 |
| II | 5 |
| III | 9 |
| IV | 10 |
| Total | 33 |

37 fragmentos, 192 nodos (4 bloques, 33 temas, 155 apartados y subapartados), cobertura completa del texto extraído. YAML→MD→YAML conserva modelo; repetición con YAML previo genera mismos bytes en YAML y MD. El candidato es de revisión editorial, no aceptación oficial. El PDF y CPS en GitHub-Datos permanecen intactos en REVISION. Los derivados reales no se publican en el repositorio público.

## Pruebas y siguiente fase

Ocho pruebas nuevas (generación, conservación de páginas, segmentación, repetición, ida/vuelta, títulos, reordenación, rechazos y cobertura). npm run test:programa incorpora ambos módulos; check/build locales 141 pruebas principales, sin fallos. CALL-05 deberá integrar la revisión guiada, corregir F02/F03, garantizar reprocesamiento no destructivo que preserve CPS, incluir aceptación explícita del candidato y no inventar notas de corte. PROG-03 después; no incorporar teoría ni preguntas hasta la aceptación.
