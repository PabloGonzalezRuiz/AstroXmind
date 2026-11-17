# Incidencias y riesgos

Estado contrastado el 17-11-2026 sobre main `5f1a33ff7a846a42914f33be61782adb0e5f8452`. Esta revisión solo cambia documentación en una rama separada.

| Riesgo | Tratamiento |
|---|---|
| Documentación acumulada con contradicciones | Sustituida por documentos operativos consolidados; auditorías antiguas intactas |
| Confundir árbol con referencias | Padre único para pertenencia; muchas referencias cruzadas independientes |
| IDs deducidos del título/ruta | ID editorial explícito; validación y mapeo a ruta actual |
| Ciclos y padres inexistentes | Bloquear validación de NAV-01 con errores claros |
| Copias raw de demos duplican citas | Excluir código mostrado de indexación de referencias |
| Referencias dentro de MDX/TreeTable no detectadas | Diseñar extracción y destinos en NAV-03; no confiar solo en regex global |
| IDs de nodos repetidos en exportación | Namespace de documento y validación antes de ensamblar ramas |
| Tablas plegadas o con scroll recortadas al imprimir | Vista específica totalmente desplegada, sin controles, validar anchos/saltos |
| Prometer offline con dist tal cual | Transformar rutas/recursos/módulos; probar HTML autónomo sin red |
| Citas a contenido no descargado/privado | Señalar salida de rama y separar ámbito público/borrador |
| Complejidad de grafo/routers/plugins | Grafo opcional, no condición; evaluar compatibilidad antes de instalar |
| Revisiones visuales incompletas | Mantenerlas pendientes; builds/DOM no sustituyen navegador real |
| Auditoría seguridad meramente informativa | Revisar ambos lockfiles/PR #1; verde no significa cero vulnerabilidades |
| Ramas y PRs heredados | Revisar sin cerrar/fusionar automáticamente |

El parser actual de TreeTable toma solo la primera sublista por nodo; revisar dentro de robustez. Estado actual y contrato publicados no incluyen IDs de nodo ni backlinks.
