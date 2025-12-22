# Diseño Orientado al Dominio (DDD) - App Oliva

Este documento describe los conceptos clave del dominio de la aplicación "Oliva", siguiendo los principios de Domain-Driven Design (DDD). El objetivo es establecer un lenguaje común y un modelo claro que guíen el desarrollo.

## 1. Lenguaje Ubicuo (Ubiquitous Language)

Para asegurar la coherencia entre el negocio y el código, se define el siguiente glosario de términos:

| Término | Definición | Alias / Notas |
| :--- | :--- | :--- |
| **Paciente** | El menor que recibe los cuidados. Es la entidad central en torno a la cual giran los registros. | `Child`, `Patient` |
| **Cuidador** | Persona que utiliza la app para registrar eventos. Existen dos tipos. | `Carer`, `User` |
| **Cuidador Principal** | Rol de tipo `ADMIN`. Tiene control total sobre los datos, la configuración y la gestión de otros cuidadores. | `AdminCarer` |
| **Cuidador Secundario** | Rol de tipo `SECUNDARIO` o `SANITARIO`. Se vincula a un perfil de Paciente mediante un QR y tiene permisos limitados. | `SecondaryCarer` |
| **Módulo** | Una categoría de cuidado que se puede registrar (ej. Cateterismos, Deposiciones). Es una entidad dinámica. | `Module` |
| **Campo de Módulo** | Un atributo específico de un módulo (ej. el campo "Volumen" del módulo "CIC"). | `ModuleField` |
| **Rutina** | Una instancia de un registro de cuidado asociado a un módulo específico. Es el evento principal. | `Routine`, `CareEvent` |
| **Campo de Rutina** | El valor concreto de un campo para una rutina específica (ej. "Volumen" = "Alto"). | `RoutineField` |
| **Historial** | Vista cronológica de todas las Rutinas registradas. | `History`, `Timeline` |
| **Sincronización QR** | Proceso mediante el cual un Cuidador se vincula a un Paciente escaneando un código QR. | `QRSync` |
| **Payload de Sinc.** | La información contenida en el QR para realizar la vinculación. | `SyncPayload` |

## 2. Contextos Delimitados (Bounded Contexts)

Aunque la aplicación es relativamente pequeña, podemos identificar dos contextos principales:

1.  **Contexto de Configuración (Setup Context)**
    *   **Responsabilidad**: Gestionar el primer uso de la aplicación, la selección de rol, la creación del perfil del Niño y la configuración inicial de los cuidadores.
    *   **Actores**: Usuario nuevo (aún no definido como Cuidador).
    *   **Disparadores**: Primer arranque de la app.

2.  **Contexto de Cuidado (Care Context)**
    *   **Responsabilidad**: Gestionar el día a día del cuidado: registro de eventos, visualización de historial, gestión de cuidadores, ajustes y exportación de datos.
    *   **Actores**: Cuidador Principal, Cuidador Secundario.
    *   **Disparadores**: Acceso a la zona privada tras la configuración inicial.

Esta separación ayuda a organizar la lógica de los casos de uso y la interfaz de usuario.

## 3. Entidades y Agregados (Entities & Aggregates)

A continuación se describen las entidades principales del dominio.

### Agregado: `Paciente`

- **Raíz del Agregado**: `Paciente`
- **Descripción**: Representa al niño/paciente. Es la entidad central que aglutina toda la información.
- **Propiedades**:
  - `id`: Identificador único.
  - `name`: Nombre del niño.
  - `birthDate`: Fecha de nacimiento.
  - `sexo` (opcional).
  - `nivelAutonomia` (opcional).

### Agregado: `Cuidador`

- **Raíz del Agregado**: `Cuidador`
- **Descripción**: Representa a un usuario de la app.
- **Propiedades**:
  - `id`: Identificador único.
  - `name`: Nombre del cuidador.
  - `tipo`: Rol (`ADMIN`, `SECUNDARIO`, `SANITARIO`).
  - `esPrincipal`: Booleano.

### Agregado: `Modulo`

- **Raíz del Agregado**: `Modulo`
- **Descripción**: Define una categoría de cuidado y los campos que la componen.
- **Propiedades**:
  - `id`: Identificador único.
  - `nombre`: Nombre del módulo.
  - `activo`: Booleano.
  - `campos`: Lista de entidades `ModuloCampo`.
- **Entidad Hija**: `ModuloCampo`
  - `id`: Identificador único.
  - `titulo`: Etiqueta del campo.
  - `tipo`: `TEXT`, `SELECT`, etc.
  - `obligatorio`: Booleano.

### Agregado: `Rutina`

- **Raíz del Agregado**: `Rutina`
- **Descripción**: Un evento de cuidado registrado. Pertenece a un `Paciente` y está asociado a un `Modulo`.
- **Propiedades**:
  - `id`: Identificador único.
  - `pacienteId`: ID del paciente.
  - `cuidadorId`: ID del cuidador.
  - `moduloId`: ID del módulo.
  - `fechaHora`: Fecha y hora del evento.
  - `notaRapida` (opcional): Anotaciones generales.
  - `campos`: Lista de entidades `RutinaCampo`.
- **Entidad Hija**: `RutinaCampo`
  - `id`: Identificador único.
  - `moduloCampoId`: ID del campo que se está registrando.
  - `valor`: El valor introducido por el usuario.

---

Esta estructura de dominio servirá como base para crear las `Entities`, `Enums`, `Mappers` y `Use-cases` descritos en el `README.md`.
