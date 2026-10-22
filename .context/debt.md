# Known technical debt

This is a living registry. Items here are things the codebase already hints are pending (TODO/FIXME) or inconsistent patterns found during analysis.

## High impact

1. **“Session exists” = cache-only check**
   - Current: `CheckCarerExistenceUseCase` checks only `CACHE_KEY_ENUM.CARER`.
   - Risk: if cache is cleared but DB still has a carer, app treats user as “not registered”.
   - See: [src/domain/carer/use-case/check-carer-existence.use-case.ts](../src/domain/carer/use-case/check-carer-existence.use-case.ts)

2. **Record creation uses placeholder IDs**
   - `ExecuteRegister` sets `carerID: 0` and record-field `recordID: -1` before persistence.
   - Risk: integrity issues or silent wrong attribution.
   - See: [src/app/(tabs)/register/execute-register.tsx](<../src/app/(tabs)/register/execute-register.tsx>)

3. **Storage strategy is inconsistent (MMKV exists but not used)**
   - `MMKVCacheAdapter` exists, but `cacheAdapter` currently points to SecureStore.
   - Risk: SecureStore is slower than MMKV for non-sensitive cache.
   - See: [src/adapter/index.ts](../src/adapter/index.ts), [src/adapter/mmkv.cache-port.adapter.ts](../src/adapter/mmkv.cache-port.adapter.ts)

## Quality and privacy risks (2026-10 audit)

- **Debug log contains the full parent-setup payload**
  - `SetupParentUseCase` logs `JSON.stringify(request)` at debug level, including the child's name, birth date and optional diagnosis.
  - `LOG_LEVEL` defaults to `4` (errors only), so it is normally suppressed, but lowering it writes the payload to the console or `logs.txt` in the app's document directory.
  - Fix: log identifiers/counts only, and review the log level before any real-data use.
  - See: [src/domain/carer/use-case/setup-parent.use-case.ts](../src/domain/carer/use-case/setup-parent.use-case.ts)

- **No PIN/lock implementation**
  - `pin_hash` exists in the schema and `CARER_PIN_HASH` in the cache, but no code sets or verifies a PIN; `.context/auth/overview.md` used to document a nonexistent `ValidatePinUseCase`. That document is now corrected.

## Medium impact

4. **Use-case validation pattern inconsistent**
   - Some use-cases manually do `safeParse` and return `success:false` instead of throwing a domain error or using `BaseUseCase.parseRequest`.
   - Many TODOs ask for a wrapper to reduce duplication.

5. **Quality gates are red and mostly unenforced**
   - `pnpm typecheck` fails with 228 errors: 17 in source files (HeroUI Native API drift in `text-field.atom.tsx`, `card.atom.tsx`, `app-settings.tsx`, `carer-managment/index.tsx`) and 211 in tests (mocks out of sync with domain types). `tsconfig.json` includes `tests/**`, so `typecheck:src` cannot isolate source, and `typecheck` never reaches the test config.
   - `pnpm test` does not start under the current pnpm-isolated install (`transformIgnorePatterns` assumes hoisted paths); with the install fixed, 55/79 suites and 291/300 tests pass, and coverage is 18.5% of statements. The 24 failing suites are: 17 `react-test-renderer` version mismatch, 4 Zod `.omit()`-on-refined-schema errors, 1 import of a missing `time-to-live.enum`, 2 suites with 9 assertion failures.
   - CI (`.github/workflows/ci.yml`) gates Biome only; typecheck and tests are an advisory job until this is fixed.
   - Details and reproductions: [TESTING.md](../TESTING.md).

6. **DB drop strategy is “DROP TABLE all”**
   - `dropDatabase()` drops all tables; it’s used when migrations fail and for “wipe local data”.
   - Risk: destructive recovery strategy; possible race conditions on app start.
   - See: [src/database/config/drop-database.config.ts](../src/database/config/drop-database.config.ts), [src/database/execute-migrations.ts](../src/database/execute-migrations.ts)

7. **Schema/domain mismatch on `pinHash`**
   - DB schema requires `carer.pin_hash NOT NULL`, while domain logic treats it as potentially missing.

8. **Relations naming bug / confusion**
   - `MODULE_RELATIONS` exposes `recordFieldList: many(RECORD)` which looks like a naming mistake.
   - See: [src/database/schema/module.database-schema.ts](../src/database/schema/module.database-schema.ts)

## Low impact (but noisy)

- Logging levels used for non-errors (e.g., debug logged as error).
- Various TODO/FIXME:
  - Deprecated enum in [src/domain/core/enum/time-range.enum.ts](../src/domain/core/enum/time-range.enum.ts)
  - Hook return shape `items` should be renamed to `result`.

## Planned refactors (existing docs)

- Hooks refactor plan: [docs/features/hooks-refactor-plan.md](../docs/features/hooks-refactor-plan.md)
- Wipe local data feature notes: [docs/features/logout-wipe-local-data.md](../docs/features/logout-wipe-local-data.md)
- Performance refactor notes: [docs/features/performance-refactor](../docs/features/performance-refactor)
