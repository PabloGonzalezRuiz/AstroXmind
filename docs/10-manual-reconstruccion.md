# Instalación limpia y reconstrucción de AstroXmind

Referencia reproducible: main publicado `2cdba361920b58a5002faa063e46660f22ff36ef` (17-11-2026), con NAV-01/02/03. Este manual reemplaza las instrucciones antiguas que fijaban 5f1a33f o remitían a una rama aún no publicada. No actualiza dependencias ni despliega nada por sí mismo.

## 1. Preparar un equipo limpio

Instalar Git y Node.js 22 con npm; abrir PowerShell, terminal de VS Code o bash y comprobar:

```sh
git --version
node --version
npm --version
```

Se utiliza Node 22 porque es el entorno de CI. Los paquetes reales los fijan los lockfiles. No se necesita instalar Astro globalmente, Pandoc, XMind Desktop, Python ni una base de datos para compilar la wiki actual. Python 3 solo se necesita si se ejecuta manualmente el script auxiliar de auditoría de dependencias.

## 2. Obtener exactamente la versión publicada

```sh
git clone https://github.com/PabloGonzalezRuiz/AstroXmind.git
cd AstroXmind
git switch --detach 2cdba361920b58a5002faa063e46660f22ff36ef
npm ci --no-audit --no-fund
npm run check
npm run build
npm run test:references:rebuild
npm run preview
```

Abrir la URL que anuncie Astro, con la base /AstroXmind/. La demostración está bajo /AstroXmind/navegacion/. El servidor de preview es local; no publica en GitHub Pages. Detenerlo con Ctrl+C. No ejecutar dev y preview esperando que ambos usen el mismo puerto libre.

La instalación debe incluir devDependencies: astro check y las pruebas de build usan herramientas de desarrollo/jsdom. npm ci no cambia el lockfile y falla si no concuerda con package.json; no sustituirlo por npm install ni borrar el lockfile para ignorar el problema.

HEAD separado reproduce la revisión. Para editar sin tocar main, crear una rama local después del checkout:

```sh
git switch -c trabajo-local
npm run dev
```

Para obtener una revisión posterior autorizada, leer antes el estado y fijar su SHA. No usar latest ni mezclar instrucciones de versiones históricas.

## 3. Qué debe aparecer al terminar

| Salida/comprobación | Resultado en la referencia |
|---|---|
| navigation:check | Árbol válido de diez documentos |
| npm run check | 32 pruebas y diagnósticos Astro sin errores/avisos |
| npm run build | Diez páginas de contenido + 404 técnico, y 15 pruebas HTML/DOM |
| npm run test:references:rebuild | Una prueba adicional, con dos builds en copia temporal y caché conservada |
| dist/navigation.json | Diez nodos, relaciones y recorrido público |
| dist/references.json | Catorce referencias efectivamente renderizadas |
| dist/navegacion/index.html | Tres ejemplos con Resultado/Código |
| dist/pagefind/ y sitemap | Búsqueda de Starlight y mapa del sitio |

Las cuentas describen ese SHA; cambiar contenido puede variarlas legítimamente. npm run check/build suma 47 pruebas; la reconstrucción adicional completa las 48 verificadas. Un build correcto no equivale a despliegue ni a revisión visual completa.

## 4. Laboratorio en una instalación independiente

Después de terminar la instalación y comprobación de la raíz, desde la raíz del checkout, en otra terminal o tras detener el servidor:

```sh
cd examples/astro-component-lab
npm ci --no-audit --no-fund
npm run check
npm run build
npm run dev
```

Abrir la URL anunciada para esa aplicación. Tiene package.json/lockfile propios; instalar la raíz no instala automáticamente el laboratorio y viceversa. No sustituir un lockfile por el otro. La independencia npm no aísla todavía el análisis TypeScript: sin tsconfig propio, el check del laboratorio puede alcanzar archivos raíz; se observó un fallo al prepararlos en paralelo. La secuencia raíz primero y laboratorio después pasó en la revisión. Aislar ese tipado queda pendiente de robustez. Para volver a la raíz desde esa carpeta, usar `cd ../..`.

TreeTable.astro vive en ese laboratorio y la wiki importa el mismo archivo. Cambiarlo afecta a ambas aplicaciones al reconstruirlas. StackBlitz crea una copia aislada; guardar allí no actualiza GitHub.

## 5. Reconstruir la aplicación desde una carpeta vacía

Para reconstrucción fiel, la fuente es el árbol del SHA fijado; no el resultado de un generador Astro actualizado. El historial muestra que originalmente se crearon package.json, configuración, colección y páginas de forma incremental. El código completo de esas piezas está versionado: [arquitectura e inventario](02-architecture.md), [historia y commits](18-development-history.md).

Una forma explícita de recuperar el árbol en una carpeta nueva es:

```sh
mkdir AstroXmind-limpio
cd AstroXmind-limpio
git init
git remote add origin https://github.com/PabloGonzalezRuiz/AstroXmind.git
git fetch --depth 1 origin 2cdba361920b58a5002faa063e46660f22ff36ef
git checkout --detach FETCH_HEAD
npm ci --no-audit --no-fund
npm run check
npm run build
```

Para comprender/reconstruir manualmente las piezas, seguir este orden y copiar las fuentes exactas del mismo SHA; no mezclar un esquema nuevo con componentes antiguos:

| Paso | Archivos/piezas que se crean | Motivo |
|---|---|---|
| 1 | package.json, package-lock.json, tsconfig.json y reglas de ignorado | Base Node/ESM, versiones y archivos generados |
| 2 | Aplicación completa examples/astro-component-lab, con su propio lockfile | Fuente única de TreeTable y CSS de ejemplo |
| 3 | src/lib/navigation/index.mjs y types.ts; scripts/navigation-content.mjs y navigation.mjs; navigation-ids.json | Modelo lógico, lector y reserva de IDs |
| 4 | src/content.config.ts y todas las páginas src/content/docs | Colección Starlight y metadatos obligatorios |
| 5 | context.mjs, src/env.d.ts y src/navigation-middleware.ts | Tipos y contexto por página |
| 6 | Referencias puras/renderizadas, plugin Remark, DocLink y validación de HTML | Resolver IDs y comprobar destinos |
| 7 | scripts/navigation-integration.mjs y astro.config.mjs | Módulo virtual, hooks, rutas e integraciones |
| 8 | Overrides src/components/navigation y DocumentNavigator | Migas, árbol y navegador de página |
| 9 | reference-client.mjs, ComponentExample, demos/Panel y src/examples | Interacción, Resultado/Código y fuentes reales |
| 10 | tests completos y scripts de package.json | El build invoca pruebas que deben existir |
| 11 | Workflows .github/workflows y script de auditoría | CI/CD y evidencias; no necesarios para servir localmente |
| 12 | Documentación/fixtures XMind y fuentes históricas | Continuidad y contexto; no motores activos |

El módulo virtual no es un archivo a crear en src: lo registra navigation-integration. Los JSON de dist se generan; no copiarlos a una carpeta de autoría ni usarlos como segunda fuente editable.

El primer build solo debe ejecutarse cuando estén las piezas que importa la configuración. Un archivo Astro mínimo o un scaffold Starlight sin navigation no reproduce esta aplicación. Si se utiliza un generador como ejercicio independiente, no es una reconstrucción validada hasta incorporar los archivos/lockfiles de referencia y pasar las mismas comprobaciones.

## 6. Añadir una página correctamente

En una rama de trabajo autorizada:

```sh
npm run navigation:id
```

El comando reserva un ID nuevo y modifica navigation-ids.json, pero no crea el archivo. Usar exactamente el ID devuelto en el frontmatter de la nueva página y elegir un padre existente. Ejemplo ilustrativo, no ID disponible para copiar sin reservar:

```yaml
title: Mi documento
navigation:
  id: doc-000011
  parent: doc-000010
  order: 20
```

Guardar el archivo bajo src/content/docs/ con extensión admitida. Un contenido con componentes/imports necesita MDX. El título no determina la identidad; el archivo/carpeta influye en su URL actual y parent/order en su posición lógica. Confirmar npm run check y build. No retirar del ledger IDs emitidos aunque se elimine una página.

## 7. Probar jerarquía y referencias

En articulo-2.md, cambiar únicamente parent de doc-000006 a doc-000009 y reconstruir. Artículo 3 debe acompañarlo sin modificar su propio padre, ID o archivo. Deshacer ese mismo cambio tras la prueba si no se quiere conservar.

Un enlace estable usa `[Desarrollo](doc:doc-000007#ref-desarrollo)`. El apartado mantiene un ID HTML explícito, y un nodo TreeTable usa `[id=ref-nombre]`. No duplicar IDs en la misma página. Markdown y DocLink están soportados; un <a href="doc:..."> arbitrario no se resuelve. [Contrato completo](16-document-references.md).

La demo incluye un salto a ref-medida-detalle, dentro de una tabla plegada y un panel Resultado/Código. Probar entrada directa, selección previa de Código y repetir el salto tras volver a plegar. Sin JavaScript la tabla completa conserva su contenido inicial; no atribuirle persistencia de estado entre sesiones.

## 8. Configurar GitHub Pages en una reconstrucción propia

Esto es un procedimiento, no una orden para cambiar el repositorio actual. Requiere autorización de publicación y permisos sobre el repositorio destino.

1. Ajustar site/base en astro.config.mjs y revisar enlaces explícitos de portada, EditLink y StackBlitz. El repositorio actual usa /AstroXmind.
2. Versionar ambos lockfiles y los workflows. Conservar las comprobaciones de rutas y referencias.
3. En Settings → Pages del repositorio destino, elegir GitHub Actions como fuente de despliegue.
4. Actualizar main solo cuando esté autorizado. CI, Wiki Build y Pages son workflows separados.
5. Esperar el éxito del SHA exacto y comprobar HTTP/HTML/JSON públicos. Que haya un artefacto no significa que Pages ya lo haya desplegado.

[Workflows y operación](19-operations-and-verification.md). No abrir/fusionar PR ni crear releases automáticamente por seguir este manual.

## 9. Codespaces, fallos habituales y restauración

Codespaces proporciona Node 22 y reenvía 4321. Su postCreateCommand conserva un mensaje heredado que sugiere instalar remark-directive. En el estado actual ya figura en el lockfile: usar npm ci; no ejecutar aquella instalación como requisito.

| Síntoma | Comprobación |
|---|---|
| 404 inicial aunque hubo deploy | Existencia de dist/index.html, colección docsLoader/docsSchema y configuración Pages |
| Portada abre, enlaces fallan | base /AstroXmind y href generados/expresos |
| ID no reservado / padre inexistente / ciclo | Ledger y frontmatter; no parchear el JSON de dist |
| Destino repetido o ausente | HTML de la página y [id=ref-...] entre tablas/apartados |
| URL antigua tras renombrar | Mantener resolución en MarkdownContent, no solo Remark; ejecutar test:references:rebuild |
| Falta jsdom/astro check | Instalación raíz completa, incluidas devDependencies |
| Cambios StackBlitz no llegan | Copia independiente; trasladar deliberadamente al repositorio |
| Mensajes de prototipos Pandoc/Remark | No forman parte de los scripts actuales; no activarlos para arreglar el build |

Para restaurar sin sobrescribir trabajo, crear otro checkout/directorio y fijar el SHA. Conservar un diff/commit del trabajo propio. La rama backup/2026-11-14-wiki-funcional apunta a a4ea186, un estado histórico sin las mejoras actuales; no confundirla con el estado publicado 2cdba36. No resetear main ni borrar ramas como parte de una reconstrucción local.

## Ampliación de navegación preparada después de esta referencia

En feature/navigation-order-created-20261117, order es opcional; sin él, el documento se muestra pendiente y al final de los hermanos. created y modified, si se declaran, están dentro de navigation y son cadenas ISO con tres decimales y zona, por ejemplo "2026-11-17T16:05:12.037Z". No se obtienen de archivos, Git o el registro de IDs. [Contrato y prioridades](20-navigation-ordering.md). La numeración utiliza los valores explícitos de order y no se añade al título editorial. npm run test:navigation:ordering verifica la compilación real con intervalos de 1 ms. La referencia de instalación publicada de este manual sigue siendo 2cdba36; no implica que la ampliación esté en Pages.
