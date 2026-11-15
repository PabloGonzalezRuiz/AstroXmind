---
title: "Galería · Markdown semántico"
description: "Árboles generados realmente desde directivas semánticas"
---

# Galería de Markdown semántico

Esta galería **sí se genera a partir del lenguaje de autoría**, mediante un procesador local de AstroXmind ejecutado antes de compilar la web. El bloque `{arbol}` es una extensión experimental propia, no una directiva oficial de MyST.

<style>
.ax-sem-tree details {border:1px solid var(--sl-color-hairline);border-radius:.6rem;margin:.5rem 0;overflow:hidden}
.ax-sem-tree summary {cursor:pointer;padding:.8rem;font-weight:650;overflow-wrap:anywhere}
.ax-sem-tree details[open]>summary {background:var(--sl-color-bg-nav)}
.ax-sem-children {padding:.4rem .6rem .6rem}
.ax-sem-children details {margin-left:.45rem}
.ax-sem-leaf {padding:.65rem .85rem;border-bottom:1px solid var(--sl-color-hairline);overflow-wrap:anywhere}
@media(max-width:600px){.ax-sem-children{padding:.25rem}.ax-sem-children details{margin-left:.2rem}}
</style>

## Árbol plegable generado desde Markdown

```{arbol} Constitución Española
- Título preliminar
  - Artículo 1 · Estado social y democrático de Derecho
  - Artículo 2 · Unidad y autonomía
- Título I · Derechos y deberes fundamentales
  - Artículo 14 · Igualdad ante la ley
  - Artículo 16 · Libertad ideológica y religiosa
```

## Segundo ejemplo: temario informático

```{arbol} Sistemas informáticos
- Hardware
  - Procesador
  - Memoria RAM
  - Almacenamiento
- Software
  - Sistemas operativos
  - Aplicaciones
- Redes
  - TCP/IP
  - DNS
  - HTTP
```

## Qué se está probando

El contenido anterior es **el origen real** de las vistas desplegables. La compilación interpreta las listas jerárquicas y produce HTML semántico con `details` y `summary`, sin JavaScript en el navegador. Puedes plegar y desplegar ramas desde el móvil. Todavía no incluye ordenación, búsqueda ni tablas de datos avanzadas.
