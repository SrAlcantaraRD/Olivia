# API operations (“endpoints”)

The Oliva app does not expose network APIs. Instead, the "API surface" consists of internal domain ports and QR-based data exchange operations.

## Port-based operations

Ports define the contract for external capabilities that use-cases depend on.

### Cache operations

```typescript
interface ICachePort {
  delete(key: TCacheKey): Promise<void>;
  get<T>(key: TCacheKey): Promise<T | null>;
  set<T>(key: TCacheKey, value: T): Promise<void>;
  clearAll(): Promise<void>;
}
```

**Operations:**
- `get()`: Retrieve cached value by key
- `set()`: Store value in cache
- `delete()`: Remove specific cache entry
- `clearAll()`: Wipe all cached data

**Usage in use-cases:**
```typescript
// Session validation
const carerId = await this.cachePort.get(CACHE_KEY_ENUM.CARER);

// PIN storage
await this.cachePort.set(CACHE_KEY_ENUM.CARER_PIN_HASH, hashedPin);
```

### Database operations

#### Carer operations

```typescript
interface ICarerPort {
  create(data: TCreateCarerData): Promise<TCarer>;
  findById(id: number): Promise<TCarer | null>;
  update(id: number, data: Partial<TCreateCarerData>): Promise<TCarer>;
  findAll(): Promise<TCarer[]>;
}
```

**Operations:**
- `create()`: Insert new carer record
- `findById()`: Retrieve carer by ID
- `update()`: Modify existing carer
- `findAll()`: List all carers

#### Record operations

```typescript
interface IRecordPort {
  create(data: TCreateRecordData): Promise<TRecord>;
  findById(id: number): Promise<TRecord | null>;
  findByModuleAndDate(moduleId: number, date: Date): Promise<TRecord[]>;
  update(id: number, data: Partial<TCreateRecordData>): Promise<TRecord>;
  delete(id: number): Promise<void>;
}
```

**Operations:**
- `create()`: Log new catheterization record
- `findByModuleAndDate()`: Query records for reporting
- `update()`/delete(): Modify/delete records

### Navigation operations

```typescript
interface INavigationPort {
  navigate(path: string, params?: Record<string, unknown>): Promise<void>;
  goBack(): Promise<void>;
  replace(path: string, params?: Record<string, unknown>): Promise<void>;
}
```

**Operations:**
- `navigate()`: Push new screen
- `goBack()`: Pop current screen
- `replace()`: Replace current screen

### QR operations

```typescript
interface IQRPort {
  pack(data: unknown): Promise<string>;
  unpack(qrString: string): Promise<unknown>;
}
```

**Operations:**
- `pack()`: Compress and encode data for QR
- `unpack()`: Decode and decompress QR data

## QR payload schemas

QR codes carry structured data between devices.

### Secondary carer invitation

```typescript
// Zod schema for invitation payload
const TSecondaryCarerInvitation = z.object({
  originCarerId: z.number(),
  originCarerName: z.string(),
  expiresAt: z.number(), // Unix timestamp
  moduleIds: z.array(z.number()),
  moduleFieldIds: z.array(z.number()),
});

type TSecondaryCarerInvitation = z.infer<typeof TSecondaryCarerInvitation>;
```

**Fields:**
- `originCarerId`: ID of inviting carer
- `expiresAt`: Invitation expiry timestamp
- `moduleIds`: Active modules to transfer

### Record synchronization

```typescript
// Record sync bundle
const TRecordSyncBundle = z.object({
  records: z.array(TRecordWithFields),
  syncedAt: z.number(),
  originDeviceId: z.string(),
});

type TRecordSyncBundle = z.infer<typeof TRecordSyncBundle>;
```

**Fields:**
- `records`: Array of records with field values
- `syncedAt`: Timestamp of sync operation

## Use-case request/response schemas

Use-cases define their input/output contracts with Zod.

### Setup parent carer

```typescript
const TSetupParentRequest = z.object({
  carerData: TCreateCarerData,
  patientData: TCreatePatientData,
  selectedModules: z.array(z.number()),
  pinHash: z.string().optional(),
});

const TSetupParentResponse = z.object({
  carer: TCarer,
  patient: TPatient,
});
```

### Create record

```typescript
const TCreateRecordRequest = z.object({
  moduleId: z.number(),
  fieldValues: z.record(z.string(), z.unknown()), // Dynamic fields
});

const TCreateRecordResponse = z.object({
  record: TRecord,
  success: z.boolean(),
});
```

## Error response patterns

Domain operations return structured error information.

```typescript
// Base response type
interface IBaseResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// Error codes
enum ErrorCode {
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  NOT_FOUND = 'NOT_FOUND',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  QR_EXPIRED = 'QR_EXPIRED',
}
```

## Operation sequencing

Complex operations chain multiple port calls.

### Onboarding sequence

```typescript
// SetupParentUseCase sequence
1. Validate request (Zod)
2. Create carer (ICarerPort.create)
3. Create patient (IPatientPort.create)
4. Activate modules (IModulePort.activateModules)
5. Store session (ICachePort.set)
6. Return success response
```

### Record creation sequence

```typescript
// CreateRecordUseCase sequence
1. Validate request
2. Create record (IRecordPort.create)
3. Create field values (IRecordFieldPort.createMultiple)
4. Notify success (INotifyPort.success)
5. Return record data
```

## Performance considerations

- **Async operations**: All port methods are async
- **Batching**: Multiple DB operations batched where possible
- **Caching**: Frequent reads cached in memory
- **Lazy loading**: Large datasets paginated

## Testing operations

Operations tested with mocked ports:

```typescript
describe('CreateRecordUseCase', () => {
  it('should create record and fields', async () => {
    const mockRecordPort = {
      create: vi.fn().mockResolvedValue({ id: 1 }),
    };
    const mockFieldPort = {
      createMultiple: vi.fn().mockResolvedValue([]),
    };

    const useCase = new CreateRecordUseCase(mockRecordPort, mockFieldPort);
    const result = await useCase.execute(validRequest);

    expect(result.success).toBe(true);
    expect(mockRecordPort.create).toHaveBeenCalled();
  });
});
```

## Decision history & trade-offs

### Why port-based "APIs"?

- **Testability**: Mock external dependencies
- **Flexibility**: Swap implementations (SQLite → PostgreSQL)
- **Clean architecture**: Domain doesn't depend on infrastructure

Trade-off: More interfaces and boilerplate.

### Why QR for data exchange?

- **Offline-first**: No network required
- **User control**: Explicit sharing actions
- **Simple**: No server infrastructure

Trade-off: Limited to visual/QR data transfer.

### Why Zod for schemas?

- **Runtime validation**: Catch invalid data at boundaries
- **TypeScript integration**: Infer types from schemas
- **Developer experience**: Clear error messages

Trade-off: Runtime performance cost for validation.
