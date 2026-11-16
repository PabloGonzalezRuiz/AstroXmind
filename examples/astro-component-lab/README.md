# AstroXmind · Laboratorio de componentes

Aplicación Astro mínima para editar y probar componentes aislados con vista previa en vivo y errores del compilador. Se abre en StackBlitz desde la wiki.

```sh
npm ci
npm run dev
```

`src/components/TreeTable.astro` es el componente de prueba. La página `src/pages/index.mdx` muestra clases por nivel y las dos formas de numeración: número de hermanos y ruta gradual. Los marcadores `{numbering=arabic}`, `tiered=true` y `start=N` se editan junto a cada nodo. StackBlitz crea una copia de prueba; los cambios no se sincronizan automáticamente con GitHub.
