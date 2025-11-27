# Modelo de Datos - Base de Datos Local

Este documento describe el esquema de la base de datos local de la aplicación Oliva, basado en un modelo dinámico de módulos y rutinas. La persistencia se gestionará a través de un ORM (DrizzleORM sobre SQLite).

## Diagrama de Entidad-Relación (Conceptual)

```
+-----------+       +------------------+       +-----------------+
|  Carer    |-------|   Child_Carer    |-------|      Child      |
| (Cuidador)|       |   (Relación)     |       |      (Niño)     |
+-----------+       +------------------+       +-----------------+
    |                                                  |
    |                                                  |
    +-----------------+--------------------------------+
                      |
                      |
               +------v------+
               | CareEvent   |
               | (Evento)    |
               +-------------+
                      ^
                      | (herencia)
            +---------+---------+
            |                   |
    +-----------+       +-------------+
    | CicRecord |       | StoolRecord |
    +-----------+       +-------------+

```

## Definición de Tablas

### `children`

Almacena el perfil de cada niño. En la primera versión, solo habrá un niño por dispositivo, gestionado por el cuidador principal.

| Columna | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | TEXT | PRIMARY KEY | Identificador único (UUID). |
| `name` | TEXT | NOT NULL | Nombre del niño. |
| `birth_date` | TEXT | NOT NULL | Fecha de nacimiento (formato ISO 8601). |
| `diagnosis` | TEXT | | Diagnóstico clínico (opcional). |

### `carers`

Almacena los perfiles de los cuidadores (tanto principal como secundarios).

| Columna | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | TEXT | PRIMARY KEY | Identificador único (UUID). |
| `name` | TEXT | NOT NULL | Nombre del cuidador. |
| `role` | TEXT | NOT NULL | Rol: `PRIMARY` o `SECONDARY`. |
| `permissions` | TEXT | | Permisos para secundarios: `READ_ONLY`, `READ_WRITE`, `ADMIN`. |

### `cic_records`

Almacena cada uno de los registros de cateterismo (CIC).

| Columna | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | TEXT | PRIMARY KEY | Identificador único (UUID). |
| `child_id` | TEXT | NOT NULL, FOREIGN KEY (`children.id`) | Niño al que pertenece el registro. |
| `carer_id` | TEXT | NOT NULL, FOREIGN KEY (`carers.id`) | Cuidador que realizó el registro. |
| `timestamp` | TEXT | NOT NULL | Fecha y hora del evento (ISO 8601). |
| `volume` | TEXT | NOT NULL | `LOW`, `NORMAL`, `HIGH`. |
| `color` | TEXT | NOT NULL | `TRANSPARENT`, `LIGHT_YELLOW`, `DARK_YELLOW`, `ANOMALOUS`. |
| `turbidity` | TEXT | NOT NULL | `CLEAR`, `SLIGHT`, `HIGH`. |
| `discomfort` | TEXT | NOT NULL | `NONE`, `SLIGHT`, `PAIN`. |
| `notes` | TEXT | | Notas generales (opcional). |
| `discomfort_note` | TEXT | | Nota específica si hubo dolor (opcional). |

### `app_settings`

Tabla clave-valor para guardar ajustes globales de la aplicación.

| Columna | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `key` | TEXT | PRIMARY KEY | Clave del ajuste (ej. `theme`, `pin_enabled`). |
| `value` | TEXT | NOT NULL | Valor del ajuste. |
