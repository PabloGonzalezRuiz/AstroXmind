# Especificación: Vinculación inteligente de temario y preguntas para AstroXmind

## Objetivo

Convertir el temario y los exámenes oficiales en una red de conocimiento estructurada que permita:

- Vincular automáticamente preguntas y conceptos.
- Navegar bidireccionalmente entre teoría y preguntas.
- Calcular la importancia real de cada concepto.
- Detectar lagunas de estudio.
- Generar preguntas tipo test relevantes basadas en exámenes oficiales.
- Priorizar el estudio en función de evidencia objetiva.

---

# Principios

## No trabajar con temas completos

Evitar:

```text
Tema 5 - Redes
```

Trabajar con conceptos concretos:

```text
DNS
DHCP
IPv4
IPv6
TCP
UDP
RAID
REST
SOAP
```

Cada concepto debe ser un nodo individual de conocimiento.

---

# Modelo de datos

## Conceptos (temario)

Ejemplo:

```yaml
---
id: dns
title: DNS

type: concept

parent: redes

related:
  - dhcp
  - ipv4
  - ipv6
  - udp

tags:
  - internet
  - resolucion-nombres
---
```

El contenido de la página contiene la teoría.

---

## Preguntas oficiales

Ejemplo:

```yaml
---
id: age_2024_15

type: official-question

year: 2024

correct_answer: B

concepts:
  - dns
  - udp
  - puertos
---
```

Las preguntas deben vincularse siempre a conceptos, nunca directamente a temas.

---

# Proceso de importación

## 1. Procesar el temario

Al importar:

```text
PDF
DOCX
MD
```

identificar:

- conceptos
- relaciones
- jerarquías
- enlaces semánticos

y generar automáticamente nodos YAML.

---

## 2. Procesar las preguntas

Para cada pregunta:

```text
¿Qué puerto utiliza DNS normalmente?
```

la IA debe identificar:

```yaml
concepts:
  - dns
  - udp
  - puertos
```

---

## 3. Crear relaciones bidireccionales

Si una pregunta apunta a:

```yaml
concepts:
  - dns
```

el concepto DNS debe conocer automáticamente:

```yaml
official_questions:
  - age_2024_15
```

Resultado:

```text
Concepto → Preguntas
Pregunta → Conceptos
```

---

# Cálculo automático de métricas

Estas métricas nunca deben escribirse manualmente.

Se calculan durante el procesamiento.

---

## exam_weight

Mide la importancia objetiva de un concepto para el examen.

Escala:

```text
0 - 10
```

Cálculo aproximado:

```text
40% Frecuencia histórica

25% Recencia

20% Conectividad

15% Relación con conceptos importantes
```

Ejemplo:

```yaml
exam_weight: 8.7
```

---

### Frecuencia

Cuántas preguntas oficiales están relacionadas.

Ejemplo:

```text
DNS   → 15 preguntas
RAID  → 3 preguntas
```

DNS recibe mayor peso.

---

### Recencia

Conceptos preguntados recientemente pesan más.

Ejemplo:

```text
DNS aparece en 2024
```

tiene más peso que:

```text
Token Ring aparece en 2007
```

---

### Conectividad

Cuántos conceptos relevantes están relacionados.

Ejemplo:

```text
DNS
 ├ DHCP
 ├ UDP
 ├ IPv4
 ├ IPv6
 └ TCP/IP
```

Más conexiones → más peso.

---

# difficulty_score

Mide la dificultad estimada.

Ejemplo:

```yaml
difficulty_score: 6.8
```

Inicialmente puede estimarlo la IA.

En el futuro puede calcularse utilizando:

- fallos en test
- número de conceptos asociados
- complejidad del contenido

---

# coverage_score

Indica el nivel de cobertura del concepto.

Ejemplo:

```yaml
coverage_score: 82
```

Factores:

- teoría disponible
- preguntas oficiales asociadas
- preguntas generadas
- ejemplos
- referencias

---

# study_priority

Métrica principal para priorizar el estudio.

Ejemplo:

```yaml
study_priority: 9.3
```

Basada en:

```text
exam_weight
+
difficulty_score
+
falta de cobertura
```

Ejemplo:

```text
Concepto:
DNS

Peso examen: alto
Dificultad: media
Cobertura: baja

Resultado:
Prioridad de estudio muy alta
```

---

# Generación de preguntas nuevas

## Regla principal

NO generar preguntas directamente desde el temario.

Incorrecto:

```text
Temario
 ↓
IA
 ↓
Pregunta
```

Correcto:

```text
Temario
 +
Preguntas oficiales
 ↓
Conceptos
 ↓
Relaciones
 ↓
Importancia
 ↓
Generación de preguntas
```

---

# Objetivo de la generación

La IA debe:

1. Analizar preguntas oficiales.
2. Extraer patrones.
3. Relacionarlas con conceptos.
4. Generar nuevas preguntas siguiendo esos patrones.

Ejemplo:

```text
Concepto:
DNS

Preguntas oficiales:
- AGE 2024
- AGE 2023
- AGE 2021
```

↓

```text
Nueva pregunta coherente con el estilo oficial
basada en DNS.
```

---

# Resultado final esperado

Cada concepto deberá conocer:

```yaml
---
id: dns

type: concept

related:
  - dhcp
  - udp
  - ipv4

official_questions:
  - age_2024_15
  - age_2023_22

generated_questions:
  - gen_001
  - gen_014

stats:
  official_count: 15
  generated_count: 42
  exam_weight: 8.7
  difficulty_score: 6.4
  coverage_score: 85
  study_priority: 9.1
---
```

De esta forma AstroXmind deja de ser una simple wiki y se convierte en un sistema de conocimiento orientado al aprendizaje y optimización del estudio basado en temario y evidencia histórica de exámenes.
