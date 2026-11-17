# Orden opcional, fechas YAML y numeración del navegador

Ampliación autorizada de NAV-02, preparada en feature/navigation-order-created-20261117. Base: documentación e0e3d6 sobre main publicado 2cdba36. No es NAV-04 ni una publicación nueva. No cambia numeración ni plegado de TreeTable.

## Regla de orden entre hermanos

1. Primero los documentos con navigation.order explícito, de menor a mayor.
2. Si comparten order, comparar la fecha declarada en navigation.created; si no existe, navigation.modified.
3. Después, todos los documentos sin order; se ordenan por esa misma fecha, de más antigua a más reciente.
4. Si no hay fecha declarada, van después de los hermanos de su grupo que sí la tienen. Una fecha idéntica, o ausente en ambos, se desempata finalmente por ID estable.

Se mantiene parent obligatorio/existente; omitir order no permite padres ausentes ni ciclos. order, si aparece, sigue siendo entero seguro no negativo. `order: null`, cadenas o valores fraccionarios no significan «sin orden»: omitir la propiedad.

## Las fechas pertenecen al YAML de autoría

```yaml
navigation:
  id: doc-000007
  parent: doc-000006
  order: 2
  created: "2026-11-17T16:05:12.037Z"
  modified: "2026-11-17T16:05:12.124Z"
```

created y modified son opcionales, están junto a order y exigen fecha/hora ISO con tres cifras de milisegundos y zona horaria. Se recomienda citarlas como cadenas. Se admite Z o un offset explícito, por ejemplo +01:00; internamente se normalizan a UTC conservando los milisegundos. Se rechazan horas locales sin zona, fechas imposibles y valores sin milisegundos.

created tiene prioridad; modified solo se usa si falta created. Cambiar la fecha de modificación no reordena un documento que conserva su fecha de creación. Un valor declarado inválido se rechaza aunque exista el otro campo válido: no se ocultan errores de metadatos.

La comparación no consulta timestamps del archivo, fechas Git, registro de IDs ni hora del build. El ledger navigation-ids.json sigue reservando exclusivamente IDs. No se importan fechas automáticamente ni se inventa una fecha si falta. La misma fuente produce el mismo orden al copiar archivos, descargar un checkout o construir en GitHub.

La aplicación tampoco actualiza modified al compilar. Quien edita/genera el documento controla esos metadatos. Un proceso de conversión o una IA debe escribirlos dentro del frontmatter de cada salida. Ejemplo de documentos emitidos en el mismo segundo:

```yaml
# Documento A
created: "2026-11-17T16:05:12.037Z"
# Documento B
created: "2026-11-17T16:05:12.038Z"
```

En una página real ambos campos van dentro de navigation; el bloque ilustra las dos marcas separadas. Los milisegundos permiten compararlas sin recurrir a la fecha física del archivo. Si ambas marcas coinciden exactamente, el ID es el desempate final; no se promete unicidad temporal por usar tres decimales. La conversión Pandoc/IA no se implementa en esta ampliación: se define la entrada que puede generar.

## Numeración heredada y pendientes

La numeración utiliza directamente los valores de order, no posiciones consecutivas calculadas. Bajo un padre con número 10, order:2 produce 10.2. Dos hermanos con order:2 comparten 10.2 aunque su fecha determine cuál se muestra primero.

Sin order, el documento no recibe número y muestra «Pendiente de ordenar». Sus hijos que sí tengan order reinician la ruta desde su propio valor, sin recuperar números de un abuelo. La raíz única es un contenedor y no muestra número ni marca de pendiente; su order:0 no añade prefijo 0 a todas las páginas.

Ejemplo bajo un padre numerado 10:

| Documento | order | created | Posición | Número |
|---|---|---|---|---|
| B | 2 | 2026-11-17T16:05:12.001Z | Primero | 10.2 |
| A | 2 | 2026-11-17T16:05:12.002Z | Segundo | 10.2 |
| D | omitido | 2026-11-17T16:05:12.003Z | Después de todos los ordenados | Sin número; pendiente |
| C | omitido | 2026-11-17T16:05:12.004Z | Después de D | Sin número; pendiente |

El mismo componente NavigationLabel se usa en árbol lateral/integrado, migas y DocumentNavigator (ubicación, padre, hermanos, hijos, anterior/siguiente). El título editorial y los enlaces DocLink de prosa no se reescriben con números. Las marcas visibles no alteran IDs, URLs ni destinos de referencias.

## Cambios de modelo y compatibilidad

navigation admite id/parent obligatorios y order/created/modified opcionales. El índice derivado pasa a schemaVersion:2. Cada nodo incluye order (número o null), created/modified normalizados o null, sortDate derivada, numberPath, numberLabel y pendingOrder. references.json conserva su formato anterior.

El índice continúa inmutable, validado y recorrido en preorden; cambiar de padre recalcula la numeración de toda la rama. Las fechas no se heredan. Los documentos antiguos siguen siendo válidos sin fechas; si sus orders son iguales y no las declaran, conservan el desempate determinista por ID. El registro de IDs y su generador no se modifican.

Astro puede convertir un timestamp YAML sin comillas en Date. El esquema adapta ese tipo, y el lector de fuente valida igualmente la representación authored con milisegundos. Las pruebas de build comprueban el caso real; citar cadenas evita ambigüedades al generar con otras herramientas.

## Verificación

- Pruebas de dominio: orden explícito vs ausente, fechas iguales/distintas, offsets, milisegundos consecutivos, modified como fallback, ausencia de fecha y rechazo de valores inválidos.
- Pruebas de invariancia: copiar/reescribir un archivo no cambia su orden; información de fechas en el ledger no participa; mover/renombrar conserva identidad/fechas y recalcula números.
- HTML real: números y pendientes coherentes en todos los controles; raíz neutra; títulos no alterados.
- npm run test:navigation:ordering: build Astro real en copia temporal con hermanos de igual order y otros sin order; fechas YAML distintas solo por un milisegundo. Comprueba posición, números compartidos, pendientes y referencias.
- npm run test:references:rebuild conserva la prueba de caché/renombrado anterior.

Sin nuevas dependencias. No hay inspección visual completa; DOM/build no acreditan layout o táctil. La wiki pública conserva 2cdba36 hasta autorización expresa para integrar/publicar esta rama.
