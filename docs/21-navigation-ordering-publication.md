# Publicación de ordenación y documentación integral — 17-11-2026

El usuario autorizó integrar en main y desplegar la ampliación validada en 19c63a2f3f1ca7aea599d2a3c3952e251abab829. Incluye la documentación integral de e0e3d6. Main previo: 2cdba361920b58a5002faa063e46660f22ff36ef. Sin apertura/fusión de PR ni release, y sin iniciar NAV-04.

## Contenido

- order opcional: primero los valores explícitos y después los pendientes.
- Desempate por created del YAML o, si falta, modified. Fechas ISO con tres cifras de milisegundos y zona; sin consulta de fechas físicas, Git, ledger o reloj del build.
- Número heredado solo con order explícito; duplicados comparten número. Los pendientes muestran marca; la raíz es neutra y un padre sin order corta el prefijo.
- NavigationLabel coherente en árbol, migas y DocumentNavigator. Índice schemaVersion:2; referencias y URLs conservadas.
- Arquitectura completa, instalación limpia, historia de 222 commits de la referencia anterior, operación, estado y prompt maestro actualizados.

## Validación y procedimiento de publicación

Antes de integrar pasaron 58 pruebas: 41 de dominio/referencias, 15 HTML/DOM y dos integraciones de builds reales (ordenación con 1 ms de diferencia y referencias/cache). Astro check sin errores/avisos/hints. No se cambian componentes TreeTable, dependencias ni workflows. Las modificaciones de preparación de publicación son documentales.

[CI, Build y Pages](https://github.com/PabloGonzalezRuiz/AstroXmind/actions) se consultan por el SHA de integración; los runs de 2cdba36 son evidencia histórica. Antes de anunciar publicación comprobar success del SHA actual y HTTP/HTML/JSON publicados: schemaVersion:2, números/marcas coherentes, diez documentos y catorce referencias.

- [Navegación](https://pablogonzalezruiz.github.io/AstroXmind/navegacion/).
- [Índice de navegación](https://pablogonzalezruiz.github.io/AstroXmind/navigation.json).
- [Contrato actualizado](20-navigation-ordering.md).

Las páginas actuales conservan sus orders explícitos y no se inventan fechas: created/modified solo tienen valor si se declaran en YAML. Los casos de pendientes, órdenes repetidos y milisegundos se comprueban en fixtures de compilación real, sin alterar de forma artificial los artículos publicados.

No afirmar revisión visual completa con pruebas DOM. La aprobación cubre esta entrega, no NAV-04 ni futuras modificaciones de main. Los informes históricos previos quedan intactos; las menciones antiguas de «solo en rama» corresponden a su momento anterior a esta autorización.
