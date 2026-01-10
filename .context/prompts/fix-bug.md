# Prompt: fix-bug

Goal: fix a bug with minimal, verified changes.

## What to provide

- Problem statement + expected vs actual behavior
- Repro steps (or failing test name)
- Files in scope

## Constraints (non-negotiable)

- Follow **UI → hooks → use-cases → ports ← adapters**
- No new deps unless approved in `.context/dependencies.md`
- No invented types/flows: search first (`rg`)

## Definition of done

- Bug reproduced (ideally via unit test) and fixed
- `pnpm test` (or targeted Jest run) passes
- `pnpm biome:check` passes

