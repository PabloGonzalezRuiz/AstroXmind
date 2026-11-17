# MarkXMind y elementos especiales — evaluación de diseño

Estado contrastado el 17-11-2026 sobre main `5f1a33ff7a846a42914f33be61782adb0e5f8452`. Esta revisión parte del SHA publicado indicado y añade NAV-01/02 en la rama feature/nav-01-document-tree, sin cambiar main ni publicar.

MarkXMind fue estudiado por sus conceptos Summary, Boundary, relaciones, notas y plegado. Se conserva compatibilidad conceptual como objetivo, no adopción de su parser ni sustitución del lenguaje activo.

Summary/Boundary siguen aplazados (AST-018). Las clases CSS o una sección HTML resumen no implementan un objeto Summary. Son necesarios grupos de nodos hermanos, IDs estables y validación. Aprovechar en su momento el contrato de referencias NAV-03, sin adelantar esa semántica en NAV-01.

AST-017 clases ya está publicada en TreeTable MDX; la rama Remark anterior no debe integrarse para obtenerla. Los YAML clases/xmind y las directivas propuestas anteriormente son antecedentes, no sintaxis activa. El contrato actual está en docs/10.

Fuentes de referencia:

- https://github.com/jinzcdev/markxmind
- https://github.com/jinzcdev/markxmind/blob/main/docs/xmindmark-syntax.md
- https://github.com/jinzcdev/markxmind/blob/main/docs/specification.md

La guía XMindMark aportada se revisó previamente. Antes de incorporar cualquier paquete reevaluar versión/licencia/dependencias y probar fixtures/round-trip, sin atribuir interoperabilidad completa a esta evaluación. Navegación es ahora la primera fase; biblioteca AST-027 sigue al final.
