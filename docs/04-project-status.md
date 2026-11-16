# Estado actual del proyecto

Verificado el 16-11-2026.

## Código y despliegue

- Repositorio: https://github.com/PabloGonzalezRuiz/AstroXmind (público).
- `main`: `109e0338b4a72c79f6796b6d66486d188c65486c`.
- Wiki: https://pablogonzalezruiz.github.io/AstroXmind/.
- [Guía Astro](https://pablogonzalezruiz.github.io/AstroXmind/clases-astro/).
- [TreeTable con numeración](https://pablogonzalezruiz.github.io/AstroXmind/componentes/tree-table/).
- [Laboratorio](https://pablogonzalezruiz.github.io/AstroXmind/laboratorio-componentes/).

La wiki publicada ya no contiene el temario. La ruta antigua `/bloque-1/introduccion/` devuelve 404. El artefacto de Pages se construyó con cuatro rutas: inicio, guía, TreeTable y laboratorio.

El repositorio sigue público. El cambio no privatiza GitHub ni elimina los commits anteriores; la visibilidad del sitio Pages no debe confundirse con la del repositorio.

## Implementación

- Astro + Starlight + MDX.
- `TreeTable.astro` recibe listas jerárquicas, genera una tabla estática y asigna clases `nivel-N`.
- Numeración decimal por nodo, formato local o gradual, inicio configurable.
- Sandbox StackBlitz en `examples/astro-component-lab`; funciona como copia independiente.
- Todavía no existe conversión a XMind ni edición que guarde automáticamente de vuelta a GitHub.

## Validaciones

Para el commit `109e0338b4a72c79f6796b6d66486d188c65486c`:
- [AstroXmind · CI — éxito](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43897812197).
- [Wiki · Build — éxito](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43897812128).
- [Wiki · Deploy GitHub Pages — éxito](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43897812168).
- [Dependency and license audit — éxito](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43897812008).
