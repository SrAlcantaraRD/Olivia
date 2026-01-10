# AI Rules (Hard Constraints)

These are *non-negotiable* constraints for working in this repo.

## Evidence rule (anti-hallucination)

- If something is not explicitly present in the repo or `.context/**`, **do not assume it exists**. Search first (`rg`) and, if still unclear, ask.
- Prefer copying patterns from the closest existing “golden path” file (use-case + schema + spec) over inventing new structure.
- When adding message keys, only use existing i18n namespaces and conventions. Avoid copy/paste keys from other use-cases.

## Architecture

- Respect the flow: **UI → hooks → domain use-cases → ports ← adapters**.
- **Domain is pure** TypeScript + Zod. No Expo/React Native imports inside `src/domain/**` (except the “hook” layer that is explicitly part of domain in this repo).
- **No DB calls in UI** (`src/app/**`, `src/ui/**`). DB access happens in `src/database/adapter/**` only.
- **No storage calls in UI** (SecureStore/MMKV). Use ports (`ICachePort`, etc.) injected into hooks/use-cases.

## Typescript & validation

- Do not introduce `any` or unsafe casts (`as`) unless absolutely unavoidable.
- Input validation lives in `*.use-case-schema.ts` using Zod `safeParse`.
- Prefer `z.infer<typeof Schema>` over hand-written types.
- Use `satisfies` in tests/mocks to keep types strict without unsafe casts.

## I18n

- No hard-coded user-facing strings in UI.
- Use typed i18n keys (see `src/ui/i18n/locales/*`).

## Data handling & privacy

- This app is designed as **local-only**: “Sin nube. Sin cuentas.”
- Sensitive values (e.g., `pinHash`) must go to SecureStore.
- Wipe-local-data is destructive: see [debt.md](debt.md) and feature doc [docs/features/logout-wipe-local-data.md](../docs/features/logout-wipe-local-data.md).

## Error handling

- Use-cases must return `IBaseResponse<T>` consistently: `success`, `message`, and optional `details`.
- Do not “silently fail”: when returning `success:false`, always return an i18n `message` key and log meaningful error details.
- Do not throw raw `Error` from use-cases unless the surrounding layer is explicitly designed to catch and translate it.

## Tooling

- Package manager: `pnpm`.
- Formatting/linting: Biome (`pnpm biome:check`).
- Tests: Jest (`pnpm test`).
