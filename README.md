# AstroXmind

Wiki técnica Astro/Starlight/MDX con TreeTable y navegación documental por identidad estable. [Hito funcional M-20261122](docs/30-milestone-20261122.md): `37cfb00bb07d40fd73cb6dae9368a17e125af3be` (22-11-2026).

- [Wiki](https://pablogonzalezruiz.github.io/AstroXmind/)
- [Navegación y demostración](https://pablogonzalezruiz.github.io/AstroXmind/navegacion/)
- [Serie de artículos](https://pablogonzalezruiz.github.io/AstroXmind/pruebas-jerarquia/serie/)
- [TreeTable](https://pablogonzalezruiz.github.io/AstroXmind/componentes/tree-table/)
- [FrameEjemplo universal](https://pablogonzalezruiz.github.io/AstroXmind/frame-ejemplo/)
- [Guía Astro](https://pablogonzalezruiz.github.io/AstroXmind/clases-astro/)
- [Laboratorio](https://pablogonzalezruiz.github.io/AstroXmind/laboratorio-componentes/)

Once páginas técnicas/de prueba, catorce referencias y demostraciones Resultado/Código. No se publica temario ni normativa. Migas arriba, árbol lateral y DocumentNavigator al pie; los artículos pueden compartir carpeta y pertenecer a distintas profundidades lógicas. Una rama se mueve cambiando su parent.

TreeTable soporta clases por nivel/nodo, numeración/tiered heredables, start local, plegado/folded, IDs locales y fullscreen centrado con scroll. NAV-01 a NAV-08 publicados. Editor MD/MDX con guardado GitHub, sincronización, TreeTable inline y teclado disponibles.

## Documentación completa

| Tema | Entrada |
|---|---|
| Índice y orden de lectura | [docs/README.md](docs/README.md) |
| Arquitectura y módulos | [Arquitectura completa](docs/02-architecture.md) |
| Instalar/reconstruir desde cero | [Manual de instalación limpia](docs/10-manual-reconstruccion.md) |
| Todo lo hecho desde el proyecto vacío | [Historia](docs/18-development-history.md) y [222 commits](docs/history/commits-through-2cdba36.md) |
| Estado, tareas y prioridades | [Estado](docs/04-project-status.md), [tareas](docs/05-task-register.md), [hoja de ruta](docs/03-roadmap.md) |
| Reanudar el trabajo | [Prompt maestro](docs/00-master-prompt.md) y [continuidad](docs/09-continuation.md) |
| Pruebas, CI/CD y recuperación | [Operación](docs/19-operations-and-verification.md) |

**Punto de transición.** FRAME-02 publicado y aceptado. Esperar información del nuevo desarrollo. La cola anterior queda en pausa y CTX-08 (mejora del cuadro de propiedades) en el último lugar. [Hoja de ruta](docs/03-roadmap.md).

## Desarrollo local

Usar Node.js 22 como CI. Desde un checkout del SHA deseado:

```sh
npm ci --no-audit --no-fund
npm run check
npm run build
npm run test:references:rebuild
npm run dev
```

Abrir la URL anunciada por Astro con /AstroXmind/. El laboratorio es otro paquete con lockfile propio; prepararlo después de la raíz según el manual. Su check de TypeScript aún puede alcanzar archivos raíz, limitación documentada. La wiki importa la única implementación TreeTable de examples/astro-component-lab. StackBlitz es una copia sin sincronización automática con GitHub.

La [auditoría vigente](docs/audits/2026-11-22-project-audit.md) concilia estado y prioridades. Summary/Boundary aplazados; la distribución de biblioteca es el último hito. GitHub/historial y la wiki actual son públicos. Las auditorías históricas se conservan.
