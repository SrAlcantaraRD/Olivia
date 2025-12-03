````markdown
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

... (original README.md archived)

````
