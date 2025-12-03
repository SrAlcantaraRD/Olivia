---
applyTo: 'src/domain/**/*.error.ts'
description: "Rules for generating or modifying Domain Error classes"
---

# Domain Error Instructions

## Purpose
- Represent domain-level failure states with typed, code-bearing errors for consistent HTTP mapping & observability.

## Artifacts
- `src/domain/**/error/<error>.error.ts`

## Naming
- Class: `Error<Action>` or specific name like `ErrorEntityNotFound`
- File: `<error>.error.ts`

## Rules
### Basic Structure
- Extend BaseError.
- Provide code (SCREAMING_SNAKE) and human-centric message (i18n key if applicable).
- Include contextual metadata if helpful (readonly).

### Usage
- Throw from use cases when invariant broken before side-effects.
- Use ErrorEntityNotFoundBy for not found errors.
- Check existing errors before creating new ones.

### Constraints
- No external side-effects, minimal surface.
- Codacy scan after edits.

### Example
  ```typescript
  export class Error<Action> extends BaseError {
    public readonly code = 'ENTITY_NOT_FOUND';
    constructor(public readonly uuid: TUUID) {
      super('error.entity-not-found', HTTP_STATUS_CODE.NOT_FOUND_404);
    }
  }
  ```
