---
applyTo: 'src/domain/**/*.enum.ts'
description: "Rules for generating Domain Enums and their usage patterns"
---

# Domain Enum Instructions

## Purpose
- Provide constrained, self-documenting sets of allowed symbolic values for stable business concepts.

## Artifacts
- `src/domain/**/enum/<enum>.enum.ts`
- `test/unit-test/domain/enum/**/<enum>.enum.spec.ts`

## Naming
- Enum: `<EnumName>Enum`
- Schema: `<EnumName>Schema`
- File: `<enum>.enum.ts`

## Rules
### Basic Structure
- Keep members semantic & stable; avoid transient states.
- Define enum with string values.

### Schema
- Provide schema wrapper using z.enum with description, message & examples.
- Expose normalization helper ONLY if converting from external inputs.

### Usage
- Entity/DTO schemas: Reference via z.enum.
- Use cases: Branching allowed but minimal.
- Controllers: Validate via schema.
- Early normalize from external sources before domain logic.

### Evolution
- Additive changes backward-compatible; renaming BREAKING.

### Do / Avoid
- Do: Explicit semantic names, provide schema, centralize normalization.
- Avoid: Obscure abbreviations, scatter literals, overload with user text.
- Do not throw framework errors; use domain errors when needed.

### Testing
- Always create `<enum>.enum.spec.ts` for schema validation and helper functions.
- Test schema parsing with valid/invalid values.
- Test helper functions (e.g., normalization) with edge cases.
- Example test cases: valid enum values parse correctly, invalid values throw errors, helper returns correct enum for inputs.

#### Example Spec
  ```typescript
  describe('[Enum] StatusEnum', () => {
    describe('Schema', () => {
      it('should parse valid status', () => {
        expect(StatusSchema.parse('active')).toBe('active');
      });

      it('should throw on invalid status', () => {
        expect(() => StatusSchema.parse('invalid')).toThrow();
      });
    });

    describe('getStatusFromValue', () => {
      it('should return correct enum for valid value', () => {
        expect(getStatusFromValue('active')).toBe(StatusEnum.ACTIVE);
      });

      it('should throw for invalid value', () => {
        expect(() => getStatusFromValue('invalid')).toThrow();
      });
    });
  });
  ```

### Quality Gates
- No duplicate literals, stable values, Codacy scan.

### Integration
- Import schema in entity/DTO, use in use cases for guards.

### Example
  ```typescript
  export enum <ROOT>_ENUM = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
  };

  export const StatusSchema = z.enum(<ROOT>_ENUM, {
    description: 'Entity status',
    errorMap: () => ({ message: 'Invalid status' }),
  });

  export const get<Root>FromValue = (value: string): SEX_ENUM => {
  const types: <ROOT>_ENUM[] = Object.values(<ROOT>_ENUM);

  const type = types.find((column) => column === value);

  if (!type) {
    throw new ErrorCannotParseSchema(
      '<ROOT>_ENUM',
      `Value "${value}" is not a valid <root>.`
    );
  }

  return type;
};

  ```
