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

## Estado contrastado — 17-11-2026

Referencia publicada: `e7bfb8e7f41ec5637c685e62698eb12b7ab1b658`. Clases AST-017, plegado AST-025 y numeración heredable AST-026 están publicados. El siguiente cambio funcional es estado inicial AST-028; Summary/Boundary aplazados. La biblioteca AST-027 sigue al final. Estado operativo y contrato completos: [estado](04-project-status.md), [contrato](10-declarative-language-architecture.md) y [hoja de ruta](03-roadmap.md). Las propuestas de presets/exportación o directivas heredadas no describen funcionalidad disponible del componente actual.
