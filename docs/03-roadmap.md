# Hoja de ruta

Estado contrastado el 17-11-2026 sobre main `5f1a33ff7a846a42914f33be61782adb0e5f8452`. Esta revisión parte del SHA publicado indicado y añade NAV-01/02 en la rama feature/nav-01-document-tree, sin cambiar main ni publicar.

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

NAV-01 y NAV-02 están autorizados, implementados y validados en la rama feature/nav-01-document-tree; pendientes de integración/publicación. NAV-03…08 siguen sin implementar y requieren autorización propia. Orden de trabajo NAV-01 → NAV-02 → NAV-03 → NAV-04 → NAV-05 → NAV-06 → NAV-07; NAV-08 opcional. Las pruebas se añaden con cada comportamiento, no se posponen a la fase de robustez. Detalle en [docs/13-navigation-phase.md](13-navigation-phase.md).

**Siguiente autorización solicitada: solo NAV-03.** Al cerrar cada paso, explicar el siguiente y pedir autorización antes de implementarlo. El encargo autoriza NAV-01/02, documentación y artículos de prueba en rama; no NAV-03 ni integración/publicación.

## 2. Robustez y accesibilidad — AST-029 / AST-012

Revisar teclado/foco, móvil, árboles grandes, extracción de sublistas y validación de anotaciones. Adaptar regresiones MDX; PR #5 anterior no integrado. Las comprobaciones necesarias para cada NAV se realizan en ese paso, no esperan esta fase.

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

Wiki/laboratorio Astro; corchetes sin escapes; clases por nivel y nodo; plegado y estado inicial heredables; numeración heredable/start local y reinicio tras padre sin número; 11 demos Resultado/Código; pantalla completa con centrado y scroll. Ver estado y contrato, no volver a implementarlos.
