import { drizzle } from 'drizzle-orm/expo-sqlite';

import { SQLITE_DB } from '@/database/config/database.config';
import * as DB_SCHEMA from '@/database/schema';
import { DrizzleLogger } from '@/domain/core/adapter/drizzle.logger';
import { getStatusFromValue } from '@/domain/core/enum/status.enum';
import type {
  TRecord,
  TRecordCreate,
} from '@/domain/module/entity/record.entity';
import type { IRecordPort } from '@/domain/module/port/record.port';
// NOTE: no direct usage of named schema imported — keeping DB_SCHEMA used to reference tables

export type TRecordAdapterEntity = typeof DB_SCHEMA.RECORD.$inferSelect;
export type TRecordAdapterInsert = typeof DB_SCHEMA.RECORD.$inferInsert;

export class SQLiteRecordAdapter implements IRecordPort {
  private readonly database;

  constructor() {
    this.database = drizzle(SQLITE_DB, {
      schema: DB_SCHEMA,
      logger: new DrizzleLogger('Record Adapter'),
    });
  }

  private static toDomainEntity(entity: TRecordAdapterEntity): TRecord {
    return {
      id: entity.id,
      moduleID: entity.moduleID,
      data: entity.data,
      synced: Boolean(entity.synced),
      status: getStatusFromValue(entity.status),
    } as TRecord;
  }

  public async create(data: TRecordCreate): Promise<TRecord> {
    const insertPayload: TRecordAdapterInsert = {
      moduleID: Number(data.moduleID),
      data: data.data,
      synced: data.synced ? 1 : 0,
      status: 1,
    } as unknown as TRecordAdapterInsert;

    const inserted = await this.database
      .insert(DB_SCHEMA.RECORD)
      .values(insertPayload)
      .returning();

    const record = inserted[0];

    // Parse payload to create record fields if present as JSON object
    let fields: Record<number, string> = {};
    try {
      const parsed = JSON.parse(data.data);
      if (parsed?.values) fields = parsed.values;
    } catch (err) {
      // nop
    }

    const fieldEntries = Object.entries(fields).map(([key, value]) => ({
      recordID: record.id,
      fieldID: Number(key),
      value: String(value),
      status: 1,
    }));

    if (fieldEntries.length > 0) {
      await this.database.insert(DB_SCHEMA.RECORD_FIELD).values(fieldEntries);
    }

    return SQLiteRecordAdapter.toDomainEntity(record);
  }

  public async getById(id: number): Promise<TRecord | null> {
    const record = await this.database.query.RECORD.findFirst({
      where: (row, { eq }) => eq(row.id, id),
    });
    if (!record) return null;

    return SQLiteRecordAdapter.toDomainEntity(record);
  }

  public async getAll(): Promise<TRecord[]> {
    const list = await this.database.query.RECORD.findMany({});
    return list.map(SQLiteRecordAdapter.toDomainEntity);
  }
}

export default SQLiteRecordAdapter;
