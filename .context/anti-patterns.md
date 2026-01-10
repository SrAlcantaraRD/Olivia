# Anti-patterns (Don’t do these disparates)

## Breaking layer boundaries

- Calling Drizzle/SQLite directly from UI (`src/app/**`, `src/ui/**`).
- Importing Expo/React Native modules inside core domain entities.

## Skipping validation

- Creating/updating domain entities without going through Zod schemas.
- Accepting UI payloads directly in adapters without request schemas.

## Storing secrets in the wrong place

- Storing `pinHash` (or anything sensitive) in MMKV or plain SQLite.
  - Use SecureStore via `SecureStoreCacheAdapter`.

## “Session” checks that ignore DB

- Using cache-only checks to decide if the user exists (current behavior). If you improve it, prefer “cache as hint, DB as source of truth”.

## UI strings

- Hardcoding strings in screens/components instead of using i18n keys.

## Error handling drift

- Returning `{ success:false }` silently from a use-case without any error code/message.
- Throwing raw `Error` from domain logic. Prefer domain errors (e.g., `BaseError` descendants).
- Copy/pasting i18n message keys between use-cases (message key should match the use-case namespace).
