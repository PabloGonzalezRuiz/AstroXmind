---
title: "Galería de tablas árbol"
description: "Comparativa interactiva de árboles generables por IA"
---

# Galería de tablas árbol

Esta galería compara tecnologías por facilidad de generación mediante IA, plegado y presentación. Todas las demostraciones usan el mismo temario de ejemplo.

## 1. HTML nativo: árbol plegable

**Tecnología:** HTML `details` / `summary`. **IA:** excelente. **Plegado:** sí, sin JavaScript. **Estética:** personalizable con CSS.

<details open>
<summary><strong>▣ Sistemas informáticos</strong></summary>
<details open style="margin-left:1.5rem"><summary>▸ Hardware</summary>
<div style="margin-left:1.5rem">Procesador · Memoria RAM · Almacenamiento</div>
</details>
<details style="margin-left:1.5rem"><summary>▸ Software</summary>
<div style="margin-left:1.5rem">Sistemas operativos · Aplicaciones</div>
</details>
<details style="margin-left:1.5rem"><summary>▸ Redes</summary>
<div style="margin-left:1.5rem">TCP/IP · DNS · HTTP</div>
</details>
</details>

**Formato que puede escribir la IA:**

```md
- Sistemas informáticos
  - Hardware
    - Procesador
    - Memoria RAM
  - Software
    - Sistemas operativos
  - Redes
    - TCP/IP
```

Un conversor puede transformar la lista Markdown en HTML plegable.

## 2. Tabla árbol de dos columnas

**Tecnología:** HTML semántico + CSS + elementos `details`. **IA:** muy buena mediante conversor. **Plegado:** por secciones. **Estética:** tabla de estudio.

| Tema | Tipo |
| --- | --- |
| ▾ Sistemas informáticos | Raíz |
| ↳ Hardware | Categoría |
| ↳ ↳ Procesador | Concepto |
| ↳ ↳ Memoria RAM | Concepto |
| ↳ Software | Categoría |
| ↳ Redes | Categoría |

<details>
<summary>Mostrar subtemas de Hardware</summary>

| Subtema | Definición |
| --- | --- |
| Procesador | Ejecuta instrucciones |
| Memoria RAM | Almacenamiento temporal |
| Almacenamiento | Conserva datos |

</details>

## 3. Árbol horizontal estilo mapa mental

**Tecnología:** CSS propio o SVG generado desde datos jerárquicos. **IA:** excelente si genera Markdown y un componente lo dibuja. **Plegado:** requiere JavaScript para plegar ramas.

```text
Sistemas informáticos ─┬─ Hardware ─┬─ Procesador
                       │            └─ Memoria RAM
                       ├─ Software ─── Sistemas operativos
                       └─ Redes ────── TCP/IP
```

## 4. Tabulator Data Tree

**Tecnología:** biblioteca JavaScript Tabulator. **IA:** buena si genera datos JSON o Markdown convertidos a JSON. **Plegado:** nativo por fila. **Ordenación:** sí. **Búsqueda:** sí, según configuración.

## 5. AG Grid Tree Data

**Tecnología:** biblioteca JavaScript AG Grid. **IA:** buena mediante adaptador de datos. **Plegado:** sí. **Ordenación y filtrado:** sí, según configuración. Algunas funciones de Tree Data requieren licencia Enterprise.

## Criterio de selección

| Opción | IA | Plegado | Dependencias |
| --- | --- | --- | --- |
| HTML details | Excelente | Sí | Ninguna |
| Tabla Markdown | Excelente | Parcial, con HTML | Ninguna |
| Árbol horizontal propio | Excelente con conversor | Requiere implementación | CSS/JS propios |
| Tabulator | Buena con conversor | Sí | Biblioteca JS |
| AG Grid Tree Data | Buena con conversor | Sí | Biblioteca JS; revisar licencia |

**Nota:** las tres primeras son demostraciones renderizadas o esquemáticas; Tabulator y AG Grid se describen como candidatos, no están integrados en esta página. La sintaxis Markdown propuesta es una entrada común, no un conversor implementado todavía.
