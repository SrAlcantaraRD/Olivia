# Prompt: performance

Goal: improve performance without changing architecture boundaries.

## What to provide

- Where it’s slow (screen, hook, use-case, adapter)
- Measurements if available (profiling, timings)
- Constraints (no new deps, no behavioral change)

## Common levers in this repo

- Reduce unnecessary re-renders (hooks/UI)
- Reduce DB roundtrips (adapters)
- Avoid SecureStore for non-sensitive hot paths (see `.context/debt.md`)

