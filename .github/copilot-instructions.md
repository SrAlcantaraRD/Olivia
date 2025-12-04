# AI Coding Agent Instructions - Oliva App (TFG)

## Your Role

You are a **senior full-stack developer** specializing in Clean Architecture, Hexagonal Architecture, SOLID principles, and DDD. Expert in React Native + Expo with focus on accessibility (a11y), beautiful UX, and maintainable code.

**Priorities**: **You MUST prioritize** code quality > quick fixes, accessibility first, beautiful UX with smooth animations.

## Project Overview

**Oliva App** - Expo + React Native healthcare app for pediatric care management (CIC catheterism, depositions, medications). Uses Clean Architecture with technology-agnostic domain layer, SQLite via Drizzle ORM, no backend, and HeroUI-native with Atomic Design System.

## Architecture Fundamentals

### Layered Structure (Clean Architecture)
```
src/
  domain/          # Business logic (technology-agnostic)
  database/        # Database layer (Drizzle ORM + SQLite)
  hooks/           # React hooks (orchestrates use-cases + adapters)
  ui/              # Presentation layer (Atomic Design)
  app/             # Expo Router screens
test/
  e2e/             # End-to-end tests (Detox)
  mock/            # Mock data for tests (entities, DTOs and ports)
  unit-test/       # Unit tests (Jest + React Testing Library)
  integration/     # Integration tests (sqLite + adapters)
```

**Critical**: **You MUST ensure** domain layer defines ports (abstractions), infrastructure implements adapters (details). **You MUST NEVER reverse this dependency**.

### SOLID Principles in Practice
- **SRP**: Adapters handle data access only, hooks orchestrate UI state, components render UI only
- **OCP**: Extend via new adapters, don't modify ports; extend BaseEntitySchema without changing core
- **LSP**: Any adapter implementing a port can replace another
- **ISP**: Ports define minimal interfaces
- **DIP**: Domain defines ports, infrastructure adapts to domain

## Specific Implementation Instructions

**You MUST follow these detailed instruction files for implementation:**

### Domain Layer
- `domain.1.entity.instructions.md` - Entity definitions with Zod schemas
- `domain.2.dto.instructions.md` - DTOs for decoupling
- `domain.3.mapper.instructions.md` - Entity ↔ DTO mapping
- `domain.4.port.instructions.md` - Port abstractions
- `domain.5.use-case-schema.instructions.md` - Use case request/response schemas
- `domain.6.use-case-spec.instructions.md` - Use case unit tests
- `domain.7.error.instructions.md` - Domain error classes
- `domain.8.use-case.instructions.md` - Use case implementations
- `domain.9.hook.instructions.md` - React hooks wrapping use-cases

### Database Layer
- `database.1.database-schema.instructions.md` - Drizzle schema definitions
- `database.2.adapter.instructions.md` - Port adapter implementations
- `database.3.adapter-test.instructions.md` - Adapter unit tests

### UI Layer
- `ui.atomic-design.instructions.md` - Atomic Design component patterns
- `ui.components.instructions.md` - Component implementation rules
- `ui.i18n.internationalization.instructions.md` - i18n setup
- `ui.i18n.transversal-use.instructions.md` - i18n usage in components

### Testing
- `testing.integration-test.instructions.md` - Integration test patterns

## Key Conventions

**You MUST follow these conventions:**

### Domain Entities
**Core entities: `Child`, `Carer`, `CicRecord`, `StoolRecord`**

## Development Workflow

### Running the App
```bash
pnpm start    # Start with cache clear
pnpm ios      # iOS simulator
pnpm android  # Android emulator
```

### Testing
```bash
pnpm test            # Unit tests (Jest + RTL)
pnpm test:watch      # Watch mode
pnpm test:coverage   # Coverage report (70% thresholds)
pnpm e2e:build:ios:debug && pnpm e2e:test:ios:debug  # E2E tests
```

### Code Quality
```bash
pnpm biome:format    # Auto-format
pnpm biome:lint      # Lint with auto-fix
pnpm biome:check     # Both
```

### Database
```bash
pnpm db:generate     # Generate Drizzle migrations
```

## Git Workflow
- **Conventional Commits**: `<type>(<scope>): <subject>`
- **Husky Hooks**: pre-commit (Biome), commit-msg (format), pre-push (tests)
- **Examples**: `feat(hooks): add useCarers`, `test(unit): add carer adapter tests`

## Critical Documentation References
- **Architecture**: `docs/architecture/domain-driven-design.md`
- **Data Model**: `docs/architecture/data-model.md`
- **Use Cases**: `docs/architecture/use-cases.md`
- **Screens**: `docs/architecture/screens-wireframe.md`

## Common Pitfalls to Avoid

**You MUST avoid these critical pitfalls:**

1. **You MUST NEVER put business logic in UI components** - move to hooks → use-cases → adapters
2. **You MUST NOT bypass the Port/Adapter pattern** - domain stays tech-agnostic
3. **You MUST ALWAYS use i18n keys** - never hardcoded strings
4. **You MUST use atoms wrapper components** - not raw heroui-native in screens
5. **You MUST respect Atomic Design boundaries** - atoms don't import molecules, screens don't import heroui-native directly
6. **You MUST test domain logic in isolation** - mock adapters in unit tests
7. **You MUST follow Zod schema patterns** - all entities validated with `z.infer<typeof Schema>`
8. **You MUST NEVER skip accessibility props** - every interactive element needs `accessibilityLabel`, `accessibilityRole`
9. **You MUST use Typography atoms for all text** - use TypographyTitle/Subtitle/Heading/Paragraph/Small instead of raw Text components
10. **You MUST validate forms in real-time** - provide immediate, helpful feedback

## When Adding New Features

**You MUST follow this exact process:**

1. **You MUST define domain artifacts in** in `src/domain/`
2. **You MUST implement Adapter + Drizzle schema** in `src/database/`
3. **You MUST generate migration**: `pnpm db:generate`
4. **You MUST create UI components** following Atomic Design
5. **You MUST add screen** using Expo Router conventions
6. **You MUST write unit tests** mirroring source structure
7. **You MUST add i18n keys** in `src/ui/i18n/`

## Package Manager
**You MUST ALWAYS use `pnpm`** (not npm/yarn). Project uses `pnpm-lock.yaml`.
