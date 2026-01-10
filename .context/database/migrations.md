# Migration strategy, rollback procedures

The Oliva app uses Drizzle ORM with SQLite for schema migrations, optimized for local-first mobile applications.

## Drizzle configuration

```typescript
// src/database/drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/database/schema/index.ts',
  out: './src/database/migrations',
  dialect: 'sqlite',
  driver: 'expo',
  dbCredentials: {
    url: './SQLite.db',
  },
  verbose: true,
  strict: true,
});
```

**Configuration options:**
- `dialect: 'sqlite'`: SQLite-specific SQL generation
- `driver: 'expo'`: Expo SQLite driver integration
- `verbose: true`: Detailed migration logs
- `strict: true`: Enforce schema consistency

## Migration generation workflow

### Generate migrations from schema changes

```bash
# Generate migration files from schema changes
pnpm db:generate

# Output: src/database/migrations/001_initial.ts
#         src/database/migrations/002_add_patient_relationship.ts
```

### Migration file structure

```typescript
// src/database/migrations/001_initial.ts
import { sql } from 'drizzle-orm';

export const migration_001_initial = {
  name: '001_initial',
  up: async (db: ExpoSQLiteDatabase) => {
    await db.run(sql`
      CREATE TABLE carers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        pin_hash TEXT,
        type TEXT NOT NULL,
        is_primary INTEGER NOT NULL DEFAULT 0,
        status INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        birth_date INTEGER NOT NULL,
        sex TEXT NOT NULL,
        autonomy_level TEXT NOT NULL,
        primary_carer_id INTEGER REFERENCES carers(id),
        status INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      -- Create indexes
      CREATE INDEX carer_email_idx ON carers(email);
      CREATE INDEX carer_primary_idx ON carers(is_primary);
    `);
  },
  down: async (db: ExpoSQLiteDatabase) => {
    await db.run(sql`DROP TABLE IF EXISTS patients;`);
    await db.run(sql`DROP TABLE IF EXISTS carers;`);
  },
};
```

## Migration execution on app startup

### Automatic migration runner

```typescript
// src/database/execute-migrations.ts
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { migrations } from './migrations/index';

export const executeMigrations = async (db: ExpoSQLiteDatabase) => {
  try {
    await useMigrations(db, migrations);
    console.log('Migrations executed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    // Fallback: drop and recreate database
    await dropDatabase(db);
    throw error; // App will restart and retry
  }
};
```

### Migration registry

```typescript
// src/database/migrations/index.ts
import { migration_001_initial } from './001_initial';
import { migration_002_add_patient_relationship } from './002_add_patient_relationship';

export const migrations = [
  migration_001_initial,
  migration_002_add_patient_relationship,
];

export type Migration = typeof migrations[number];
```

## Rollback procedures

### Manual rollback for development

```typescript
// Rollback specific migration
export const rollbackMigration = async (
  db: ExpoSQLiteDatabase,
  migrationName: string
) => {
  const migration = migrations.find(m => m.name === migrationName);
  if (!migration) {
    throw new Error(`Migration ${migrationName} not found`);
  }

  await migration.down(db);
  console.log(`Rolled back migration: ${migrationName}`);
};
```

### Database reset for testing

```typescript
// src/database/config/drop-database.config.ts
export const dropDatabase = async (db: ExpoSQLiteDatabase) => {
  // Get all table names except system tables
  const tables = await db.run(sql`
    SELECT name FROM sqlite_master
    WHERE type='table' AND name NOT LIKE 'sqlite_%'
  `);

  // Drop all tables
  for (const table of tables) {
    await db.run(sql`DROP TABLE IF EXISTS ${table.name}`);
  }

  // Reset migration tracking
  await db.run(sql`DELETE FROM __drizzle_migrations`);
};
```

## Migration testing strategy

### Test migrations in isolation

```typescript
// tests/integration/migrations.test.ts
describe('Database Migrations', () => {
  let testDb: ExpoSQLiteDatabase;

  beforeEach(async () => {
    testDb = createTestDatabase();
  });

  afterEach(async () => {
    await dropDatabase(testDb);
  });

  it('should execute initial migration successfully', async () => {
    await migration_001_initial.up(testDb);

    const carers = await testDb.select().from(carersTable);
    expect(carers).toHaveLength(0);
  });

  it('should rollback initial migration', async () => {
    await migration_001_initial.up(testDb);
    await migration_001_initial.down(testDb);

    // Verify tables are dropped
    const result = await testDb.run(sql`
      SELECT name FROM sqlite_master WHERE type='table' AND name='carers'
    `);
    expect(result.rows).toHaveLength(0);
  });
});
Trade-off: Loss of local data on migration failure.

### Why Drizzle over raw SQL?

- **Type safety**: Schema changes caught at compile time
- **Cross-platform**: Consistent migration format
- **Tooling**: Built-in migration generation and validation

Trade-off: Additional dependency and learning curve.

### Why transaction batching?

- **Performance**: Reduce I/O operations during migrations
- **Atomicity**: All-or-nothing migration execution
- **Consistency**: Database never in partially migrated state

Trade-off: Larger transactions can cause timeouts.

### Why integrity checks?

- **Data quality**: Catch migration bugs early
- **Debugging**: Clear error messages for migration issues
- **Compliance**: Ensure medical data integrity

Trade-off: Additional startup time and complexity.
