# Prompt maestro de AstroXmind

## Objetivo

Mantener una wiki de estudio clara, accesible y publicable a partir de Markdown/MDX, y desarrollar un lenguaje declarativo explícito que una estructura, intención, estilo visual y futuras propiedades de XMind. La escritura debe ser fácil de generar y revisar tanto por una persona como por una IA.

## Hechos actuales

- Repositorio activo: `PabloGonzalezRuiz/AstroXmind`, rama `main`.
- Wiki GitHub Pages: https://pablogonzalezruiz.github.io/AstroXmind/.
- Procesador: Astro/Starlight, remark-directive, plugin semántico en `scripts/remark-semantic.mjs`.
- `tabla-arbol`/`rootTopic` genera jerarquía HTML. Propiedades XMind pueden declararse en YAML `xmind`.
- Encabezados admiten clases particulares; mapa automático de clases por nivel es una mejora planificada, no implementada.
- La conversión funcional a `.xmind` aún no existe.
- MarkXMind/XMindMark se estudió como referencia de conceptos. La recomendación está en `docs/12-markxmind-compatibility.md`; no adoptar automáticamente su sintaxis de marcadores.

## Principios

1. Expresar estructura y propósito explícitamente.
2. Permitir defaults por estructura/nivel y sobrescrituras locales.
3. Mantener Markdown estándar como base y extensiones legibles por IA.
4. Separar jerarquía, presentación CSS, semántica de mind map y propiedades serializables XMind.
5. Usar IDs estables para referencias entre nodos.
6. Documentar ejemplos ejecutables y verificar con documentos XMind reales.
7. Conservar fuentes y referencias de los materiales de estudio.

## Retomar

Leer `docs/09-continuation.md`, verificar HEAD, PR, Actions y Pages actuales y seguir `docs/03-roadmap.md`. Distinguir siempre lo propuesto, implementado y verificado.
