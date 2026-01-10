# Prompt: review

Goal: code review against repo standards.

## What to provide

- PR diff or list of changed files
- Intended behavior
- Any known trade-offs

## Review checklist (high signal)

- Boundaries respected (UI/hooks/domain/ports/adapters)
- Zod validation present for use-cases
- Correct i18n `message` keys (no copy/paste mismatch)
- Tests exist and are meaningful (AAA, strict types)
- No new deps without `.context/dependencies.md` update

