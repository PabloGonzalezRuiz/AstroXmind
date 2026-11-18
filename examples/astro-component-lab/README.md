# AstroXmind · Laboratorio de componentes

Aplicación Astro/MDX para editar y probar TreeTable con vista previa y errores del compilador. Su archivo src/components/TreeTable.astro es también la fuente importada por la wiki; no hay otra implementación paralela.

## Instalación desde cero

Este paquete tiene package.json, lockfile y tsconfig propios. Desde esta carpeta, o desde una copia que contenga solo el laboratorio:

```sh
npm ci --no-audit --no-fund
npm run check
npm run build
npm run dev
```

Abrir la URL anunciada por Astro. La página src/pages/index.mdx muestra clases y numeración mediante listas MDX. Anotaciones como [numbering=arabic; tiered=true] o [numbering=arabic; start=7] se escriben entre corchetes sin escapes. Para el contrato completo y referencias: [arquitectura](../../docs/02-architecture.md) y [NAV-03](../../docs/16-document-references.md).

## Comprobación independiente

El tsconfig incluye las fuentes locales, los tipos generados por Astro y la configuración del laboratorio. CI instala y comprueba este paquete en un trabajo propio. La wiki comprueba por separado el uso de TreeTable como componente compartido.

StackBlitz crea una copia para experimentar y no sincroniza cambios con GitHub. La preview no es un editor persistente de la wiki. Sin Starlight en este paquete, el componente DocumentNavigator de la wiki no se incluye automáticamente en el laboratorio.
