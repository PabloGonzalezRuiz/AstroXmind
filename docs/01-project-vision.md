# Visión y alcance de AstroXmind

Referencia publicada y auditada: 2cdba36, 17-11-2026. [Arquitectura completa](02-architecture.md) e [historia](18-development-history.md).

Crear una wiki de estudio donde Markdown/MDX permita expresar estructuras y formatos que una persona y una IA entiendan con claridad. Hoy el sitio publica documentación técnica y artículos ficticios de prueba, no temario real. TreeTable aproxima una representación útil de tabla árbol sin depender del visor XMind en ejecución.

La organización lógica debe ser explícita: documentos con identidad estable, padre y orden, aunque compartan carpeta. Cada página conoce su ubicación. Mover una rama cambia un parent; referencias entre documentos no alteran esa pertenencia. Es la base futura para imprimir/descargar una rama entera.

Disponibles: componente de tabla con estilos/numeración/plegado/fullscreen, demos Resultado/Código, árbol y navegación contextual, referencias a apartados/nodos y revelado de destinos. Publicación estática GitHub Pages, dos paquetes npm, sin backend/login/editor persistente.

Pendientes: backlinks con contexto (NAV-04), retorno exacto, exportación/impresión autónoma, consulta lateral y grafo opcional. Summary/Boundary aplazados; exportación XMind y biblioteca separadas del producto actual. La biblioteca conserva el último lugar de la hoja de ruta. Inspirarse en patrones útiles de herramientas de notas sin clonar Obsidian ni asumir sus formatos exclusivos.

Prioridad inmediata: documentación y continuidad fieles al repositorio, después explicar NAV-04 y obtener autorización. Una planificación no implementa código ni concede permiso de publicación. Conservar la historia y los prototipos como referencia, con su estado explícito.
