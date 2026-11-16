# Arquitectura actual y prevista (2026-11-14)

## Implementada
- Astro 5 + Starlight 0.36, sitio estático de estudio TAI, base `/AstroXmind`, idioma español.
- `src/content/docs/`: portada, guía y cuatro introducciones de bloques; colección Starlight registrada en `src/content.config.ts`.
- `package-lock.json` versionado; Node 22, `npm ci`, `astro check`, `astro build`, verificación `dist/index.html`.
- CI solo lectura en `.github/workflows/ci.yml`; despliegue Pages mediante workflow `.github/workflows/wiki-pages.yml` (verificar antes de modificar).
- Indexación automática de runs: `.github/workflows/ci-run-index.yml` escucha `workflow_run` y publica JSON en rama separada `automation/ci-run-index`. Se evita escritura en CI principal.
- GitHub Pages: https://pablogonzalezruiz.github.io/AstroXmind/ .

## No implementada
- Temario TAI completo y control de fuentes/licencias.
- Editor Markdown con persistencia y versiones.
- Adaptador PMD/XMind, visor web y sincronización.

## Fronteras
`AstroXmind` es independiente de `xmind-md` y `xmind-md-ts`. Una futura integración requiere contrato, revisión de licencias y compatibilidad, prototipo aislado y autorización. No usar Actions como motor de vista previa interactiva inmediata.

## Verificación
Último run auditado: 43615164608, éxito. Consultar el índice antes de dar por actual el resultado. La versión 0.1.0 estable sigue pendiente.


## Experimento MDX y laboratorio de componentes

- Rama: `feature/mdx-tree-table`, basada en `main`; no integrada ni desplegada.
- Aplicación aislada: `examples/astro-component-lab/`, con Astro 5, MDX y `node-html-parser`.
- `TreeTable.astro` es la fuente compartida por el laboratorio y por la página MDX experimental de la wiki.
- El componente renderiza el slot a HTML en build/dev, convierte la lista anidada en un árbol, calcula spans por hojas y emite una tabla estática. Las clases `nivel-N` colorean las celdas.
- La página `laboratorio-componentes` abre la carpeta del ejemplo en StackBlitz con `npm run dev`; la vista previa HMR y el terminal permiten ver cambios y errores sin instalar Astro localmente.
- El procesador MDX de este prototipo no hereda los plugins Remark/Rehype del sitio. El pipeline de `.md` en `main` no cambia.
- La validación de CI se activa al abrir/actualizar PR. Pages despliega al hacer push a `main` o manualmente; mergear no forma parte de esta fase.

### Límites actuales

La demo solo admite una lista raíz; preserva formato inline común y enlaces con destinos seguros. El importador StackBlitz crea una copia de trabajo y no guarda cambios de vuelta a GitHub automáticamente. Falta probar el HTML real que MDX entrega al slot, ramas irregulares, accesibilidad y funcionamiento del WebContainer.
