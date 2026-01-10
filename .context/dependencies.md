# Dependencies (approved / core)

This file lists the libraries that define core architecture patterns.

## Runtime

- Expo Router (`expo-router`) — file-based routing
- Drizzle ORM (`drizzle-orm`) + Expo SQLite (`expo-sqlite`) — local persistence
- Zod (`zod`) — validation + typing
- i18next (`i18next`, `react-i18next`) — internationalization
- HeroUI Native (`heroui-native`) — UI primitives (wrapped by local atoms)
- Zustand (`zustand`) — state stores
- Expo Secure Store (`expo-secure-store`) — sensitive storage

## Dev tooling

- Biome (`@biomejs/biome`) — formatting + lint
- Jest (`jest`, `jest-expo`, `@testing-library/react-native`) — testing

See also:

- Scripts and versions in [package.json](../package.json)
