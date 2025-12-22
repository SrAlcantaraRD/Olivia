---
applyTo: 'tests/e2e/**/*.test.ts'
description: 'Detox E2E rules (device-level, user flows, stable selectors)'
---

## Where
- Place tests under `tests/e2e/**` and name `*.spec.ts`.

## Naming
- `describe('[E2E] <Flow>', ...)` and `it('completes <scenario>', ...)`.

## Stability rules
- Always use `testID` selectors (`by.id(...)`); never rely on text that changes with i18n.
- Prefer `waitFor(...).toBeVisible().withTimeout(...)` over arbitrary sleeps.
- Keep each test independent: reset app state between tests when needed.

## Data/state rules
- Start from a known clean state (fresh install / cleared storage / reset DB) when the flow depends on it.
- Do not share state between `it` blocks.
- Avoid randomness; use fixed fixtures.

## Assertions
- Assert visible UI state + navigation outcome.
- For forms: assert validation messages and final success screen/route.

## Performance/timeouts
- Keep timeouts tight but realistic.
- If a screen is async, wait for a specific stable element.

## Commands
- Use existing scripts: `pnpm e2e:test:ios:debug` / `pnpm e2e:test:android:debug`.
