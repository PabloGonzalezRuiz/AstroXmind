# Presets y JSON XMind — diseño pendiente

**Alcance actual:** material de referencia/prototipos, no conversión XMind ni Summary/Boundary implementados en el pipeline vigente. La entrada activa de TreeTable es una lista MDX con anotaciones entre corchetes; no interpreta los bloques xmind/tabla-arbol descritos en pruebas históricas. Ver docs/02-architecture.md y docs/18-development-history.md.

Actualización 17-11-2026: integración autorizada de NAV-01/02/03 en main, desde el código validado 238ce44. Ver docs/17-navigation-publication.md y las ejecuciones del SHA actual para la evidencia de despliegue.

Esta propuesta corresponde a AST-023 y al prototipo declarativo anterior, no al parser MDX activo. No hay carga de presets ni exportación .xmind en AstroXmind. La nueva prioridad Navegación genera su propio modelo documental; no debe confundirse con estructura visual XMind.

Referencia real: examples/xmind/TablaArbol/content.json y .xmind. structureClass org.xmind.ui.treetable.toptitle identifica la variante observada. No inventar valores de la variante izquierda sin un ejemplo real. El JSON incluye IDs/títulos/revisionId de la prueba; no es un preset directamente cargable.

Diseño futuro: defaults globales → preset estructural → preset visual opcional → propiedades explícitas → títulos/jerarquía del contenido. Objetos se combinan por propiedad; listas se reemplazan salvo regla concreta. Extraer estilos y estructura de fixtures reales sin reutilizar identidad de sesión.

El antiguo bloque yaml xmind y directiva rootTopic pertenecen al prototipo Remark, conservado en scripts y ejemplos históricos. El contrato activo está en docs/10. Tras Navegación, evaluar correspondencia de IDs y relaciones con el modelo de exportación, sin imponer IDs XMind al árbol documental.
