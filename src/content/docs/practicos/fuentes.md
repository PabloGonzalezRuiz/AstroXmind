---
title: "Prácticos · Fuentes y revisión"
description: "Procedencia, atribución y correcciones de los materiales adaptados."
---

## Procedencia

Adaptación de cinco documentos del repositorio de **Víctor Segura García**, revisión `af05130f95da193615c4430cb5739278c4cd9cba`, bajo licencia MIT. Se conserva el aviso íntegro al final.

| Documento | Apartados |
|---|---:|
| [supuestos-practicos-bloque3-normalizacion-bbdd.md](https://github.com/victorseguragarcia/OPOSICIONES-TAI-OBSIDIAN/blob/af05130f95da193615c4430cb5739278c4cd9cba/wiki/synthesis/supuestos-practicos-bloque3-normalizacion-bbdd.md) | 5 |
| [supuestos-practicos-bloque3-java-php-programacion.md](https://github.com/victorseguragarcia/OPOSICIONES-TAI-OBSIDIAN/blob/af05130f95da193615c4430cb5739278c4cd9cba/wiki/synthesis/supuestos-practicos-bloque3-java-php-programacion.md) | 6 |
| [supuestos-practicos-bloque3-simulacro-examen-tai.md](https://github.com/victorseguragarcia/OPOSICIONES-TAI-OBSIDIAN/blob/af05130f95da193615c4430cb5739278c4cd9cba/wiki/synthesis/supuestos-practicos-bloque3-simulacro-examen-tai.md) | 8 |
| [supuestos-practicos-bloque4-redes-subnetting-ad-ens.md](https://github.com/victorseguragarcia/OPOSICIONES-TAI-OBSIDIAN/blob/af05130f95da193615c4430cb5739278c4cd9cba/wiki/synthesis/supuestos-practicos-bloque4-redes-subnetting-ad-ens.md) | 1 |
| [supuestos-practicos-bloque4-seguridad-firewalls-iptables-ens-dmz.md](https://github.com/victorseguragarcia/OPOSICIONES-TAI-OBSIDIAN/blob/af05130f95da193615c4430cb5739278c4cd9cba/wiki/synthesis/supuestos-practicos-bloque4-seguridad-firewalls-iptables-ens-dmz.md) | 2 |

## Revisión editorial de 15/11/2026

- Conversión de enlaces Obsidian y recuadros de respuesta a enlaces entre enunciados y soluciones, con 22 identificadores persistentes.
- El supuesto que anunciaba 20 preguntas contiene 8; no se atribuye carácter oficial a ninguna.
- Corrección del ejemplo PHP que incluía secuencias literales de salto de línea.
- SQL de identidad identificado como PostgreSQL; AUTO_INCREMENT no se presenta como SQL ANSI.
- Normalización condicionada a dependencias funcionales explícitas; se consideran todas las claves candidatas.
- Se sustituyó una pregunta normativa sin fuente verificada por un ejercicio propio de COUNT y NULL.
- Retiradas afirmaciones ENS sin justificación sobre cifrados concretos, retención y categoría automática por datos personales. Se conserva la regla de categoría del anexo I del RD 311/2022.
- Se delimita el ejemplo de filtrado: requiere enrutamiento y DNAT para publicar la dirección pública hacia la DMZ; no es una configuración de producción.

## Referencias de contraste

- [RD 311/2022, anexo I](https://boe.es/diario_boe/txt.php?id=BOE-A-2022-7191).
- [PostgreSQL: columnas de identidad](https://www.postgresql.org/docs/18/ddl-identity-columns.html).

La revisión es editorial y técnica parcial. No se han ejecutado las políticas de Windows ni el firewall. La tabla VLSM y los enlaces internos sí se verifican en la preparación de esta incorporación.

## Aviso MIT del material adaptado

```text
MIT License

Copyright (c) 2026 Víctor Segura García

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
