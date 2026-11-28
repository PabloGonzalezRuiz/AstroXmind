# Lectura resaltada con Piper

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
