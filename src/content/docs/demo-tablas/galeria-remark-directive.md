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

La cabecera es el título de nivel 1. Los títulos de nivel 2 y 3 forman las ramas y sus celdas se extienden verticalmente según las filas que ocupen sus descendientes.

**Markdown original:**

```md
:::rootTopic{#organizacion .tema-estudio aria-label="Organización del Estado" structureClass="org.xmind.ui.treetable.toptitle"}
# Organización del Estado
## Poder legislativo
### Cortes Generales
### Congreso y Senado
## Poder ejecutivo
### Presidencia del Gobierno
### Administración General del Estado
:::
```

**Renderizado:**

:::rootTopic{#organizacion-vista .tema-estudio aria-label="Organización del Estado" structureClass="org.xmind.ui.treetable.toptitle"}
# Organización del Estado
## Poder legislativo
### Cortes Generales
### Congreso y Senado
## Poder ejecutivo
### Presidencia del Gobierno
### Administración General del Estado
:::

## 13. Tabla árbol con la sintaxis AstroXmind propuesta

El bloque representa directamente el objeto `rootTopic` del JSON. La jerarquía se expresa solo con niveles de encabezado: `#` para `rootTopic.title`, y `##` en adelante para los elementos de `children.attached`. El `.md` original importado por XMind se conserva en la carpeta de ejemplos; aquí la lista final se expresa como `####`, tal como propones para AstroXmind. `structureClass` usa el nombre y el valor del JSON de XMind.

**Lenguaje AstroXmind propuesto:**

```md
:::rootTopic{.Ley structureClass="org.xmind.ui.treetable.toptitle" customWidth="978"}
# TablaArbol

## Nodo1

### Nodo1Subnodo1

### Nodo1Subnodo2

## Nodo2

### Nodo1Subnodo2

#### Nodo1Subnodo2Subnodo1
:::
```

**Renderizado:**

:::rootTopic{.Ley structureClass="org.xmind.ui.treetable.toptitle" customWidth="978"}
# TablaArbol

## Nodo1

### Nodo1Subnodo1

### Nodo1Subnodo2

## Nodo2

### Nodo1Subnodo2

#### Nodo1Subnodo2Subnodo1
:::

La regla de maquetación es: una fila por cada camino hoja; cada nodo ocupa su columna y usa `rowspan` para cubrir todas las filas de sus descendientes. Las columnas se dimensionan por el contenido de sus celdas; en pantallas estrechas la tabla permite desplazamiento horizontal.

**Regla para IA:** la entrada mínima es `:::rootTopic{structureClass="org.xmind.ui.treetable.toptitle"}`. El `#` define `rootTopic.title`; cada encabezado `##` o inferior crea un tema en `children.attached`. Añade `.Ley` solo para elegir esa presentación o propiedades como `customWidth="978"` si quieres sobrescribir el preset. Las propiedades adicionales de `rootTopic` se escriben con sus nombres JSON exactos y se conservan en `data-xmind-properties`.

**Alcance:** el transformador interpreta el objeto `rootTopic` y su árbol `children.attached`, y lo representa como una tabla HTML semántica cuando `structureClass` selecciona `org.xmind.ui.treetable.toptitle`. La galería demuestra esta regla; el conversor Markdown general aún no está implementado.

Archivos originales y análisis del formato: [ejemplo XMind de TablaArbol en el repositorio](https://github.com/PabloGonzalezRuiz/AstroXmind/tree/main/examples/xmind/TablaArbol/).
