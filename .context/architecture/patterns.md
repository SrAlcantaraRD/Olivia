# Architecture patterns & conventions

## Ports & adapters

Ports define contracts for external capabilities, keeping domain logic testable and swappable.

- **Port location**: `src/domain/**/port/*.port.ts`
- **Adapter location**:
  - `src/database/adapter/*` (SQLite/Drizzle implementations)
  - `src/adapter/*` (platform/UI services: navigation, secure store, QR, notify)
- **Wiring**: Adapters are composed centrally via `useAdapters()` in [src/adapter/index.ts](../../src/adapter/index.ts).

Example port interface:

```typescript
// src/domain/core/port/cache.port.ts
export interface ICachePort {
  delete(key: TCacheKey): Promise<void>;
  get<T>(key: TCacheKey): Promise<T | null>;
  set<T>(key: TCacheKey, value: T): Promise<void>;
  clearAll(): Promise<void>;
}
```

Example adapter implementation:

```typescript
// src/adapter/expo-secure-store.cache-port.adapter.ts
export class SecureStoreCacheAdapter implements ICachePort {
  public async set<T>(key: string, value: T): Promise<void> {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  }

  public async get<T>(key: string): Promise<T | null> {
    const value = await SecureStore.getItemAsync(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch (_e) {
      return null;
    }
  }
  // ... delete, clearAll
}
```

## Use-cases

Use-cases orchestrate business logic and are the primary domain entry points.

- **Structure**: Validate input → Call ports → Return typed response
- **Validation**: Use Zod request schemas
- **Response**: Typed `IBaseResponse<T>` or domain errors

Example use-case:

```typescript
// src/domain/carer/use-case/create-carer.use-case.ts
export class CreateCarerUseCase {
  constructor(
    private readonly carerPort: ICarerPort,
    private readonly notifyPort: INotifyPort
  ) {}

  async execute(request: TCreateCarerRequest): Promise<TCreateCarerResponse> {
    const parsed = TCreateCarerRequest.safeParse(request);
    if (!parsed.success) {
      throw new ErrorCannotParseSchema(parsed.error);
    }

    const carer = await this.carerPort.create(parsed.data);
    await this.notifyPort.success('Carer created successfully');

    return { success: true, carer };
  }
}
```

Current state: Some use-cases still duplicate `safeParse` logic (tracked in [debt.md](../debt.md)).

## Domain hooks

Domain hooks wrap use-cases and provide React-friendly interfaces.

- **Pattern**: `{ execute, isExecuting, error, data }`
- **Injection**: Adapters resolved via `useAdapters()`

Example domain hook:

```typescript
// src/domain/carer/hook/use-create-carer.hook.ts
export const useCreateCarer = () => {
  const { carerAdapter, notifyAdapter } = useAdapters();

  const execute = useCallback(async (request: TCreateCarerRequest) => {
    const useCase = new CreateCarerUseCase(carerAdapter, notifyAdapter);
    return useCase.execute(request);
  }, [carerAdapter, notifyAdapter]);

  return { execute };
};
```

Refactoring plan: Reduce duplication via a generic hook wrapper (see [docs/features/hooks-refactor-plan.md](../../docs/features/hooks-refactor-plan.md)).

## Cache vs Secure store

Both implement `ICachePort` but serve different purposes.

- **SecureStore**: Sensitive data (PIN hashes, auth tokens)
- **MMKV**: Fast access for non-sensitive cache (user preferences)

Current wiring uses SecureStore as default for safety.

```typescript
// src/adapter/index.ts
const secureStoreAdapter = new SecureStoreCacheAdapter();
// const cacheAdapter = new MMKVCacheAdapter(); // Alternative

return {
  cacheAdapter: secureStoreAdapter, // Currently SecureStore
  // ...
};
```

## Date/time strategy

Consistent handling across domain and infrastructure.

- **Domain**: Native JS `Date` objects
- **SQLite**: Unix seconds via `unixepoch()` (`created_at` INTEGER)
- **Conversion**: `date-fns` helpers in adapters

```typescript
// Conversion helpers (in adapters)
import { fromUnixTime, getUnixTime } from 'date-fns';

// From DB to domain
const date = fromUnixTime(record.created_at);

// From domain to DB
const unixSeconds = getUnixTime(date);
```

See [README.md](../../README.md) for detailed date handling notes.

## Routing conventions

Expo Router with grouped layouts for different app states.

- **Main UI**: `src/app/(tabs)/*` — tab-based navigation
- **Onboarding**: `src/app/(onboarding)/*` — setup flows
- **Guards**: Splash screen checks session state

```typescript
// src/app/index.tsx - Splash guard
export default function Index() {
  const { isLoading, hasSession } = useSplashCarerValidation();

  if (isLoading) return <SplashScreen />;
  if (hasSession) return <Redirect href="/(tabs)/home" />;
  return <Redirect href="/(onboarding)/welcome" />;
}
```

## UI conventions

Atomic Design with HeroUI Native wrappers.

- **Do not use HeroUI directly in screens**: screens import local atoms/molecules/organisms from `src/ui/**`.
- **No domain logic in UI**: UI calls domain hooks; hooks instantiate use-cases with adapters.
- **No hardcoded strings**: UI text comes from typed i18n keys.

## Decision history & trade-offs

### Why domain hooks instead of direct use-case calls in UI?

- **React integration**: Hooks provide loading states, error handling, and re-rendering.
- **Consistency**: Standardized interface across all domain operations.

Trade-off: Extra layer of indirection, but improves UI code quality.

### Why SecureStore as default cache?

- **Security-first**: Prevents accidental exposure of sensitive data.
- **Simplicity**: Single adapter implementation.

Trade-off: Performance hit for non-sensitive data; consider MMKV for hot paths.

### Why typed i18n keys?

- **Compile-time safety**: Catch missing translations at build time.
- **Refactoring safety**: IDE support for key renames.

Trade-off: More setup work, but prevents runtime i18n errors.
