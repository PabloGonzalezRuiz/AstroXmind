---
title: "Galería · MyST Markdown"
description: "Correspondencia entre MyST, HTML y vista visual"
---
# Galería MyST Markdown

**Estado:** comparación didáctica, todavía **no** una conversión automática de MyST. El HTML mostrado abajo es el que utiliza la demostración visual; se ha eliminado la tabla ajena al ejemplo. Hasta integrar y validar el procesador oficial, no debe interpretarse como HTML generado por MyST.

## 1. Código de autoría MyST

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

## 2. HTML de la demostración (escrito manualmente)

Este HTML representa **los mismos dos desplegables y los mismos cuatro artículos**. No es una salida certificada del compilador MyST.

~~~html
<h1>Constitución Española</h1>
<details open>
  <summary>Título preliminar</summary>
  <ul><li>Artículo 1</li><li>Artículo 2</li></ul>
</details>
<details>
  <summary>Título I</summary>
  <ul><li>Artículo 14</li><li>Artículo 16</li></ul>
</details>
~~~

## 3. Resultado visual del HTML anterior

<style>
.ax-myst-example details {border:1px solid var(--sl-color-hairline);border-radius:.6rem;margin:.5rem 0;padding:.2rem .7rem}
.ax-myst-example summary {cursor:pointer;padding:.6rem .2rem;font-weight:650}
.ax-myst-example ul {margin:.4rem 0 .7rem 1.5rem}
</style>
<div class="ax-myst-example">
<h1>Constitución Española</h1>
<details open>
  <summary>Título preliminar</summary>
  <ul><li>Artículo 1</li><li>Artículo 2</li></ul>
</details>
<details>
  <summary>Título I</summary>
  <ul><li>Artículo 14</li><li>Artículo 16</li></ul>
</details>
</div>

## Próxima validación

Una vez integrado MyST, sustituiremos el HTML manual por **el HTML real generado a partir del bloque MyST**, manteniendo la misma secuencia: fuente → HTML generado → resultado. La apariencia exacta y la interacción dependen del renderizador y sus estilos.
