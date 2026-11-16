---
title: "Laboratorio remark-directive · semántica y estilos"
description: "Ejemplos de directivas con su Markdown original y su resultado."
---

<link rel="stylesheet" href="/AstroXmind/remark-directive-gallery.css" />

# Laboratorio de remark-directive

Esta página se procesa con **remark-directive** y un transformador semántico local. Cada sección muestra primero el **Markdown en crudo** y después el **resultado real**. Las directivas de este laboratorio son extensiones de AstroXmind, no elementos estándar que remark-directive conozca por sí solo.

## 1. Concepto / definición

**Markdown original:**

````md
:::definicion{#def-mru .azul}
**Movimiento rectilíneo uniforme (MRU):** movimiento con velocidad constante.
:::
````

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

````md
:::rootTopic{#organizacion .tema-estudio aria-label="Organización del Estado"}
```yaml xmind
structureClass: org.xmind.ui.treetable.toptitle
```
# Organización del Estado
## Poder legislativo
### Cortes Generales
### Congreso y Senado
## Poder ejecutivo
### Presidencia del Gobierno
### Administración General del Estado
:::
````

**Renderizado:**

:::rootTopic{#organizacion-vista .tema-estudio aria-label="Organización del Estado"}
```yaml xmind
structureClass: org.xmind.ui.treetable.toptitle
```
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

````md
:::rootTopic{.Ley}
```yaml xmind
structureClass: org.xmind.ui.treetable.toptitle
```
# TablaArbol

## Nodo1

### Nodo1Subnodo1

### Nodo1Subnodo2

## Nodo2

### Nodo1Subnodo2

#### Nodo1Subnodo2Subnodo1
:::
````

**Renderizado:**

:::rootTopic{.Ley}
```yaml xmind
structureClass: org.xmind.ui.treetable.toptitle
```
# TablaArbol

## Nodo1

### Nodo1Subnodo1

### Nodo1Subnodo2

## Nodo2

### Nodo1Subnodo2

#### Nodo1Subnodo2Subnodo1
:::

La regla de maquetación es: una fila por cada camino hoja; cada nodo ocupa su columna y usa `rowspan` para cubrir todas las filas de sus descendientes. Las columnas se dimensionan por el contenido de sus celdas; en pantallas estrechas la tabla permite desplazamiento horizontal.

**Regla para IA:** la entrada mínima es `:::rootTopic` con un bloque `xmind` que contenga `structureClass: org.xmind.ui.treetable.toptitle`. El `#` define `rootTopic.title`; cada encabezado `##` o inferior crea un tema en `children.attached`. Añade `.Ley` solo para elegir esa presentación. Las propiedades adicionales se escriben en el bloque `xmind` con jerarquía YAML, nombres XMind y tipos naturales; `customWidth: 978`, por ejemplo, es un número, sin comillas. Se conservan en `data-xmind-properties`.

**Alcance:** el transformador interpreta el objeto `rootTopic` y su árbol `children.attached`, y lo representa como una tabla HTML semántica cuando `structureClass` selecciona `org.xmind.ui.treetable.toptitle`. La galería demuestra esta regla; el conversor Markdown general aún no está implementado.

Archivos originales y análisis del formato: [ejemplo XMind de TablaArbol en el repositorio](https://github.com/PabloGonzalezRuiz/AstroXmind/tree/main/examples/xmind/TablaArbol/).

## 14. Etiquetas de estilo por nodo

Los encabezados pueden llevar al final etiquetas CSS y un ancla (`.rama-principal #derechos`). Las propiedades XMind del tema se expresan en un bloque `xmind` con jerarquía YAML, no como JSON en una línea.

````md
:::rootTopic{.Ley}
```yaml xmind
structureClass: org.xmind.ui.treetable.toptitle
```
# Derechos fundamentales

## Derechos {.rama-principal #derechos}
```yaml xmind
style:
  properties:
    fo:text-align: left
```
### Derecho a la vida {.subrama}
### Integridad {.subrama}
#### Integridad física {.concepto-clave}
#### Integridad moral {.concepto-clave}
:::
````

El mismo bloque se procesa y puede probarse aquí:

:::rootTopic{.Ley}
```yaml xmind
structureClass: org.xmind.ui.treetable.toptitle
```
# Derechos fundamentales

## Derechos {.rama-principal #derechos}
```yaml xmind
style:
  properties:
    fo:text-align: left
```
### Derecho a la vida {.subrama}
### Integridad {.subrama}
#### Integridad física {.concepto-clave}
#### Integridad moral {.concepto-clave}
:::

Correspondencia: `.rama-principal`, `.subrama` y `.concepto-clave` son etiquetas de presentación web definidas en `remark-directive-gallery.css`; `#derechos` es un ancla web; `structureClass` sigue siendo la propiedad XMind que selecciona la variante de tabla. El bloque `xmind` que sigue a `## Derechos` se asocia a ese nodo; su sangría simula el árbol de propiedades JSON y el resultado se conserva como `data-xmind-properties` en la celda.

El JSON real de la muestra de XMind aporta la referencia visual inicial: relleno `#EEEEEEFF`, fuente global `NeverMind Hand`, grosor de línea `3pt` y paleta con `#000229` y `#1F2766`. `.Ley` aproxima esos valores en CSS; las clases por nodo refinan partes concretas sin alterar el preset entero. Las reglas CSS deben declararse expresamente en la hoja de estilos: una clase nueva en Markdown no inventa por sí sola su aspecto.


## 15. Clases CSS predeterminadas por nivel

El bloque `yaml clases` asigna clases predeterminadas a cada nivel de tema. Las clases escritas en el encabezado se añaden después; las repetidas se conservan una sola vez.

````md
:::rootTopic{.Ley}
```yaml clases
niveles:
  1: rama-principal
  2: subrama
  3: concepto-clave
```
# Constitución
## Derechos {.rama-principal}
### Igualdad
#### Igualdad ante la ley
## Garantías
### Tutela judicial
:::
````

**Renderizado:**

:::rootTopic{.Ley}
```yaml clases
niveles:
  1: rama-principal
  2: subrama
  3: concepto-clave
```
# Constitución
## Derechos {.rama-principal}
### Igualdad
#### Igualdad ante la ley
## Garantías
### Tutela judicial
:::

`##` es el nivel 1; `###` es el nivel 2. Por eso las clases `rama-principal` se asignan a Derechos y Garantías, mientras que `subrama` se asigna a Igualdad y Tutela judicial. La clase explícita del encabezado se combina con la clase automática. Los nombres de clase necesitan sus reglas CSS, como las clases ya definidas para la presentación `.Ley`.