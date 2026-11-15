---
title: "Galería de tablas árbol"
description: "Cinco ejemplos visibles y adaptados al móvil, agrupados por tecnología"
---

# Galería de tablas árbol

**Laboratorio de pruebas · móvil y escritorio.** Toca los títulos para abrir y cerrar ramas. Los ejemplos **TAB-001 a TAB-003 funcionan sin bibliotecas externas**. TAB-004 y TAB-005 son **previsualizaciones funcionales con HTML nativo** del tipo de interfaz que podríamos construir con Tabulator y AG Grid: **no son integraciones de esas bibliotecas**.

<style>
.ax-lab { --ax-line: var(--sl-color-hairline, #c5cbd3); --ax-surface: var(--sl-color-bg-nav, #f2f5f8); --ax-accent: var(--sl-color-accent, #3768b2); }
.ax-lab details { border: 1px solid var(--ax-line); border-radius: .65rem; margin: .45rem 0; overflow: hidden; background: var(--sl-color-bg, white); }
.ax-lab summary { padding: .8rem .85rem; cursor: pointer; font-weight: 650; line-height: 1.5; overflow-wrap: anywhere; }
.ax-lab summary:focus-visible { outline: 3px solid var(--ax-accent); outline-offset: -3px; }
.ax-lab details[open] > summary { background: var(--ax-surface); border-bottom: 1px solid var(--ax-line); }
.ax-lab .ax-children { padding: .45rem .65rem .65rem; }
.ax-lab .ax-children details { margin-left: .4rem; }
.ax-lab .ax-note { font-size: .88rem; opacity: .85; margin: .35rem .4rem; }
.ax-lab .ax-scroll { max-width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; border: 1px solid var(--ax-line); border-radius: .6rem; }
.ax-lab table { display: table; width: 100%; border-collapse: collapse; margin: 0; font-size: .91rem; }
.ax-lab th, .ax-lab td { padding: .7rem .65rem; text-align: left; border-bottom: 1px solid var(--ax-line); vertical-align: top; overflow-wrap: anywhere; }
.ax-lab th { background: var(--ax-surface); }
.ax-lab tr:last-child td { border-bottom: 0; }
.ax-lab td:first-child { min-width: 8rem; }
.ax-lab td details { margin: 0; }
.ax-lab td summary { padding: .45rem; }
.ax-lab .ax-tree-row { display: flex; align-items: flex-start; flex-wrap: wrap; gap: .55rem; }
.ax-lab .ax-chip { display: inline-block; border: 1px solid var(--ax-line); border-radius: .5rem; padding: .55rem .7rem; background: var(--ax-surface); font-weight: 600; }
.ax-lab .ax-flow { display: flex; align-items: flex-start; gap: .7rem; min-width: 34rem; padding: .85rem; }
.ax-lab .ax-flow > details { flex: 1; min-width: 10rem; margin: 0; }
.ax-lab .ax-flow > details > summary { min-height: 3rem; }
.ax-lab .ax-flow .ax-children { font-size: .9rem; }
.ax-lab .ax-tag { font-size: .75rem; font-weight: 700; opacity: .8; letter-spacing: .03em; }
@media (max-width: 600px) {
  .ax-lab .ax-children { padding: .35rem .4rem .5rem; }
  .ax-lab .ax-children details { margin-left: .2rem; }
  .ax-lab summary { padding: .85rem .65rem; }
  .ax-lab th, .ax-lab td { padding: .55rem .4rem; }
  .ax-lab .ax-mobile-cards thead { display: none; }
  .ax-lab .ax-mobile-cards, .ax-lab .ax-mobile-cards tbody, .ax-lab .ax-mobile-cards tr, .ax-lab .ax-mobile-cards td { display: block; width: 100%; min-width: 0; }
  .ax-lab .ax-mobile-cards tr { border-bottom: 1px solid var(--ax-line); padding: .4rem; }
  .ax-lab .ax-mobile-cards td { border: 0; padding: .3rem; }
  .ax-lab .ax-mobile-cards td[data-label]::before { content: attr(data-label) ": "; font-weight: 700; }
}
</style>

## TAB-001 · Árbol vertical plegable

**Tecnología:** HTML nativo (`details`/`summary`) + CSS. **IA:** excelente. **Plegado:** real, sin JavaScript. **Móvil:** adaptable.

<div class="ax-lab">
<details open>
<summary>🗂️ Sistemas informáticos</summary>
<div class="ax-children">
<details open>
<summary>🖥️ Hardware</summary>
<div class="ax-children">
<details><summary>Procesador</summary><p class="ax-note">Ejecuta instrucciones.</p></details>
<details><summary>Memoria RAM</summary><p class="ax-note">Almacenamiento temporal.</p></details>
<details><summary>Almacenamiento</summary><p class="ax-note">Conserva datos.</p></details>
</div>
</details>
<details><summary>💻 Software</summary><div class="ax-children"><p class="ax-note">Sistemas operativos · Aplicaciones</p></div></details>
<details><summary>🌐 Redes</summary><div class="ax-children"><p class="ax-note">TCP/IP · DNS · HTTP</p></div></details>
</div>
</details>
</div>

## TAB-002 · Tabla árbol de estudio

**Tecnología:** HTML semántico + CSS + `details`. **IA:** excelente con datos estructurados. **Plegado:** real dentro de celdas. **Móvil:** tarjetas apiladas para evitar columnas ilegibles.

<div class="ax-lab">
<div class="ax-scroll">
<table class="ax-mobile-cards">
<thead><tr><th>Concepto / rama</th><th>Descripción</th></tr></thead>
<tbody>
<tr><td><details open><summary>🖥️ Hardware</summary><div class="ax-children"><details><summary>Procesador</summary><p class="ax-note">CPU</p></details><details><summary>Memoria RAM</summary><p class="ax-note">Memoria volátil</p></details></div></details></td><td data-label="Descripción">Componentes físicos del equipo</td></tr>
<tr><td><details><summary>💻 Software</summary><div class="ax-children">Sistema operativo · Aplicaciones</div></details></td><td data-label="Descripción">Programas e instrucciones</td></tr>
<tr><td><details><summary>🌐 Redes</summary><div class="ax-children">TCP/IP · DNS · HTTP</div></details></td><td data-label="Descripción">Comunicación entre sistemas</td></tr>
</tbody>
</table>
</div>
</div>

## TAB-003 · Árbol horizontal

**Tecnología:** CSS flexible + HTML nativo. **IA:** excelente con estructura Markdown. **Plegado:** real. **Móvil:** desplazamiento horizontal intencionado; desliza la zona para ver las columnas.

<div class="ax-lab">
<div class="ax-scroll" role="region" aria-label="Árbol horizontal desplazable">
<div class="ax-flow">
<div class="ax-chip">🗂️ Sistemas informáticos →</div>
<details open><summary>Hardware</summary><div class="ax-children"><p>Procesador</p><p>Memoria RAM</p><p>Almacenamiento</p></div></details>
<details open><summary>Software</summary><div class="ax-children"><p>Sistemas operativos</p><p>Aplicaciones</p></div></details>
<details open><summary>Redes</summary><div class="ax-children"><p>TCP/IP</p><p>DNS</p><p>HTTP</p></div></details>
</div>
</div>
</div>

## TAB-004 · Previsualización de árbol de datos estilo Tabulator

**Tecnología objetivo:** Tabulator Data Tree (JavaScript). **En esta prueba:** HTML nativo, **no Tabulator**. **Plegado:** real. **Ordenación y búsqueda:** no implementadas; requerirían integrar la biblioteca o programarlas.

<div class="ax-lab">
<div class="ax-scroll">
<table class="ax-mobile-cards">
<thead><tr><th>Elemento</th><th>Tipo</th><th>Detalle</th></tr></thead>
<tbody>
<tr><td><details open><summary>▾ Hardware</summary><div class="ax-children"><details><summary>Procesador</summary><p class="ax-note">CPU</p></details><details><summary>RAM</summary><p class="ax-note">Memoria volátil</p></details></div></details></td><td data-label="Tipo">Categoría</td><td data-label="Detalle">3 conceptos</td></tr>
<tr><td><details><summary>▸ Software</summary><div class="ax-children">Sistema operativo · Aplicaciones</div></details></td><td data-label="Tipo">Categoría</td><td data-label="Detalle">2 conceptos</td></tr>
<tr><td><details><summary>▸ Redes</summary><div class="ax-children">TCP/IP · DNS · HTTP</div></details></td><td data-label="Tipo">Categoría</td><td data-label="Detalle">3 conceptos</td></tr>
</tbody>
</table>
</div>
</div>

## TAB-005 · Previsualización de árbol de datos estilo AG Grid

**Tecnología objetivo:** AG Grid Tree Data (JavaScript). **En esta prueba:** HTML nativo, **no AG Grid**. **Plegado:** real. **Ordenación y filtrado:** no implementados. Las funciones avanzadas de Tree Data pueden requerir licencia Enterprise.

<div class="ax-lab">
<details open>
<summary>📁 Sistemas informáticos <span class="ax-tag">RAÍZ</span></summary>
<div class="ax-children">
<details open><summary>📂 Hardware <span class="ax-tag">3 ELEMENTOS</span></summary><div class="ax-children"><div class="ax-chip">Procesador</div> <div class="ax-chip">RAM</div> <div class="ax-chip">Almacenamiento</div></div></details>
<details><summary>📂 Software <span class="ax-tag">2 ELEMENTOS</span></summary><div class="ax-children">Sistemas operativos · Aplicaciones</div></details>
<details><summary>📂 Redes <span class="ax-tag">3 ELEMENTOS</span></summary><div class="ax-children">TCP/IP · DNS · HTTP</div></details>
</div>
</details>
</div>

## Formato de entrada común para IA

Los cinco ejemplos usan el mismo contenido. La IA puede producir una lista Markdown como esta y un conversor futuro podrá elegir la vista:

```md
- Sistemas informáticos
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

**Importante:** el conversor Markdown → vistas aún no está implementado. Los IDs `TAB-001` a `TAB-005` son identificadores de demostración, no etiquetas semánticas ni clases CSS.

## Comparativa y próximos pasos

| Modelo | Visible en móvil | Plegado | Motor real |
| --- | --- | --- | --- |
| TAB-001 · Árbol vertical | Sí | Sí | HTML nativo |
| TAB-002 · Tabla árbol | Sí | Sí | HTML nativo |
| TAB-003 · Horizontal | Sí, deslizando | Sí | HTML + CSS |
| TAB-004 · Estilo Tabulator | Sí | Sí | Previsualización HTML |
| TAB-005 · Estilo AG Grid | Sí | Sí | Previsualización HTML |

La siguiente fase sería integrar **Tabulator real** y compararlo con los prototipos, tras comprobar licencias, tamaño y compatibilidad móvil.
