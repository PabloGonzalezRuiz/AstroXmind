# Punto de reanudación de AstroXmind

Última revisión: 16-11-2026.

## Estado actual verificado

- Repositorio: https://github.com/PabloGonzalezRuiz/AstroXmind.
- `main`: `5dd5273c03ed8efd10155420f44a04f8a254d67f`.
- Wiki: https://pablogonzalezruiz.github.io/AstroXmind/.
- AST-019 está integrada mediante PR #6 (squash `fc7ed10ff54e511c4ff1a624b20b3d7f8ba36692`) y publicada. Página: https://pablogonzalezruiz.github.io/AstroXmind/demo-tablas/tabla-arbol-mdx/.
- Tras publicar, se corrigió el CSS para que los textos largos no se partan a mitad de palabra; el cambio es `5dd5273c03ed8efd10155420f44a04f8a254d67f`.
- CI, Wiki Build y Pages Deploy pasaron para el SHA `5dd5273c03ed8efd10155420f44a04f8a254d67f`.
- La página AST-019 incluye enlaces al componente `TreeTable.astro`, al MDX fuente y a su editor de GitHub; muestra también el MD base bajo la tabla.
- El archivo editable es `src/content/docs/demo-tablas/tabla-arbol-mdx.mdx`. El componente compartido es `examples/astro-component-lab/src/components/TreeTable.astro`.
- StackBlitz abre una copia del proyecto `examples/astro-component-lab`; sirve para experimentar y no sincroniza cambios con el repositorio.
- AST-020: se trabaja en `feature/ast-020-mdx-source-access` para explicar mejor la inspección/edición manual del MDX y dejar un patrón reutilizable para las pruebas.
- AST-017 sigue aislada en `feature/ast-017-level-classes`, pendiente de validación.
- El proyecto aún no convierte la representación a `.xmind` ni aplica un catálogo completo de presets/herencia.

## Siguiente paso activo

1. Terminar AST-020 en la página de ejemplo y documentación.
2. Abrir PR borrador para validar con `AstroXmind · CI` y `Wiki · Build`; no fusionar ni publicar AST-020 sin autorización.
3. Revisar la preview de Pages una vez integrada.

## Checks de AST-019

- [AstroXmind · CI](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43877354252)
- [Wiki · Build](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43877354293)
- [GitHub Pages Deploy](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43877354242)

## Flujo local

Requiere Node.js 22:

```sh
npm ci
npm run dev
```

La vista local se actualiza mediante Vite. La fuente MDX de las páginas de la wiki está bajo `src/content/docs/`; editar el contenido ahí no altera el componente Astro. Las modificaciones desde StackBlitz ocurren en la copia aislada.
