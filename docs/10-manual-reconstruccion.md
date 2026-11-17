# Reconstrucción de AstroXmind

Estado contrastado el 17-11-2026 sobre main `5f1a33ff7a846a42914f33be61782adb0e5f8452`. Esta revisión solo cambia documentación en una rama separada.

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

La wiki pública está desplegada y las capacidades descritas en docs/10 están implementadas. NAV-01…08 todavía no existen en código: no intentar reconstruirlos a partir del plan ni afirmar que hay padre/IDs/backlinks.

Después de autorización NAV-01, actualizar aquí los archivos/comandos añadidos y el SHA validado. Para estado reciente leer docs/09; para alcance aprobado leer docs/13. GitHub/historial siguen públicos; StackBlitz es copia aislada.
