# Auth integration patterns

## Framework integration

The Oliva app integrates "authentication" at the framework level through Expo Router guards and local session management.

## Splash screen guard

The app entry point acts as an authentication guard:

```typescript
// src/app/index.tsx
export default function Index() {
  const { isLoading, hasSession } = useSplashCarerValidation();

  if (isLoading) {
    return <SplashScreen />;
  }

  if (hasSession) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/(onboarding)/welcome" />;
}
```

- **Hook**: `useSplashCarerValidation` checks session existence
- **Session check**: Looks for `carerId` in cache
- **Routing**: Redirects based on auth state

## Session validation hook

Domain hook that orchestrates session checking:

```typescript
// src/domain/carer/hook/use-splash-carer-validation.hook.ts
export const useSplashCarerValidation = () => {
  const { cacheAdapter } = useAdapters();

  const [isLoading, setIsLoading] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const carerId = await cacheAdapter.get<string>(
          CACHE_KEY_ENUM.CARER
        );
        setHasSession(!!carerId);
      } catch (error) {
        console.error('Session check failed:', error);
        setHasSession(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [cacheAdapter]);

  return { isLoading, hasSession };
};
```

- **Cache dependency**: Uses `ICachePort` for session storage
- **Error handling**: Graceful fallback to no session
- **Loading state**: Prevents flash of wrong content

## Onboarding flow integration

Primary carer setup creates the session:

```typescript
// src/domain/carer/use-case/setup-parent.use-case.ts
export class SetupParentUseCase {
  async execute(request: TSetupParentRequest) {
    // Create carer and patient in DB
    const carer = await this.carerPort.create(request.carerData);
    const patient = await this.patientPort.create(request.patientData);

    // Activate modules
    await this.modulePort.activateModules(request.selectedModules);

    // Establish session
    await this.cachePort.set(CACHE_KEY_ENUM.CARER, carer.id);
    await this.cachePort.set(CACHE_KEY_ENUM.CARER_PIN_HASH, request.pinHash);

    return { carer, patient };
  }
}
```

- **Session establishment**: Stores `carerId` and `pinHash`
- **Atomic operation**: All setup steps succeed or fail together

## Secondary carer invitation

QR-based auth for secondary carers:

```typescript
// src/domain/carer/use-case/secondary-carer.consume-invitation-qr.use-case.ts
export class ConsumeSecondaryCarerInvitationQRUseCase {
  async execute(qrData: string) {
    const bundle = await this.qrPort.unpack(qrData);
    const invitation = TSecondaryCarerInvitation.parse(bundle);

    // Validate expiry
    if (Date.now() > invitation.expiresAt) {
      throw new ErrorInvitationExpired();
    }

    // Switch to secondary carer mode
    await this.cachePort.set(CACHE_KEY_ENUM.SECONDARY_CARER_EXPIRES_AT, invitation.expiresAt);
    await this.cachePort.set(CACHE_KEY_ENUM.CARER, invitation.originCarerId);

    // Deactivate current modules, activate invited ones
    await this.modulePort.deactivateAll();
    await this.modulePort.activateModules(invitation.moduleIds);

    return { success: true };
  }
}
```

- **QR integration**: Uses `IQRPort` for data exchange
- **Session switching**: Changes active carer context
- **Module management**: Dynamic module activation based on invitation

## Logout/wipe integration

Destructive logout that clears all local data:

```typescript
// src/domain/core/use-case/wipe-local-data.use-case.ts
export class WipeLocalDataUseCase {
  async execute() {
    // Clear all cache
    await this.cachePort.clearAll();

    // Drop database
    await this.databasePort.dropAllTables();

    // Navigate to splash
    await this.navigationPort.navigate('/index');
  }
}
```

- **Complete reset**: Clears cache, DB, and navigates to start
- **Framework integration**: Uses navigation port for routing

## PIN validation integration

Optional PIN check for sensitive operations:

```typescript
// src/domain/carer/use-case/validate-pin.use-case.ts
export class ValidatePinUseCase {
  async execute(pin: string) {
- **Integration tests**: Test full flows with mocked adapters
- **Session verification**: Check cache state after operations

## Decision history & trade-offs

### Why splash screen as auth guard?

- **Simple routing**: Single entry point controls all navigation.
- **Framework native**: Uses Expo Router's redirect capabilities.

Trade-off: No deep linking support for protected routes.

### Why cache-based session?

- **Performance**: No DB queries for session checks.
- **Offline-first**: Works without database access.

Trade-off: Session can be stale if cache is cleared but DB persists.

### Why destructive logout?

- **Privacy**: Complete data removal for medical app.
- **Simplicity**: No selective data cleanup logic.

Trade-off: No "soft logout" option; users lose all data.
