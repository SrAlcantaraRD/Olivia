# Dependency injection patterns (Expo + React Native)

## Overview

The Oliva app uses **manual dependency injection** (DI) via adapter composition in React hooks. No external DI library is used—adapters are instantiated in module scope or hook scope and passed to use-cases.

This keeps the codebase simple while enforcing the Ports & Adapters pattern.

## Adapter wiring (composition root)

The central DI happens in `useAdapters()`:

```typescript
// src/adapter/index.ts
export const useAdapters = (): Readonly<IAdapters> => {
  const router = useRouter();
  const navigationAdapter = new ExpoRouterNavigationAdapter(router);

  return Object.freeze({
    loggerAdapter: BASE_LOGGER,
    notifyAdapter,
    carerAdapter,
    patientAdapter,
    moduleAdapter,
    moduleFieldAdapter,
    recordAdapter,
    navigationAdapter,
    recordFieldAdapter,
    cacheAdapter: secureStoreAdapter,
    secureStoreAdapter,
    qrAdapter,
    summaryModuleAdapter,
    summaryModuleFieldAdapter,
  });
};
```

- **Singleton adapters**: DB adapters (SQLiteCarerAdapter, etc.) are created once in module scope.
- **Scoped adapters**: Navigation adapter requires `useRouter()` hook, so it's created per-hook call.
- **Frozen object**: Prevents accidental mutation of the adapter registry.

## Use-case injection

Domain hooks inject adapters into use-cases:

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

- **Constructor injection**: Use-cases receive adapters in their constructor.
- **Hook scope**: Adapters are resolved per-hook, allowing for potential future scoping (e.g., per-user adapters).

## Port interfaces (contracts)

Ports define the contract for adapters:

```typescript
// src/domain/core/port/cache.port.ts
export interface ICachePort {
  delete(key: TCacheKey): Promise<void>;
  get<T>(key: TCacheKey): Promise<T | null>;
  set<T>(key: TCacheKey, value: T): Promise<void>;
  clearAll(): Promise<void>;
}
```

- **Async-first**: All port methods are async, even if the adapter implementation is sync.
- **Generic types**: `<T>` for value types, allowing type-safe storage.
- **Typed keys**: `TCacheKey` enum prevents typos in cache keys.

## Adapter implementations

Adapters implement ports using concrete tech:

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

- **Error handling**: JSON parse errors return `null` (graceful degradation).
- **Async wrapper**: SecureStore is async, so adapter methods are naturally async.

## Testing with DI

Unit tests mock ports, not adapters:

```typescript
// tests/unit-test/domain/carer/create-carer.use-case.spec.ts
describe('CreateCarerUseCase', () => {
  it('should create carer and notify', async () => {
    const mockCarerPort = {
      create: vi.fn().mockResolvedValue({ id: 1 }),
    };
    const mockNotifyPort = {
      success: vi.fn(),
    };

    const useCase = new CreateCarerUseCase(mockCarerPort, mockNotifyPort);
    await useCase.execute({ name: 'Test Carer' });

    expect(mockCarerPort.create).toHaveBeenCalledWith({ name: 'Test Carer' });
    expect(mockNotifyPort.success).toHaveBeenCalled();
  });
});
```

- **Port mocks**: Tests use plain objects implementing port interfaces.
- **Isolated**: No real SQLite or SecureStore in unit tests.

## Decision history & trade-offs

### Why manual DI over a library (like tsyringe)?

- **Simplicity**: No extra dependency or runtime overhead.
- **React-native friendly**: Libraries like tsyringe add bundle size and complexity.
- **Hook-based**: DI happens in hooks, which aligns with React's mental model.

Trade-off: More boilerplate for large adapter registries. If the app grows significantly, consider a DI library.

### Why async ports even for sync operations?

- **Future-proofing**: Allows swapping to async implementations (e.g., network-backed cache).
- **Consistency**: All ports follow the same async pattern.

Trade-off: Slight performance overhead for sync operations, but negligible in practice.

### Why frozen adapter object?

- **Immutability**: Prevents accidental adapter replacement during development.
- **Debugging**: Easier to track adapter usage.

Trade-off: Can't dynamically swap adapters at runtime (not needed for this app).</content>
<parameter name="filePath">/Users/gabriel/Documents/personal/UOC/2025_2026_01/TFG/.context/architecture/dependencies.md
