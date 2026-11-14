# Continuidad — LEER PRIMERO

1. Leer `AGENTS.md`, `docs/00-master-prompt.md`, estado, roadmap, tareas y riesgos.
2. Comprobar en GitHub el HEAD real de `PabloGonzalezRuiz/AstroXmind` / `main` y los últimos workflows.
3. **AST-001 cerrada**; **AST-002 implementada, compilación verificada** en [43591621032](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43591621032); revisión de navegación aún pendiente.
4. Se añadieron configuración Astro/Starlight, portada MDX, guía y cuatro bloques Markdown de demostración; no hay importación de temario real.
5. **Próxima acción inmediata:** revisar la navegación de la wiki, comprobar el artefacto y actualizar auditoría; no comenzar fase 2 sin autorización. No declarar build correcto sin evidencia.
6. No hay despliegue público, release 0.1.0, editor ni integración XMind. La fase de publicación necesita verificación y autorización.
7. Registrar commits, problemas y decisiones antes de cerrar una sesión.

## Bloqueo de publicación (2026-11-14)

El workflow `.github/workflows/wiki-pages.yml` compila correctamente pero su primer deploy [43592193295](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43592193295) falló con 404 porque GitHub Pages no está habilitado para desplegar. Solicitar al usuario configurar `Settings → Pages → Build and deployment → Source: GitHub Actions`. Tras ello, repetir workflow y comprobar la URL real antes de dar por publicada la wiki.

## Despliegue desbloqueado

Tras habilitar GitHub Pages, el segundo intento del run [43592285017](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43592285017) finalizó **success**. URL: https://pablogonzalezruiz.github.io/AstroXmind/ . Próxima tarea: recibir comprobación visual del usuario y corregir problemas si aparecen; no declarar release estable 0.1.0 sin autorización.
