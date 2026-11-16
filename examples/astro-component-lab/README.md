# AstroXmind · Laboratorio de componentes

Aplicación Astro mínima para editar y probar componentes aislados con vista previa en vivo y errores del compilador. Se abre en StackBlitz desde la wiki.

```sh
npm ci
npm run dev
```

`src/components/TreeTable.astro` es el componente de prueba. La página `src/pages/index.mdx` muestra clases por nivel y las dos formas de numeración: número de hermanos y ruta gradual. Los marcadores se escriben entre corchetes junto a cada nodo, por ejemplo `[numbering=arabic; tiered=true]` o `[numbering=arabic; start=7]`. Los corchetes son texto normal en Markdown/MDX y no necesitan escape. StackBlitz crea una copia de prueba; los cambios no se sincronizan automáticamente con GitHub.
