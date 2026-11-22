# Auditoría de continuidad — 22-11-2026

## Evidencia

Repositorio público PabloGonzalezRuiz/AstroXmind. Main remoto: `b78362d7809b0cbeeea0b994e520e51eec38987c`; último cambio 19-11, corrección CSS de Acciones móvil. FrameEjemplo v1 integrado en la serie hasta `d5ceb22`. Consultado main por Git y Actions por API.

| Verificación | Resultado |
|---|---|
| [CI](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44580177891) | success |
| [Wiki Build](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44580177886) | success |
| [Pages](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44580177872) | success |
| [TreeTable público](https://pablogonzalezruiz.github.io/AstroXmind/componentes/tree-table/) | HTTP 200; diez `data-frame-ejemplo` en HTML |
| npm run check | 43 navegación + 6 catálogo + 8 transformación; Astro check 71 archivos, 0 errores/avisos/hints |
| npm run build | 44 pruebas HTML/DOM, todas correctas |

Pruebas locales realizadas en worktree limpio del SHA con dependencias existentes, sin reinstalación ni cambios de lockfile. Total 101 pruebas. No se repitió auditoría de dependencias ni se comprobó interacción real en iPhone. No afirmar validación visual a partir de DOM ni seguridad a partir de CI verde.

## Hallazgos

- NAV-01–08, TreeTable y editor persistente siguen activos. CTX-01–05 implementados; CTX-06/07 pendientes.
- FrameEjemplo v1 deriva catálogo de diez MDX, usa `<details>` y WikiEditor practice; requiere id por instancia. ComponentExample practice delega a ese marco. Selector/reset y aislamiento tienen pruebas; diseño vertical solicitado aún no existe.
- b78362d hace Acciones relativo bajo 72rem para no quedar oculto bajo la cabecera de Starlight; validación táctil pendiente. No prometer flotación móvil con esta corrección.
- PRs abiertos #1, #2, #4, #5 y #10. No se abren, fusionan ni cierran en esta auditoría.

## Próximo incremento

FRAME-02: separar representación de autoría de la práctica runtime; etiqueta con example e identidad automática, marco vertical sin abrir desplegable, reset/selector y render compartido. Ver criterios en [contrato](../29-frame-ejemplo.md). Después CTX-06 regresión integral y CTX-07 extensibilidad; consultar [roadmap](../03-roadmap.md). Auditoría documental, sin cambios de código ni publicación de Pages.
