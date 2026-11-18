# Documentación de AstroXmind

Índice de mantenimiento contrastado con main `d87deba886e1c61a6ce18d915c89e0fb79cc511f` el 18-11-2026. Este directorio está en GitHub, pero no se convierte en páginas de la wiki. Las páginas de usuario viven en src/content/docs.

La [propuesta de edición desde la wiki](25-wiki-editing-proposal.md) detalla la primera prioridad de la [hoja de ruta](03-roadmap.md). La investigación comparativa AST-035 se registra en [patrones de edición Astro](26-astro-editing-patterns.md).

## Leer según la tarea

| Necesidad | Documento |
|---|---|
| Reanudar con una IA u otro colaborador | [Prompt maestro](00-master-prompt.md) y [continuidad](09-continuation.md) |
| Entender toda la aplicación y sus módulos | [Arquitectura completa](02-architecture.md) |
| Instalar desde cero o reproducir un SHA | [Manual de reconstrucción limpia](10-manual-reconstruccion.md) |
| Saber qué se construyó y por qué | [Historia de desarrollo](18-development-history.md) y [222 commits](history/commits-through-2cdba36.md) |
| Operar, comprobar CI/Pages y recuperar | [Operación y verificación](19-operations-and-verification.md) |
| Saber qué está publicado y qué falta | [Estado](04-project-status.md), [hoja de ruta](03-roadmap.md), [tareas](05-task-register.md) |
| Revisar riesgos y decisiones | [Riesgos](06-issues-and-risks.md), [decisiones](08-decisions.md) y ADRs |
| Usar el lenguaje TreeTable | [Contrato de autoría](10-declarative-language-architecture.md) |
| Comprender la fase Navegación | [Plan y alcance](13-navigation-phase.md) |
| Identidad, reserva de IDs y pertenencia | [Contrato documental](14-navigation-contract.md) |
| Componente contextual y jerarquía plana | [Navegación contextual](15-contextual-navigation.md) |
| Referencias y destinos plegados | [Contrato NAV-03](16-document-references.md) |
| Ver qué se autorizó/publicó | [Registro de publicación](17-navigation-publication.md) |
| Publicación de esta ampliación | [Registro de entrega](21-navigation-ordering-publication.md) |
| Orden opcional, fechas YAML y numeración | [Ampliación de navegación](20-navigation-ordering.md) |
| Localizar módulos NAV-01 a NAV-08 | [Guía del runtime](24-navigation-runtime.md) |
| Probar referencias entrantes y salientes | [NAV-04](23-reference-relations.md) |
| Auditoría actual | [Estado del 18-11-2026](audits/2026-11-18-application-state.md) |
| Detalle de pruebas y evidencias | [Validación](07-test-and-audit.md) y [auditoría documental](audits/2026-11-17-architecture-documentation.md) |
| Contexto XMind/MarkXMind pendiente | [XMind y presets](11-xmind-json-defaults.md), [MarkXMind](12-markxmind-compatibility.md) |

## Precedencia y fuentes de verdad

El código/configuración del SHA actual y su resultado comprobado determinan lo disponible. Estado/continuidad/arquitectura describen la versión vigente auditada; contratos definen uso; roadmap expresa trabajo futuro. Informes en audits/ y ADRs conservan decisiones/evidencias de su contexto y no prueban por sí solos que un prototipo siga activo.

Hay dos instalaciones npm, una única implementación TreeTable y un árbol lógico derivado del YAML. No confundir archivo/carpeta con parent, una referencia con parentesco, artefacto de build con despliegue, ni dist con una descarga autónoma offline.

NAV-01 a NAV-08 están publicados. El editor Markdown de prueba con borradores locales está publicado en `d87deba`; persistencia en GitHub pendiente. [Hoja de ruta](03-roadmap.md) y [propuesta](25-wiki-editing-proposal.md).
