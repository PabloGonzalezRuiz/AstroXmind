---
title: "Laboratorio remark-directive · semántica y estilos"
description: "Ejemplos de directivas con su Markdown original y su resultado."
---

<link rel="stylesheet" href="/AstroXmind/remark-directive-gallery.css" />

# Laboratorio de remark-directive

Esta página se procesa con **remark-directive** y un transformador semántico local. Cada sección muestra primero el **Markdown en crudo** y después el **resultado real**. Las directivas de este laboratorio son extensiones de AstroXmind, no elementos estándar que remark-directive conozca por sí solo.

## 1. Concepto / definición

**Markdown original:**

```md
:::definicion{#def-mru .azul}
**Movimiento rectilíneo uniforme (MRU):** movimiento con velocidad constante.
:::
```

**Renderizado:**

:::definicion{#def-mru .azul}
**Movimiento rectilíneo uniforme (MRU):** movimiento con velocidad constante.
:::

## 2. Artículo jurídico con identidad semántica

**Markdown original:**

```md
:::articulo{#ce-14 numero="14"}
**Artículo 14.** Los españoles son iguales ante la ley.
:::
```

**Renderizado:**

:::articulo{#ce-14 numero="14"}
**Artículo 14.** Los españoles son iguales ante la ley.
:::

## 3. Nota y advertencia

**Markdown original:**

```md
:::nota
La distancia recorrida y el desplazamiento no siempre coinciden.
:::

:::advertencia
No confundas rapidez y velocidad.
:::
```

**Renderizado:**

:::nota
La distancia recorrida y el desplazamiento no siempre coinciden.
:::

:::advertencia
No confundas rapidez y velocidad.
:::

## 4. Ejemplo resuelto

**Markdown original:**

```md
:::ejemplo{#ejemplo-mru}
Un móvil recorre 100 m en 20 s.

**Velocidad:** 100 / 20 = **5 m/s**.
:::
```

**Renderizado:**

:::ejemplo{#ejemplo-mru}
Un móvil recorre 100 m en 20 s.

**Velocidad:** 100 / 20 = **5 m/s**.
:::

## 5. Pregunta de repaso

**Markdown original:**

```md
:::pregunta{dificultad="basica"}
¿Qué magnitud se expresa en m/s?
:::
```

**Renderizado:**

:::pregunta{dificultad="basica"}
¿Qué magnitud se expresa en m/s?
:::

## 6. Jerarquía: tema, capítulo y sección

**Markdown original:**

```md
:::tema{#tema-cinematica}
### Cinemática
:::capitulo
#### Magnitudes del movimiento
:::seccion
- Posición
- Desplazamiento
- Velocidad
:::
:::
:::
```

**Renderizado:**

:::tema{#tema-cinematica}
### Cinemática
:::capitulo
#### Magnitudes del movimiento
:::seccion
- Posición
- Desplazamiento
- Velocidad
:::
:::
:::

## 7. Bloque plegable interactivo

**Markdown original:**

```md
:::plegable{titulo="Mostrar explicación"}
La velocidad media es desplazamiento dividido por tiempo.
:::
```

**Renderizado:**

:::plegable{titulo="Mostrar explicación"}
La velocidad media es desplazamiento dividido por tiempo.
:::

## 8. Referencia y cita

**Markdown original:**

```md
:::referencia{destino="#ce-14"}
Consulta el artículo 14 mostrado arriba.
:::

:::cita{fuente="Constitución Española"}
Fragmento de estudio: «Los españoles son iguales ante la ley».
:::
```

**Renderizado:**

:::referencia{destino="#ce-14"}
Consulta el artículo 14 mostrado arriba.
:::

:::cita{fuente="Constitución Española"}
Fragmento de estudio: «Los españoles son iguales ante la ley».
:::

## 9. Regla y resumen

**Markdown original:**

```md
:::regla
En MRU, la velocidad es constante.
:::

:::resumen
- La posición depende del sistema de referencia.
- La distancia es escalar.
- El desplazamiento es vectorial.
:::
```

**Renderizado:**

:::regla
En MRU, la velocidad es constante.
:::

:::resumen
- La posición depende del sistema de referencia.
- La distancia es escalar.
- El desplazamiento es vectorial.
:::

## 10. Clases CSS propias

**Markdown original:**

```md
:::concepto{.azul .compacto}
Esta tarjeta usa dos clases de presentación.
:::
```

**Renderizado:**

:::concepto{.azul .compacto}
Esta tarjeta usa dos clases de presentación.
:::

---

**Alcance:** los nombres de directiva aportan semántica y las clases controlan la apariencia. El bloque plegable utiliza HTML nativo `details`. Las referencias son enlaces; este prototipo no implementa todavía validación de enlaces, generación de índices ni sincronización con XMind.
## 11. Tabla comparativa con clases personalizadas

**Markdown original:**

```md
:::tabla-estudio{.comparativa}
| Magnitud | Qué mide | Unidad SI | Naturaleza |
| --- | --- | --- | --- |
| Distancia | Longitud total del recorrido | m | Escalar |
| Desplazamiento | Cambio entre posición inicial y final | m | Vectorial |
| Rapidez | Distancia por unidad de tiempo | m/s | Escalar |
| Velocidad | Desplazamiento por unidad de tiempo | m/s | Vectorial |
:::
```

**Renderizado:**

:::tabla-estudio{.comparativa}

| Magnitud | Qué mide | Unidad SI | Naturaleza |
| --- | --- | --- | --- |
| Distancia | Longitud total del recorrido | m | Escalar |
| Desplazamiento | Cambio entre posición inicial y final | m | Vectorial |
| Rapidez | Distancia por unidad de tiempo | m/s | Escalar |
| Velocidad | Desplazamiento por unidad de tiempo | m/s | Vectorial |

:::

## 12. Tabla árbol con dos ramas

**Markdown original:**

```md
:::tabla-arbol{#arbol-organizacion .tema-estudio aria-label="Organización del Estado"}
::::nodo{.raiz}
**Organización del Estado**
:::::nodo{.rama}
**Poder legislativo**
::::::nodo
Cortes Generales
::::::
::::::nodo
Congreso y Senado
::::::
:::::
:::::nodo{.rama}
**Poder ejecutivo**
::::::nodo
Presidencia del Gobierno
::::::
::::::nodo
Administración General del Estado
::::::
:::::
::::
:::
```

**Renderizado:**

:::tabla-arbol{#arbol-organizacion-vista .tema-estudio aria-label="Organización del Estado"}
::::nodo{.raiz}
**Organización del Estado**
:::::nodo{.rama}
**Poder legislativo**
::::::nodo
Cortes Generales
::::::
::::::nodo
Congreso y Senado
::::::
:::::
:::::nodo{.rama}
**Poder ejecutivo**
::::::nodo
Presidencia del Gobierno
::::::
::::::nodo
Administración General del Estado
::::::
:::::
::::
:::

## 13. Tabla árbol de tres ramas con anchura proporcional

Este ejemplo sigue la imagen de referencia: cada grupo de hermanos ocupa una fila; el ancho de cada rama depende del número de hojas que contiene. Así, las celdas se alinean aunque las ramas tengan distinta profundidad.

**Markdown original:**

```md
:::tabla-arbol{#articulo-15 .tema-constitucion aria-label="Desglose del artículo 15"}
::::nodo{.raiz}
**Artículo 15 · Vida e integridad física y moral**
:::::nodo{.rama}
**A. Derecho a la vida**
:::::
:::::nodo{.rama}
**B. Integridad**
::::::nodo
B.1 Física
::::::
::::::nodo
B.2 Moral
::::::
:::::
:::::nodo{.rama}
**C. Prohibiciones**
::::::nodo
C.1 Tortura
::::::
::::::nodo
C.2 Tratos
:::::::nodo
C.2.1 Inhumanos
:::::::
:::::::nodo
C.2.2 Degradantes
:::::::
::::::
:::::
::::
:::
```

**Renderizado:**

:::tabla-arbol{#articulo-15-vista .tema-constitucion aria-label="Desglose del artículo 15"}
::::nodo{.raiz}
**Artículo 15 · Vida e integridad física y moral**
:::::nodo{.rama}
**A. Derecho a la vida**
:::::
:::::nodo{.rama}
**B. Integridad**
::::::nodo
B.1 Física
::::::
::::::nodo
B.2 Moral
::::::
:::::
:::::nodo{.rama}
**C. Prohibiciones**
::::::nodo
C.1 Tortura
::::::
::::::nodo
C.2 Tratos
:::::::nodo
C.2.1 Inhumanos
:::::::
:::::::nodo
C.2.2 Degradantes
:::::::
::::::
:::::
::::
:::

En pantalla, A ocupa una hoja de ancho, B dos y C tres. En móvil se conserva la geometría del árbol y se desplaza horizontalmente la tabla para leer las celdas sin aplastarlas.

**Regla para IA:** escribir una directiva `nodo` por elemento y anidar sus hijos dentro de ella. El transformador cuenta las hojas de cada rama y calcula automáticamente sus proporciones; las clases `raiz`, `rama` y `tema-constitucion` controlan el estilo.

**Estado:** estas tablas árbol se generan con directivas y clases CSS propias. La galería demuestra el formato; el conversor Markdown general aún no está implementado.
