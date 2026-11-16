# Visión y alcance

AstroXmind sirve ahora como una wiki técnica para estudiar la creación de componentes Astro y sus clases CSS. La wiki pública contiene guía, ejemplo ejecutable y sandbox; en esta fase no ofrece acceso al temario.

## Enfoque actual

- Componentes Astro escritos en `.astro`.
- Clases CSS encapsuladas y clases de nivel como `nivel-0`, `nivel-1`.
- Uso de componentes desde páginas MDX.
- Prototipos estáticos que muestran su resultado en Starlight.
- Laboratorio Astro aislado con vista previa y errores de compilación en vivo.

## Evolución posible

Ampliar el lenguaje de árbol para expresar semántica de nodos y propiedades XMind, y evaluar la conversión a `.xmind`. La numeración por nodo ya tiene un prototipo: decimal, local entre hermanos o gradual con ruta de antecesores y un número inicial configurable.

La vuelta a contenido TAI queda aplazada. Antes de publicar temario habría que decidir acceso, procedencia, licencias y fuentes oficiales. El repositorio actual es público, por lo que todo contenido e historial accesible en GitHub debe tratarse como público.

## Fuera del alcance público actual

No se publican bloques, apuntes ni galerías de otras tecnologías. El desarrollo de componentes usa Astro, MDX y CSS porque son las herramientas que se documentan en la wiki.

## Referencia de continuidad — 16-11-2026

Código publicado auditado: `6aff07e65b8cbd8e89f56a2f9a39d04f5a0af372`. PR #8 integrado; numeración literal `[numbering=arabic; tiered=true; start=5]` sin escapes. Clases automáticas `nivel-N` implementadas; mapa configurable AST-017 pendiente de adaptación al componente actual. Summary y Boundary (AST-018) son diseño pendiente, no funcionalidades publicadas. Ver [estado](./04-project-status.md) y [continuidad](./09-continuation.md).
