# ED-03 · Prototipo local de editor de tres paneles

25/11/2026. Base funcional PR #12, SHA `6e0a4722fe5dbf435258208768c9e3655f1bd1a5`. Prototipo autorizado para integración y publicación.

- NUM: segmento vacío no asigna código; los descendientes conservan ruta heredada; códigos realmente asignados siguen siendo únicos.
- ORD: mover a orden ocupado del mismo padre reordena ambos sentidos; al cambiar padre se desplazan las posiciones ocupadas consecutivas. Identidades y descendientes intactos.
- Ruta `/editor-programa/`: prototipo independiente, ejemplo ficticio, DSL y Markdown puro, árbol reactivo, flechas entre hermanos, selección explícita de IDs, confirmación de bajas, copia del MD y exportación JSON del borrador. No guardar en GitHub ni en expediente. El editor existente conserva su funcionamiento.
- ED-04 pendiente: persistencia privada coherente, vínculo con evidencia y catálogo, plantilla, actualización del visor y guardado/cierre real. No declarar aceptación de TAI ni despliegue del prototipo.

Pruebas: 23 específicas del motor y una prueba DOM del editor; `npm run check` / `npm run build` sobre copia local. Check y build locales correctos: 168 pruebas principales. Pendiente comprobar CI, Pages y revisión visual.
