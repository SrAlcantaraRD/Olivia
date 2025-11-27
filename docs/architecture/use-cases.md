# Casos de Uso Principales - App Oliva

Este documento detalla los casos de uso (Use Cases) más importantes de la aplicación, que corresponden a las reglas de negocio y flujos de usuario críticos. Cada caso de uso será implementado en la capa de dominio, siguiendo la Clean Architecture.

---

### UC-01: Configurar Perfil de Cuidador Principal

- **Actor**: Nuevo Usuario.
- **Objetivo**: Configurar la aplicación por primera vez como "Progenitor/Tutor".
- **Flujo Principal**:
  1. El usuario selecciona el rol "Progenitor / Tutor".
  2. **Paso 1 (Sobre ti)**: Introduce su nombre y su relación (`Padre/Madre` o `Tutor`).
  3. **Paso 2 (Sobre el niño)**: Introduce el nombre, fecha de nacimiento y diagnóstico (opcional) del niño.
  4. **Paso 3 (Módulos)**: Activa los módulos de cuidado necesarios (ej. `CIC`, `Deposiciones`).
  5. **Paso 4 (Cuidadores secundarios)**: Decide si quiere añadir cuidadores ahora o más tarde.
  6. **Paso 5 (Resumen)**: Revisa toda la información introducida.
  7. Al confirmar, el sistema crea las entidades `Child` y `Carer` (con rol `PRIMARY`), las persiste en la base de datos local y redirige al usuario al Dashboard.
- **Precondiciones**: La aplicación no ha sido configurada previamente.
- **Postcondiciones**: El perfil del cuidador principal y del niño están creados. La app está lista para usarse.

---

### UC-02: Vincular Perfil de Cuidador Secundario

- **Actor**: Nuevo Usuario.
- **Objetivo**: Configurar la aplicación como "Cuidador/Profesional" vinculándose a un perfil de niño existente.
- **Flujo Principal**:
  1. El usuario selecciona el rol "Cuidador / Profesional".
  2. **Paso 1 (Vincular QR)**: La app activa la cámara. El usuario escanea el código QR proporcionado por un Cuidador Principal.
  3. El sistema decodifica el QR, que contiene la información del `Child` y los `permissions` asignados.
  4. **Paso 2 (Confirmar)**: La app muestra los datos del niño y los permisos.
  5. Al confirmar, el sistema crea una entidad `Carer` (con rol `SECONDARY`), la asocia al `Child` y redirige al usuario al Dashboard con la vista correspondiente a sus permisos.
- **Precondiciones**: Un Cuidador Principal ha generado un QR de invitación.
- **Postcondiciones**: El cuidador secundario está vinculado y puede registrar eventos según sus permisos.

---

### UC-03: Registrar un Evento de CIC

- **Actor**: Cuidador (Principal o Secundario con permisos).
- **Objetivo**: Registrar un nuevo cateterismo (CIC) de forma guiada.
- **Flujo Principal**:
  1. El usuario pulsa "Registrar Ahora" y selecciona "Cateterismo (CIC)".
  2. **Paso 1 (Volumen)**: Selecciona una opción (`Bajo`, `Normal`, `Alto`).
  3. **Paso 2 (Color)**: Selecciona una opción (`Transparente`, `Amarillo claro`, etc.).
  4. **Paso 3 (Turbidez)**: Selecciona una opción (`Clara`, `Leve`, `Alta`).
  5. **Paso 4 (Molestias)**: Selecciona una opción (`No`, `Leve`, `Dolor`). Si es `Dolor`, se habilita un campo de texto para una nota breve.
  6. **Paso 5 (Notas y Confirmación)**: El usuario puede añadir notas adicionales y ve un resumen de lo seleccionado.
  7. Al pulsar "Guardar registro", el sistema crea una entidad `CicRecord` con la fecha y hora actual, la asocia al `Child` y al `Carer` que realiza la acción, y la persiste en la base de datos.
  8. El sistema redirige al usuario al Dashboard, que ahora muestra el nuevo registro.
- **Excepciones**: Si el usuario cancela, el flujo se interrumpe y no se guarda nada.

---

### UC-04: Generar y Compartir QR para un Cuidador Secundario

- **Actor**: Cuidador Principal.
- **Objetivo**: Añadir un nuevo cuidador secundario y compartirle un acceso.
- **Flujo Principal**:
  1. Desde "Configuración" -> "Cuidadores", el usuario pulsa "Añadir cuidador".
  2. Introduce el nombre del nuevo cuidador y le asigna un rol/permisos (`Lectura`, `Registro`, `Completo`).
  3. Al guardar, el sistema genera un código QR que contiene la información necesaria para la vinculación (ID del niño, permisos, etc.).
  4. La app muestra el QR en pantalla para que el Cuidador Secundario pueda escanearlo (ver UC-02).
