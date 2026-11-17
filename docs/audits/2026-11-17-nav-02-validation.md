# Validación NAV-02 — 17-11-2026

Base: NAV-01 1aa5a594b2c2c573af4591689d9089826dd210d8, rama feature/nav-01-document-tree. Autorización del usuario: implementar NAV-02 en esta rama sin publicar; petición adicional de serie de artículos en archivos distintos de una misma carpeta con jerarquía lógica.

## Cambio

Módulo virtual solo servidor conectado al mismo lector del registro; middleware de Starlight y componentes de ruta/padre, hijos, árbol y recorrido preorden. Portada incluida. El menú manual desaparece. Cinco documentos nuevos (serie y cuatro artículos ficticios), todos directamente en src/content/docs/pruebas-jerarquia/. Metadatos doc-000005…9 reservados en el ledger. No se cambia TreeTable, rutas existentes, paquetes ni workflows.

## Evidencia local

- npm ci: correcto.
- npm run check: 26 pruebas pasan; Astro check, 28 archivos, 0 errores/avisos/hints.
- npm run build: nueve documentos de contenido y 404 técnico; navigation.json con nueve nodos; diez pruebas del HTML generado pasan.
- Cada página contrasta breadcrumbs, padre, hijos, árbol HTML anidado, aria-current único y enlaces anterior/siguiente con el registro. Root splash incluida; 404 sin contexto documental falso.
- Prueba real de traslado: editar únicamente parent de articulo-2.md de doc-000006 a doc-000009, reconstruir y pasar diez pruebas HTML. Artículo 3 acompaña a Artículo 2, mantiene parent doc-000007 y URLs intactas. Antecesores finales en esa prueba: inicio, serie, Artículo 4, Artículo 2. Restaurado el YAML inicial antes del build final.
- Servidor dev: petición HTTP al Artículo 3 antes/después de la misma edición y tras restaurarla; breadcrumb cambia entre Artículo 1 y Artículo 4 sin reiniciar el servidor. Proceso cerrado tras comprobarlo.
- git diff --check sin errores. Ninguna inspección visual completa ni prueba manual de teclado/táctil; el HTML generado no demuestra esas coberturas.

## Publicación y continuidad

Validación local, sin nuevos Actions ni despliegue. Main se mantiene en el SHA publicado 5f1a33f; no PR ni release. Pages no contiene la nueva serie. Documentación de estado/hoja de ruta/continuidad y contrato NAV-02 actualizados. NAV-03 pendiente de explicar y autorizar: referencias estables a documentos, apartados y nodos. Backlinks y exportación offline siguen pendientes.
