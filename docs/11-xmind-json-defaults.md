# Presets y JSON XMind — diseño pendiente

Estado contrastado el 17-11-2026 sobre main `5f1a33ff7a846a42914f33be61782adb0e5f8452`. Esta revisión parte del SHA publicado indicado y añade NAV-01/02/03 en la rama feature/nav-01-document-tree, sin cambiar main ni publicar.

Esta propuesta corresponde a AST-023 y al prototipo declarativo anterior, no al parser MDX activo. No hay carga de presets ni exportación .xmind en AstroXmind. La nueva prioridad Navegación genera su propio modelo documental; no debe confundirse con estructura visual XMind.

Referencia real: examples/xmind/TablaArbol/content.json y .xmind. structureClass org.xmind.ui.treetable.toptitle identifica la variante observada. No inventar valores de la variante izquierda sin un ejemplo real. El JSON incluye IDs/títulos/revisionId de la prueba; no es un preset directamente cargable.

Diseño futuro: defaults globales → preset estructural → preset visual opcional → propiedades explícitas → títulos/jerarquía del contenido. Objetos se combinan por propiedad; listas se reemplazan salvo regla concreta. Extraer estilos y estructura de fixtures reales sin reutilizar identidad de sesión.

El antiguo bloque yaml xmind y directiva rootTopic pertenecen al prototipo Remark, conservado en scripts y ejemplos históricos. El contrato activo está en docs/10. Tras Navegación, evaluar correspondencia de IDs y relaciones con el modelo de exportación, sin imponer IDs XMind al árbol documental.
