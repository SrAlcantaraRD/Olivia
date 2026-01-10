# Auth overview (local-first)

## What "auth" means here

This project has **no remote authentication**. "Authentication" is a local concept for device session management and optional PIN protection.

## Core concepts

- **Primary carer**: The main user who sets up the device
- **Session**: Existence of a `carerId` in local cache
- **PIN**: Optional biometric/PIN protection for sensitive operations
- **Secondary carers**: Temporary access via QR invitations

## Session lifecycle

### Establishment (onboarding)

Primary carer setup creates the session:

```typescript
// src/domain/carer/use-case/setup-parent.use-case.ts
export class SetupParentUseCase {
  async execute(request: TSetupParentRequest) {
    // Create carer and patient
    const carer = await this.carerPort.create(request.carerData);
    const patient = await this.patientPort.create(request.patientData);

    // Activate selected modules
    await this.modulePort.activateModules(request.selectedModules);

    // Establish session
    await this.cachePort.set(CACHE_KEY_ENUM.CARER, carer.id);
    await this.cachePort.set(CACHE_KEY_ENUM.CARER_PIN_HASH, request.pinHash);

    return { carer, patient };
  }
}
```

- **Atomic setup**: All steps succeed or fail together
- **Session keys**: `carerId` and optional `pinHash` stored in cache

### Validation (splash guard)

App startup checks for existing session:

```typescript
// src/domain/carer/hook/use-splash-carer-validation.hook.ts
export const useSplashCarerValidation = () => {
  const { cacheAdapter } = useAdapters();

  useEffect(() => {
    const checkSession = async () => {
      const carerId = await cacheAdapter.get<string>(CACHE_KEY_ENUM.CARER);
      setHasSession(!!carerId);
    };
    checkSession();
  }, [cacheAdapter]);

  return { hasSession };
};
```

- **Cache check**: Fast lookup for `carerId`
- **Guard pattern**: Controls app navigation flow

### Secondary carer mode

QR invitations enable temporary secondary access:

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

    // Switch session
    await this.cachePort.set(CACHE_KEY_ENUM.SECONDARY_CARER_EXPIRES_AT, invitation.expiresAt);
    await this.cachePort.set(CACHE_KEY_ENUM.CARER, invitation.originCarerId);

    // Switch modules
    await this.modulePort.deactivateAll();
    await this.modulePort.activateModules(invitation.moduleIds);
  }
}
```

- **Temporary access**: Expires at `invitation.expiresAt`
- **Module switching**: Dynamic module activation
- **Session override**: Changes active carer context

### Termination (logout/wipe)

Complete local data destruction:

```typescript
// src/domain/core/use-case/wipe-local-data.use-case.ts
export class WipeLocalDataUseCase {
  async execute() {
    // Clear cache
    await this.cachePort.clearAll();

    // Drop database
    await this.databasePort.dropAllTables();

    // Reset navigation
    await this.navigationPort.navigate('/index');
  }
}
```

- **Destructive**: Removes all user data
- **Privacy-focused**: Complete local reset

## PIN protection

Optional PIN for sensitive operations:

```typescript
// src/domain/carer/use-case/validate-pin.use-case.ts
export class ValidatePinUseCase {
  async execute(pin: string) {
    const storedHash = await this.cachePort.get<string>(
      CACHE_KEY_ENUM.CARER_PIN_HASH
    );

    if (!storedHash) return { valid: true }; // No PIN set

    const isValid = await this.cryptoPort.verifyHash(pin, storedHash);
    return { valid: isValid };
  }
}
```

- **Optional**: No PIN required by default
- **Crypto abstraction**: Uses port for hash verification
- **Graceful fallback**: Missing PIN is valid

## Cache keys used

```typescript
// src/domain/core/constant/cache-key.constants.ts
export const CACHE_KEY_ENUM = {
  CARER: 'carer',
  CARER_PIN_HASH: 'carer_pin_hash',
  SECONDARY_CARER_EXPIRES_AT: 'secondary_carer_expires_at',
} as const;
```

- **Typed enum**: Prevents typos in cache keys
- **SecureStore**: All keys use secure storage adapter

## Flow diagrams

### Primary onboarding flow

```mermaid
sequenceDiagram
  participant U as User
  participant S as Splash
  participant O as Onboarding
  participant UC as SetupParentUseCase
  participant DB as SQLite
  participant C as Cache

  U->>S: Open app
  S->>C: Check CARER key
  C-->>S: null
  S->>O: Redirect to onboarding

  U->>O: Complete setup
  O->>UC: Execute setup
  UC->>DB: Create carer/patient
  UC->>DB: Activate modules
  UC->>C: Set CARER + PIN_HASH
  UC-->>O: Success
  O->>S: Redirect to home
```

### Secondary carer invitation

```mermaid
sequenceDiagram
  participant P as Primary Carer
  participant S as Secondary Carer
  participant QR as QR Code
  participant UC as ConsumeInvitationUseCase

  P->>QR: Generate invitation
  P->>S: Share QR
  S->>QR: Scan code
  S->>UC: Consume invitation
  UC->>UC: Validate expiry
  UC->>C: Set SECONDARY_CARER_EXPIRES_AT
  UC->>C: Set CARER to origin
  UC->>DB: Switch modules
```

## Error scenarios

- **Expired invitation**: `ErrorInvitationExpired`
- **Invalid QR**: Zod validation errors
- **DB failures**: Domain errors during setup
- **Cache failures**: Fallback to no session

## Testing patterns

Auth flows require integration testing:

```typescript
// tests/integration/auth-flow.integration.spec.ts
describe('Auth flow', () => {
  it('should establish session after onboarding', async () => {
    const mockCache = new MockCacheAdapter();
    const adapters = createTestAdapters({ cache: mockCache });

    const useCase = new SetupParentUseCase(adapters);
    await useCase.execute(validRequest);

    expect(mockCache.get(CACHE_KEY_ENUM.CARER)).toBeDefined();
    expect(mockCache.get(CACHE_KEY_ENUM.CARER_PIN_HASH)).toBeDefined();
  });
});
```

- **Mock adapters**: Test without real storage
- **State verification**: Check cache after operations

## Decision history & trade-offs

### Why local-first auth?

- **Offline capability**: Works without internet
- **Privacy**: No user data sent to servers
- **Simplicity**: No OAuth/JWT complexity

Trade-off: No multi-device sync for auth state.

### Why cache-based sessions?

- **Performance**: Instant session checks
- **Framework integration**: Easy with Expo Router guards

Trade-off: Cache clearing breaks sessions (mitigated by DB checks in critical paths).

### Why destructive logout?

- **Medical data privacy**: Complete local data removal
- **Regulatory compliance**: No residual patient data

Trade-off: No "undo" capability; users must re-setup everything.

### Why optional PIN?

- **Accessibility**: Not all users can remember PINs
- **Progressive security**: Add protection as needed

Trade-off: No default protection; relies on device-level security.
