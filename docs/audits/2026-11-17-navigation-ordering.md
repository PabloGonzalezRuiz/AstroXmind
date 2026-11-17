# Ordenación, fechas YAML y numeración — 17-11-2026

## Alcance autorizado

Rama feature/navigation-order-created-20261117 desde e0e3d620896ae7b91010a7d113e420bd9b2f3bac (documentación integral) sobre main publicado 2cdba361920b58a5002faa063e46660f22ff36ef. El usuario pidió order opcional, pendientes al final por fecha y números heredados solo para órdenes explícitos, compartidos cuando order coincide. Aclaró que la fecha debe estar en el YAML junto al orden, con milisegundos. No se autoriza publicar ni NAV-04.

## Entrega final

navigation admite order opcional y created/modified opcionales con ISO, tres cifras de milisegundos y zona. Se compara created o, si falta, modified. Sin fecha declarada, el documento queda después de los hermanos de su grupo con fecha; empate final por ID. Fechas del archivo, Git, ledger y reloj del build no participan. El ledger/generador se mantienen intactos.

Primero order explícito; después omitidos. Número formado por valores de order y ruta del padre; duplicados comparten número. Sin order no hay número y aparece Pendiente de ordenar; padre sin order corta el prefijo. Raíz contenedora sin número. NavigationLabel se utiliza en árbol, migas y controles de DocumentNavigator. Títulos editoriales/DocLink/TreeTable no se renumeran.

Índice derivado schemaVersion:2 con order nullable, created/modified, sortDate, numberPath, numberLabel y pendingOrder. references.json mantiene formato/destinos. Se actualizan guía, arquitectura, contrato, prompt, estado/continuidad y operación. Sin nuevas dependencias ni cambios de workflows.

## Correcciones realizadas durante la implementación

La primera propuesta consideró fechas persistidas junto al registro de IDs; se descartó por la aclaración del usuario antes de guardar la entrega. No se han conservado cambios a navigation-ids.json ni a los scripts de reserva/lectura para usar esas fechas. Solo los campos YAML del documento son autoría temporal.

Una prueba real mostró que Astro puede convertir timestamps YAML sin comillas en Date. Se adaptó el esquema y se mantuvo la comprobación estricta de la fuente original. No se rellenan milisegundos implícitos de timestamps sin precisión: el lector fuente los rechaza. Se recomienda citar las cadenas ISO.

## Validación

- npm run check: 41 pruebas y Astro check de 43 archivos, sin errores/avisos/hints.
- npm run build: diez documentos y 404, catorce referencias validadas, quince pruebas HTML/DOM correctas.
- npm run test:navigation:ordering: un build real en copia temporal, con mismos orders y fechas YAML separadas por 1 ms, además de documentos sin order. Posición, números compartidos, marca pendiente y referencias correctos.
- npm run test:references:rebuild: regresión de dos builds con caché/renombrado correcta.
- Total: 58 pruebas persistentes ejecutadas; check/build habitual ejecutaría 56. Las dos reconstrucciones adicionales son comandos explícitos.
- Las pruebas de dominio validan prioridad created/modificado, zonas/fechas imposibles/precisión, raíz neutra, prefijos, invariancia al mover ramas y ausencia de fuentes temporales implícitas. El fixture altera el mtime físico hasta 2040 sin cambiar el orden YAML.
- git diff --check y enlaces locales de Markdown comprobados. Sin inspección visual completa ni cambios del componente TreeTable/laboratorio; la verificación no acredita layout/móvil/táctil.

Main/Pages conservan 2cdba36. La rama incluye la documentación integral anterior; no se abren/fusionan PR, publican releases ni despliega. El siguiente paso operativo sería revisar y autorizar la integración/publicación de esta entrega; NAV-04 permanece separado y sin autorización.
