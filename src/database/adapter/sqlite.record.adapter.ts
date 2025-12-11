import { drizzle } from 'drizzle-orm/expo-sqlite';

import {
  SQLiteCarerAdapter,
  type TCarerAdapterEntity,
} from '@/database/adapter/sqlite.carer.adapter';
import {
  SQLiteModuleAdapter,
  type TModuleAdapterEntity,
} from '@/database/adapter/sqlite.module.adapter';
import {
  SQLiteRecordFieldAdapter,
  type TRecordFieldAdapterEntity,
} from '@/database/adapter/sqlite.record-field.adapter';
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

export type TRecordAdapterEntity = typeof DB_SCHEMA.RECORD.$inferSelect & {
  carer?: TCarerAdapterEntity;
  module?: TModuleAdapterEntity;
  recordFields?: TRecordFieldAdapterEntity[];
};

export type TRecordAdapterInsert = typeof DB_SCHEMA.RECORD.$inferInsert;

export class SQLiteRecordAdapter implements IRecordPort {
  private readonly database;

  constructor() {
    this.database = drizzle(SQLITE_DB, {
      schema: DB_SCHEMA,
      logger: new DrizzleLogger('Record Adapter'),
    });
  }

  public static toDomainEntity(entity: TRecordAdapterEntity): TRecord {
    return {
      id: entity.id,
      status: getStatusFromValue(entity.status),

      carerID: entity.carerID,
      moduleID: entity.moduleID,

      data: entity.data,
      synced: Boolean(entity.synced),

      ...(entity.carer && {
        carer: SQLiteCarerAdapter.toDomainEntity(entity.carer),
      }),

      ...(entity.module && {
        module: SQLiteModuleAdapter.toDomainEntity(entity.module),
      }),

      ...(entity.recordFields && {
        recordFields: entity.recordFields.map(
          SQLiteRecordFieldAdapter.toDomainEntity
        ),
      }),
    } satisfies TRecord;
  }

  public async create(data: TRecordCreate): Promise<TRecord> {
    const insertPayload = {
      moduleID: Number(data.moduleID),
      carerID: Number(data.carerID),
      data: data.data,
      synced: data.synced ? 1 : 0,
      status: 1,
    } satisfies TRecordAdapterInsert;

    const [record] = await this.database
      .insert(DB_SCHEMA.RECORD)
      .values(insertPayload)
      .returning();

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
    const list = (await this.database.query.RECORD.findMany(
      {}
    )) as TRecordAdapterEntity[];
    return list.map(SQLiteRecordAdapter.toDomainEntity);
  }

  // Aggregations for reporting
  public async getCountsByModule(opts?: {
    start?: number;
    end?: number;
  }): Promise<{ moduleID: number; count: number }[]> {
    const { start = 0, end = Math.floor(Date.now() / 1000) } = opts || {};
    // Use Drizzle query to fetch active records and then group in memory.
    const recordList = await this.database.query.RECORD.findMany({
      where: (row, { eq }) => eq(row.status, 1),
    });

    const map: Record<number, number> = {};

    for (const record of recordList) {
      const created = Number(record.createdAt ?? 0);
      if (created < start || created > end) continue;
      map[record.moduleID] = (map[record.moduleID] ?? 0) + 1;
    }

    return Object.entries(map).map(([moduleID, count]) => ({
      moduleID: Number(moduleID),
      count,
    }));
  }

  public async getCountsByDay(opts?: {
    start?: number;
    end?: number;
    moduleID?: number;
  }): Promise<{ day: string; count: number }[]> {
    const {
      start = 0,
      end = Math.floor(Date.now() / 1000),
      moduleID,
    } = opts || {};
    // Fetch active records via Drizzle and bucket by local date.
    const recordList = await this.database.query.RECORD.findMany({
      where: (row, { eq }) => eq(row.status, 1),
    });

    const map: Record<string, number> = {};
    for (const record of recordList) {
      const created = Number(record.createdAt ?? 0);
      if (created < start || created > end) continue;
      if (moduleID && record.moduleID !== moduleID) continue;

      const ts = created * 1000;
      const d = new Date(ts);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = `${y}-${m}-${String(d.getDate()).padStart(2, '0')}`; // local YYYY-MM-DD
      map[day] = (map[day] ?? 0) + 1;
    }

    return Object.entries(map)
      .map(([day, count]) => ({ day, count }))
      .sort((a, b) => a.day.localeCompare(b.day));
  }

  public async getFieldDistribution(opts: {
    fieldID: number;
    moduleID?: number;
    start?: number;
    end?: number;
  }): Promise<{ value: string; count: number }[]> {
    const {
      fieldID,
      moduleID,
      start = 0,
      end = Math.floor(Date.now() / 1000),
    } = opts;
    // Fetch active records in range (Drizzle) and build a set of valid record IDs.
    const recordList = await this.database.query.RECORD.findMany({
      where: (row, { eq }) => eq(row.status, 1),
    });

    const validRecordIds = new Set<number>();

    for (const record of recordList) {
      const created = Number(record.createdAt ?? 0);
      if (created < start || created > end) continue;
      if (moduleID && record.moduleID !== moduleID) continue;
      validRecordIds.add(record.id);
    }

    // Fetch record fields for the given fieldID and count values where recordID is valid
    const recordFieldList = await this.database.query.RECORD_FIELD.findMany({
      where: (row, { eq }) => eq(row.fieldID, fieldID),
    });

    const map: Record<string, number> = {};
    for (const recordField of recordFieldList) {
      if (!validRecordIds.has(recordField.recordID)) continue;
      const val = String(recordField.value);
      map[val] = (map[val] ?? 0) + 1;
    }

    return Object.entries(map).map(([value, count]) => ({ value, count }));
  }
}
