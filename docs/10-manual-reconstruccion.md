# Reconstrucción de AstroXmind

Actualización 17-11-2026: integración autorizada de NAV-01/02/03 en main, desde el código validado 238ce44. Ver docs/17-navigation-publication.md y las ejecuciones del SHA actual para la evidencia de despliegue.

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

La wiki pública está desplegada y las capacidades descritas en docs/10 están implementadas. NAV-01 ya añade padre/IDs y registro en esta rama. NAV-02 añade UI de árbol en esta rama; NAV-03 añade referencias estables en rama; NAV-04…08 todavía no existen: no afirmar que hay backlinks o exportador.

Para NAV-01, ver esquema y comandos de docs/14-navigation-contract.md; el registro se genera en dist/navigation.json al compilar. Para estado reciente leer docs/09; para alcance aprobado leer docs/13. GitHub/historial siguen públicos; StackBlitz es copia aislada.

Para reproducir NAV-01, obtener la rama feature/nav-01-document-tree y ejecutar npm ci, npm run check y npm run build. Archivos nuevos: navigation-ids.json, src/lib/navigation/index.mjs, scripts/navigation*.mjs y tests/navigation.test.mjs. El esquema y las cuatro páginas incluyen el YAML de jerarquía; dist/navigation.json se genera, no se edita.

Para probar NAV-02, usar la misma rama y comandos. Abrir /AstroXmind/pruebas-jerarquia/serie/ en el servidor local; la ruta nueva no está disponible en Pages. El build ejecuta además pruebas del HTML contextual. Para mover una rama, ver docs/15-contextual-navigation.md. Los artículos ficticios no son temario ni normativa.

Para NAV-03, misma rama y npm ci/check/build; abrir /AstroXmind/navegacion/. npm ci instala jsdom únicamente para pruebas; no es un paquete enviado al navegador. npm run test:references:rebuild ejecuta dos builds en una copia temporal para verificar el renombrado de un archivo destino conservando la identidad. No usar esa URL de Pages como si la rama ya estuviera publicada. Contrato completo en docs/16-document-references.md.
