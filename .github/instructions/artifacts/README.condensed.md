# Arquitectura y Convenciones de Oliva App (Versión Condensada)

**Última actualización:** Diciembre 2025

Este documento es una guía de alta densidad para desarrolladores. Asume conocimiento experto en React Native, Clean Architecture y TypeScript.

---

## 1. Tech Stack & Versiones

| Categoría | Tecnología | Versión | Notas |
| :--- | :--- | :--- | :--- |
| **Core** | React | `19.1.0` | |
| | React Native | `0.81.5` | |
| | Expo SDK | `~54.0.20` | |
| **Routing** | Expo Router | `~6.0.13` | File-based |
| **UI** | heroui-native | `1.0.0-beta.3` | Librería de componentes base |
| | NativeWind / Uniwind | `^1.0.4` | Tailwind CSS para React Native |
| **Database** | SQLite (via `expo-sqlite`) | `~16.0.9` | |
| | Drizzle ORM / Drizzle Kit | `^0.44.7` | |
| **State** | Zustand | `^5.0.8` | Estado global |
| | React Hooks | N/A | Estado local |
| **i18n** | i18next / react-i18next | `^25.6.3` | |
| **Validation** | Zod | `^4.1.13` | |
| **Tooling** | Biome (Linter/Formatter) | `@biomejs/biome` | Reemplaza ESLint/Prettier |
| | pnpm | `latest` | Gestor de paquetes |
| | Detox | `latest` | E2E Testing |
| | Jest | `latest` | Unit Testing |

---

## 2. Reglas de Oro (Axiomas)

1.  **Clean Architecture Estricta:** La capa de `domain` es agnóstica a la tecnología. **NUNCA** debe importar nada de `adapter`, `database`, `ui` o frameworks (React, Expo).
2.  **Ports & Adapters (Hexagonal):** Toda comunicación con el exterior (DB, UI, APIs) se realiza a través de `ports` (interfaces en `domain`) y `adapters` (implementaciones en `src/adapter`).
3.  **Atomic Design Jerárquico:** La UI se construye en capas: `Atoms` → `Molecules` → `Organisms`. **NUNCA** importar un componente de `heroui-native` directamente en una pantalla; siempre a través de un `Atom` wrapper.
4.  **Type Safety Total:** `any` está prohibido. Todo debe estar tipado, incluyendo las claves de i18n (`Ti18nKeys`).
5.  **Inmutabilidad:** Los `Entities` de dominio y los `props` de componentes son inmutables.
6.  **Soft Deletes por Defecto:** Todas las queries de lectura deben filtrar por `status = ACTIVE` o `status = true`. El borrado es lógico, no físico.
7.  **i18n Obligatorio:** **NUNCA** hardcodear strings visibles al usuario. Usar siempre claves i18n a través del tipo `Ti18nKeys`.
8.  **Biome es la única fuente de verdad:** No usar ESLint/Prettier. La configuración está en `biome.json`.
9.  **Tests son Mandatorios:**
    *   **Unit Tests:** Cubren lógica de `use-cases`, `mappers`, y `adapters` (con mocks).
    - **Integration Tests:** Validan flujos completos con una base de datos real.
10. **Conventional Commits:** Seguir el estándar `feat:`, `fix:`, `refactor:`, etc.

---

## 3. Convenciones de Arquitectura

### Estructura de Directorios (`src/`)

```
/src
├── adapter/          # Adapters (implementaciones de Ports)
├── app/              # Routing y Screens (Expo Router)
├── assets/           # Imágenes y fuentes
├── constants/        # Constantes de la app (ej: tema)
├── database/         # Drizzle: schemas, migraciones
├── domain/           # Lógica de negocio pura (Entities, Ports, Use-Cases)
└── ui/               # Componentes React (Atomic Design)
    ├── components/
    │   ├── atoms/
    │   ├── molecules/
    │   └── organisms/
    ├── i18n/         # Internacionalización
    └── themes/       # Temas (light/dark)
```

### Flujo de Datos (Clean Architecture)

`Screen (UI) -> Hook (UI) -> Adapter (Infra) -> Port (Domain) -> Use Case (Domain) -> Entity (Domain)`

1.  **`app/**/_layout.tsx` (Screen):** Renderiza UI, llama a hooks.
2.  **`domain/**/hook/*.hook.ts` (Hook):** Orquesta la lógica de UI, llama a adapters.
3.  **`adapter/*.adapter.ts` (Adapter):** Implementa un `Port`. Encapsula la tecnología (Drizzle, Toast). Mapea datos de DB/API a `Entity`.
4.  **`domain/**/port/*.port.ts` (Port):** Interface que define el contrato que el `Use Case` necesita.
5.  **`domain/**/use-case/*.use-case.ts` (Use Case):** Contiene la lógica de negocio. Orquesta `Ports` y `Entities`.
6.  **`domain/**/entity/*.entity.ts` (Entity):** Representa el estado del dominio. Es un objeto puro.

### Patrón Canónico: Creación de una Entidad

1.  **Definir `Entity` y `DTO`:**
    *   `patient.entity.ts`: `PatientEntitySchema` (con `id`, `uuid`, `createdAt`, etc.)
    *   `patient.dto.ts`: `PatientDTOSchema` (sin `id`, `createdAt`, etc. para exposición)
2.  **Definir `Port`:**
    *   `patient.port.ts`: `IPatientPort { create(dto: TPatientCreateDTO): Promise<TPatientEntity>; }`
3.  **Implementar `Adapter`:**
    *   `sqlite.patient.adapter.ts`: `SQLitePatientAdapter implements IPatientPort`.
    *   El método `create` usa Drizzle para insertar en la DB.
    *   Contiene un mapper estático `toDomainEntity` para convertir el resultado de la DB a `TPatientEntity`.
4.  **Implementar `Use Case` (si hay lógica de negocio):**
    *   `create-patient.use-case.ts`: Inyecta `IPatientPort`. Valida datos y llama a `patientPort.create()`.
5.  **Implementar `Hook`:**
    *   `use-patient-creation.hook.ts`: Inyecta el `Adapter` y `INotifyPort`. Llama a `patientAdapter.create()`. Maneja el estado de carga y muestra notificaciones (éxito/error).
6.  **Consumir en la `Screen`:**
    *   `parent-setup.tsx`: Llama al hook `useParentSetupForm` y renderiza el estado.

---

## 4. Guía de Estilo (Snippets)

### Componente `Atom` Wrapper

**Regla:** Siempre envolver `heroui-native` en Atoms.

```typescript
# Archived — consolidated

This artifact has been consolidated into `docs/architecture/condensed-copilot-guide.md`.

Original content archived at `.github/artifacts/archive/README.condensed.md`.

Open the archive file or review the Git history to access the original full text.
import { TypographyParagraph } from './typography.atom';
