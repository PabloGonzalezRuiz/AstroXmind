# Hoja de ruta

## Prioridad vigente — decisión del 17-11-2026

Esta decisión sustituye el orden de prioridades anterior que situaba NAV-04 como siguiente desarrollo. Inicio previsto al retomar el 18-11-2026 (Europe/Madrid); no hay ejecución automática ni recordatorio programado.

1. **Edición desde la wiki:** resolver autenticación y permisos; abrir un documento existente, editar contenido, previsualizar y guardar el cambio en el repositorio. Verificar el commit y distinguir guardado de publicación; comprobar el resultado publicado si se autoriza desplegar. Aún no implementado.
2. **Movimiento visual persistente:** solo después de verificar la edición normal. Botón «Mover» en cabecera, árbol con documento resaltado y flechas: arriba/abajo entre hermanos; izquierda promueve al nivel del padre, después de él; derecha convierte en hijo del hermano anterior, mostrando el destino. Trasladar la rama completa conservando IDs y relaciones internas; previsualizar numeración, deshacer/cancelar y guardar los cambios en el repositorio. Desactivar operaciones imposibles y rechazar ciclos. Aún no implementado.

El arrastre queda como alternativa posterior. NAV-04 y el resto de ampliaciones se posponen; conservar su registro sin iniciarlas. No adoptar ahora nuevas claves de orden ni migraciones del modelo. La lógica de movimiento debe ser independiente de Actions; el acceso autorizado guarda, y el proceso de build valida/publica. Conservar order opcional, empates con mismo número y fechas exclusivamente YAML.

Alcance autorizado en esta conversación: actualizar la planificación y continuidad; no implementar hoy estas funciones ni desplegarlas. La próxima sesión empieza por revisar el estado remoto y concretar la primera edición completa desde la wiki. No presentar esta fecha como una tarea autónoma programada.


Estado contrastado el 17-11-2026 sobre main publicado 2cdba36. Esta revisión documental no añade funcionalidad ni cambia main. [Arquitectura](02-architecture.md), [historia](18-development-history.md) y [estado](04-project-status.md).

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

NAV-01/02/03 están integrados y publicados en 2cdba36, con CI/build/Pages y HTTP verificados. NAV-04…08 siguen sin implementar y requieren autorización propia. Orden de trabajo NAV-01 → NAV-02 → NAV-03 → NAV-04 → NAV-05 → NAV-06 → NAV-07; NAV-08 opcional. Las pruebas se añaden con cada comportamiento, no se posponen a la fase de robustez. Detalle en [docs/13-navigation-phase.md](13-navigation-phase.md).

**Prioridad anterior sustituida:** NAV-04 queda pospuesto por la decisión vigente de edición y movimiento visual. Al cerrar cada paso, explicar el siguiente y pedir autorización antes de implementarlo. La publicación previa de NAV-01/02/03 ya terminó. El encargo actual solo actualiza documentación; NAV-04 y una nueva publicación requieren autorización aplicable.

## 2. Robustez y accesibilidad — AST-029 / AST-012

Revisar teclado/foco, móvil, árboles grandes, extracción de sublistas, validación de anotaciones y aislamiento TypeScript del laboratorio. Adaptar regresiones MDX; PR #5 anterior no integrado. Las comprobaciones necesarias para cada NAV se realizan en ese paso, no esperan esta fase.

## 3. Seguridad y mantenimiento — AST-003.5

Reevaluar dependencias y ambos lockfiles; revisión de PR #1 y documentación de PR #4. No cerrar ni fusionar trabajo antiguo automáticamente.

## 4. Summary y Boundary — AST-018 (aplazados)

Modelo semántico de grupos, referencias e IDs; considerar el contrato de IDs introducido por Navegación, sin implementarlo prematuramente en esa fase.

## 5. Presets y exportación XMind — AST-023

Modelo intermedio, fixtures reales y round-trip en Desktop. No confundir exportación HTML/PDF de NAV-06 con exportación .xmind.

## 6. Editor y persistencia

Fuera del comportamiento actual de StackBlitz; definir después alcance y guardado.

## 7. Contenido de estudio — AST-024 (aplazado)

Decidir acceso, fuentes/licencias antes de publicar. PR #2 permanece separado.

## 8. Biblioteca de componentes — AST-027 (último hito)

Agrupar componentes y tema compartido, evaluar paquete interno, mantener wiki como catálogo. No publicar npm ni crear repositorios hasta acordarlo.

## Ya completado

Wiki/laboratorio Astro; corchetes sin escapes; clases por nivel y nodo; plegado y estado inicial heredables; numeración heredable/start local y reinicio tras padre sin número; 14 demos Resultado/Código; NAV-01/02/03; pantalla completa con centrado y scroll. Ver estado y contrato, no volver a implementarlos.

## Ampliación inmediata autorizada de NAV-02

Orden opcional, fechas YAML created/modified con milisegundos, pendientes al final y numeración por order con duplicados compartidos. Implementación en rama; [contrato](20-navigation-ordering.md). No modifica la prioridad de NAV-04 ni concede autorización para iniciarlo/publicar.
