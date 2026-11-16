# Hoja de ruta

Estado de referencia: commit `109e0338b4a72c79f6796b6d66486d188c65486c` en `main`, 16-11-2026.

## Hecho y publicado

### AST-020 · wiki centrada en componentes Astro

PR #7 integrado. La navegación pública quedó reducida a inicio, guía de clases/componentes, TreeTable y laboratorio. Se retiraron las rutas del temario, las galerías de tecnologías distintas y los HTML de Markmap/Tabulator. Se simplificó la configuración de build y Pages comprueba el contenido del artefacto.

### AST-021 · numeración TreeTable compatible con el modelo XMind observado

Añadida en el mismo PR. Los atributos por nodo admiten numeración decimal, ruta acumulada con `tiered=true`, y `start=N` para comenzar/reiniciar y continuar entre hermanos. Se agregó una demo de número local y una de numeración gradual. El JSON de referencia usa `org.xmind.ui.numbering`, `pattern: numeral-arabic` y `tiered: true`.

## Próximo trabajo

1. Revisar visualmente TreeTable en escritorio y móvil; observar si la tabla conserva alineación y legibilidad con numeración.
2. Completar documentación de la sintaxis, incluyendo casos de ramas sin número y de reinicio bajo otro padre.
3. Definir si habrá más patrones numéricos además de decimal.
4. Añadir pruebas automatizadas de parser y numeración cuando se acuerde esa fase.
5. Explorar otros elementos del lenguaje XMind (summary, boundary, relationship) como modelos semánticos independientes.

## Aplazado

- Publicación de cualquier temario o bloque de estudio: no está en la wiki.
- Conversión a `.xmind`, editor web persistente y sincronización.
- Galerías de Remark, Pandoc, MyST, Markmap y Tabulator en la wiki.

## Despliegue

Las Actions de validación pueden ejecutarse en PR. Pages se despliega desde `main`. Cada cambio publicado debe comprobar build, CI y Pages Deploy y conservar enlaces a las ejecuciones.


### AST-022 · anotaciones de numeración sin escapes en MDX

En curso en la rama `feature/ast-022-bracket-numbering`. Cambia los marcadores de nodo a `[numbering=arabic; tiered=true; start=N]`, con opciones separadas por punto y coma. El parser conserva la numeración y la elimina del texto visible; los corchetes se escriben directamente en MDX. Pendiente de validación en Actions e integración a `main`.
