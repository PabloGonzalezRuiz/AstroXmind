# Lectura resaltada con Piper

## Estado de continuidad · 28-11-2026

**HIST-LECT-02 — pendiente de integración y validación.**

- Página publicada: https://pablogonzalezruiz.github.io/AstroXmind/republica-y-guerra-civil/
- Última versión de lectura confirmada en main: PR #40, merge `a533cf4e800cd29dcbcc4babe947c18545da882d`. Lee únicamente el texto marcado; contiene el defecto señalado por Pablo.
- Presentación previa: seis páginas numeradas con separadores; anotaciones originales en las páginas 1, 2, 3 y 6, y resaltado editorial en las páginas 4 y 5, sin fotos originales de estas dos últimas.
- Corrección: en la sesión previa se informó de que se había preparado la extracción completa, pero no hay evidencia de que se hayan integrado el nuevo extractor, MP3 y marcas sincronizadas en main. No considerar cerrada la incidencia.

### Requisito de aceptación

Leer todo el texto impreso original en orden, incluidas palabras y frases sin resaltar, con Piper `es_ES-davefx-medium` (castellano peninsular). Excluir notas manuscritas, controles del reproductor y etiquetas artificiales de página. Mantener las anotaciones, numeración, URL y texto original; los resaltados de estudio no afectan a qué se narra.

### Próximo paso para retomar

1. Recuperar o completar el extractor de lectura íntegra y cotejar su salida con el texto original de las seis páginas.
2. Regenerar juntos el MP3 y las marcas temporales; ajustar el resaltado activo para abarcar también el texto sin marcas de estudio.
3. Actualizar la prueba para exigir cobertura textual completa, orden, ausencia de notas y duplicados, y sincronización.
4. Ejecutar compilación y pruebas, integrar los archivos coherentes, comprobar el despliegue y probar la reproducción en la misma URL. Registrar el commit, la duración y los resultados reales antes de cerrar HIST-LECT-02.

## Funcionamiento de la versión anterior (PR #40)
El documento de Historia conserva su Markdown, numeración y anotaciones. El reproductor utiliza un MP3 pregenerado con Piper `es_ES-davefx-medium` (castellano de España). Lee únicamente los fragmentos rosa, morado, subrayados o rodeados; no lee las notas manuscritas, etiquetas de página ni texto sin marcar. Las marcas superpuestas no duplican palabras. El resaltado activo amarillo es temporal e independiente de los colores de estudio.

El lector permite reproducir, pausar, buscar por tiempo, avanzar/retroceder por fragmento, cambiar velocidad y desactivar el seguimiento de pantalla. Verifica que las marcas temporales coinciden con el HTML compilado antes de habilitar el audio. No ejecuta el modelo en el dispositivo ni requiere servicio de voz en línea.

## Regeneración

Desde la raíz, con Node, Piper, FFmpeg y el modelo ONNX descargado por separado:

```sh
npx astro build
python scripts/generate-reading-audio.py dist/republica-y-guerra-civil/index.html /ruta/es_ES-davefx-medium.onnx public/audio/republica-y-guerra-civil
npm run build
```

El MP3 y las marcas se versionan juntos; el modelo no se incluye en el repositorio. Los datos de este documento no forman parte del motor genérico ni de futuras instalaciones limpias. El extractor, reproductor y prueba son reutilizables; los ficheros de audio y marcas pertenecen al documento concreto. La prueba integrada verifica el cotejo literal, el orden, los tiempos y que el reproductor no aparece en otros documentos.
