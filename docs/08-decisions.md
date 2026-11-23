# Decisiones vigentes

**Hito de continuidad H-TEM-01 (23-11-2026; reanudar 24-11):** base funcional `0758632`, CI/Build/Pages correctos y 123 pruebas principales locales; dos integraciones adicionales de reconstrucción fallan en el entorno temporal, pendiente diagnóstico. El expediente 2025 libre sigue en REVISION, con año/modalidad explícitos y CPS separado. Próximo trabajo PROG-01: definir esquema canónico del programa desglosado (YAML), conceptos permanentes, ocurrencias versionadas y asociaciones múltiples; Markdown anidado como vista editable. Después PROG-02, CALL-05 y PROG-03; no reiniciar ni importar datos hasta validar. Las prioridades anteriores son históricas. [Auditoría y criterios de aceptación](audits/2026-11-23-hito-temario.md).

Decisión de diseño: catálogo de conceptos independiente, nodos versionados con padre único, relaciones muchos a muchos, procedencia y revisión manual; conservar oficial literal y usar Markdown como vista, no como única fuente de verdad.

Referencia publicada: 2cdba36, 17-11-2026. [Arquitectura](02-architecture.md), [historia](18-development-history.md), [registro de commits](history/commits-through-2cdba36.md). Los ADRs conservan su contexto; el estado operativo actual se resume aquí.

| Decisión | Resultado vigente |
|---|---|
| Astro/Starlight/MDX, salida estática | Wiki pública en GitHub Pages; evaluar arquitectura privada antes de servir recursos protegidos |
| Edición desde la wiki | Editor GitHub publicado; menú y acceso privado pendientes de implementación |
| Flujo privado documental | Alta por nombre y año; asistente secuencial para 2025 hasta F00; no avanzar sin aceptación |
| Fuente única del componente | TreeTable en laboratorio, importado por wiki; dos paquetes/lockfiles, no workspaces |
| Lista MDX y corchetes literales | Lenguaje actual; no reactivar directivas/Pandoc heredados |
| Herencia explícita | Numeración/tiered/collapsible/folded heredables; start e id locales; clase explícita > nivel > padre > defecto |
| Fuente única de demos | Import componente + ?raw, con Resultado/Código |
| Identidad neutral por proyecto | IDs reservados permanentes, independientes de título/URL |
| Jerarquía YAML | Padre único y orden, independientes de carpetas; raíz única, sin ciclos |
| Árbol y red de citas distintos | Una referencia no convierte destino en descendiente ni lo añade a una futura impresión de rama |
| NAV-01/02/03 | Implementados y publicados, con pruebas y evidencia por SHA |
| Recorrido global preorden | Anterior/siguiente entra en ramas; hermanos tienen controles propios |
| Destino explícito ref-nombre | Estabilidad frente a cambios de título, unicidad por página, sin ID heredado de nodo |
| Resolución también al renderizar | Corrige enlaces Markdown cacheados; validación de HTML final permanece obligatoria |
| Revelado de celdas desprendidas | Abrir antecesores necesarios sin desplegar ramas ajenas |
| Incrementos autorizados | NAV-04 requiere aprobación propia; un encargo documental no autoriza código ni publicar |
| Summary/Boundary | Aplazados; no adoptada compatibilidad completa MarkXMind |
| XMind y offline | Fixtures/objetivos separados; sin exportador .xmind ni HTML autónomo ya disponible |
| Biblioteca AST-027 | Último hito; no paquete npm o repositorio nuevo en este encargo |

Se mantiene el historial de las alternativas exploradas, incluidas galerías semánticas y prototipos de enlaces. No atribuir NAV-04 al producto actual por un prototipo antiguo con ese nombre. El hallazgo reciente de tipado del laboratorio se registra como deuda, sin introducir una corrección funcional en una tarea solo documental.
