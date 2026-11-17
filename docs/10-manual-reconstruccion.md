# Manual de reconstrucción de AstroXmind

Actualizado el 16-11-2026. Reproduce el sitio actual de componentes; sustituye las instrucciones de fase inicial que aún indicaban que Pages no estaba desplegado.

## Obtener el estado reproducible

Requiere Git, Node.js 22 y npm. La referencia publicada auditada es `6aff07e65b8cbd8e89f56a2f9a39d04f5a0af372`.

```sh
git clone https://github.com/PabloGonzalezRuiz/AstroXmind.git
cd AstroXmind
git switch --detach 6aff07e65b8cbd8e89f56a2f9a39d04f5a0af372
npm ci
npm run check
npm run build
npm run preview
```

Abrir la URL que anuncie Astro, teniendo en cuenta el prefijo /AstroXmind. Para desarrollar crear una rama propia desde la referencia deseada; usar npm run dev. Conservar package-lock.json y usar npm ci para reproducir dependencias.

## Archivos que reconstruyen el sitio

- package.json y package-lock.json: comandos y dependencias exactas.
- astro.config.mjs y src/content.config.ts: Astro, Starlight, MDX y contenido.
- src/content/docs: inicio, guía, TreeTable y laboratorio.
- examples/astro-component-lab/src/components/TreeTable.astro: componente importado por la wiki.
- examples/astro-component-lab: sandbox independiente.
- .github/workflows/ci.yml, wiki-ci.yml y wiki-pages.yml: validación y publicación.

Copiar esos archivos desde el SHA fijado si se reconstruye manualmente; no sustituirlos por ejemplos antiguos de configuración. Los scripts Remark/Pandoc conservados no son requisitos del build actual.

## Editar y comprobar

Los nodos son una lista Markdown dentro de TreeTable. Ejemplo de anotación: [numbering=arabic; tiered=true; start=5]. Se escribe sin escapes MDX. Ver docs/10-declarative-language-architecture.md para las reglas completas.

Comprobar npm run check y npm run build, navegación por las cuatro rutas, alineación en escritorio/móvil y numeración. El directorio dist contiene el sitio estático. El sandbox no guarda cambios en GitHub.

## GitHub Pages

El repositorio actual ya tiene publicación mediante GitHub Actions desde main. En una reconstrucción autorizada, configurar Settings → Pages → Source: GitHub Actions y conservar el workflow de publicación. Cambiar propietario, nombre o prefijo exige revisar site/base en astro.config.mjs y los enlaces.

No empujar a main, abrir/fusionar PR ni publicar releases como parte de una reconstrucción local sin aprobación. No afirmar publicación hasta observar el deployment correcto para el SHA correspondiente.

## Verificación del código publicado

Base auditada: `6aff07e65b8cbd8e89f56a2f9a39d04f5a0af372` en `main`, 16-11-2026. PR #8 integrado.

- [CI correcto](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43901962478).
- [Wiki Build correcto](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43901962607).
- [Pages Deploy correcto](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43901962390).
- La auditoría de dependencias 43897812008 corresponde al SHA anterior `109e033`; no atribuirla al HEAD actual.

Los checks acreditan compilación y despliegue del SHA indicado, no fidelidad visual ni interoperabilidad XMind.

## Continuidad y límites

Leer AGENTS.md y docs/09-continuation.md. La wiki pública se limita a componentes y clases Astro. No hay exportación XMind, editor persistente ni sincronización de StackBlitz. Las auditorías históricas conservan el estado de su fecha y no sustituyen docs/04-project-status.md.

## Estado contrastado — 17-11-2026

Referencia publicada: `e7bfb8e7f41ec5637c685e62698eb12b7ab1b658`. Clases AST-017, plegado AST-025 y numeración heredable AST-026 están publicados. El siguiente cambio funcional es estado inicial AST-028; Summary/Boundary aplazados. La biblioteca AST-027 sigue al final. Estado operativo y contrato completos: [estado](04-project-status.md), [contrato](10-declarative-language-architecture.md) y [hoja de ruta](03-roadmap.md). Las propuestas de presets/exportación o directivas heredadas no describen funcionalidad disponible del componente actual.
