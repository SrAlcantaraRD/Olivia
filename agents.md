# Agent Guidelines for TFG Repository

## Build Commands

### Development
```bash
pnpm start              # Start Expo development server
pnpm ios               # iOS simulator
pnpm android           # Android emulator
pnpm web               # Web browser
```

### Code Quality
```bash
pnpm biome:check       # Format and lint (run before commits)
pnpm biome:format      # Format only
pnpm biome:lint        # Lint only
pnpm typecheck         # TypeScript strict checking (src + tests)
pnpm typecheck:src     # Check source files only
pnpm typecheck:tests   # Check test files only
```

### Testing
```bash
pnpm test              # Run all unit tests
pnpm test:watch        # Run tests in watch mode
pnpm test:coverage     # Run with coverage report
pnpm test:ci           # CI mode (maxWorkers=2)
```

### Single Test
```bash
# Run specific test file
pnpm test path/to/test.spec.ts

# Run tests matching pattern
pnpm test --testNamePattern="use case name"
```

### E2E Testing
```bash
pnpm e2e:build:ios:debug     # Build iOS debug
pnpm e2e:test:ios:debug      # Test iOS debug
pnpm e2e:build:android:debug # Build Android debug
pnpm e2e:test:android:debug  # Test Android debug
```

### Database
```bash
pnpm db:generate       # Generate Drizzle migrations
```

## Code Style Guidelines

### Architecture Flow
**Strict layer separation required:**
```
UI (app/ui) → Hooks (domain/*/hook) → Use Cases (domain/*/use-case) → Ports (domain/*/port) ← Adapters (database/adapter, adapter)
```

- **Domain is pure**: No Expo/React Native imports in `src/domain/**` (except hooks)
- **No DB calls in UI**: Database access only in `src/database/adapter/**`
- **No storage calls in UI**: Use ports (`ICachePort`) injected via adapters

### TypeScript Rules
- **Strict mode enabled**: No `any` or unsafe `as` casts
- **Zod validation**: Input schemas in `*.use-case-schema.ts` using `safeParse`
- **Prefer inferred types**: `z.infer<typeof Schema>` over hand-written types
- **Use `satisfies`**: In tests/mocks for type safety without casts

### Import Organization
```typescript
// 1. External libraries (React, Expo, etc.)
import { Button } from 'heroui-native';
import type React from 'react';

// 2. Internal aliases (@/*)
import { TypographyParagraph } from '@/ui/components/atoms/typography.atom';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

// 3. Relative imports (rare, prefer aliases)
```

### Naming Conventions
- **Files**: kebab-case with atomic design suffix
  - `button.atom.tsx`, `card.molecule.tsx`, `form.organism.tsx`
  - `create-carer.use-case.ts`, `use-create-carer.hook.ts`
- **Components**: PascalCase with descriptive names
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Interfaces**: Prefix `I` (`ICarerPort`)
- **Types**: Prefix `T` (`TCarerCreate`)

### Error Handling
```typescript
// Use-cases must return IBaseResponse<T>
return {
  success: false,
  message: 'error.validation.failed', // i18n key
  details: parsed.error.errors
};

// Never throw raw Error from use-cases
// Use domain error classes instead
```

### UI Component Rules
- **No HeroUI directly in screens**: Wrap in atoms/molecules/organisms
- **No hardcoded strings**: Use typed i18n keys (`Ti18nKeys`)
- **Accessibility required**: Always include `testID` props
- **Atomic design**: Respect atom → molecule → organism hierarchy

### Use Case Pattern
```typescript
export class CreateCarerUseCase extends BaseUseCase<TRequest, TResponse> {
  constructor(private readonly adapters: { loggerAdapter: TLoggerPort; carerAdapter: ICarerPort }) {
    super('create-carer', adapters.loggerAdapter);
  }

  async execute(request: TRequest): Promise<IBaseResponse<TResponse>> {
    const parse = this.parseRequest(RequestCreateCarerSchema, request);
    // Business logic here
    return { success: true, message: 'common.success', details: result };
  }
}
```

### Hook Pattern
```typescript
export const useCreateCarer = () => {
  const { carerAdapter, notifyAdapter } = useAdapters();

  const execute = useCallback(async (request: TRequest) => {
    const useCase = new CreateCarerUseCase({ loggerAdapter, carerAdapter });
    return useCase.execute(request);
  }, [carerAdapter]);

  return { execute };
};
```

### Testing
- **Unit tests**: Mirror domain structure in `tests/unit/domain/**`
- **Use `satisfies`**: For mock type safety
- **Arrange-Act-Assert**: Clear test structure
- **Use mocks**: For entity, dto, ports in `tests/mocks/**`
- **Test happy path + errors**: Cover validation failures
- **No Expo imports in domain tests**: Mock adapters

### Git Workflow
- **Branch naming**: `feature/description`, `fix/issue`, `hotfix/critical`
- **Commits**: Conventional commits with `commitlint`
- **Quality gates**: Run `pnpm biome:check` and `pnpm test` before push

### I18n
- **No hardcoded strings**: All UI text via i18n keys
- **Typed keys**: Use `Ti18nKeys` for compile-time safety
- **Existing namespaces**: Don't invent new namespaces without reason

### Security & Privacy
- **Local-only design**: "Sin nube. Sin cuentas"
- **SecureStore for sensitive data**: PIN hashes, auth tokens
- **MMKV for cache**: Non-sensitive user preferences

## Tooling
- **Package manager**: `pnpm` (required)
- **Formatting**: Biome (not Prettier)
- **Linting**: Biome + ESLint Expo config
- **Testing**: Jest with React Native Testing Library
- **Database**: Drizzle ORM with SQLite

## Before Committing
1. `pnpm biome:check` - Format and lint
2. `pnpm test` - Run unit tests
3. `pnpm typecheck` - TypeScript strict mode
4. Verify architecture flow is respected
5. Check for hardcoded strings
6. Ensure accessibility testIDs are present

## Context Files (Read These First)
- `.context/ai-rules.md` - Hard constraints and non-negotiable standards
- `.context/architecture/patterns.md` - Code organization and patterns
- `.context/guidelines.md` - Git workflow and testing
- `.context/testing.md` - Testing strategy and standards

## Domain-Specific Context
**Authentication work:** `.context/auth/overview.md`, `.context/auth/security.md`
**Database work:** `.context/database/schema.md`, `.context/database/models.md`
**UI work:** `.context/ui/overview.md`, `.context/ui/patterns.md`
