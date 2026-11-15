# AST-004.1 · Fusión de prácticos TAI — 2026-11-15

## Alcance autorizado
El usuario solicita retomar la fusión y copia de prácticos; abandona la transferencia desde OneDrive. AstroXmind fue comprobado como privado en esta sesión.

## Resultado implementado
Rama content/tai-practicos-fusion, basada en main. Cuatro páginas Starlight: índice, cuaderno, soluciones y fuentes. Cinco cuadernos MIT de Víctor Segura García (commit af05130f95da193615c4430cb5739278c4cd9cba) adaptados en 22 apartados: 5 SQL/normalización, 6 Java/PHP, 8 repaso de desarrollo, 1 caso integrado de redes y 2 de seguridad. Preguntas y soluciones separadas con 22 IDs y 44 enlaces de ida/vuelta. Aviso MIT íntegro en fuentes.md y hashes originales en practicos-sources.json.

Catálogo complementario: 17 casos de jmpastor2/oposicion-informatica en b4697c71e87bc9ceec466b44fd8607464c15d6b7 (4 bloque II, 6 III, 7 IV), enlazados pero no copiados al no localizar licencia. No afirmar que esos 17 están fusionados.

## Correcciones editoriales
No presentar como oficial un simulacro sin convocatoria identificada; anuncia 20 pero contiene 8. Corregidos escapes PHP, identidad SQL por dialecto, condiciones de normalización y claves candidatas. Sustituida una pregunta normativa no contrastada por COUNT/NULL. Retiradas afirmaciones ENS no justificadas sobre algoritmos concretos, conservación de logs y clasificación automática. Contraste de categoría con anexo I de RD 311/2022. Aclarados ámbito GPO y requisitos de DNAT/reenvío/rutas ausentes en ejemplo de filtrado.

## Validación local
- npm install --ignore-scripts --no-audit --no-fund (resolución local de rangos de package.json; no sustituye una CI con el lockfile remoto).
- npm run check: 0 errores, 0 warnings, 0 hints.
- npm run build: éxito, 11 páginas, 4 rutas nuevas. Advertencias no bloqueantes: npm http-proxy, tsconfck obsoleto y DEP0190; el mensaje de 404 de Starlight no impidió generar dist/404.html.
- 22 IDs únicos, enlaces recíprocos, rutas Markdown y cierres de código comprobados.
- Tabla VLSM comprobada con ipaddress: capacidad, contención y ausencia de solapamientos.
- COUNT/NULL ejecutado en SQLite: (3,1).
- Links y fragmentos comprobados sobre el HTML construido.
- Windows/GPO y firewall no ejecutados; revisión técnica parcial, no certificación académica ni plantilla oficial.

## Publicación y continuidad
No se ha publicado esta rama ni modificado Pages. El workflow wiki-pages.yml despliega main automáticamente. Un repositorio privado NO demuestra que su sitio Pages sea privado: no fusionar esta rama hacia un despliegue accesible públicamente sin resolver el acceso privado. La petición actual autoriza copia al repositorio privado, no exposición pública. Mantener separados este trabajo y PR #1 de dependencias. Siguiente tarea: validación CI de esta rama y entrega privada de la wiki; conservar el backup histórico.
