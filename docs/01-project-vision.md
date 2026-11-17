# Visión y alcance

Estado contrastado el 17-11-2026 sobre main `5f1a33ff7a846a42914f33be61782adb0e5f8452`. Esta revisión parte del SHA publicado indicado y añade NAV-01/02/03 en la rama feature/nav-01-document-tree, sin cambiar main ni publicar.

Mantener una wiki técnica con componentes Astro reutilizables y evolucionar hacia un árbol documental de estudio, navegable en ambas direcciones y exportable por ramas. La fase pública actual sigue centrada en componentes; no introduce temario.

## Principios

1. Cada página tendrá identidad estable y posición explícita, independiente de su carpeta/URL.
2. Pertenencia jerárquica define navegación, orden y descendientes imprimibles. Referencias cruzadas conectan contenido sin cambiar de padre.
3. Conservar Markdown/MDX y generar salidas web/offline/impresión a partir de la misma fuente.
4. Enlaces a bloques/nodos, backlinks con contexto y retorno rápido se añadirán de forma incremental.
5. La interfaz debe servir para estudiar: consulta lateral, contexto y retorno antes que un grafo global complejo.
6. Inspirarse en Obsidian por sus patrones de uso, sin reproducir aplicación, editor, sincronización ni sintaxis exclusiva obligatoria.

Navegación es la primera fase pendiente; biblioteca se mantiene al final. Detalle en docs/13-navigation-phase.md. NAV-01/02/03 están autorizados e implementados en la rama feature/nav-01-document-tree; pendientes de integración/publicación. NAV-04…08 siguen sin implementar y requieren autorización propia.
