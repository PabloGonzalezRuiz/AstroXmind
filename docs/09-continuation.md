# Punto de reanudación de AstroXmind

Última auditoría: 16-11-2026. Este es el documento breve que debe leerse al retomar.

## Estado comprobado

- Repositorio: https://github.com/PabloGonzalezRuiz/AstroXmind
- Rama por defecto: `main`.
- Commit de documentación actual: `d4f2d60bec8433f1c97d1e0e71d742fe5231aee1`.
- Base de código auditada antes de los cambios documentales: `f6fda9f743d038ab7ee08ee0b71ad65c790c34db`.
- La wiki pública funciona en https://pablogonzalezruiz.github.io/AstroXmind/.
- Main ya usa Astro/Starlight, remark-directive, plugin semántico propio y YAML para metadatos XMind.
- La galería documenta tabla árbol, clases CSS y propiedades estructurales.
- CI, Wiki Build, Pages Deploy y auditoría de dependencias fueron exitosos para el SHA de la base de código citado.
- Los commits documentales posteriores no modifican código; no se pudo verificar el resultado de Actions asociado a esos commits con las herramientas disponibles.
- La conversión a XMind y los presets completos con herencia no están implementados.
- El script de pruebas del PR #5 no está integrado en main.

## Paso recomendado al retomar

1. Consultar el estado actual de main, Pages, Actions y los PRs #1, #2, #4 y #5; los estados de noviembre pueden haber cambiado.
2. Revisar el diff del PR #5 y confirmar que su head conserva los checks exitosos. Es la propuesta más acotada para fijar comportamiento con pruebas; no fusionar sin autorización explícita.
3. Si no se integra, continuar AST-013: especificar defaults/herencia con ejemplos de XMind y una tabla de precedencia.
4. Mantener separado el trabajo de seguridad de dependencias (PR #1) del diseño de lenguaje.
5. Tras cada cambio, actualizar este documento, el estado, el registro de tareas y el informe fechado.

## PR y riesgos que requieren atención

- #1 actualización Astro/Starlight: base antigua/merge conflict según auditoría; reevaluar seguridad y checks del head actual.
- #2 material de prácticos TAI: el repo y Pages son públicos; verificar derechos, fuente y licencia.
- #4 documentación operativa: parece reflejar una arquitectura de wiki anterior; reconciliar con Pages antes de integrarla.
- #5 pruebas del procesador: PR borrador, checks verdes en el SHA observado, todavía no integrado.

## Comandos

```sh
npm ci
npm run check
npm run build
```

Requiere Node.js 22. No depender de Codespaces para leer o editar el repositorio.
