# AstroXmind

**Hito de continuidad H-TEM-01 (23-11-2026; reanudar 24-11):** base funcional `0758632`, CI/Build/Pages correctos y 123 pruebas principales locales; dos integraciones adicionales de reconstrucción fallan en el entorno temporal, pendiente diagnóstico. El expediente 2025 libre sigue en REVISION, con año/modalidad explícitos y CPS separado. Próximo trabajo PROG-01: definir esquema canónico del programa desglosado (YAML), conceptos permanentes, ocurrencias versionadas y asociaciones múltiples; Markdown anidado como vista editable. Después PROG-02, CALL-05 y PROG-03; no reiniciar ni importar datos hasta validar. Las prioridades anteriores son históricas. [Auditoría y criterios de aceptación](docs/audits/2026-11-23-hito-temario.md).

Wiki técnica Astro/Starlight/MDX con TreeTable y navegación documental por identidad estable. Base funcional auditada: `da19c5ba05c5ab2fd12353c3f86e22c49fedd78e` (19-11-2026).

- [Wiki](https://pablogonzalezruiz.github.io/AstroXmind/)
- [Navegación y demostración](https://pablogonzalezruiz.github.io/AstroXmind/navegacion/)
- [Serie de artículos](https://pablogonzalezruiz.github.io/AstroXmind/pruebas-jerarquia/serie/)
- [TreeTable](https://pablogonzalezruiz.github.io/AstroXmind/componentes/tree-table/)
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

**Prioridad actual (23-11-2026):** gestión documental privada, según [continuidad](docs/09-continuation.md) y [hoja de ruta](docs/03-roadmap.md). Menú autorizado por GitHub, alta por nombre y por año, y asistente de 2025 hasta F00 (registro del original PDF, metadatos, renombrado y enlace protegido). Parar para aceptación antes de continuar. No exponer contenido privado ni credenciales. Las prioridades anteriores quedan aplazadas.

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
