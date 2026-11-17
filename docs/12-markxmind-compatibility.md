# MarkXMind y elementos especiales — evaluación de diseño

Actualización 17-11-2026: integración autorizada de NAV-01/02/03 en main, desde el código validado 238ce44. Ver docs/17-navigation-publication.md y las ejecuciones del SHA actual para la evidencia de despliegue.

MarkXMind fue estudiado por sus conceptos Summary, Boundary, relaciones, notas y plegado. Se conserva compatibilidad conceptual como objetivo, no adopción de su parser ni sustitución del lenguaje activo.

Summary/Boundary siguen aplazados (AST-018). Las clases CSS o una sección HTML resumen no implementan un objeto Summary. Son necesarios grupos de nodos hermanos, IDs estables y validación. Aprovechar en su momento el contrato de referencias NAV-03, sin adelantar esa semántica en NAV-01.

AST-017 clases ya está publicada en TreeTable MDX; la rama Remark anterior no debe integrarse para obtenerla. Los YAML clases/xmind y las directivas propuestas anteriormente son antecedentes, no sintaxis activa. El contrato actual está en docs/10.

Fuentes de referencia:

- https://github.com/jinzcdev/markxmind
- https://github.com/jinzcdev/markxmind/blob/main/docs/xmindmark-syntax.md
- https://github.com/jinzcdev/markxmind/blob/main/docs/specification.md

La guía XMindMark aportada se revisó previamente. Antes de incorporar cualquier paquete reevaluar versión/licencia/dependencias y probar fixtures/round-trip, sin atribuir interoperabilidad completa a esta evaluación. Navegación es ahora la primera fase; biblioteca AST-027 sigue al final.
