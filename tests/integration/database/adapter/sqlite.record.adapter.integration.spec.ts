import { jest } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';

// Prevent native Expo SQLite from loading in Node test environment.
jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn(() => ({})),
}));

// Prevent React Native async logger + native deps from running in Node.
jest.mock('@/domain/core/adapter/logger.adapter', () => ({
  BASE_LOGGER: {
    setSeverity: jest.fn(),
    extend: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

import Database from 'better-sqlite3';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/better-sqlite3';

import { SQLiteRecordAdapter } from '@/database/adapter/sqlite.record.adapter';
import * as DB_SCHEMA from '@/database/schema';
import { CARER_TYPE_ENUM } from '@/domain/carer/enum/carer-type.enums';
import { STATUS_ENUM } from '@/domain/core/enum/status.enum';
import { MODULE_KEY_ENUM } from '@/domain/module/enum/module-key.enum';

const MIGRATIONS_DIR = path.resolve(
  process.cwd(),
  'src',
  'database',
  'migrations'
);

const applySqlMigrations = (sqlite: Database.Database): void => {
  const migrationFiles = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((file) => /^\d+_.*\.sql$/.test(file))
    .sort((a, b) => a.localeCompare(b));

  for (const fileName of migrationFiles) {
    const sqlText = fs.readFileSync(
      path.join(MIGRATIONS_DIR, fileName),
      'utf8'
    );

    const statements = sqlText
      .split(/-->\s*statement-breakpoint\s*/g)
      .map((s) => s.trim())
      .filter(Boolean);

    for (const statement of statements) {
      sqlite.exec(statement);
    }
  }
};

describe('[Integration][Adapter] SQLiteRecordAdapter', () => {
  it('persists and reads records against a real SQLite DB', async () => {
    const sqlite = new Database(':memory:');
    sqlite.pragma('foreign_keys = ON');
    applySqlMigrations(sqlite);

    const db = drizzle(sqlite, { schema: DB_SCHEMA });
    const adapter = new SQLiteRecordAdapter(db);

    const [seededModule] = await db
      .select()
      .from(DB_SCHEMA.MODULE)
      .where(eq(DB_SCHEMA.MODULE.code, MODULE_KEY_ENUM.CIC))
      .limit(1);

    if (!seededModule) {
      throw new Error('Seeded CIC module not found after migrations');
    }

    const moduleID = Number(seededModule.id);
    const carerID = 9999;

    await db.insert(DB_SCHEMA.CARER).values({
      id: carerID,
      name: 'Test carer',
      type: CARER_TYPE_ENUM.ADMIN,
      isPrimary: 1,
      pinHash: 'hash',
      status: STATUS_ENUM.ACTIVE,
    });

    const created = await adapter.create({
      moduleID,
      carerID,
      data: '{"hello":"world"}',
      synced: false,
      fieldList: [],
    });

    expect(created.id).toBeGreaterThan(0);
    expect(created.moduleID).toBe(moduleID);
    expect(created.carerID).toBe(carerID);
    expect(created.synced).toBe(false);
    expect(created.createdAt).toBeInstanceOf(Date);

    const fetched = await adapter.getByID(created.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.id).toBe(created.id);
    expect(fetched?.moduleID).toBe(moduleID);
    expect(fetched?.carerID).toBe(carerID);
    expect(fetched?.createdAt).toBeInstanceOf(Date);
  });
});
