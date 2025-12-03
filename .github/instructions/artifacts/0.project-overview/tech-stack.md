# Stack Tecnológico - Oliva App

## 📋 Información General

**Proyecto:** Oliva - Aplicación de gestión de cuidados pediátricos
**Plataforma:** Mobile (iOS + Android)
**Framework Principal:** React Native + Expo
**Arquitectura:** Clean Architecture + Hexagonal Architecture
**Última actualización:** Diciembre 2025

---

## 🎯 Stack Principal

### Frontend Framework
# Archived — consolidated

This artifact has been consolidated into `docs/architecture/condensed-copilot-guide.md`.

Original content archived at `.github/artifacts/archive/0.project-overview__tech-stack.md`.

If you need the full original, open `.github/artifacts/archive/0.project-overview__tech-stack.md` or retrieve from Git history.
p-4  → 16px
p-6  → 24px
p-8  → 32px
```

---

## 🚀 Scripts Disponibles

### Development
```bash
pnpm start              # Start dev server (con clear cache)
pnpm ios                # iOS simulator
pnpm android            # Android emulator
pnpm web                # Web browser
```

### Testing
```bash
pnpm test               # Run unit tests
pnpm test:watch         # Watch mode
pnpm test:coverage      # Coverage report
pnpm test:ci            # CI mode
```

### E2E Testing
```bash
# iOS
pnpm e2e:build:ios:debug
pnpm e2e:test:ios:debug
pnpm e2e:build:ios
pnpm e2e:test:ios

# Android
pnpm e2e:build:android:debug
pnpm e2e:test:android:debug
pnpm e2e:build:android
pnpm e2e:test:android
```

### Code Quality
```bash
pnpm biome:format       # Auto-format
pnpm biome:lint         # Lint with auto-fix
pnpm biome:check        # Format + Lint
```

### Database
```bash
pnpm db:generate        # Generate migrations
```

---

## 🔐 Environment Configuration

### Expo Config (`app.json`)
- Scheme: `com.oliva.app`
- Bundle ID: iOS/Android specific
- Permissions: Camera, Storage, Notifications
- Splash screen & Icon

### TypeScript Config (`tsconfig.json`)
- Path aliases:
  - `@/*` → `./src/*`
  - `@/i18n` → `./src/ui/i18n/*`
  - `@/database` → `./src/ddbb/*`

---

## 📚 Documentación Adicional

- **Atomic Design:** `.github/artifacts/5.ui-components/1.atomic-design.instructions.md`
- **Toast System:** `.github/artifacts/5.ui-components/0.toast-system.instructions.md`
- **Domain Layer:** `.github/artifacts/1.domain/`
- **Database Layer:** `.github/artifacts/2.database/`
- **Testing:** `.github/artifacts/4.testing/`
- **Git Workflow:** `HOOKS.md`
- **Testing Strategy:** `TESTING.md`

---

## 🆕 Versiones Clave (Diciembre 2025)

| Paquete                      | Versión        | Notas                              |
|------------------------------|----------------|------------------------------------|
| React                        | 19.1.0         | Última versión estable             |
| React Native                 | 0.81.5         | Compatible con Expo 54             |
| Expo SDK                     | 54.0.20        | Último release LTS                 |
| heroui-native                | 1.0.0-beta.3   | Beta, API estable                  |
| Drizzle ORM                  | 0.44.7         | Última versión con SQLite support  |
| i18next                      | 25.6.3         | Última major version               |
| Zod                          | 4.1.13         | Validation library                 |
| react-native-reanimated      | 4.1.5          | Última versión estable             |
| react-native-svg             | 15.12.1        | Para gradientes radiales           |
| react-native-toast-message   | 2.3.3          | Sistema de notificaciones          |

---

## ⚠️ Notas Importantes

1. **No usar ESLint/Prettier:** El proyecto usa Biome exclusivamente
2. **Siempre usar pnpm:** No npm ni yarn
3. **Pre-commit hooks activos:** Formato y lint automáticos
4. **Conventional commits obligatorios:** `feat:`, `fix:`, `docs:`, etc.
5. **Tests obligatorios antes de push:** Pre-push hook ejecuta tests
6. **Path aliases configurados:** Usar `@/` para imports
7. **i18n obligatorio:** No hardcodear strings en UI
8. **Atomic Design estricto:** No importar heroui-native en screens
9. **Clean Architecture:** Domain layer technology-agnostic
10. **Database:** Camel case en código, snake_case en SQL

---

## 🔄 Flujo de Actualización

Para mantener este documento actualizado:

1. Revisar `package.json` tras instalar/actualizar paquetes
2. Documentar nuevas librerías con versión y propósito
3. Actualizar patrones de arquitectura si cambian
4. Mantener scripts sincronizados con `package.json`
5. Documentar breaking changes de dependencias

---

**Última revisión:** Diciembre 2025
**Mantenedor:** Equipo de desarrollo Oliva
