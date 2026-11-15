# ADR / Arquitectura · Markdown declarativo semántico y tabla árbol CSS
Fecha: 2026-11-15 · Estado: decisión de producto aprobada; implementación parcial

## Objetivo y principios
La fuente de verdad es un Markdown jerárquico legible y fácil de producir, revisar y transformar por IA. Una declaración acota una estructura y define su rol, tema CSS y opciones visuales. La semántica (qué es cada nodo) se mantiene separada de la presentación (cómo se ve). Primera salida: tabla árbol HTML/CSS responsive y plegable. En fases siguientes: referencias cruzadas, navegación inversa y otras vistas, con XMind como posible destino futuro. Pandoc y Quarto NO son dependencias para la visualización.

## Sintaxis de referencia del MVP
```markdown
:::tree-table{structure="legislation" theme="ocean" columns="2" fold="native"}
# Título I · Derechos y deberes fundamentales
## Capítulo I · Españoles y extranjeros
### Artículo 11 · Nacionalidad
- La nacionalidad se adquiere, conserva y pierde según la ley.
### Artículo 12 · Mayoría de edad
- Los españoles son mayores de edad a los dieciocho años.
:::
```
**Importante:** sintaxis inspirada en la familia `remark-directive`; NO equivale todavía a ejecutar el plugin `remark-directive`. En el prototipo el parser propio solo reconoce una declaración inicial, encabezados y listas simples. `structure="legislation"` y `theme="ocean"` se validan; `columns="2"` y `fold="native"` están declarados pero el primero no configura aún columnas, y el plegado se implementa directamente con `details/summary`.

## Implementación actual y límites verificables
- Fuente: `src/tree-tables/constitucion.md`.
- Compilador: `scripts/render-tree-table.mjs`, ejecutado por `prebuild` en `package.json`.
- Salida: `public/tree-table/index.html` generada durante build; tarjeta de portada en `src/content/docs/index.mdx`.
- HTML `details/summary` para plegado sin JS; CSS incrustado para colores, bordes, sangrías, temas `ocean`, `forest`, `slate`. Los controles «abrir/cerrar todo» y selector de tema sí usan JavaScript auxiliar.
- No hay parser AST Markdown real, plugin remark-directive integrado, clases semánticas completas, esquema validado, CSS externo, enlaces semánticos, IDs estables ni backlinks.
- Publicación en GitHub Pages requiere comprobar workflow, ruta y aceptación móvil; un commit no prueba disponibilidad de la web.

## Contrato de lenguaje previsto (no implementado)
- Declaraciones legibles y explícitas: `structure` (tipo de documento), `theme` (tema CSS), `view` (tabla, documento, mapa), `fold` (política de plegado), `columns` (configuración visual).
- Roles semánticos: `law`, `title`, `chapter`, `section`, `article`, `paragraph`, `definition`, `note`. El vocabulario y sus reglas deberán formalizarse.
- IDs estables definidos explícitamente o derivados con política reproducible; los enlaces se resuelven entre documentos y se validan al compilar.
- Índice de backlinks: recopilar enlaces salientes de cada nodo, invertir el grafo y presentar referencias entrantes junto al artículo de destino.
- La IA debe poder inferir jerarquía del Markdown ordinario, declarar excepciones y recibir errores comprensibles por atributos desconocidos.
- Herencia visual: tema por bloque, sobrescritura por nodo y reglas documentadas; el contenido no debe duplicarse por vista.
- Seguridad: escapar contenido HTML, no insertar HTML no confiable, verificar IDs duplicados y rutas rotas.

## Hoja de ruta y criterios de aceptación
1. **AST-011 (código MVP, aceptación pendiente):** verificar build y publicación, abrir/cerrar en móvil, cambiar temas, comprobar Markdown fuente y navegación de portada.
2. **AST-012:** integrar remark + remark-directive, parsear AST Markdown, conservar encabezados/listas/inline y atributos, pruebas automatizadas.
3. **AST-013:** separar CSS del compilador, catálogo de temas, roles semánticos, herencia, accesibilidad y responsive.
4. **AST-014:** IDs estables y referencias cruzadas entre documentos, validación de enlaces.
5. **AST-015:** backlinks automáticos y navegación bidireccional.
6. **AST-016:** múltiples vistas y posible exportación XMind sin reescribir el contenido.

## Decisiones de plataforma y límites
Astro + Starlight sigue siendo la wiki. GitHub Pages es el entorno de prueba del desarrollo actual: https://pablogonzalezruiz.github.io/AstroXmind/. ChatGPT Sites es otra superficie y no hay sincronización confirmada. No fusionar PR ni publicar releases sin autorización. El backup histórico `backup/2026-11-14-wiki-funcional` permanece intacto.
