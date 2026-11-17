# Arquitectura

Estado contrastado el 17-11-2026 sobre main `5f1a33ff7a846a42914f33be61782adb0e5f8452`. Esta revisión solo cambia documentación en una rama separada.

## Activa

Astro + Starlight + MDX, salida estática en GitHub Pages bajo /AstroXmind. Cuatro páginas de contenido y 404 técnico. docs/ de mantenimiento no es contenido publicado; src/examples se usa para demos, no como páginas del árbol.

TreeTable recibe HTML del slot generado desde listas Markdown, construye nodos, resuelve numeración/clases/collapsible/folded y genera tabla completa. Un custom element gestiona plegado, fullscreen nativo/alternativo y estado, sin React/Vue. Sin JS se muestra todo el contenido.

Componente y CSS de demostración en examples/astro-component-lab; la wiki importa esa fuente. ComponentExample usa Tabs/TabItem/Code de Starlight y demos MDX + ?raw. El laboratorio es independiente y las ediciones de StackBlitz no vuelven a GitHub. Scripts Remark/Pandoc son prototipos heredados, fuera del pipeline activo.

## Diseño de Navegación, no implementado

Metadatos editoriales → registro jerárquico validado → árbol/contexto y enumeración de ramas. Sobre ese registro, resolución de destinos y citas → backlinks, retornos, paneles y exportaciones. Sin base de datos externa para la primera implementación: registro derivado del contenido durante el build.

Extender docsSchema() con un bloque navigation sin sustituir IDs de Astro. Separar identidad de página, ancla local y destino de salida. No depender de ClientRouter ni instalar un sistema completo de notas. Los componentes interactivos deben probarse con la estrategia de navegación elegida antes de cambiar el router.

Validar ciclos/duplicados/padres ausentes y mantener ámbito de publicación. La exportación de ramas no incluye automáticamente destinos de citas externas al subárbol. Biblioteca no creada; exportación XMind no implementada.
