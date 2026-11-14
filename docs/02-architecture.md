# Arquitectura prevista

## Versión 0.1.0 (pendiente)
Astro + Starlight; contenido Markdown en `src/content/docs/`; navegación y búsqueda; GitHub Actions para instalar, comprobar y compilar; publicación en GitHub Pages solo tras verificar permisos y configuración.

## Evolución posterior (NO implementada)
Editor → almacenamiento versionado → adaptador de conversión PMD → archivo `.xmind` → visor web oficial. GitHub Actions servirán para artefactos persistentes; la vista previa inmediata necesitará ejecución bajo demanda, no dependerá de la latencia de Actions.

## Separación de responsabilidades
`AstroXmind` gestiona experiencia de estudio; `xmind-md-ts` mantiene el motor de conversión, si supera las verificaciones de compatibilidad y seguridad. Ninguna integración está aprobada ni implementada en fase 0.
