# Validación NAV-01 — 17-11-2026

Base de implementación: documentación 3b14131 sobre código main 5f1a33f. El usuario autorizó actualizar el contrato (IDs neutros, YAML entendible por IA y movimiento de ramas por parent) e iniciar NAV-01, sin publicación.

Implementados: esquema navigation, cuatro páginas, registro puro consultable, ledger/generador de IDs, validación en check y build, emisión de JSON en dist y pruebas persistentes. No se cambia UI de navegación, TreeTable, rutas existentes, dependencias o workflows. Main queda intacto.

Resultados: npm ci correcto; 24 pruebas pasan; Astro check 0 errores/avisos; build correcto con cuatro páginas de contenido, 404 técnico y navigation.json. Hook de cierre comprueba existencia de cada HTML registrado. Prueba negativa de build real: padre inexistente provoca fallo; se restauró la página y se repitió build válido. Los IDs reales siguen siendo doc-000001…4; el generador se probó solo sobre ficheros temporales.

Casos: reconstrucción plana, movimiento por un solo parent, estabilidad al renombrar URL, desempate de orden, duplicados, padres inexistentes, ciclos, borradores, rutas duplicadas, YAML inválido y reserva de IDs sin reutilización. No hubo nueva revisión visual ni Actions de rama; no hay UI nueva. La salida pública no contiene nodos borradores.

Pendiente: integración/publicación con autorización; NAV-02 requiere una aprobación distinta y añadirá ruta de ubicación y navegación contextual derivada del registro.
