# Registro de decisiones

| ADR | Decisión | Estado |
|---|---|---|
| [ADR-001](adr/ADR-001-initial-architecture.md) | Wiki separada, Markdown fuente y XMind posterior | Aceptada |
| ADR-002 | PMD conserva la extensión .md y codifica metadatos interpretables en comentarios HTML ocultos para el renderizado Markdown normal | Aceptada |

## ADR-002 — PMD dentro de Markdown (2026-11-15)

### Contexto

AstroXmind debe mantener los documentos Markdown legibles en la wiki y permitir generar mapas XMind que el usuario abrirá con la aplicación oficial en Android o iOS. No se usará una extensión de archivo distinta para PMD.

### Decisión

- La fuente seguirá siendo un archivo `.md`.
- Las instrucciones PMD se incluirán en comentarios HTML (`<!-- ... -->`), con un contenido estructurado que el parser propio pueda interpretar.
- El renderizado Markdown normal no mostrará esas instrucciones; el parser PMD leerá el texto fuente original antes de procesarlo y extraerá sus metadatos.
- Cuando se implemente la conversión, el mapa generado conservará el nombre base del Markdown y usará la extensión `.xmind`. El Markdown seguirá abriéndose como página renderizada y el XMind como descarga.
- La wiki será un catálogo de archivos: orden alfabético por nombre base, extensiones contiguas para cada nombre, texto de mayor tamaño e iconos identificativos por tipo. Se priorizará la apertura del archivo XMind en las aplicaciones móviles oficiales, sin depender de un visor de mapas en navegador.
- La conversión automática al guardar cambios en el Markdown/PMD queda para una fase posterior. Antes habrá que concretar el mecanismo de edición: la web estática publicada no guarda por sí sola cambios hechos en una página.

### Consecuencias y cautelas

- Los archivos siguen siendo Markdown estándar para lectura; los comentarios no se verán en la página renderizada, pero sí forman parte del texto fuente y no deben tratarse como información secreta.
- El conversor debe procesar el archivo fuente antes de que una herramienta intermedia elimine o modifique los comentarios HTML.
- Se deberán validar los enlaces de descarga y la apertura del `.xmind` en Android e iOS.
- La sintaxis exacta del bloque PMD y el disparador de regeneración automática se especificarán en el diseño de la conversión.

Las decisiones nuevas deben documentar contexto, alternativas, consecuencias, fecha y posibilidad de reversión.
