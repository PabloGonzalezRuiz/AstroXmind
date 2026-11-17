# Validación y auditoría

Auditado el 17-11-2026 sobre `main`, commit `e7bfb8e7f41ec5637c685e62698eb12b7ab1b658`.

## Evidencia remota

Para `e7bfb8e7f41ec5637c685e62698eb12b7ab1b658`:

- [CI: éxito, 43913208743](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43913208743).
- [Wiki Build: éxito, 43913208998](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43913208998).
- [Pages Deploy: éxito, 43913209250](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43913209250).
- La página pública TreeTable respondió y contiene los ejemplos de clases, plegado y numeración heredable. Esta lectura HTTP no sustituye una revisión visual/interactiva.

La auditoría de dependencias [43897812008](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43897812008) es anterior y corresponde a `109e033`, no al HEAD auditado. Su workflow genera un informe y no bloquea por severidad: éxito no significa cero vulnerabilidades.

## Qué comprueba CI

Node.js 22, npm ci, npm run check y npm run build. Wiki Build produce artefacto; Pages publica main. No sustituye pruebas funcionales ni certifica compatibilidad XMind. El workflow de auditoría de dependencias solo se activa por cambios de rutas concretas o dispatch; no se ha vuelto a ejecutar en esta auditoría.

## Evidencia histórica de desarrollo

En el desarrollo anterior se registraron builds locales de wiki y sandbox y comprobaciones DOM de herencia, excepciones, celdas, numeración y clases. Esas comprobaciones temporales no constituyen una suite persistente integrada en main. PR #5 sigue abierto sobre otra base. No afirmar cobertura automatizada completa.

## Verificación de esta auditoría

Lecturas de GitHub (SHA, ramas, commits, PRs, Actions y fuentes) y respuesta HTTP de TreeTable pública con ejemplos actuales. No hubo nueva ejecución local de tests/build, revisión visual o interacción de navegador; el cambio es documental.

Validación futura tras cambios: npm ci, npm run check, npm run build y build del laboratorio si cambia. Incorporar casos funcionales dirigidos cuando se implemente AST-028, sin baterías ad hoc innecesarias.

## AST-028 · Estado inicial y botón compacto — implementación en rama

Implementado el 17-11-2026 en feature/ast-028-folded-compact-toggle. No integrado ni publicado por este encargo.

- Prop global folded=true/false (booleano o cadena true/false); valor predeterminado false. Sufijo de nodo [folded=true] o [folded=false], heredable y sobrescribible.
- Collapsible sigue siendo la capacidad de plegado. False mantiene el nodo abierto, aunque folded continúa siendo configuración heredable para descendientes que reactiven collapsible=true. Las hojas no tienen botón. Un hijo abierto bajo un padre cerrado aparece al abrir ese padre.
- Se genera toda la tabla en servidor; el cliente lee los estados efectivos y recalcula filas al iniciar. Sin JavaScript se conserva todo el contenido, sin botones inactivos.
- Botón absoluto arriba a la izquierda (0.2rem), tamaño visual 1rem, símbolo 0.75rem. Reserva superior para evitar solapamiento con texto; no ocupa espacio en línea. Se conserva/restaura foco del botón al reconstruir filas.
- Ejemplos en página TreeTable y sandbox; numeración y clases conservadas. Summary/Boundary aplazados; biblioteca sigue al final.
- Check Astro: 0 errores/avisos. Builds de wiki y laboratorio correctos. Comprobación DOM de estado inicial, herencia, excepciones, collapsible=false, restauración de estado/foco, celdas, aislamiento entre tablas y fallback sin JS correcta. CSS compacto verificado por lectura; no revisión visual en navegador porque Chromium falló al iniciar (socket no permitido). No se ha ejecutado Actions de esta rama.

## AST-030 · Ejemplos con pestañas — 17-11-2026

Todos los ejemplos pedagógicos de componentes de la wiki usan src/components/ComponentExample.astro, con Tabs/TabItem/Code de Starlight: Resultado por defecto y Código con resaltado/copia. Ocho grupos en TreeTable y tres en la guía. Las tarjetas de navegación de inicio y el enlace externo al laboratorio no son demostraciones de código.

Cada ejemplo MDX está en src/examples; se importa como componente para la vista previa y con ?raw para el código. La fuente es única. La demo de Panel incluye uso MDX e implementación Astro; los ejemplos de clases muestran la hoja CSS real. Los bloques informativos de lenguaje permanecen como explicación y las listas de muestra se muestran también con pestañas.

Regla para futuros ejemplos: usar ComponentExample, importar la demo y su mismo archivo ?raw; no duplicar manualmente el código visible. Grupos independientes, sin sincronización global de la pestaña elegida. Estado de plegado conservado al alternar.

Validación local: npm ci, npm run check (0 errores/avisos), npm run build correctos; DOM de ambas páginas verifica 11 grupos, correspondencia exacta de data-code para copia, cambio por clic/teclas, foco, IDs únicos y TreeTable dentro de pestañas. No hubo nueva captura visual en navegador. No se modificaron dependencias ni el componente TreeTable. El laboratorio externo se conserva sin dependencia de Starlight.

AST-031: npm ci, npm run check (0 errores/avisos), builds de wiki/laboratorio correctos. Comprobaciones del cálculo real y HTML compilado: reactivación 1 e hijo 1.1 bajo padre sin número; start=5 e hijo 5.1; hermanos continúan en 6 y otros padres conservan su contador; ruta continua 7.5.3 y ocho ejemplos con pestañas intactos. Sin nuevas dependencias ni cambios de sintaxis.

## AST-032 · Pantalla completa de cada tabla — 17-11-2026

Botón en esquina superior derecha: visible con hover o foco de teclado; siempre visible en puntero táctil y mientras la tabla está ampliada. Sin nueva propiedad del lenguaje. Fullscreen API nativa cuando disponible; si falta o se rechaza, panel fijo que ocupa la ventana. Salida con botón o Escape. En el panel alternativo se mantiene foco dentro del contenido, se restaura el overflow previo del body y se devuelve foco. Tabla/celdas no se clonan, preservando plegado, numeración, clases y estado al volver. Sin JS el control permanece oculto.

Validación: npm run check (0 errores/avisos), builds de wiki/laboratorio correctos. DOM del script compilado verifica API nativa simulada/eventos, API ausente/rechazada, botón/Escape, foco, restauración de overflow e independencia de tablas. No se ha realizado una prueba visual o de Fullscreen API nativa en navegador real en este cambio.
