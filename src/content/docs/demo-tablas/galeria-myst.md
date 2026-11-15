---
title: "Galería · MyST Markdown"
description: "Directivas MyST y demostración visual"
---
# Galería MyST Markdown

**Prototipo comparativo:** la demostración de abajo funciona con HTML nativo. La directiva `{dropdown}` es de MyST; Astro no la interpreta automáticamente sin una integración. `{tree}` sería una extensión propia, no estándar.

## Vista interactiva en móvil y escritorio

<style>
.ax-demo details {border:1px solid var(--sl-color-hairline);border-radius:.6rem;margin:.5rem 0;padding:.2rem .7rem}
.ax-demo summary {cursor:pointer;padding:.6rem .2rem;font-weight:650}
.ax-demo details details {margin-left:.65rem}
.ax-demo .scroll {overflow-x:auto;max-width:100%}
.ax-demo table {width:100%;min-width:420px}
</style>
<div class="ax-demo">
<details open><summary>Constitución Española</summary>
<details open><summary>Título preliminar</summary><p>Artículo 1 · Estado social y democrático de Derecho</p><p>Artículo 2 · Unidad y autonomía</p></details>
<details><summary>Título I · Derechos y deberes fundamentales</summary><p>Artículo 14 · Igualdad ante la ley</p><p>Artículo 16 · Libertad ideológica y religiosa</p></details>
</details>
<div class="scroll"><table><thead><tr><th>Bloque</th><th>Contenido</th><th>Tipo</th></tr></thead><tbody><tr><td>Título preliminar</td><td>Principios constitucionales</td><td>Temario</td></tr><tr><td>Título I</td><td>Derechos y deberes</td><td>Temario</td></tr></tbody></table></div>
</div>

## Ejemplo de autoría MyST

~~~md
# Constitución Española

```{dropdown} Título preliminar
- Artículo 1
- Artículo 2
```

```{dropdown} Título I
- Artículo 14
- Artículo 16
```
~~~

**Evaluación IA:** sintaxis descriptiva y cercana a Markdown; exige un paso de transformación para Astro.
