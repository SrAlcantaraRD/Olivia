# API conventions

This project does **not** expose a network API.

Instead, the “API surface” is:

1. **Domain ports** (interfaces) used by use-cases
2. **Use-case request/response schemas** (Zod)
3. **QR payload formats** used for cross-device sharing and synchronization

## Ports (internal APIs)

Examples:

- `ICachePort`: local cache / secure storage abstraction
  - See: [src/domain/core/port/cache.port.ts](../../src/domain/core/port/cache.port.ts)
- `INavigationPort`: navigation abstraction (Expo Router adapter)
  - Adapter: [src/adapter/expo-router-navigation.adapter.ts](../../src/adapter/expo-router-navigation.adapter.ts)
- `IQRPort`: QR pack/unpack abstraction
  - Adapter: [src/adapter/minizlib.qr.adapter.ts](../../src/adapter/minizlib.qr.adapter.ts)

DB ports (examples):

- `IRecordPort`, `IModulePort`, `ICarerPort`, etc.

## Use-case conventions

- Validate input via `*.use-case-schema.ts` using `safeParse`.
- Prefer consistent error handling:
  - either throw domain errors
  - or return `success:false` with a stable i18n message key

Current state is mixed (see [debt.md](../debt.md)).

## QR bundles

### Encoding

The QR adapter (`QrPortAdapter`) packs a payload like this:

- `JSON.stringify`
- `pako.deflate` (compression)
- `base64` encode

See: [src/adapter/minizlib.qr.adapter.ts](../../src/adapter/minizlib.qr.adapter.ts)

### Chunking

Record sync QR data is chunked into `TQRChunk[]`.

- Chunk size is controlled by `ENVIRONMENT_VARIABLES.QR_CHUNK_SIZE`.
  - See: [src/domain/core/constant/environment-variables.constants.ts](../../src/domain/core/constant/environment-variables.constants.ts)

### Record synchronization

- Generate:
  - Reads pending records from DB
  - Produces bundle + QR chunks
  - See: [src/domain/core/use-case/generate-record-synchronization-qr.use-case.ts](../../src/domain/core/use-case/generate-record-synchronization-qr.use-case.ts)
- Consume:
  - Reassembles chunks
  - Validates bundle via Zod
  - Upserts records and record fields
  - See: [src/domain/core/use-case/consume-record-synchronization-qr.use-case.ts](../../src/domain/core/use-case/consume-record-synchronization-qr.use-case.ts)

### Secondary carer invitations

- Generate/consume invitation bundles in:
  - [src/domain/carer/use-case/secondary-carer.generate-invitation-qr.use-case.ts](../../src/domain/carer/use-case/secondary-carer.generate-invitation-qr.use-case.ts)
  - [src/domain/carer/use-case/secondary-carer.consume-invitation-qr.use-case.ts](../../src/domain/carer/use-case/secondary-carer.consume-invitation-qr.use-case.ts)
