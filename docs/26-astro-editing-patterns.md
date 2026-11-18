# Patrones de edición en wikis y sitios Astro alojados en GitHub

Investigación inicial: 18-11-2026. Complementa la [propuesta de edición](25-wiki-editing-proposal.md) y la [hoja de ruta](03-roadmap.md). El rastreo amplio de repositorios Astro es la tarea AST-035 y queda pendiente del informe comparativo.

## Conclusión

La edición desde una web alojada en GitHub es viable. Lo habitual cae en tres modelos: abrir el editor web de GitHub; usar la wiki nativa de GitHub; o añadir un CMS/editor al sitio estático, con autenticación y una vía de escritura atendidas por GitHub o por un servicio/backend. GitHub Pages puede servir la interfaz; Pages por sí solo no aporta un servidor de aplicación ni una credencial segura para modificar el repositorio.

## Patrones comprobados

| Patrón | Cómo guarda | Requisitos y límites | Fuente |
|---|---|---|---|
| Enlace «Editar esta página» | Lleva al archivo fuente de GitHub. El colaborador edita allí; GitHub registra el cambio o propone una solicitud de cambios según sus permisos. | Es sencillo y no requiere CMS propio, pero la edición sucede en GitHub, no dentro de la wiki. | [Guía de contribución de Astro](https://contribute.docs.astro.build/first-time/edit-single-page/) y [configuración editLink de Starlight](https://starlight.astro.build/reference/configuration/). |
| Wiki nativa de GitHub | La interfaz de GitHub edita páginas de la wiki y guarda cada cambio como commit en el repositorio de la wiki. | Es un producto de GitHub con servidor, autenticación y permisos propios; no demuestra que una página estática de Pages pueda escribir por sí misma. | [Documentación de GitHub: añadir o editar páginas wiki](https://docs.github.com/en/communities/documenting-your-project-with-wikis/adding-or-editing-wiki-pages). |
| Decap CMS con GitHub backend | CMS web edita archivos del repositorio y realiza cambios de Git. | La autenticación GitHub normal requiere un servidor. Los usuarios necesitan acceso de escritura. Open Authoring permite proponer cambios desde un fork y enviar un PR; Decap Turbo ofrece autenticación y proxy alojados. | [GitHub backend](https://decapcms.org/docs/github-backend/), [Open Authoring](https://decapcms.org/docs/open-authoring/) y [conectar con Decap Turbo](https://decapcms.org/docs/turbo-connecting-a-site/). |
| TinaCMS / TinaCloud | El editor se conecta a un backend/API alojado o propio; el servicio gestiona usuarios, integración Git y commits al repositorio. | Reduce el trabajo de infraestructura, a cambio de adoptar y configurar ese servicio/backend. La documentación indica que los editores autorizados pueden editar sin acceso directo al repositorio. | [FAQ y opciones de producción de TinaCMS](https://tina.io/docs/faq). |

## Qué significa para AstroXmind

El editor Markdown con vista previa en directo y borradores locales ya está publicado en la página de prueba. El commit `d87deba` lo confirma; los trabajos de compilación y despliegue de Pages asociados terminaron correctamente. Ese editor demuestra la experiencia de autoría, pero todavía no autentica ni guarda cambios en GitHub.

El contenido de AstroXmind incluye Markdown/MDX, anotaciones TreeTable, IDs, rutas y metadatos de navegación. Un CMS genérico puede cubrir edición de texto; el movimiento de ramas, la renumeración y la conservación de referencias requieren una capa de lógica específica. Esta conclusión se basa en el modelo de contenido actual y deberá confirmarse durante AST-035.

## Arquitectura recomendada para evaluar

1. Mantener GitHub como fuente de verdad y Pages como alojamiento de la interfaz estática.
2. Añadir login y una API de guardado; mantener cualquier clave de GitHub App como secreto del servidor, nunca dentro del bundle del navegador.
3. Autorizar solo repositorio/rutas necesarias, validar la página y su revisión base, y guardar en una rama de borrador con PR antes de integrar y publicar.
4. Mantener las operaciones del árbol en una capa de dominio: al mover una rama, actualizar el padre/orden de los hermanos afectados, conservar IDs y referencias, validar ciclos y detectar conflictos.
5. Comparar una API propia (por ejemplo, una función serverless) con un CMS alojado como Decap Turbo o TinaCloud antes de elegir. La solución final debe seguir mostrando vista previa compilada fiel para MDX/TreeTable.

Una instalación privada del repositorio no sustituye autenticación de escritura en la aplicación ni convierte automáticamente en privada la web de Pages. El repositorio de AstroXmind es actualmente público; cualquier cambio de visibilidad es una decisión aparte.

## Tarea de investigación AST-035

Hacer un barrido reproducible de repositorios públicos de GitHub que dependan de Astro y registrar ejemplos verificables de edición documental. Para cada caso: repositorio y evidencia; modo de edición (enlace, CMS, editor propio); dónde se autentica; cómo se escribe (commit directo, rama/PR, servicio); alojamiento; y qué parte sería reutilizable para AstroXmind. Indicar el tamaño y los límites de la muestra: no prometer exhaustividad sobre «todos» los repositorios públicos. Entregar una tabla comparativa, fuentes enlazadas, patrones comunes y recomendación concreta. Esta investigación no cambia por sí misma la prioridad: la edición persistente desde la wiki sigue siendo el primer desarrollo.

## Referencias

- [Astro Docs: editar una página](https://contribute.docs.astro.build/first-time/edit-single-page/)
- [Starlight: editLink](https://starlight.astro.build/reference/configuration/)
- [GitHub Docs: editar una wiki](https://docs.github.com/en/communities/documenting-your-project-with-wikis/adding-or-editing-wiki-pages)
- [Decap CMS: GitHub backend](https://decapcms.org/docs/github-backend/)
- [Decap CMS: Open Authoring](https://decapcms.org/docs/open-authoring/)
- [TinaCMS: FAQ y producción](https://tina.io/docs/faq/)
