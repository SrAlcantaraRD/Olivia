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
# Architecture & Conventions — Consolidated

This artifact has been consolidated into the canonical architecture guide.

See: `docs/architecture/condensed-copilot-guide.md` — the single source of truth for architecture rules, snippets, and conventions.

Original content archived at: `.github/artifacts/archive/README.md`

If you need the original full text, open the archive file above or check Git history.
    ├── i18n/         # Internacionalización
