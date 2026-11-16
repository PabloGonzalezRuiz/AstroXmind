# Prompt maestro de AstroXmind

## Objetivo

Mantener una wiki de estudio clara, accesible y publicable a partir de Markdown/MDX, y desarrollar un lenguaje declarativo explícito que una estructura, intención, estilo visual y futuras propiedades de XMind. La escritura debe ser fácil de generar y revisar tanto por una persona como por una IA.

## Hechos actuales

- El repositorio activo es `PabloGonzalezRuiz/AstroXmind`, rama principal `main`.
- La wiki se publica mediante GitHub Pages en https://pablogonzalezruiz.github.io/AstroXmind/.
- El procesador usa Astro/Starlight y remark-directive; el procesamiento especializado está en `scripts/remark-semantic.mjs`.
- La directiva `tabla-arbol` genera tablas jerárquicas. Sus propiedades de XMind se pueden declarar en un bloque YAML con lenguaje `xmind`.
- Las clases CSS definen la apariencia; las propiedades XMind son metadatos orientados a una conversión futura. Actualmente no existe conversión funcional a `.xmind`.
- La auditoría de continuidad con referencias a commit y Actions está en `docs/audits/2026-11-16-project-audit.md`.

## Principios de producto

1. La estructura y el propósito deben quedar explícitos en la fuente.
2. Los valores omitidos deben poder heredarse de presets, con sobrescrituras localizadas.
3. La sintaxis debe ser legible, fácil de validar y adecuada para generación por IA.
4. Mantener Markdown estándar como base y añadir solo extensiones con semántica clara.
5. Separar la semántica declarativa de la presentación CSS y de la serialización final XMind.
6. Documentar ejemplos ejecutables antes de ampliar el lenguaje.
7. Conservar fuentes y referencias de los materiales de estudio.

## Disciplina para retomar

Leer primero `docs/09-continuation.md`, comprobar el SHA de `main`, los PR y los Actions actuales, y después seguir el siguiente paso pendiente de `docs/03-roadmap.md`. Actualizar el estado y la auditoría cuando cambien decisiones o capacidades. No repetir como actuales afirmaciones antiguas sobre ChatGPT Sites, parser manual o ausencia de Pages.
