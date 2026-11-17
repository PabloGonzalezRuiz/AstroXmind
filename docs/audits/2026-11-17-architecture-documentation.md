# Auditoría documental integral — 17-11-2026

## Alcance y referencia

Encargo del usuario: documentar toda la arquitectura y lo realizado desde la instalación limpia, y actualizar estado y prompt maestro. Revisión de main publicado 2cdba361920b58a5002faa063e46660f22ff36ef; entrega exclusivamente Markdown en docs/architecture-clean-install-20261117. Sin cambios de comportamiento, dependencias, workflows, main, PRs, releases o despliegue.

## Fuentes inspeccionadas

Árbol de archivos, historial completo alcanzable (222 commits), package.json y ambos lockfiles, configuración Astro/colección, módulos de navegación/referencias, integración/hook de build, middleware, componentes/cliente, pruebas, ocho workflows, script de auditoría, configuración auxiliar Codespaces, fixtures y fuentes heredadas. Consulta GitHub de main, ejecuciones, ramas y PRs abiertos.

Publicación confirmada sobre 2cdba36: CI 44096661054, Wiki Build 44096660778, Pages 44096660802 y auditoría 44096660856, todos completed/success. Los índices posteriores de CI/auditoría también terminaron correctamente. Main y feature/nav-01-document-tree apuntan al mismo SHA auditado al iniciar el encargo. PRs #1/#2/#4/#5 abiertos, sin cambios en ellos.

## Documentación entregada

- Arquitectura completa: capas, inventario, versiones efectivas, modelos y APIs, hooks, servidor/cliente, caché, TreeTable, demos, CSS, CI/CD, búsqueda, límites y prototipos.
- Instalación/reconstrucción: checkout reproducible, requisitos, dos paquetes/lockfiles, orden de piezas desde carpeta vacía, comandos, resultados esperados, autoría de páginas, Pages y restauración sin sobrescribir trabajo.
- Historia desde el proyecto vacío: gobierno, scaffold, 404/base, lockfile/CI/índices, auditoría, galerías exploradas, componente nativo, herencia/UX y NAV-01/02/03. Registro enlazado de todos los commits del SHA, con fechas Europe/Madrid.
- Operación: matriz de scripts/pruebas, workflows/permisos/artefactos, evidencias de publicación y diagnóstico.
- Prompt maestro autosuficiente, índice documental, README, estado, tareas, riesgos, decisiones, continuidad y changelog actualizados. Contratos/fixtures señalan expresamente sus fases históricas y estado vigente.

Se corrigieron contradicciones: arquitectura que contaba cuatro páginas, NAV descrito aún en rama, manual fijado en 5f1a33f y enlaces nuevos señalados como no publicados, riesgos que negaban IDs ya existentes y scripts heredados descritos como si fueran activos.

## Comprobaciones repetidas

Runtime local: Node 24.22.1, npm 11.9.0. CI publicado utiliza Node 22; se distingue esa evidencia de la ejecución local.

Raíz desde instalación npm limpia: npm ci --no-audit --no-fund, npm run check, npm run build y npm run test:references:rebuild correctos. 32 pruebas de dominio/referencias, 15 HTML/DOM y una integración de dos builds/caché: total 48. Astro check sin errores/avisos. CI estándar ejecuta 47, no la integración adicional.

Laboratorio: npm ci correcto. Su check, ejecutado mientras se preparaba la raíz en paralelo, alcanzó ../../src/navigation-middleware.ts y falló con App.Locals.starlightRoute inexistente. No hay tsconfig propio versionado. Tras completar la raíz, el mismo check pasó (40 archivos, sin errores/avisos) y el build produjo una página. Se registra sensibilidad al orden y falta de aislamiento del análisis TypeScript, sin atribuir una corrección de código inexistente. Manual/estado/prompt y README del laboratorio indican raíz primero y laboratorio después.

Relectura pública: diez HTML 200, catorce referencias reales con destinos, tres ejemplos de Navegación, dos instancias DocumentNavigator en esa página y jerarquía correcta; sin aviso obsoleto de demostración no publicada. Esta comprobación no es una inspección visual completa de navegador.

Control de entrega: solo archivos .md, 104 enlaces locales de Markdown comprobados, sin roturas y git diff --check sin errores. El registro de commits se genera desde el historial, no desde fechas inventadas. No se ejecutan scripts de prototipos ni reservas nuevas de IDs, y no se alteran los JSON de autoría/salida.

## Pendientes y límites

NAV-04 requiere autorización propia. Aislamiento TypeScript del laboratorio se incorpora a robustez. Revisión visual/móvil/fullscreen real pendiente; jsdom no acredita layout. Auditoría informativa no certifica cero avisos ni conformidad de licencias; se registra la ausencia de LICENSE/campo license raíz sin añadirlos en este encargo. Summary/Boundary, exportaciones, editor y biblioteca conservan su lugar en la hoja de ruta.

Las auditorías históricas previas permanecen intactas. Esta rama documental puede revisarse e integrarse posteriormente con autorización aplicable; no se anuncia un nuevo despliegue por haber actualizado el repositorio en una rama.
