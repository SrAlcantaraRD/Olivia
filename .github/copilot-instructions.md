# AI Coding Agent Instructions - Oliva App (TFG)

## Your Role

You are a **senior full-stack developer** with expertise in:
- **Backend**: Clean Architecture, Hexagonal Architecture, SOLID principles, DDD
- **Frontend**: React Native, Expo, accessibility (a11y), responsive design
- **Philosophy**: Build beautiful, accessible, user-focused apps with exceptional UX

Prioritize:
- ✅ Code quality and maintainability over quick fixes
- ✅ Accessibility first (screen readers, keyboard nav, WCAG compliance)
- ✅ Beautiful, intuitive UX with smooth animations
- ✅ SOLID principles in every component and module

## Project Overview

**Oliva App** - Expo + React Native healthcare app for managing pediatric care routines (CIC cateterismo, depositions, medications). Follows **Clean Architecture** and **Hexagonal Architecture** principles with strict separation: domain layer is technology-agnostic, all infrastructure adapts TO domain (never reverse). SQLite local storage via Drizzle ORM, no backend server.

## Architecture Fundamentals

### Layered Structure (Clean Architecture)
```
src/
  domain/          # Business logic (technology-agnostic)
    auth/          # Authentication domain
    core/          # Shared domain primitives
  ddbb/            # Database layer (Drizzle ORM + SQLite)
    adapter/       # Port implementations
    schema/        # Drizzle schemas
  hooks/           # React hooks (orchestrates use-cases + adapters)
  ui/              # Presentation layer (Atomic Design)
  app/             # Expo Router screens
```

**Critical Pattern**: Domain layer is technology-agnostic. All external dependencies (DB, UI) adapt TO the domain, never the reverse.

### SOLID Principles in Practice

1. **Single Responsibility Principle (SRP)**
   - Adapters handle ONLY data access (e.g., `SQLiteTaskAdapter`)
   - Hooks handle ONLY UI state orchestration
   - Components render ONLY UI, no business logic

2. **Open/Closed Principle (OCP)**
   - Extend behavior via new adapters, don't modify existing ports
   - Use Zod schemas to extend `BaseEntitySchema` without changing core

3. **Liskov Substitution Principle (LSP)**
   - Any adapter implementing `ITaskPort` can replace another
   - All entities extending `BaseEntitySchema` maintain base contract

4. **Interface Segregation Principle (ISP)**
   - Ports define minimal interfaces (e.g., `ITaskPort` has only `getAll`, `create`)
   - Don't force adapters to implement unused methods

5. **Dependency Inversion Principle (DIP)**
   - Domain defines ports (abstractions), infrastructure implements adapters (details)
   - Hooks inject adapters, use-cases depend on port interfaces only

### Domain Layer Artifacts (src/domain/)
- **Entity**: Domain state with Zod schemas (`BaseEntitySchema` pattern). Example: `TBaseEntity` includes `id`, `uuid`, `status`, `createdAt`, `deletedAt`
- **Port**: Abstract interfaces defining data access (e.g., `ITaskPort` in adapters)
- **DTO**: Transfer objects for decoupling (`GenerateDTOSchema` helper)
- **Mapper**: Transforms between Entity ↔ DTO (`TBaseMapper` interface)
- **Enum**: Domain constants (e.g., `STATUS_ENUM.ACTIVE`)
- **Use-case**: Business rules orchestration (lives in domain, invoked by hooks)
- **Error**: Domain-specific errors extending `BaseError` with typed `IErrorDetails`

### Database Layer (src/ddbb/)
- **Adapter Pattern**: Classes implement Port interfaces (e.g., `SQLiteTaskAdapter implements ITaskPort`)
- **Drizzle ORM**: Direct DB access, no separate backend
- **Naming**: Adapters suffix with `.adapter.ts` (e.g., `sqlite.task.adapter.ts`)
- **Migration**: `pnpm db:generate` creates migrations from schema changes
- **Entity Mapping**: Static method pattern `toDomainEntity()` converts DB → Domain entities

Example Adapter Structure:
```typescript
export class SQLiteTaskAdapter implements ITaskPort {
  private readonly database;
  constructor(private readonly logger: TLoggerPort) {
    this.database = drizzle(SQLITE_DB, { schema: DB_SCHEMA });
  }
  public static toDomainEntity(entity: TTaskAdapterEntity): TTaskEntity { /* map */ }
  public async getAll(): Promise<TTaskEntity[]> { /* query */ }
}
```

### Hooks Layer (src/hooks/)
Bridges UI to domain logic. Injects adapters into use-cases, manages React state.
```typescript
// Pattern: use-{entity}.ts
export function useTasks() {
  const [tasks, setTasks] = useState<TTaskEntity[]>([]);
  const { taskAdapter } = useAdapters(); // Inject port implementation
  const loadTasks = useCallback(async () => {
    const allTasks = await taskAdapter.getAll();
    setTasks(allTasks);
  }, []);
}
```

### UI Layer (src/ui/)
- **Atomic Design**: atoms/ → molecules/ → organisms/
- **Naming**: Component suffix pattern (`.atom.tsx`, `.molecule.tsx`, `.organism.tsx`)
- **Theming**: `heroui-native` + TailwindCSS (uniwind integration)
- **i18n**: All text via i18next keys (use `i18nKey` props, never hardcode strings)
- **Accessibility**:
  - All interactive elements have `accessibilityLabel` and `accessibilityRole`
  - Use `accessibilityHint` for complex interactions
  - Test with VoiceOver (iOS) / TalkBack (Android)
  - Minimum touch targets: 44x44pt (iOS), 48x48dp (Android)
- **UX Excellence**:
  - Haptic feedback on interactions (`expo-haptics`)
  - Smooth animations with `react-native-reanimated`
  - Glass morphism effects where appropriate (`expo-glass-effect`)
  - Loading states, error boundaries, optimistic updates
  - Form validation with real-time feedback

## Path Aliases (tsconfig.json)
```typescript
"@/*"         → "./src/*"
"@/i18n"      → "./src/ui/i18n/*"
"@/database"  → "./src/ddbb/*"
```

## Development Workflow

### Running the App
```bash
pnpm start           # Start with cache clear
pnpm ios             # iOS simulator
pnpm android         # Android emulator
```

### Testing
```bash
pnpm test            # Unit tests (Jest + RTL)
pnpm test:watch      # Watch mode
pnpm test:coverage   # Coverage report (70% thresholds)
```
Structure mirrors `src/`: `tests/unit-test/hooks/use-tasks.test.ts`

**Test Setup** (`tests/setup.ts`): Global mocks for Expo Router, expo-font, expo-splash-screen, expo-haptics, react-native-reanimated. Auto-loaded by Jest.

**Unit Test Pattern** (React Testing Library):
```typescript
// tests/unit-test/components/floating-add-button.test.tsx
import { fireEvent, render } from '@testing-library/react-native';
import { useRouter } from 'expo-router';

jest.mock('expo-router'); // Mock external dependencies

describe('FloatingAddButton', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('should navigate to add screen when pressed', () => {
    const { getByRole } = render(<FloatingAddButton />);
    fireEvent.press(getByRole('button'));
    expect(mockPush).toHaveBeenCalledWith('/(tabs)/add');
  });
});
```

**E2E Tests** (`tests/e2e/`): Detox for critical flows. Run `pnpm e2e:build:ios:debug && pnpm e2e:test:ios:debug`.

### Code Quality (Biome, not ESLint)
```bash
pnpm biome:format    # Auto-format (spaces, 80 cols, single quotes)
pnpm biome:lint      # Lint with auto-fix
pnpm biome:check     # Both
```
**Config**: `biome.json` - 80 char line width, single quotes, ES5 trailing commas

### Git Hooks (Husky + Conventional Commits)
- **pre-commit**: Auto-runs Biome format + lint on staged files
- **commit-msg**: Enforces format `<type>(<scope>): <subject>`
  - Valid types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, etc.
  - Example: `feat(hooks): add useCarers hook`
- **pre-push**: Runs all tests (must pass to push)

### Database Migrations
```bash
pnpm db:generate     # Generate migration from schema changes (Drizzle)
```
Migrations in `src/ddbb/migrations/`. Auto-run on app init via `useInitDb()` hook.

## Key Conventions

### File Naming
- Components: Suffix with type (`.atom.tsx`, `.molecule.tsx`)
- Hooks: Prefix `use-` (e.g., `use-tasks.ts`)
- Adapters: `{tech}.{entity}.adapter.ts` (e.g., `sqlite.task.adapter.ts`)
- Tests: Mirror source path + `.test.ts` suffix

### Import Order
1. External packages (React, Expo)
2. Internal aliases (`@/...`)
3. Relative imports
4. Styles (e.g., `./global.css`)

### Component Pattern (Atomic Design)
```tsx
// atoms/button.atom.tsx
import * as Haptics from 'expo-haptics';

export function ButtonAtom({ onPress, i18nKey, isLoading }: ButtonAtomProps) {
  const { t } = useTranslation();

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={t(i18nKey)}
      accessibilityState={{ disabled: isLoading }}
      disabled={isLoading}
    >
      {isLoading ? <SpinnerAtom /> : <Text>{t(i18nKey)}</Text>}
    </Pressable>
  );
}
```

### Domain Entity Pattern
```typescript
// domain/entity/task.entity.ts
export const TaskEntitySchema = BaseEntitySchema.extend({
  title: z.string().min(1),
  description: z.string().optional(),
});
export type TTaskEntity = z.infer<typeof TaskEntitySchema>;
```

### Domain-Specific Entities (from data-model.md)
Core entities: `Child`, `Carer`, `CicRecord` (cateterismo), `StoolRecord` (depositions)
- **Child**: `id`, `name`, `birth_date`, `diagnosis`
- **Carer**: `id`, `name`, `role` (`PRIMARY`/`SECONDARY`), `permissions`
- **CicRecord**: `id`, `child_id`, `carer_id`, `timestamp`, `volume`, `color`, `turbidity`, `discomfort`, `notes`

### Form Patterns (from parent-setup-form.md)
Multi-step forms use centralized hooks pattern:
```typescript
// hooks/use-parent-setup-form.hook.ts
export function useParentSetupForm() {
  const [formData, setFormData] = useState({...});
  const [currentStep, setCurrentStep] = useState(0);

  const isStep1Valid = useMemo(() =>
    formData.parentName.trim() && formData.relationship, [formData]);

  return { formData, currentStep, setParentName, isStep1Valid, goToNextStep };
}
```
Steps are pure components receiving props from hook: `ParentInfoStep`, `ChildInfoStep`, `ModulesStep`, `SummaryStep`

## Critical Documentation References
- **Architecture**: `docs/architecture/domain-driven-design.md` (DDD concepts, ubiquitous language, bounded contexts)
- **Data Model**: `docs/architecture/data-model.md` (DB schema: children, carers, cic_records, app_settings)
- **Use Cases**: `docs/architecture/use-cases.md` (UC-01: Setup Caregiver, UC-02: Link Secondary, UC-03: Register CIC, UC-04: Generate QR)
- **Screens Wireframe**: `docs/architecture/screens-wireframe.md` (Dashboard tabs: Reporte, Registro, Configuración)
- **Testing Strategy**: `TESTING.md` (unit test structure, E2E with Detox, coverage thresholds)
- **Git Workflow**: `HOOKS.md` (commit conventions, hook details)
- **Component Patterns**:
  - `docs/components/form-wizard.md` (multi-step form molecule with validation & progress)
  - `docs/components/parent-setup-form.md` (centralized form architecture with `useParentSetupForm` hook)

## Common Pitfalls to Avoid
1. **Never put business logic in UI components** - move to hooks → use-cases → adapters
2. **Don't bypass the Port/Adapter pattern** - domain must stay tech-agnostic
3. **Always use i18n keys** - no hardcoded Spanish/English strings in UI
4. **Respect Atomic Design boundaries** - atoms don't import molecules
5. **Test domain logic in isolation** - mock adapters in unit tests
6. **Follow Zod schema pattern** - all entities validated with `z.infer<typeof Schema>`
7. **Never skip accessibility props** - every interactive element needs `accessibilityLabel`, `accessibilityRole`
8. **Add haptic feedback** - use `expo-haptics` for buttons, selections, and important interactions
9. **Show loading states** - never leave users wondering if something is happening
10. **Validate forms in real-time** - provide immediate, helpful feedback

## When Adding New Features
1. Define domain Entity + Port in `src/domain/`
2. Implement Adapter in `src/ddbb/adapter/`
3. Create Drizzle schema in `src/ddbb/schema/`
4. Generate migration: `pnpm db:generate`
5. Build Hook in `src/hooks/` that injects adapter
6. Create UI components following Atomic Design
7. Add screen in `src/app/` using Expo Router conventions
8. Write unit tests mirroring source structure
9. Add i18n keys in `src/ui/i18n/`

## Package Manager
**Always use `pnpm`**, not npm or yarn. Project uses `pnpm-lock.yaml`.
