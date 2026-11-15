---
title: "Galería · MDX"
description: "Componentes MDX y demostración visual"
---
# Galería MDX

**Prototipo comparativo:** la vista interactiva utiliza HTML nativo. Los componentes `Tree` y `TreeNode` del ejemplo son una **API propuesta**, no componentes instalados en AstroXmind.

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

## Ejemplo de autoría MDX

~~~mdx
<Tree collapsible>
  <TreeNode title="Constitución Española">
    <TreeNode title="Título preliminar">
      - Artículo 1
      - Artículo 2
    </TreeNode>
    <TreeNode title="Título I">
      - Artículo 14
      - Artículo 16
    </TreeNode>
  </TreeNode>
</Tree>
~~~

**Evaluación IA:** expresivo y compatible con componentes reales; la IA debe conocer sus nombres y propiedades.
