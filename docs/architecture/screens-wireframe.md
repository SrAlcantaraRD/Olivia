# Screens – Wireframes de la app Oliva

Estos wireframes representan la guía visual conceptual para todas las pantallas de la app Oliva. Permiten mantener coherencia entre diseño, UX y desarrollo, y sirven como punto de referencia durante la implementación.

==================================================
ZONA PRIVADA – WIREFRAMES (TXT PURO)
(Cuidador principal)
==================================================


1) DASHBOARD PRINCIPAL
--------------------------------------------------

==================================================
WIREFRAME – REPORTE (TAB 1)
==================================================

+--------------------------------------------------+
|  [logo]  Gabriel                           ⚙︎    |
+--------------------------------------------------+
|   ● Reporte     Registro     Configuración        |
+--------------------------------------------------+

| [ TARJETA DEL NIÑO ]                             |
|  Mateo (3 años)                                   |
|  Estado general: ● Verde                          |
|  Último CIC: 10:42                                |
|  Última deposición: ayer 18:05                    |
+--------------------------------------------------+

| Próxima acción                                    |
|  “Próximo cateterismo en 2h 15min”                |
+--------------------------------------------------+

| Resumen del día                                   |
|   CIC: 2     Dep: 1     Enemas: 0                 |
+--------------------------------------------------+

| [ Ver historial ]     [ Ver calendario ]          |
+--------------------------------------------------+

==================================================
WIREFRAME – CONFIGURACIÓN (TAB 3)
==================================================

+--------------------------------------------------+
|  [logo]  Gabriel                           ⚙︎    |
+--------------------------------------------------+
|   Reporte     Registro     ● Configuración        |
+--------------------------------------------------+

| Perfil del niño                                   |
|  - Datos personales                               |
|  - Diagnóstico                                    |
+--------------------------------------------------+

| Módulos activos                                    |
|  ✔ CIC     ✔ Deposiciones     ○ Enemas     ○ Meds |
+--------------------------------------------------+

| Cuidadores                                         |
|  - Lista actual                                    |
|  [ Añadir cuidador ]                               |
|  [ Mostrar mi QR ]                                 |
+--------------------------------------------------+

| Ajustes de la app                                  |
|  - Tema (claro / oscuro / oliva)                   |
|  - PIN de acceso                                   |
|  - Exportar datos                                  |
+--------------------------------------------------+

==================================================
WIREFRAME – REGISTRO (DEFAULT TAB)
==================================================

+--------------------------------------------------+
|  [logo]  Gabriel                           ⚙︎    |
+--------------------------------------------------+
|                                                  |
|   Reporte     ● Registro     Configuración       |
+--------------------------------------------------+
|                                                  |
| Próxima acción                                   |
|  “Cateterismo en 1h 45min”                       |
|--------------------------------------------------|
|                                                  |
| Estado del día                                   |
|  ● Verde  – Todo dentro de lo esperado           |
|                                                  |
+--------------------------------------------------+
|                                                  |
|  ¿Qué quieres registrar ahora?                   |
|                                                  |
|             [   REGISTRAR AHORA   ]              |
|             (botón grande primario)              |
|                                                  |
+--------------------------------------------------+
|                                                  |
| Último registro                                  |
|  “CIC hace 3h 20min” → pulsar muestra detalle    |
|                                                  |
+--------------------------------------------------+


2) SELECTOR DE REGISTRO RÁPIDO
--------------------------------------------------

WIREFRAME – SELECTOR DE REGISTRO

+--------------------------------------------------+
|            ¿Qué quieres registrar?               |
+--------------------------------------------------+
|  [ 💧 Cateterismo (CIC) ]                        |
|  [ 💩 Deposición ]                               |
|  [ 🚽 Enema ]   (si módulo activo)               |
|  [ 💊 Medicación ] (si módulo activo)            |
+--------------------------------------------------+
|                 [ Cancelar ]                     |
+--------------------------------------------------+

3) FLUJO CIC – PASO 1 (VOLUMEN)
--------------------------------------------------

WIREFRAME – CIC PASO 1 (Volumen)

+--------------------------------------------------+
| Volumen de orina                                 |
+--------------------------------------------------+
|   ( ) Bajo                                       |
|   ( ) Normal                                     |
|   ( ) Alto                                       |
+--------------------------------------------------+
|    [ Atrás ]                   [ Siguiente ]     |
+--------------------------------------------------+

4) FLUJO CIC – PASO 2 (COLOR)
--------------------------------------------------

WIREFRAME – CIC PASO 2 (Color)

+--------------------------------------------------+
| Color de la orina                                |
+--------------------------------------------------+
|   ( ) Transparente                               |
|   ( ) Amarillo claro                             |
|   ( ) Amarillo oscuro                            |
|   ( ) Anómalo                                    |
+--------------------------------------------------+
|    [ Atrás ]                   [ Siguiente ]     |
+--------------------------------------------------+

5) FLUJO CIC – PASO 3 (TURBIDEZ)
--------------------------------------------------

WIREFRAME – CIC PASO 3 (Turbidez)

+--------------------------------------------------+
| Turbidez                                         |
+--------------------------------------------------+
|   ( ) Clara                                      |
|   ( ) Leve                                       |
|   ( ) Alta                                       |
+--------------------------------------------------+
|    [ Atrás ]                   [ Siguiente ]     |
+--------------------------------------------------+

6) FLUJO CIC – PASO 4 (MOLESTIAS)
--------------------------------------------------

WIREFRAME – CIC PASO 4 (Molestias)

+--------------------------------------------------+
| ¿Hubo molestias?                                 |
+--------------------------------------------------+
|   ( ) No                                         |
|   ( ) Leve                                       |
|   ( ) Dolor                                      |
|       -> campo de nota breve si elige Dolor      |
+--------------------------------------------------+
|    [ Atrás ]                   [ Siguiente ]     |
+--------------------------------------------------+

7) FLUJO CIC – PASO 5 (NOTAS Y CONFIRMACIÓN)
--------------------------------------------------

WIREFRAME – CIC PASO 5 (Confirmación)

+--------------------------------------------------+
| Notas (opcional)                                 |
|  [______________________________]                |
+--------------------------------------------------+
| Resumen del registro                             |
|  Volumen: Normal                                 |
|  Color: Amarillo claro                           |
|  Turbidez: Clara                                 |
|  Molestias: No                                   |
+--------------------------------------------------+
|    [ Cancelar ]        [ Guardar registro ]      |
+--------------------------------------------------+

8) HISTORIAL – TIMELINE
--------------------------------------------------

WIREFRAME – HISTORIAL (TIMELINE)

+--------------------------------------------------+
| Historial                                        |
|  [Hoy] [7 días] [30 días] [Personalizado]        |
+--------------------------------------------------+

| Lunes 26 enero                                   |
|   10:42  💧 CIC – Volumen normal                 |
|   08:04  💩 Deposición – Consistencia normal     |
+--------------------------------------------------+

| Domingo 25 enero                                 |
|   18:05  💩 Deposición                           |
|   14:10  💧 CIC                                  |
+--------------------------------------------------+

             [ Ver en calendario ]
+--------------------------------------------------+

9) HISTORIAL – CALENDARIO
--------------------------------------------------

WIREFRAME – HISTORIAL (CALENDARIO)

+--------------------------------------------------+
|                  Enero 2025                      |
|  <     Enero 2025     >                          |
+--------------------------------------------------+

| Mo Tu We Th Fr Sa Su                             |
| ●  ○  ●  ●  ○  ○  ●                              |
| (● = registros, ○ = sin registros)               |
+--------------------------------------------------+

| Resumen del día seleccionado:                    |
|  CIC: 2   Dep: 1   Enemas: 0                     |
|  Estado: Día dentro de lo esperado               |
+--------------------------------------------------+
|           [ Ver detalle del día ]                |
+--------------------------------------------------+

10) RESUMEN DEL DÍA
--------------------------------------------------

WIREFRAME – RESUMEN DEL DÍA

+--------------------------------------------------+
| Resumen – 26 enero                               |
+--------------------------------------------------+

| Ciclos del día                                   |
|  - CIC: 2                                        |
|  - Deposiciones: 1                               |
|  - Enemas: 0                                     |
+--------------------------------------------------+

| Registro del día                                 |
|  10:42  💧 CIC – Volumen normal                  |
|  08:04  💩 Deposición – Consistencia normal      |
+--------------------------------------------------+

11) DETALLE DE UN REGISTRO
--------------------------------------------------

Created file.
