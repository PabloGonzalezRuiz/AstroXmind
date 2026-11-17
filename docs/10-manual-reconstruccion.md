# Reconstrucción de AstroXmind

Estado contrastado el 17-11-2026 sobre main `5f1a33ff7a846a42914f33be61782adb0e5f8452`. Esta revisión parte del SHA publicado indicado y añade NAV-01 en rama de desarrollo, sin cambiar main.

Requiere Git, Node.js 22 y npm. Para reproducir el código publicado auditado:

```sh
git clone https://github.com/PabloGonzalezRuiz/AstroXmind.git
cd AstroXmind
git switch --detach 5f1a33ff7a846a42914f33be61782adb0e5f8452
npm ci
npm run check
npm run build
npm run preview
```

Abrir URL anunciada por Astro con su base /AstroXmind. Para desarrollar crear una rama propia desde el estado adecuado. No publicar main ni PR/release como efecto secundario de reconstrucción.

Fuentes: astro.config.mjs, src/content.config.ts, src/content/docs, src/examples, src/components/ComponentExample.astro y examples/astro-component-lab. Conservar ambos lockfiles. El componente activo está en el laboratorio y se importa desde la wiki; no se necesitan scripts Remark/Pandoc antiguos.

La wiki pública está desplegada y las capacidades descritas en docs/10 están implementadas. NAV-01 ya añade padre/IDs y registro en esta rama. NAV-02…08 todavía no existen: no afirmar que hay UI de árbol, backlinks o exportador.

Para NAV-01, ver esquema y comandos de docs/14-navigation-contract.md; el registro se genera en dist/navigation.json al compilar. Para estado reciente leer docs/09; para alcance aprobado leer docs/13. GitHub/historial siguen públicos; StackBlitz es copia aislada.

Para reproducir NAV-01, obtener la rama feature/nav-01-document-tree y ejecutar npm ci, npm run check y npm run build. Archivos nuevos: navigation-ids.json, src/lib/navigation/index.mjs, scripts/navigation*.mjs y tests/navigation.test.mjs. El esquema y las cuatro páginas incluyen el YAML de jerarquía; dist/navigation.json se genera, no se edita.
