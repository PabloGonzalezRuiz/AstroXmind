# Seguridad y mantenimiento · 18-11-2026

Base publicada: `a12154c2e86465b3bded8affa80919c5094312e4`. La guía de plegado se comprobó en el HTML público y el [despliegue](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/44311480793) terminó correctamente. La auditoría ejecutó `npm audit --json` y `npm audit --omit=dev --json` desde cada directorio, con sus lockfiles versionados.

| Ámbito | Paquetes registrados | Informe completo | Sin dependencias de desarrollo |
|---|---:|---|---|
| Wiki | 590 | 16 entradas: 1 crítica, 12 altas, 3 bajas | 14 entradas: 1 crítica, 10 altas, 3 bajas |
| Laboratorio | 502 | 15 entradas: 1 crítica, 12 altas, 2 bajas | 13 entradas: 1 crítica, 10 altas, 2 bajas |

Las cifras son entradas de paquetes de npm y pueden solaparse entre ámbitos. Ambos proyectos fijan Astro 5.18.2 y MDX 4.3.14. La wiki fija Starlight 0.36.3. Astro es la entrada crítica directa en ambos informes. Los resultados describen los árboles de dependencias y sirven para priorizar la actualización. La wiki publicada en GitHub Pages es estática, por lo que el inventario no prueba que cada dependencia se ejecute al visitar la wiki.

El inventario detectó un paquete sin campo de licencia en cada lockfile. Los metadatos requieren revisión documental antes de distribuir software. Este inventario no determina obligaciones ni uso efectivo.

## Cambio preparado en rama

El flujo AST-003.5 revisa wiki y laboratorio por separado y genera un artefacto por ámbito. La clave de auditoría histórica de la wiki se conserva. Un fallo de npm que no produce datos de avisos aprovechables genera un informe con esa limitación y hace fallar la tarea. Si hay datos válidos con avisos, se conserva el resultado informativo. El cambio se verificó con ambos informes reales, un error simulado de npm y análisis YAML del flujo. La primera ejecución remota del flujo doble queda pendiente.

## Próximo paso

Preparar una actualización compatible de Astro, MDX y Starlight desde main, en ambos lockfiles. Revaluar el PR #1 contra las versiones y pruebas actuales. Ejecutar los checks y builds de ambos proyectos y repetir la auditoría antes de proponer una integración. El PR #4 conserva su revisión documental separada.
