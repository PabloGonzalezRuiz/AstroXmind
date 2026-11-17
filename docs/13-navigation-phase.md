# Fase Navegación — AST-034

Estado contrastado el 17-11-2026 sobre main `5f1a33ff7a846a42914f33be61782adb0e5f8452`. Esta revisión solo cambia documentación en una rama separada.

## 1. Fase «Navegación» — AST-034 (primera prioridad)

Objetivo: árbol documental fuerte, referencias bidireccionales rápidas y base compartida para wiki, consulta e impresión/descarga de ramas. Inspirarse en patrones de notas enlazadas, sin reproducir la aplicación Obsidian ni adoptar una dependencia de su formato.

| Paso | Funcionalidad | Viabilidad y alcance |
|---|---|---|
| NAV-01 | Identidad y árbol documental | Alta. ID estable, padre único y orden; índice derivado en build y validación de árbol. Base de todo lo demás. |
| NAV-02 | Navegación jerárquica contextual | Alta tras NAV-01. Ruta de ubicación, subir al padre, hijos, anterior/siguiente y árbol con posición actual. |
| NAV-03 | Referencias a documentos, apartados y nodos | Alta/media. Destinos con ID estable y enlaces normales; revelar antecesores plegados, seleccionar Resultado si corresponde y resaltar destino. |
| NAV-04 | Enlaces entrantes y salientes | Alta tras NAV-03. Generar backlinks con contexto y salto al punto de cita, sin escribir el enlace inverso a mano. |
| NAV-05 | Ida/vuelta rápida | Media. Volver al origen exacto con posición, foco, pestaña y plegado; historial reciente limitado a la sesión y fallback sin historial. |
| NAV-06 | Imprimir y descargar una rama | Media. Recorrer descendientes en orden; vista continua desplegada con índice y enlaces internos. Primera descarga: HTML autónomo por rama; impresión del navegador/PDF con estilos adecuados. |
| NAV-07 | Consulta sin abandonar el origen | Media. Vista previa accesible y panel lateral de referencia, con abrir documento y retorno; teclado y táctil, no solo hover. |
| NAV-08 | Mapa local de conexiones | Opcional, tras lo anterior. Grafo del documento y sus enlaces cercanos; no sustituye el árbol ni condiciona impresión/offline. Evaluar plugin existente antes de desarrollar. |

Estado: fase planificada, ningún NAV implementado. Orden de trabajo NAV-01 → NAV-02 → NAV-03 → NAV-04 → NAV-05 → NAV-06 → NAV-07; NAV-08 opcional. Las pruebas se añaden con cada comportamiento, no se posponen a la fase de robustez. Detalle en [docs/13-navigation-phase.md](13-navigation-phase.md).

**Siguiente autorización solicitada: solo NAV-01.** Al cerrar cada paso, explicar el siguiente y pedir autorización antes de implementarlo. El encargo actual permite planificación/documentación, no ejecución de NAV-01 ni integración/publicación.

## Ideas aprovechadas y límites

Aprovechar enlaces entre notas y bloques, backlinks con contexto, consultas laterales y reutilización de contenido. Definir un árbol explícito para pertenencia; una referencia cruzada no crea parentesco. Un documento tiene un padre, pero puede recibir muchas referencias. Las carpetas/URLs no son su identidad.

No copiar interfaz completa, formato exclusivo, editor, ecosistema de plugins ni sincronización Obsidian. No instalar Obsidian ni incorporar paquetes como parte de esta planificación. Conservar Markdown/MDX y generar destinos adecuados para cada salida.

## NAV-01: primer cambio ejecutable, pendiente de autorización

### Alcance propuesto

Añadir un bloque de metadatos navigation al esquema de contenido de Starlight, separado de sidebar. Sus campos serán id estable, parent (ID o null para raíz) y order (entero no negativo). No usar el id de Astro como identidad editorial; no depender del nombre del archivo. Un ejemplo de **diseño todavía no implementado**:

```yaml
navigation:
  id: componentes-tree-table
  parent: guia-componentes
  order: 10
```

Derivar durante el build un registro id → título/ruta/padre/orden/hijos/antecesores. Una sola raíz documental explícita para el ámbito de la wiki; no incluir docs/ de mantenimiento ni src/examples como páginas del árbol. Ordenar hermanos por order y desempatar por ID para resultados deterministas. Los IDs y sus referencias serán exactos, no títulos deducidos automáticamente.

Aplicarlo a las cuatro páginas actuales sin añadir temario: inicio como raíz; guía y laboratorio como hijos; TreeTable bajo guía. Es una propuesta inicial revisable, no cambia todavía rutas ni menús. No crear nuevas páginas de contenido para aparentar jerarquía.

### Validaciones y aceptación

- Cada página del ámbito tiene ID estable único; raíz con parent null, las restantes con padre existente.
- Rechazar IDs duplicados, padres ausentes, autociclos/ciclos, páginas desconectadas y orden inválido.
- No permitir que contenido público dependa de un padre borrador/no exportado. Separar el ámbito si más adelante existe contenido privado.
- Consultar raíz, padre, hijos ordenados, antecesores y descendientes desde el registro; cambiar la ruta conservando ID no cambia la pertenencia.
- Mantener las cuatro URLs actuales y builds correctos. Probar árbol válido y errores con fixtures pequeños y significativos.
- Entregar esquema, registro, metadatos de las cuatro páginas, documentación y validación. Sin UI nueva, backlinks, exportador, cambio del lenguaje de TreeTable ni nuevas dependencias en este primer paso.

### Cierre

Informar archivos y validación, mostrar la estructura resultante y pedir autorización para NAV-02. La autorización NAV-01 no autoriza publicar main, abrir/fusionar PR o release salvo que el usuario lo incluya expresamente.

## Referencias portables

NAV-03 resolverá identidad de documento y destino local. Mantener enlaces Markdown normales donde sea posible; no fijar todavía sintaxis especial ni prometer que #^block de Obsidian funcionará sin adaptador. Para nodos proponer IDs locales estables, no índices de fila ni texto del título. Al imprimir varias páginas usar anclas con namespace de documento para evitar colisiones.

Comprobar destino existente/único y distinguir referencias internas de URLs externas. Los archivos ?raw de ejemplos no cuentan como nuevas citas de la página ni duplican backlinks. Las referencias en componentes MDX deben tener una extracción explícita: no asumir que un escaneo simple de Markdown detectará todas.

## Referencias bidireccionales y retorno

NAV-04 indexa citas origen → destino y deriva destino → orígenes, con fragmento/contexto. El backlink debe ir al lugar de la cita, no solo al inicio de la página. Mantener independiente NAV-05: retorno de una consulta concreta con estado de sesión, ruta alternativa si se abre un enlace directo, y restauración accesible sin ejecutar saltos inesperados.

## Impresión y descarga de ramas

NAV-06 incluye la página seleccionada y solo descendientes jerárquicos, en recorrido preorden. Las referencias cruzadas no añaden automáticamente páginas ajenas. Ofrecer índice y numeración/secciones coherentes; expandir contenido plegado para imprimir y excluir botones/pestañas de demostración duplicadas. La salida de estudio prioriza Resultado y conserva el código solo si se solicita.

Usar vista de impresión continua, sin recortar tablas por scroll. Para tablas muy anchas evaluar presentación lineal o apaisada antes de prometer fidelidad en PDF. Resolver links dentro de la rama y señalar destinos externos a la descarga. Enlaces a páginas omitidas deben seguir disponibles online o mostrarse como no incluidas, nunca simular disponibilidad offline.

Primera exportación prevista: un HTML autónomo con estilos/scripts/recursos necesarios para abrir sin servidor y sin red; no entregar dist/ como si fuera portable sin transformar rutas y módulos. Probar un paquete descargado con red desactivada. PDF inicial mediante vista de impresión del navegador; una generación PDF dedicada sería un paso adicional.

## Viabilidad, dependencias y decisiones aplazadas

NAV-01/02 son trabajo sobre contenido y Starlight existente. NAV-03/04 añaden resolución e indexación. NAV-05/07 requieren interacción y revisión de foco, móvil y ramas plegadas. NAV-06 depende de la jerarquía y de un formato de salida comprobable; el grafo no es requisito.

Evaluar starlight-site-graph o BrainDB solo si simplifican el modelo requerido y se verifica compatibilidad con la versión instalada, MDX, destinos de nodo y exportación. No sustituir el árbol con un grafo ni introducir ClientRouter como requisito: podría exigir adaptar ciclo de vida de componentes.

## Fuentes de inspiración consultadas

- [Obsidian: enlaces y bloques](https://obsidian.md/help/links).
- [Obsidian: backlinks con contexto](https://obsidian.md/help/plugins/backlinks).
- [Obsidian: contenido incrustado](https://obsidian.md/help/embeds).
- [Starlight: navegación y componentes](https://starlight.astro.build/reference/overrides/).
- [Starlight Site Graph](https://fevol.github.io/starlight-site-graph/).
- [Astro Digital Garden: vistas previas](https://astro-digital-garden.stereobooster.com/recipes/link-previews/).

Estas fuentes inspiran funciones; no hay incorporación de su código ni compatibilidad prometida con sus formatos.
