# AstroXmind · Laboratorio de componentes

Aplicación Astro/MDX para editar y probar TreeTable con vista previa y errores del compilador. Su archivo src/components/TreeTable.astro es también la fuente importada por la wiki; no hay otra implementación paralela.

## Instalación desde cero

Este paquete tiene package.json y lockfile propios. Preparar y comprobar primero la raíz de AstroXmind según el [manual](../../docs/10-manual-reconstruccion.md). Después, desde esta carpeta:

```sh
npm ci --no-audit --no-fund
npm run check
npm run build
npm run dev
```

Abrir la URL anunciada por Astro. La página src/pages/index.mdx muestra clases y numeración mediante listas MDX. Anotaciones como [numbering=arabic; tiered=true] o [numbering=arabic; start=7] se escriben entre corchetes sin escapes. Para el contrato completo y referencias: [arquitectura](../../docs/02-architecture.md) y [NAV-03](../../docs/16-document-references.md).

## Límite de aislamiento observado

La instalación npm es independiente, pero no hay tsconfig propio versionado. El check puede alcanzar archivos TypeScript de la raíz: se observó un error App.Locals.starlightRoute cuando la raíz se preparaba en paralelo. Tras completar raíz, check/build pasaron. Por ahora usar la secuencia documentada; aislar el tipado queda pendiente dentro de robustez. No afirmar que un check verde prueba una instalación mínima autónoma sin haberla probado.

StackBlitz crea una copia para experimentar y no sincroniza cambios con GitHub. La preview no es un editor persistente de la wiki. Sin Starlight en este paquete, el componente DocumentNavigator de la wiki no se incluye automáticamente en el laboratorio.
