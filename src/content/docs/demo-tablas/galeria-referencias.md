---
title: "Galería · Búsqueda y referencias semánticas"
description: "Código fuente y representación real de identificadores, enlaces, referencias inversas y búsqueda"
---

# Galería de búsqueda y referencias semánticas

**Laboratorio funcional:** en cada ejemplo se presenta primero el código fuente y después su representación. La búsqueda se ejecuta en el navegador sobre los conceptos de esta página; no es todavía un índice global de la wiki. Las referencias inversas de esta prueba son enlaces explícitos, no se calculan automáticamente.

<style>
.ax-ref-demo{border:1px solid var(--sl-color-hairline);border-radius:.75rem;padding:1rem;margin:1rem 0;overflow-wrap:anywhere}
.ax-ref-demo article{border-bottom:1px solid var(--sl-color-hairline);padding:.65rem 0}
.ax-ref-demo article:last-child{border:0}
.ax-ref-demo a{overflow-wrap:anywhere}
.ax-ref-demo input{width:100%;max-width:32rem;border:1px solid var(--sl-color-hairline);border-radius:.45rem;padding:.75rem;background:var(--sl-color-bg);color:var(--sl-color-text)}
.ax-ref-demo .ax-hit{padding:.55rem;border-bottom:1px solid var(--sl-color-hairline)}
.ax-ref-demo .ax-hit[hidden]{display:none}
.ax-ref-demo .ax-pill{display:inline-block;border:1px solid var(--sl-color-hairline);border-radius:99px;padding:.15rem .5rem;font-size:.8rem}
</style>

## 1. Identificadores estables

El atributo HTML `id` permite enlazar a un fragmento concreto de la página. En Markdown convencional también se puede escribir un enlace a ese fragmento.

**Código HTML nativo:**

~~~html
<article id="ce-014">
  <h3>Artículo 14 · Igualdad</h3>
  <p>Principio de igualdad ante la ley.</p>
</article>
<a href="#ce-014">Ir al artículo 14</a>
~~~

**Representación funcional:**

<div class="ax-ref-demo">
  <article id="ce-014">
    <h3>Artículo 14 · Igualdad</h3>
    <p>Principio de igualdad ante la ley.</p>
    <span class="ax-pill">ID: ce-014</span>
  </article>
  <a href="#ce-014">Ir al artículo 14</a>
</div>

## 2. Referencias cruzadas entre contenidos

El enlace Markdown nativo es legible por personas e IA. El destino debe conservar su identificador.

**Código Markdown nativo:**

~~~md
[Consultar el artículo 14](#ce-014)

[Ir a la pregunta TAI-001](#tai-001)
~~~

**Representación funcional:**

<div class="ax-ref-demo">
  <p><a href="#ce-014">Consultar el artículo 14</a></p>
  <p><a href="#tai-001">Ir a la pregunta TAI-001</a></p>
</div>

## 3. Referencias inversas y preguntas relacionadas

Un índice futuro podrá generar las referencias inversas automáticamente. En esta demostración están declaradas manualmente para que el enlace funcione ya.

**Código HTML nativo:**

~~~html
<article id="tai-001">
  <h3>Pregunta TAI-001</h3>
  <p>¿Qué artículo recoge el principio de igualdad?</p>
  <a href="#ce-014">Fuente: CE-014</a>
</article>
<section aria-label="Referencias inversas">
  <a href="#tai-001">Pregunta que cita CE-014</a>
</section>
~~~

**Representación funcional:**

<div class="ax-ref-demo">
  <article id="tai-001">
    <h3>Pregunta TAI-001</h3>
    <p>¿Qué artículo recoge el principio de igualdad ante la ley?</p>
    <p><a href="#ce-014">Fuente: artículo 14</a></p>
  </article>
  <p><strong>Desde el artículo CE-014 se puede encontrar:</strong></p>
  <p><a href="#tai-001">Pregunta TAI-001 · Igualdad ante la ley</a></p>
</div>

## 4. Búsqueda por conceptos

Aquí se muestra el HTML de los datos indexables y el JavaScript que realiza el filtrado. Prueba a escribir «igualdad», «redes» o «constitución».

**Código HTML y JavaScript nativo (versión mínima):**

~~~html
<input id="buscar" type="search" placeholder="Buscar conceptos">
<ul id="resultados">
  <li data-texto="igualdad constitución artículo 14">Artículo 14</li>
  <li data-texto="redes tcp ip">Redes TCP/IP</li>
</ul>
<script>
  const campo = document.querySelector('#buscar');
  campo.addEventListener('input', () => {
    for (const item of document.querySelectorAll('#resultados li')) {
      item.hidden = !item.dataset.texto.includes(
        campo.value.toLowerCase().trim()
      );
    }
  });
</script>
~~~

**Representación interactiva:**

<div class="ax-ref-demo" id="ax-search-demo">
  <label for="ax-search-field"><strong>Buscar en el índice de ejemplo</strong></label>
  <input id="ax-search-field" type="search" placeholder="Escribe igualdad, constitución, redes..." autocomplete="off">
  <div id="ax-search-results" aria-live="polite">
    <div class="ax-hit" data-search="igualdad constitucion constitución artículo articulo 14 derechos"><a href="#ce-014">CE-014 · Igualdad ante la ley</a></div>
    <div class="ax-hit" data-search="tai pregunta test igualdad constitucion constitución"><a href="#tai-001">TAI-001 · Pregunta sobre igualdad</a></div>
    <div class="ax-hit" data-search="redes tcp ip informática informatica">RED-001 · Redes TCP/IP</div>
    <div class="ax-hit" data-search="hardware procesador cpu informática informatica">HW-001 · Procesador</div>
  </div>
  <p id="ax-search-count" role="status">4 resultados</p>
</div>

<script>
  function setupAxSearch() {
    const root = document.getElementById('ax-search-demo');
    if (!root || root.dataset.ready === 'true') return;
    root.dataset.ready = 'true';
    const field = document.getElementById('ax-search-field');
    const rows = [...root.querySelectorAll('[data-search]')];
    const count = document.getElementById('ax-search-count');
    const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
    const update = () => {
      const tokens = normalize(field.value).split(/\s+/).filter(Boolean);
      let visible = 0;
      for (const row of rows) {
        const haystack = normalize(row.dataset.search + ' ' + row.textContent);
        const match = tokens.every(token => haystack.includes(token));
        row.hidden = !match;
        if (match) visible++;
      }
      count.textContent = visible + (visible === 1 ? ' resultado' : ' resultados');
    };
    field.addEventListener('input', update);
    update();
  }
  setupAxSearch();
  document.addEventListener('astro:page-load', setupAxSearch);
</script>

## 5. Metadatos semánticos para una IA

**Código Markdown con YAML nativo:**

~~~md
---
id: ce-014
tipo: articulo
norma: constitucion-espanola
temas:
  - igualdad
  - derechos-fundamentales
---

# Artículo 14 · Igualdad

Relacionado con [TAI-001](#tai-001).
~~~

**Representación de los metadatos:**

<div class="ax-ref-demo">
  <p><strong>Artículo 14 · Igualdad</strong></p>
  <p><span class="ax-pill">ce-014</span> <span class="ax-pill">artículo</span> <span class="ax-pill">igualdad</span> <span class="ax-pill">derechos fundamentales</span></p>
  <p>Relacionado con <a href="#tai-001">TAI-001</a>.</p>
</div>

**Nota técnica:** esta última tarjeta es una representación manual de los metadatos; aún no hay un extractor YAML automático conectado a esta galería.

## Qué queda por implementar

La siguiente fase consistirá en generar un **índice global automáticamente** a partir de todos los documentos, resolver referencias cruzadas y calcular referencias inversas, sin mantenerlas a mano. Esta galería distingue deliberadamente las funciones reales de las que todavía son prototipos.
