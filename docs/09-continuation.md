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
- AST-020: PR #7 borrador abierto desde `feature/ast-020-mdx-source-access`; CI y Wiki Build pasaron para `69806572c4757b39fa08d26adc4b084755f432cd`. Incluye enlaces al componente y fuente MDX, el MD base bajo la tabla y explicación de edición manual.
- AST-017 sigue aislada en `feature/ast-017-level-classes`, pendiente de validación.
- El proyecto aún no convierte la representación a `.xmind` ni aplica un catálogo completo de presets/herencia.

## Siguiente paso activo

1. Revisar el PR #7 y sus enlaces de código fuente.
2. Esperar instrucciones antes de integrar o publicar AST-020.

## PR y checks de AST-020

- PR #7: https://github.com/PabloGonzalezRuiz/AstroXmind/pull/7 (borrador; no integrado).
- [AstroXmind · CI](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43879133120).
- [Wiki · Build](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43879133114).

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
