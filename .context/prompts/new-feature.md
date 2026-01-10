# Prompt: new-feature

Goal: implement a feature consistent with existing architecture and conventions.

## What to provide

- Feature description and UX expectations (screens involved)
- Domain operation(s) needed (use-cases)
- Data involved (entities/DTOs) and persistence needs
- Acceptance criteria

## Constraints (non-negotiable)

- Respect **UI → hooks → use-cases → ports ← adapters**
- Validate use-case input with Zod schemas (`*.use-case-schema.ts`)
- Use `IBaseResponse<T>` with i18n `message` keys (no hardcoded UI strings)

## Required outputs

- Use-case + schema + unit tests
- Any ports/adapters/wiring needed
- Updated docs if patterns change (`.context/**`)

