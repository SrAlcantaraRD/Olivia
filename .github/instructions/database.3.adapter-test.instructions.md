---
applyTo: 'src/database/**/*.adapter.spec.ts'
description: "Instructions for writing database adapter tests with Drizzle mocks or integration"
---

# Database Adapter Test Instructions

## Purpose
Validate adapter logic including correct Drizzle queries, entity mapping, soft-delete filters, and error propagation through comprehensive unit and integration tests.

## Artifacts
- `test/unit-test/database/adapter/<root>.adapter.spec.ts`
- `test/integration/database/adapter/<tech>.<root>.adapter.spec.ts`
- Mock factories for database entities and domain objects.

## Naming
- Unit tests: `<root>.adapter.spec.ts` (e.g., `task.adapter.spec.ts`)
- Integration tests: `<tech>.<root>.adapter.spec.ts` (e.g., `sqlite.task.adapter.spec.ts`)

## Rules

### Test Types
- **Unit tests**: Mock-based tests for `toDomainEntity` function and isolated logic
- **Integration tests**: Real database tests for full adapter functionality
- Separate unit and integration tests into different files

### Unit Tests (toDomainEntity focus)
- Test static `toDomainEntity` method with various entity states
- Verify enum conversions and field mappings
- Test edge cases (null/undefined values, date conversions)
- Mock all external dependencies

### Integration Tests (Full adapter functionality)
- Test complete adapter methods with real database
- Verify query execution, filtering, and data persistence
- Test error scenarios with actual database constraints
- Include performance and load testing for critical paths

### Setup
- Unit tests: Mock Drizzle client and database connections
- Integration tests: Use test database with proper cleanup
- Create mock factories for consistent test data
- Use Jest's mocking capabilities for external dependencies

### Test Cases
- **Unit**: Entity mapping accuracy, enum conversions, null handling
- **Integration**: CRUD operations, query filtering, transaction handling
- Happy path, error path, and edge cases for both levels

### Assertions
- **Unit**: Correct entity transformation and type safety
- **Integration**: Proper database state changes and query results
- Verify logging and error propagation in both contexts

### Quality Gates
- No use of `any` type in tests
- Minimal mocking in unit tests; prefer real objects where possible
- Pass Codacy static analysis scans
- Maintain high test coverage (>80%) across both test levels

### Example

#### Unit Test Example (`test/unit-test/database/adapter/task.adapter.spec.ts`)
```typescript
import { SQLiteTaskAdapter } from '@/database/adapter/sqlite.task.adapter';
import { getTaskStatusFromValue } from '@/domain/task/enum/task-status.enum';
import { STATUS_ENUM } from '@/domain/core/enum/status.enum';

describe('SQLiteTaskAdapter - Unit Tests', () => {
  describe('toDomainEntity', () => {
    it('should map database entity to domain entity correctly', () => {
      const dbEntity = {
        id: 1,
        uuid: 'uuid-123',
        title: 'Test Task',
        description: 'Test Description',
        status: 'ACTIVE',
        createdAt: 1234567890,
        updatedAt: 1234567890,
        deletedAt: null,
      };

      const result = SQLiteTaskAdapter.toDomainEntity(dbEntity);

      expect(result).toEqual({
        id: 1,
        uuid: 'uuid-123',
        title: 'Test Task',
        description: 'Test Description',
        status: getTaskStatusFromValue('ACTIVE'),
        createdAt: new Date(1234567890),
        updatedAt: new Date(1234567890),
        deletedAt: undefined,
      });
    });

    it('should handle null deletedAt as undefined', () => {
      const dbEntity = {
        id: 1,
        uuid: 'uuid-123',
        title: 'Test Task',
        description: null,
        status: 'COMPLETED',
        createdAt: 1234567890,
        updatedAt: null,
        deletedAt: null,
      };

      const result = SQLiteTaskAdapter.toDomainEntity(dbEntity);

      expect(result.deletedAt).toBeUndefined();
      expect(result.updatedAt).toBeUndefined();
      expect(result.description).toBeUndefined();
    });
  });
});
```

#### Integration Test Example (`test/integration/database/adapter/sqlite.task.adapter.spec.ts`)
```typescript
import { SQLiteTaskAdapter } from '@/database/adapter/sqlite.task.adapter';
import { TTaskCreateDTO } from '@/domain/task/dto/task.dto';
import { cleanupTestDatabase, setupTestDatabase } from '@/test/utils/database';

describe('SQLiteTaskAdapter - Integration Tests', () => {
  let adapter: SQLiteTaskAdapter;

  beforeAll(async () => {
    await setupTestDatabase();
    adapter = new SQLiteTaskAdapter();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  beforeEach(async () => {
    // Clean up data between tests
    await adapter.deleteAll(); // Assuming this method exists
  });

  describe('create and getById', () => {
    it('should create and retrieve a task', async () => {
      const createDto: TTaskCreateDTO = {
        title: 'Integration Test Task',
        description: 'Created in integration test',
        status: 'ACTIVE',
      };

      const created = await adapter.create(createDto);
      expect(created.title).toBe(createDto.title);
      expect(created.status).toBeDefined();

      const retrieved = await adapter.getById(created.id);
      expect(retrieved).toEqual(created);
    });
  });

  describe('getAll', () => {
    it('should return only active tasks', async () => {
      // Create multiple tasks
      await adapter.create({ title: 'Active Task 1', status: 'ACTIVE' });
      await adapter.create({ title: 'Active Task 2', status: 'ACTIVE' });
      const completedTask = await adapter.create({ title: 'Completed Task', status: 'COMPLETED' });

      // Soft delete one task
      await adapter.delete(completedTask.id);

      const allTasks = await adapter.getAll();
      expect(allTasks).toHaveLength(2);
      expect(allTasks.every(task => task.status !== 'DELETED')).toBe(true);
    });
  });
});
```
