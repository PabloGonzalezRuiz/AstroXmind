---
title: Galería de temas declarativos
description: Un Markdown normal, distintas vistas elegidas por una declaración previa.
---

# Galería · mismo Markdown, distintos temas

**Objetivo:** el contenido permanece en Markdown estándar. Una declaración anterior determina el tema, los colores, la disposición y el comportamiento de toda la sección. El tema se implementaría con CSS y un procesador de directivas; **las declaraciones siguientes son propuestas de sintaxis, no directivas nativas de MyST ni funciones ya instaladas**.

## Contenido de referencia (idéntico en todos los ejemplos)

```md
## Constitución Española
- Título preliminar
  - Artículo 1. Estado social y democrático
  - Artículo 2. Unidad y autonomía
- Título I. Derechos y deberes
  - Derechos fundamentales
  - Garantías
```

## Galería A · declaración para el siguiente elemento y sus descendientes

```md
::: {view="tree" theme="xmind-color" collapsible=true}
## Constitución Española
- Título preliminar
  - Artículo 1. Estado social y democrático
  - Artículo 2. Unidad y autonomía
- Título I. Derechos y deberes
  - Derechos fundamentales
  - Garantías
```

Esta forma **se propone** como declaración de una sola línea: el compilador la vincularía al encabezado siguiente y a su subárbol hasta el próximo encabezado del mismo nivel o superior. No es sintaxis estándar de MyST.

<details open>
<summary><strong>Vista conceptual · XMind color</strong></summary>
<div style="border-left:5px solid #7356c8;padding:12px;background:#f3efff;color:#28223b;border-radius:8px">
<strong>🟣 Constitución Española</strong>
<details open><summary style="color:#6240ae">🟪 Título preliminar</summary><ul><li>Artículo 1. Estado social y democrático</li><li>Artículo 2. Unidad y autonomía</li></ul></details>
<details open><summary style="color:#6240ae">🟪 Título I. Derechos y deberes</summary><ul><li>Derechos fundamentales</li><li>Garantías</li></ul></details>
</div>
</details>

## Galería B · bloque con apertura y cierre

```md
::: {view="tree-table" theme="oposiciones-azul" sortable=true}
## Constitución Española
- Título preliminar
  - Artículo 1. Estado social y democrático
  - Artículo 2. Unidad y autonomía
- Título I. Derechos y deberes
  - Derechos fundamentales
  - Garantías
:::
```

Aquí el alcance es explícito. Un renderizador futuro podría generar columnas, plegado y ordenación. La siguiente vista solo demuestra colores y plegado, **no ordenación real**.

<details open>
<summary><strong>Vista conceptual · tabla árbol azul</strong></summary>
<div style="border:1px solid #9cc5eb;border-radius:8px;overflow:hidden;color:#183452">
<div style="background:#175f9c;color:white;padding:10px;font-weight:bold">Constitución Española · Estructura</div>
<details open><summary style="padding:10px;background:#e7f2ff">Título preliminar</summary><div style="padding:10px 18px">↳ Artículo 1. Estado social y democrático</div><div style="padding:10px 18px">↳ Artículo 2. Unidad y autonomía</div></details>
<details open><summary style="padding:10px;background:#e7f2ff">Título I. Derechos y deberes</summary><div style="padding:10px 18px">↳ Derechos fundamentales</div><div style="padding:10px 18px">↳ Garantías</div></details>
</div>
</details>

## Galería C · tema compacto para estudiar en móvil

```md
::: {view="outline" theme="study-compact" accent="#15803d"}
## Constitución Española
- Título preliminar
  - Artículo 1. Estado social y democrático
  - Artículo 2. Unidad y autonomía
- Título I. Derechos y deberes
  - Derechos fundamentales
  - Garantías
:::
```

<details open>
<summary><strong>Vista conceptual · verde compacto</strong></summary>
<div style="background:#eaf7ef;color:#14532d;padding:12px;border-radius:8px">
<strong>Constitución Española</strong>
<details><summary>Título preliminar</summary><ul><li>Artículo 1. Estado social y democrático</li><li>Artículo 2. Unidad y autonomía</li></ul></details>
<details><summary>Título I. Derechos y deberes</summary><ul><li>Derechos fundamentales</li><li>Garantías</li></ul></details>
</div>
</details>

## Contrato semántico para una IA

La IA conserva títulos, listas y tablas Markdown sin transformarlos. Solo antepone una declaración con las claves `view`, `theme` y, cuando corresponda, `collapsible`, `sortable` o `accent`. Los temas CSS predefinidos deciden tipografía, fondos, bordes, colores y espaciados. La interactividad necesita JavaScript o componentes además de CSS.

**Decisión técnica pendiente:** definir y programar un plugin de compilación para Astro que interprete estas directivas y aplique el alcance de forma inequívoca. Las vistas de esta página son maquetas HTML plegables, no el renderizador definitivo.
