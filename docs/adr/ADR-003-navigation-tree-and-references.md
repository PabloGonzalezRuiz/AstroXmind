# ADR-003 · Árbol documental y referencias independientes

Fecha: 17-11-2026. Estado: decisión de planificación; implementación no autorizada todavía.

## Contexto

El usuario necesita navegación bidireccional rápida, pertenencia jerárquica explícita e impresión/descarga de una rama completa. Busca patrones de Obsidian sin clonar la aplicación. La wiki actual solo conoce rutas/menú y anclas de encabezado, no una identidad/parent editorial validada.

## Decisión

Crear fase Navegación como primera prioridad. Árbol por identidad estable/padre/orden y red de referencias separada; registro derivado del contenido. Adaptadores de destino web/HTML/impresión sin imponer sintaxis exclusiva Obsidian ni depender de su programa. IDs de nodo se diseñarán después de la base documental. NAV-01 es primer cambio pequeño y revisable; autorización individual antes de implementarlo.

## Alternativas

- Carpetas como única jerarquía: sencillo, pero mover archivos cambiaría pertenencia y no expresa una relación independiente.
- Solo wikienlaces/grafo: útil para explorar, insuficiente para padre único y orden de impresión.
- Adoptar motor de notas completo: mayor alcance/dependencias que el objetivo actual.

## Consecuencias

Validar IDs, ciclos y ámbitos; mantener rutas actuales durante migración. Una referencia no añade hijos ni incorpora contenido ajeno a la impresión. Backlinks no sustituyen retorno al origen. HTML offline y PDF requieren salida y pruebas específicas; no aparecen automáticamente por tener enlaces relativos. Biblioteca permanece último hito y Summary/Boundary aplazados.
