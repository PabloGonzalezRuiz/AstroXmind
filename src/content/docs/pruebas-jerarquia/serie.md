---
title: "Artículos de prueba"
description: "Prueba de navegación jerárquica entre archivos de una misma carpeta."
navigation:
  id: doc-000005
  parent: doc-000010
  order: 30
---

Esta serie demuestra una jerarquía lógica entre documentos guardados en la misma carpeta. Es contenido ficticio para comprobar la navegación; no es normativa.

Todos los archivos están en `src/content/docs/pruebas-jerarquia/`. La ruta de ubicación, el árbol lateral y los enlaces al padre, hijos y anterior/siguiente se generan a partir de `navigation`.

## Estructura de la serie

- Artículo 1: organización de la colección.
  - Artículo 2: desarrollo de la organización.
    - Artículo 3: detalle del desarrollo.
- Artículo 4: revisión independiente dentro de la serie.

El Artículo 4 es hermano del Artículo 1. Los artículos 2 y 3 pertenecen a la rama del Artículo 1 aunque todos estén en la misma carpeta.

## Prueba de traslado de rama

En `articulo-2.md`, cambiar solo `parent: doc-000006` por `parent: doc-000009` mueve el Artículo 2 y su Artículo 3 bajo el Artículo 4. No se cambian sus IDs, archivos, URLs ni el padre del Artículo 3. Al reconstruir la wiki se actualizan todos los controles de navegación.

Los enlaces estables se prueban en el [apartado Navegación](doc:doc-000010).

## Metadatos del Artículo 2

Este bloque está en el frontmatter de `articulo-2.md`. El padre representa pertenencia lógica, no una carpeta:

```yaml
navigation:
  id: doc-000007
  parent: doc-000006
  order: 10
```

Para mover la rama bajo el Artículo 4, el único cambio es `parent: doc-000009`.

[Comenzar por el Artículo 1](doc:doc-000006).
