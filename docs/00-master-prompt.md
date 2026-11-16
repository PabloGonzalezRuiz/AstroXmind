# Prompt maestro de AstroXmind

## Objetivo

Mantener una wiki de estudio clara, accesible y publicable a partir de Markdown/MDX, y desarrollar un lenguaje declarativo explícito que una estructura, intención, estilo visual y futuras propiedades de XMind. La escritura debe ser fácil de generar y revisar tanto por una persona como por una IA.

## Hechos actuales

- Repositorio activo: `PabloGonzalezRuiz/AstroXmind`, rama `main`.
- Wiki GitHub Pages: https://pablogonzalezruiz.github.io/AstroXmind/.
- `main` conserva Astro/Starlight y el pipeline remark-directive → plugin semántico → rehype para documentos `.md`.
- `tabla-arbol`/`rootTopic` genera jerarquía HTML. Propiedades XMind pueden declararse en YAML `xmind`.
- AST-017 está desarrollada en `feature/ast-017-level-classes`, aislada y pendiente de validación.
- AST-019 está integrada y publicada en `main`: componente Astro `TreeTable.astro` que transforma una lista MDX en tabla HTML estática. La prueba pública enlaza al componente y al archivo fuente; muestra debajo el MD base.
- El sandbox está en `examples/astro-component-lab`; la wiki enlaza a StackBlitz con vista previa Vite y terminal. Esa copia no cambia automáticamente las fuentes del repositorio.
- La conversión funcional a `.xmind` aún no existe.
- MarkXMind/XMindMark se estudió como referencia de conceptos. La recomendación está en `docs/12-markxmind-compatibility.md`; no adoptar automáticamente su sintaxis de marcadores.

## Principios

1. Expresar estructura y propósito explícitamente.
2. Permitir defaults por estructura/nivel y sobrescrituras locales.
3. Mantener `.md` como formato habitual de los temas; usar `.mdx` para ejemplos que importan componentes Astro.
4. Mantener un laboratorio aislado para observar cambios y errores antes de integrar componentes.
5. Separar jerarquía, presentación CSS, semántica de mind map y propiedades serializables XMind.
6. Usar IDs estables para referencias entre nodos.
7. Documentar ejemplos ejecutables y verificar con documentos XMind reales.
8. Conservar fuentes y referencias de los materiales de estudio.
9. No sustituir el sistema actual por el prototipo MDX hasta revisar el comportamiento y validar con Actions.
10. En cada página de prueba, enlazar al componente generador y al MDX fuente; mostrar el MD base bajo el resultado y explicar cómo editar el archivo en el repositorio.

## Retomar

Leer `docs/09-continuation.md`, comprobar la rama de trabajo, PRs y Actions. La validación de CI puede ejecutarse en PR; el despliegue de Pages requiere `main`. No fusionar ni publicar sin autorización explícita. Distinguir siempre lo propuesto, implementado y verificado.
