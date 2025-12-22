---
applyTo: 'src/database/adapter/*.adapter.ts'
description: "Rules for implementing database adapters following the Port/Adapter pattern"
---

# Database Adapter Instructions

## Purpose
Implement database adapters for data access in the database layer, following the Port/Adapter pattern to decouple domain from infrastructure.

## Artifacts
- `src/database/adapter/*.adapter.ts`
- `test/unit-test/database/adapter/<root>.adapter.spec.ts`
- `test/integration/database/adapter/<tech>.<root>.adapter.spec.ts`

## Naming
- File names must follow the pattern `{tech}.{entity}.adapter.ts`, e.g., `sqlite.task.adapter.ts`.

## Rules

### Implementation
- Adapters must implement the corresponding Port interface from the domain layer.
- Constructor must accept a logger dependency for error handling and logging.
- Use Drizzle ORM for all database operations.
- Never include business logic; adapters are purely for data access.

### Mapping
- Implement a static `toDomainEntity()` method to convert database entities to domain entities.
- Ensure all fields are properly mapped, including relations if needed.
- Handle soft deletes by filtering out entities with `deletedAt` set.

### Error Handling
- Propagate database errors appropriately, using domain error types when possible.
- Log errors using the injected logger.

### Dependencies
- Inject database connection and schema as needed.
- Avoid hard dependencies on external services; use ports for those.

### Quality Gates
- No `any`/`unknown` types in adapter implementations
- All port methods implemented and tested
- Proper error handling and logging
- Codacy scan passes without issues

### Do / Avoid
| Do | Avoid |
|----|-------|
| Use `DrizzleLogger` for consistent logging | Direct database access in domain/business logic |
| Implement static `toDomainEntity` method | Business logic in adapters |
| Use `database.query` for simple queries | Hardcoded values instead of domain enums |
| | Missing error handling |

## Testing
- Mock Drizzle database operations for unit tests
- Test error propagation and logging
- Verify correct mapping between database and domain entities
- Test soft delete filtering
- Use integration tests for complex queries when needed

### Example
```typescript

export type T<ENTITY>AdapterEntity = typeof DB_SCHEMA.<ENTITY>.$inferSelect;

export class SQLite<ENTITY>Adapter implements I<ENTITY>Port {
  private readonly database;

  constructor() {
    this.database = drizzle(SQLITE_DB, {
      schema: DB_SCHEMA,
      logger: new DrizzleLogger('SQLite<ENTITY>Adapter'),
    });
  }

  public static toDomainEntity(entity: T<ENTITY>AdapterEntity): T<ENTITY>Entity {
    return {
      id: entity.id,
      // other files
    };
  }

  public async create(dto: TTaskCreateDTO): Promise<TTaskEntity> {
    const [item] = await this.database
      .insert(DB_SCHEMA.TASK)
      .values({
        title: dto.title,
        description: dto.description,
        status: dto.status,
      })
      .returning();

    return SQLiteTaskAdapter.toDomainEntity(item);
  }

  public async getById(id: TID): Promise<TTaskEntity | null> {
    const item = await this.database.query.TASK.findFirst({
      where: (row, { eq, and }) =>
        and(eq(row.id, id), eq(row.status, STATUS_ENUM.ACTIVE)),
    });

    return item ? SQLiteTaskAdapter.toDomainEntity(item) : null;
  }

  public async getAll(): Promise<TTaskEntity[]> {
    const list = await this.database.query.TASK.findMany({
      where: (row, { eq }) => eq(row.status, STATUS_ENUM.ACTIVE),
    });

    return list.map((row) => SQLiteTaskAdapter.toDomainEntity(row));
  }

  // Other port methods...
}
```
