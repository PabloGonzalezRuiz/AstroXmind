# Manual de reconstrucción manual de AstroXmind

> **Versión del manual:** 2026-11-14. **Alcance:** reconstruir el repositorio documental (fase 0) y la primera estructura Astro + Starlight (fase 1). No se ha publicado una release estable ni desplegado el sitio. **Fuente exacta:** los archivos de la rama `main` de [AstroXmind](https://github.com/PabloGonzalezRuiz/AstroXmind). Si cambia el código, prevalece el contenido del commit que se quiera reproducir.

## 1. Qué se está construyendo

AstroXmind es una wiki de estudio de la oposición TAI, escrita en Markdown, con navegación y búsqueda mediante Astro + Starlight. La edición web, el lenguaje PMD, la conversión a XMind y el visor integrado **no están implementados**. El repositorio es independiente de `xmind-md` y `xmind-md-ts`.

## 2. Requisitos

- Cuenta de GitHub y permiso para crear repositorios.
- Para trabajar **sin instalar nada localmente**: navegador y editor web de GitHub; las compilaciones se hacen con GitHub Actions.
- Para trabajar **localmente**: Git, Node.js 22, npm y editor de texto (por ejemplo VS Code).
- Acceso a Internet para instalar las dependencias npm.

## 3. Crear el repositorio manualmente

1. Abre https://github.com/new.
2. Propietario: tu usuario; nombre exacto: **AstroXmind** (respeta las mayúsculas para la URL de Pages).
3. Selecciona **Public** si deseas publicar con GitHub Pages; el repositorio actual es público.
4. Puedes marcar «Add a README file». Si lo haces, reemplázalo después con el README de este proyecto.
5. Pulsa **Create repository**.
6. Comprueba que la rama principal se llama `main`. No crees una release ni una etiqueta `v0.1.0` todavía.

URL de referencia: https://github.com/PabloGonzalezRuiz/AstroXmind.

## 4. Crear archivos desde la web de GitHub

Para **cada archivo** del árbol del apartado 5:

1. Abre la raíz del repositorio en la rama `main`.
2. Selecciona **Add file → Create new file**.
3. En «Name your file», escribe la **ruta completa**, por ejemplo `docs/00-master-prompt.md`. GitHub crea las carpetas automáticamente.
4. Abre el archivo equivalente del repositorio de referencia, selecciona **Raw** o **Edit**, y copia **todo su contenido**. Es la forma más fiel de reconstruir la versión real sin transcribir a mano fragmentos que pueden haber cambiado.
5. Pega el contenido, selecciona **Commit changes**, escribe un mensaje descriptivo y confirma en `main`.
6. Repite para cada ruta. Si el archivo existe, utiliza el lápiz **Edit this file**, no «Create new file».

**Atención:** los archivos cuyo nombre empieza por punto (`.github`, `.gitignore`) deben conservar el punto inicial. No crees archivos vacíos de carpeta: Git no almacena carpetas vacías.

## 5. Árbol que debes reproducir

```text
AstroXmind/
├── .github/
│   └── workflows/
│       └── wiki-ci.yml
├── .gitignore
├── AGENTS.md
├── CHANGELOG.md
├── README.md
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── docs/
│   ├── 00-master-prompt.md
│   ├── 01-project-vision.md
│   ├── 02-architecture.md
│   ├── 03-roadmap.md
│   ├── 04-project-status.md
│   ├── 05-task-register.md
│   ├── 06-issues-and-risks.md
│   ├── 07-test-and-audit.md
│   ├── 08-decisions.md
│   ├── 09-continuation.md
│   ├── 10-manual-reconstruccion.md
│   ├── adr/
│   │   └── ADR-001-initial-architecture.md
│   └── audits/
│       └── 2026-11-14-phase-0.md
└── src/
    └── content/
        └── docs/
            ├── index.mdx
            ├── guia-estudio.md
            ├── bloque-1/introduccion.md
            ├── bloque-2/introduccion.md
            ├── bloque-3/introduccion.md
            └── bloque-4/introduccion.md
```

Para copiar el contenido **exacto** de cualquier ruta, utiliza:

```text
https://github.com/PabloGonzalezRuiz/AstroXmind/blob/main/RUTA_DEL_ARCHIVO
```

Sustituye `RUTA_DEL_ARCHIVO` por, por ejemplo, `astro.config.mjs` o `docs/00-master-prompt.md`.

## 6. Crear la base Astro + Starlight

### 6.1 package.json

Crea `package.json` con esta configuración inicial:

```json
{
  "name": "astro-xmind",
  "version": "0.1.0-dev",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check"
  },
  "dependencies": {
    "@astrojs/starlight": "^0.36.0",
    "astro": "^5.16.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.4",
    "typescript": "^5.8.0"
  }
}
```

Los rangos con `^` permiten actualizaciones compatibles; para reproducibilidad estricta, genera y conserva `package-lock.json` y utiliza `npm ci` en CI cuando exista ese archivo.

### 6.2 astro.config.mjs

Crea `astro.config.mjs`. Este es el diseño de navegación inicial; para una reproducción exacta comprueba también la versión actual del archivo en GitHub:

```js
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://pablogonzalezruiz.github.io',
  base: '/AstroXmind',
  integrations: [
    starlight({
      title: 'AstroXmind · Temario TAI',
      defaultLocale: 'root',
      locales: { root: { label: 'Español', lang: 'es' } },
      sidebar: [
        {
          label: 'Introducción',
          items: [
            { label: 'Inicio', link: '/' },
            { label: 'Cómo estudiar', link: '/guia-estudio/' },
          ],
        },
        { label: 'Bloque I · Organización del Estado', autogenerate: { directory: 'bloque-1' } },
        { label: 'Bloque II · Tecnología básica', autogenerate: { directory: 'bloque-2' } },
        { label: 'Bloque III · Desarrollo de sistemas', autogenerate: { directory: 'bloque-3' } },
        { label: 'Bloque IV · Sistemas y comunicaciones', autogenerate: { directory: 'bloque-4' } },
      ],
    }),
  ],
});
```

**Nota de despliegue:** `site` y `base` deben adaptarse si cambias de usuario o repositorio. `/AstroXmind` es la subruta de GitHub Pages; no es una URL de sitio ya verificada.

### 6.3 tsconfig.json

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": { "types": ["astro/client"] }
}
```

### 6.4 .gitignore

```gitignore
node_modules/
dist/
.astro/
.env
.env.*
!.env.example
```

## 7. Crear las páginas Markdown

Las páginas de la wiki se colocan en `src/content/docs/`, **no** en la carpeta `docs/` de gobierno del proyecto.

- `index.mdx`: portada Starlight con frontmatter YAML `title`, `description`, `template: splash`, `hero` y componentes `CardGrid` y `LinkCard`.
- `guia-estudio.md`: instrucciones de uso y límites actuales.
- `bloque-1/introduccion.md`: Organización del Estado.
- `bloque-2/introduccion.md`: Tecnología básica.
- `bloque-3/introduccion.md`: Desarrollo de sistemas.
- `bloque-4/introduccion.md`: Sistemas y comunicaciones.

Ejemplo de una página de bloque:

```md
---
title: Introducción al bloque II
description: Tecnología básica.
sidebar:
  order: 1
---

# Tecnología básica

Espacio reservado para los contenidos del bloque.
```

Copia las páginas completas desde la rama `main` para reproducir el mismo contenido. Los textos actuales son **ejemplos de navegación**, no un temario oficial verificado.

## 8. Implantar la documentación de continuidad (fase 0)

La carpeta `docs/` guarda **la documentación del desarrollo**, no las páginas de estudio. Crea los siguientes archivos copiándolos de la referencia:

| Archivo | Para qué sirve |
|---|---|
| `AGENTS.md` | Instrucciones obligatorias para asistentes de IA |
| `docs/00-master-prompt.md` | Objetivos y límites permanentes |
| `docs/01-project-vision.md` | Visión del producto y fuentes candidatas |
| `docs/02-architecture.md` | Arquitectura actual y futura |
| `docs/03-roadmap.md` | Fases, dependencias y criterios de cierre |
| `docs/04-project-status.md` | Estado actual, contrastable con Git |
| `docs/05-task-register.md` | Tareas AST-NNN y evidencias |
| `docs/06-issues-and-risks.md` | Incidencias y riesgos |
| `docs/07-test-and-audit.md` | Protocolo y resultados de pruebas |
| `docs/08-decisions.md` | Índice de decisiones ADR |
| `docs/09-continuation.md` | Cómo retomar el proyecto sin esta conversación |
| `docs/adr/ADR-001-initial-architecture.md` | Decisión de arquitectura inicial |
| `docs/audits/2026-11-14-phase-0.md` | Primera auditoría |
| `CHANGELOG.md` | Registro de cambios |
| `README.md` | Presentación y enlaces a documentos |

### Protocolo de trabajo

1. **Antes de empezar:** leer `AGENTS.md`, continuidad, estado, tareas y roadmap; verificar HEAD y Actions.
2. **Al iniciar una tarea:** asignar identificador `AST-NNN`, objetivo y criterio de aceptación.
3. **Durante el trabajo:** registrar errores y decisiones relevantes, indicando commits y ejecuciones.
4. **Al verificar:** separar implementado de probado; una compilación fallida nunca es «completada».
5. **Al cerrar:** actualizar estado, tareas, auditoría y continuidad. Pedir autorización antes de una fase nueva.

## 9. Configurar GitHub Actions

Crea `.github/workflows/wiki-ci.yml`:

```yaml
name: Wiki · Build
on:
  push:
    branches: [main]
  pull_request:
  workflow_dispatch:

permissions:
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - name: Install dependencies
        run: npm install --no-audit --no-fund
      - name: Build wiki
        run: npm run build
      - name: Upload site artifact
        uses: actions/upload-artifact@v4
        with:
          name: astro-xmind-site
          path: dist/
```

Guarda el archivo. GitHub debería detectar el workflow automáticamente. Entra en **Actions → Wiki · Build**, abre la ejecución más reciente y verifica que los pasos de instalación y compilación terminan correctamente. Si falla, abre **build** y consulta el registro de errores.

**Importante:** este workflow solo **compila y sube un artefacto**. **No publica GitHub Pages.** El despliegue se configurará en una fase posterior.

## 10. Alternativa: instalación y prueba local

Si decides utilizar un ordenador:

```bash
git clone https://github.com/PabloGonzalezRuiz/AstroXmind.git
cd AstroXmind
npm install
npm run dev
```

Abre la URL local que muestre Astro (habitualmente `http://localhost:4321`).

Para comprobar la compilación:

```bash
npm run build
npm run preview
```

La carpeta `dist/` contiene el sitio generado. Si aparece `package-lock.json`, consérvalo en Git y cambia la instalación del workflow a `npm ci`.

## 11. Incidencias reales encontradas

### INC-001: enlace de portada incorrecto

**Error observado:** `AstroUserError: The slug "" specified in the Starlight sidebar config does not exist`.

**Causa:** se configuró `{ label: 'Inicio', slug: '' }`.

**Corrección:** utilizar `{ label: 'Inicio', link: '/' }`.

**Evidencia:** [ejecución fallida 43591434053](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43591434053), corrección commit `5da231c9`.

### INC-002: enlace de guía incorrecto

**Error observado:** `AstroUserError: The slug "guia-estudio" specified in the Starlight sidebar config does not exist`.

**Corrección aplicada:** sustituir `slug: 'guia-estudio'` por `link: '/guia-estudio/'`.

**Evidencia:** [ejecución fallida 43591525345](https://github.com/PabloGonzalezRuiz/AstroXmind/actions/runs/43591525345), corrección commit `a3b61547`.

**Estado:** las correcciones requieren comprobar una ejecución posterior; no afirmar que el sitio compila hasta verla finalizar correctamente.

## 12. Lista de comprobación para reconstrucción

- [ ] Repositorio `AstroXmind` creado con rama `main`.
- [ ] Archivos de configuración Astro y npm presentes.
- [ ] Portada, guía y cuatro bloques Markdown presentes.
- [ ] Documentación de gobierno, ADR y auditoría presentes.
- [ ] Workflow `Wiki · Build` visible en Actions.
- [ ] Dependencias instaladas sin errores.
- [ ] `npm run build` finaliza correctamente.
- [ ] Se genera el artefacto `astro-xmind-site`.
- [ ] La portada y los cuatro bloques se pueden navegar en una vista previa.
- [ ] Estado, tareas e incidencias reflejan los resultados reales.

## 13. Cómo recuperar el contexto en una sesión nueva

Indica al asistente:

> Trabaja en `PabloGonzalezRuiz/AstroXmind`. Lee `AGENTS.md`, `docs/00-master-prompt.md`, `docs/09-continuation.md`, `docs/04-project-status.md` y `docs/05-task-register.md`. Comprueba el HEAD y las ejecuciones recientes de GitHub Actions. Audita discrepancias, informa del estado real y retoma la primera tarea pendiente sin comenzar una fase nueva sin autorización.

Esta instrucción **no sustituye** la inspección de GitHub: sirve para indicar dónde está la información persistente.

## 14. Alcance y limitaciones

Este manual reproduce la configuración y el contenido documental creados hasta la fase 1, pero no documenta una aplicación ya estable. No se han implementado editor Markdown, persistencia desde navegador, conversión PMD, integración XMind, publicación Pages ni release. El código y las versiones pueden cambiar; si necesitas reconstruir un estado histórico exacto, utiliza el SHA de un commit y no la rama `main` móvil.
