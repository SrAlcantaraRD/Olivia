---
applyTo: 'src/database/schema/*.database-schema.ts'
description: "Rules for defining Drizzle database schemas"
---

# Database Schema Instructions

## Purpose
Define database schemas using Drizzle ORM to represent domain entities in the database layer.

## Artifacts
- `src/database/schema/*.database-schema.ts`

## Naming
- File names must end with `<root>.database-schema.ts`, e.g., `task.database-schema.ts`.

## Rules

### Schema Definition
- Use Drizzle ORM for all schema definitions.
- Ensure schemas align with domain entities, including all required fields.
- Include proper column types, constraints (e.g., notNull, unique), and defaults.

#### Enum Handling
- Use custom types for runtime validation of enum values
- Consider adding CHECK constraints in migrations for database-level validation
- Example custom enum type:
  ```typescript
  const textEnum = <V extends Record<string, string>, RV = V[keyof V]>(
    columnName: string,
    enumObj: V,
    message?: string,
  ) => {
    const colFn = customType<{
      data: string;
      driverData: string;
    }>({
      dataType() {
        return "text";
      },
      toDriver(value: string): string {
        const values = Object.values(enumObj);
        if (!values.includes(value))
          throw Error(
            message ??
              `Invalid value for column ${columnName}. Expected: ${values.join(", ")} | Found: ${value}`,
          );
        return value;
      },
    });
    return colFn(columnName).$type<RV>();
  };
  ```
- Usage: `role: textEnum("role", USER_ROLE_ENUM).notNull()`
- For database constraints, add CHECK in migrations: `TEXT CHECK( role IN ('admin','user') )`

#### Complex CHECK Constraints
- Use CHECK constraints for complex business rules that span multiple columns
- Particularly useful for polymorphic relationships or conditional validations
- Example for polymorphic references:
  ```typescript
  export const polymorphicTableSchema = sqliteTable('polymorphic_table', {
    // ... other fields
    entityType: textEnum('entity_type', ENTITY_TYPES).notNull(),
    entityAId: integer('entity_a_id'),
    entityBId: integer('entity_b_id'),
  }, (table) => ({
    // CHECK: Ensure only one entity ID is set based on entityType
    checkEntityReference: check(
      'polymorphic_table__check__entity_reference',
      sql`
        (
          ${table.entityType} = '${sql.raw(ENTITY_TYPES.TYPE_A)}'
          AND ${table.entityAId} IS NOT NULL
          AND ${table.entityBId} IS NULL
        )
        OR
        (
          ${table.entityType} = '${sql.raw(ENTITY_TYPES.TYPE_B)}'
          AND ${table.entityAId} IS NULL
          AND ${table.entityBId} IS NOT NULL
        )
      `
    ),
  }));
  ```

### Relations
- Define foreign keys and relations explicitly using Drizzle's relation helpers.
- Use appropriate relation types (one-to-one, one-to-many, many-to-many).

### Migrations
- Migrations must be stored in `src/database/migrations/`.
- Auto-run migrations on app init via `useInitDb()` hook.
- Never modify schemas without generating and applying migrations.
- Generate migrations from schema: `npx drizzle-kit generate --config=src/database/drizzle.config.ts`
- Generate custom migration file: `npx drizzle-kit generate --config=src/database/drizzle.config.ts --custom --name=<<custom-migration-name>>`

### Best Practices
- Use descriptive column names matching domain entity properties.
- Include indexes for frequently queried columns.
- Add comments for complex schemas or business rules.

## Testing
- Validate schema definitions against domain entities to ensure alignment
- Test custom types (like `textEnum`) with invalid values to ensure proper error handling
- Verify CHECK constraints work correctly with test data
- Use Drizzle's schema validation tools to catch type mismatches
- Test migrations on a separate database to ensure they apply correctly

### Example
```typescript
import { sqliteTable, text, integer, customType } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { STATUS_ENUM } from '../../domain/core/enum/status.enum';

// Custom enum helper for runtime validation
const textEnum = <V extends Record<string, string>, RV = V[keyof V]>(
  columnName: string,
  enumObj: V,
  message?: string,
) => {
  const colFn = customType<{
    data: string;
    driverData: string;
  }>({
    dataType() {
      return "text";
    },
    toDriver(value: string): string {
      const values = Object.values(enumObj);
      if (!values.includes(value))
        throw Error(
          message ??
            `Invalid value for column ${columnName}. Expected: ${values.join(", ")} | Found: ${value}`,
        );
      return value;
    },
  });
  return colFn(columnName).$type<RV>();
};

export const taskSchema = sqliteTable('tasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  // Domain enums stored as text with runtime validation
  status: textEnum('status', STATUS_ENUM).notNull().default(STATUS_ENUM.ACTIVE),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export const insertTaskSchema = createInsertSchema(taskSchema);
export const selectTaskSchema = createSelectSchema(taskSchema);
```
