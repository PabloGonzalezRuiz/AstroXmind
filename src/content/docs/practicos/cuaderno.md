---
title: "Prácticos TAI · Cuaderno fusionado"
description: "Ejercicios de desarrollo, redes y seguridad, con soluciones separadas."
---

Material de entrenamiento adaptado; **no es un examen oficial ni una plantilla del INAP**. Revisión editorial: 15/11/2026.

[Índice de prácticos](/AstroXmind/practicos/) · [Soluciones](/AstroXmind/practicos/soluciones/)

Resuelve cada apartado antes de abrir su solución. Los ejemplos de firewall son ejercicios de laboratorio; no constituyen una configuración operativa completa.


## Normalización y SQL
Fuente adaptada: [supuestos-practicos-bloque3-normalizacion-bbdd.md](https://github.com/victorseguragarcia/OPOSICIONES-TAI-OBSIDIAN/blob/af05130f95da193615c4430cb5739278c4cd9cba/wiki/synthesis/supuestos-practicos-bloque3-normalizacion-bbdd.md).

Guía práctica de resolución de supuestos de examen sobre normalización relacional, dependencias funcionales y definición de esquemas en SQL ANSI.

---

## 📋 Caso 1: Identificación de Formas Normales en Tablas Reales

### Enunciado 1.1: Atomicidad de Atributos (1FN)
Dada la siguiente tabla `PERSONAS`:
| id | nombre | fecha_nacimiento | pais |
|---|---|---|---|
| 1 | José Pérez Fernández | 21/10/1970 | España |
| 2 | María López Ruiz | 01/01/1974 | Perú |

<a id="b3-bbdd-01"></a>
**B3-BBDD-01 · ❓ ¿Cumple la tabla la Primera Forma Normal (1FN)?**
[Consultar solución](/AstroXmind/practicos/soluciones/#b3-bbdd-01)


---

### Enunciado 1.2: Dependencias Parciales (2FN)
Dada la tabla `MATRICULAS` con clave primaria compuesta `(dni, curso, modulo)`:
| dni | nombre | apellidos | direccion | curso | modulo | nota |
|---|---|---|---|---|---|---|
| 12345678A | Almudena | Cantero Leal | Calle Sur | AD | DAM1 | 5.1 |
| 23456789B | Luis | López Ruiz | Calle Norte | PSP | DAM1 | 5.5 |

<a id="b3-bbdd-02"></a>
**B3-BBDD-02 · ❓ ¿Cumple la tabla la Segunda Forma Normal (2FN)?**
[Consultar solución](/AstroXmind/practicos/soluciones/#b3-bbdd-02)


---

### Enunciado 1.3: Dependencias Transitivas (3FN) y Descomposición
Partiendo de las tablas resultantes:
- `USUARIOS(dni, nombre, apellidos, direccion)`
- `CURSOS(idcurso, curso, modulo)`
- `USUARIO_CURSOS(dni, idcurso, nota)`

<a id="b3-bbdd-03"></a>
**B3-BBDD-03 · ❓ ¿En qué forma normal se encuentra el esquema descompuesto?**
[Consultar solución](/AstroXmind/practicos/soluciones/#b3-bbdd-03)


---

## 📋 Caso 2: Esquema Comercial Completo y 4FN

Dadas las siguientes tablas:
```sql
Cliente (idCliente, nombre, direccion)
Vendedor (idVendedor, nombre)
Venta (idVenta, Fecha, idCliente, idVendedor)
Articulos (idArticulo, nombre, precio)
ArticulosVendidos (idVenta, idArticulo, cantidad)
```

<a id="b3-bbdd-04"></a>
**B3-BBDD-04 · ❓ ¿En qué Forma Normal se encuentra este esquema? ¿Requiere 4FN?**
[Consultar solución](/AstroXmind/practicos/soluciones/#b3-bbdd-04)


---

## 💻 Caso 3: Sintaxis SQL DDL para Creación de Esquema

<a id="b3-bbdd-05"></a>
**B3-BBDD-05 · ❓ Escribe la sentencia SQL de PostgreSQL para crear la tabla `Estudiante` con clave primaria autoincremental:**
[Consultar solución](/AstroXmind/practicos/soluciones/#b3-bbdd-05)


> Nota de estudio
> 1. **Confundir 2FN con 3FN**: Para comprobar 2FN se consideran **todas las claves candidatas**, no solo la primaria. Una clave primaria simple no excluye otra candidata compuesta con dependencias parciales.
> 2. **BCNF vs 3FN**: La 3FN permite `X  → A` si `A` es atributo primo; la BCNF exige estrictamente que `X` sea superclave sin excepciones.
> 3. **4FN**: Una relación está en 4FN si, para cada dependencia multivaluada no trivial X ↠ Y, X es superclave.

---

## Java y PHP
Fuente adaptada: [supuestos-practicos-bloque3-java-php-programacion.md](https://github.com/victorseguragarcia/OPOSICIONES-TAI-OBSIDIAN/blob/af05130f95da193615c4430cb5739278c4cd9cba/wiki/synthesis/supuestos-practicos-bloque3-java-php-programacion.md).

Ejercicios prácticos de seguimiento de ejecución, bucles infinitos, operadores ternarios, sobrecarga y estructuras de control.

---

## ☕ 1. Trazas de Bucles en Java

### Ejercicio 1.1: Bucle con Condición Inicial Falsa
```java
int contador = 1; 
while (contador < 0) { 
    System.out.println(contador); 
    contador--; 
}
```
<a id="b3-codigo-01"></a>
**B3-CODIGO-01 · ❓ ¿Cuál es la salida del programa?**
[Consultar solución](/AstroXmind/practicos/soluciones/#b3-codigo-01)


---

### Ejercicio 1.2: Bucle Infinito por Incremento de Paso
```java
int contador = 3; 
while (contador != 10) { 
    System.out.println(contador); 
    contador += 2; 
}
```
<a id="b3-codigo-02"></a>
**B3-CODIGO-02 · ❓ ¿Qué ocurre durante la ejecución?**
[Consultar solución](/AstroXmind/practicos/soluciones/#b3-codigo-02)


---

### Ejercicio 1.3: Bucle con `continue` y `break`
```java
int a = 5; 
for (int i = 1; i <= 10; i++) { 
    if (i % 2 == 0) continue;  
    a = a + i; 
    System.out.print(i++ + "," + a + " "); 
    if (a > 20) break; 
}
```
<a id="b3-codigo-03"></a>
**B3-CODIGO-03 · ❓ ¿Qué imprime por pantalla este fragmento?**
[Consultar solución](/AstroXmind/practicos/soluciones/#b3-codigo-03)


---

## 🐘 2. Estructuras Condicionales en PHP y Operadores

### Ejercicio 2.1: Evaluación de `elseif` en PHP
```php
<?php 
$a = 10; 
if ($a < 10 && $a > 1)  
    echo 'el valor es menor que 10'; 
elseif ($a > 10) 
    echo 'el valor es mayor que 10'; 
else 
    echo 'el valor es 0'; 
?>
```
<a id="b3-codigo-04"></a>
**B3-CODIGO-04 · ❓ ¿Qué salida produce el script PHP?**
[Consultar solución](/AstroXmind/practicos/soluciones/#b3-codigo-04)


---

## 🎯 3. Operador Ternario y Sobrecarga de Métodos en Java

### Ejercicio 3.1: Operador Ternario
```java
int v1 = 5;  
int v2 = 4;  
int VF = (v1 > v2) ? v1 : v2;
```
<a id="b3-codigo-05"></a>
**B3-CODIGO-05 · ❓ ¿Qué valor toma `VF`?**
[Consultar solución](/AstroXmind/practicos/soluciones/#b3-codigo-05)


---

### Ejercicio 3.2: Sobrecarga y Retorno Anticipado
```java
void ejemplo(int n, String nombre) {  
    if (n > 0 && !nombre.equals("")) { 
        System.out.println("Hola " + nombre); 
        return; 
    } 
    System.out.println("Adiós"); 
}
```
<a id="b3-codigo-06"></a>
**B3-CODIGO-06 · ❓ ¿Qué imprime si se invoca con `ejemplo(0, "Carlos")`?**
[Consultar solución](/AstroXmind/practicos/soluciones/#b3-codigo-06)


---

## Repaso de desarrollo
Fuente adaptada: [supuestos-practicos-bloque3-simulacro-examen-tai.md](https://github.com/victorseguragarcia/OPOSICIONES-TAI-OBSIDIAN/blob/af05130f95da193615c4430cb5739278c4cd9cba/wiki/synthesis/supuestos-practicos-bloque3-simulacro-examen-tai.md).

Ocho preguntas de entrenamiento sobre desarrollo. No se acredita procedencia de una convocatoria oficial.

---

## 📝 Bloque de Preguntas de Examen

### Pregunta 1: Métrica v3 y Estudio de Viabilidad
En MÉTRICA Versión 3, ¿en qué proceso se define la arquitectura de información y el plan global de proyectos de una organización?
<a id="b3-repaso-01"></a>
**B3-REPASO-01 · ❓ Ver Solución**
[Consultar solución](/AstroXmind/practicos/soluciones/#b3-repaso-01)


---

### Pregunta 2: Diagramas UML de Interacción
En un diagrama de casos de uso UML 2.x, ¿qué relación indica que el caso de uso base incorpora obligatoriamente el comportamiento de otro caso de uso?
<a id="b3-repaso-02"></a>
**B3-REPASO-02 · ❓ Ver Solución**
[Consultar solución](/AstroXmind/practicos/soluciones/#b3-repaso-02)


---

### Pregunta 3: Patrones de Diseño GoF
¿Qué patrón de diseño estructural permite añadir funcionalidades a un objeto dinámicamente en tiempo de ejecución sin alterar la clase original ni utilizar herencia estática?
<a id="b3-repaso-03"></a>
**B3-REPASO-03 · ❓ Ver Solución**
[Consultar solución](/AstroXmind/practicos/soluciones/#b3-repaso-03)


---

### Pregunta 4: Transacciones ACID
En el estándar ANSI SQL, ¿qué nivel de aislamiento previene las *Lecturas Sucias* y las *Lecturas No Repetibles*, pero no garantiza la prevención de *Lecturas Fantasma*?
<a id="b3-repaso-04"></a>
**B3-REPASO-04 · ❓ Ver Solución**
[Consultar solución](/AstroXmind/practicos/soluciones/#b3-repaso-04)


---

### Pregunta 5: SQL y valores nulos
Una tabla tiene tres filas cuyo campo `telefono` vale respectivamente NULL, '111' y NULL. ¿Qué devuelven `COUNT(*)` y `COUNT(telefono)`?
<a id="b3-repaso-05"></a>
**B3-REPASO-05 · Ver solución**
[Consultar solución](/AstroXmind/practicos/soluciones/#b3-repaso-05)


---

### Pregunta 6: Git y Reescribir Historial
¿Qué comando de Git aplica un commit específico de una rama diferente sobre la rama actualmente activa?
<a id="b3-repaso-06"></a>
**B3-REPASO-06 · ❓ Ver Solución**
[Consultar solución](/AstroXmind/practicos/soluciones/#b3-repaso-06)


---

### Pregunta 7: Métricas de Calidad de McCabe
Si un programa posee un grafo de flujo de control con 14 aristas (`E`), 10 nodos (`N`) y 1 componente conexo (`P`), ¿cuál es su complejidad ciclomática `V(G)`?
<a id="b3-repaso-07"></a>
**B3-REPASO-07 · ❓ Ver Solución**
[Consultar solución](/AstroXmind/practicos/soluciones/#b3-repaso-07)


---

### Pregunta 8: Arquitectura RESTful
En el modelo de madurez de Richardson para APIs REST, ¿qué nivel introduce el uso de hipermedios y enlaces dinámicos (HATEOAS)?
<a id="b3-repaso-08"></a>
**B3-REPASO-08 · ❓ Ver Solución**
[Consultar solución](/AstroXmind/practicos/soluciones/#b3-repaso-08)


---

## Redes y directorio
Fuente adaptada: [supuestos-practicos-bloque4-redes-subnetting-ad-ens.md](https://github.com/victorseguragarcia/OPOSICIONES-TAI-OBSIDIAN/blob/af05130f95da193615c4430cb5739278c4cd9cba/wiki/synthesis/supuestos-practicos-bloque4-redes-subnetting-ad-ens.md).

Guía integral de resolución de supuestos prácticos para la segunda parte del examen de Técnicos Auxiliares de Informática (TAI) del Estado, integrando diseño de red IP, servicios de directorio y cumplimiento del Esquema Nacional de Seguridad (RD 311/2022).

---

## 📋 Enunciado del Caso Práctico

Un Organismo Público Estatal dispone del direccionamiento privado `10.20.0.0/22` reservado para este supuesto ficticio para interconectar su sede central y tres delegaciones provinciales. Se requiere diseñar la arquitectura técnica y de seguridad con los siguientes requerimientos:

### Requerimientos de Red (VLSM):
1. **Sede Central (Servidores y CPD)**: Requiere soporte para un mínimo de **480 hosts**.
2. **Delegación A**: Requiere soporte para un mínimo de **120 hosts**.
3. **Delegación B**: Requiere soporte para un mínimo de **60 hosts**.
4. **Delegación C**: Requiere soporte para un mínimo de **28 hosts**.
5. **Enlaces WAN Punto a Punto**: 3 enlaces punto a punto entre la Sede Central y cada una de las 3 delegaciones (2 hosts por enlace).

### Requerimientos de Sistemas y Directorio Activo (AD DS):
- Configuración de un dominio `organismo.age.es` en Windows Server 2022.
- Se debe implementar una directiva de grupo (GPO) que bloquee el uso de dispositivos de almacenamiento USB a los usuarios del departamento administrativo y fuerce el bloqueo de pantalla tras 10 minutos de inactividad.

### Requerimientos de Seguridad ENS (RD 311/2022):
- El sistema gestiona datos de carácter personal y expedientes sancionadores. La pérdida de confidencialidad o integridad causaría un perjuicio grave al organismo. Razonar si este dato basta para asignar automáticamente una categoría ALTA. No se presuponen niveles en las demás dimensiones.

---


<a id="b4-redes-01"></a>
**B4-REDES-01 · Resolución de redes, GPO y categorización**
[Consultar solución](/AstroXmind/practicos/soluciones/#b4-redes-01)


## DMZ y filtrado
Fuente adaptada: [supuestos-practicos-bloque4-seguridad-firewalls-iptables-ens-dmz.md](https://github.com/victorseguragarcia/OPOSICIONES-TAI-OBSIDIAN/blob/af05130f95da193615c4430cb5739278c4cd9cba/wiki/synthesis/supuestos-practicos-bloque4-seguridad-firewalls-iptables-ens-dmz.md).

Entrenamiento de infraestructura segura de red.

---

## 📋 Enunciado del Escenario Práctico

Un Organismo Público necesita desplegar una sede electrónica accesible desde Internet con acceso a base de datos interna cumpliendo con el **Esquema Nacional de Seguridad (ENS RD 311/2022)**.

### Topología de red
| Zona | Interfaz del firewall | Destino |
|---|---|---|
| Internet | eth0: 203.0.113.1 | Dirección pública de documentación |
| DMZ | eth1: 192.168.10.1/24 | Web: 192.168.10.50 |
| Interna | eth2: 192.168.20.1/24 | BBDD: 192.168.20.100; administración: 192.168.20.10 |

---

## ❓ Preguntas del Ejercicio Práctico

### Pregunta 1: Configuración de Reglas de Filtrado `iptables`
Escriba el script de comandos `iptables` en el Firewall para:
1. Política por defecto `DROP` en todas las cadenas (`INPUT`, `FORWARD`, `OUTPUT`).
2. Permitir tráfico de retorno de conexiones ya establecidas (`ESTABLISHED,RELATED`).
3. Permitir tráfico web HTTP (80) y HTTPS (443) desde Internet hacia el Servidor Web en DMZ (`192.168.10.50`).
4. Permitir que el Servidor Web en DMZ consulte la base de datos MySQL (`192.168.20.100:3306`) en la Red Interna.
5. Permitir administración SSH (22) al Servidor Web y al Firewall **únicamente** desde la IP del Administrador (`192.168.20.10`).

<a id="b4-seguridad-01"></a>
**B4-SEGURIDAD-01 · 🔍 Solución Detallada Pregunta 1: Script iptables**
[Consultar solución](/AstroXmind/practicos/soluciones/#b4-seguridad-01)


---

### Pregunta 2: Categoría de seguridad
Para este supuesto se dan expresamente los niveles D=MEDIO, A=ALTO, I=ALTO, C=MEDIO y T=ALTO. ¿Qué categoría resulta?
<a id="b4-seguridad-02"></a>
**B4-SEGURIDAD-02 · Ver solución**
[Consultar solución](/AstroXmind/practicos/soluciones/#b4-seguridad-02)

