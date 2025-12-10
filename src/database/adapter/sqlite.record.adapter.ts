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
    const insertPayload = {
      moduleID: Number(data.moduleID),
      carerID: Number(data.carerID),
      data: data.data,
      synced: data.synced ? 1 : 0,
      status: 1,
    } satisfies TRecordAdapterInsert;

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
    const sql = `SELECT module_id as moduleID, COUNT(1) as count FROM record WHERE status = 1 AND created_at BETWEEN ? AND ? GROUP BY module_id`;
    try {
      const rawExec: unknown =
        (this.database as unknown as { execute?: unknown }).execute ??
        (this.database as unknown as { run?: unknown }).run ??
        (this.database as unknown as { all?: unknown }).all;
      if (typeof rawExec === 'function') {
        const fn = rawExec as (
          sql: string,
          params?: unknown[]
        ) => Promise<unknown>;
        const rows = await fn.call(this.database, sql, [start, end]);
        // Normalize rows if needed (SQLite returns { rows } sometimes)
        const normalize = (rows as unknown as { rows?: unknown[] })?.rows
          ? (rows as unknown as { rows?: unknown[] }).rows
          : (rows as unknown as unknown[]);
        if (Array.isArray(normalize))
          return normalize.map((r: unknown) => {
            const row = r as { moduleID: number; count: number };
            return { moduleID: Number(row.moduleID), count: Number(row.count) };
          });
      }
    } catch (err) {
      // fallback to in-memory grouping
    }

    // fallback to in-memory grouping
    const list = (await this.database.query.RECORD.findMany(
      {}
    )) as TRecordAdapterEntity[];
    const map: Record<number, number> = {};
    list
      .filter(
        (r) =>
          Number(r.createdAt ?? 0) >= start && Number(r.createdAt ?? 0) <= end
      )
      .forEach((r) => {
        map[r.moduleID] = (map[r.moduleID] ?? 0) + 1;
      });

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
    const sql = `SELECT strftime('%Y-%m-%d', r.created_at, 'unixepoch') AS day, COUNT(1) as count FROM record r WHERE r.status = 1 AND (? IS NULL OR r.module_id = ?) AND r.created_at BETWEEN ? AND ? GROUP BY day ORDER BY day ASC`;
    try {
      const rawExec: unknown =
        (this.database as unknown as { execute?: unknown }).execute ??
        (this.database as unknown as { run?: unknown }).run ??
        (this.database as unknown as { all?: unknown }).all;
      if (typeof rawExec === 'function') {
        const fn = rawExec as (
          sql: string,
          params?: unknown[]
        ) => Promise<unknown>;
        const rows = await fn.call(this.database, sql, [
          moduleID ?? null,
          moduleID ?? null,
          start,
          end,
        ]);
        const normalize = (rows as unknown as { rows?: unknown[] })?.rows
          ? (rows as unknown as { rows?: unknown[] }).rows
          : (rows as unknown as unknown[]);
        if (Array.isArray(normalize))
          return normalize.map((r: unknown) => ({
            day: (r as { day: string }).day,
            count: Number((r as { count: number }).count),
          }));
      }
    } catch (err) {
      // fallback to in-memory grouping
    }

    const list = (await this.database.query.RECORD.findMany(
      {}
    )) as TRecordAdapterEntity[];
    const map: Record<string, number> = {};
    list
      .filter((r) => {
        const created = Number(r.createdAt ?? 0);
        if (created < start || created > end) return false;
        if (moduleID && r.moduleID !== moduleID) return false;
        return true;
      })
      .forEach((r) => {
        const ts = Number(r.createdAt ?? 0) * 1000;
        const day = new Date(ts).toISOString().slice(0, 10); // UTC YYYY-MM-DD
        map[day] = (map[day] ?? 0) + 1;
      });

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

    // Try DB aggregation first
    const sql = `SELECT rf.value as value, COUNT(1) as count FROM record_field rf JOIN record r ON r.id = rf.record_id WHERE rf.field_id = ? AND r.status = 1 AND r.created_at BETWEEN ? AND ? ${moduleID ? 'AND r.module_id = ?' : ''} GROUP BY rf.value ORDER BY count DESC`;
    try {
      const rawExec: unknown =
        (this.database as unknown as { execute?: unknown }).execute ??
        (this.database as unknown as { run?: unknown }).run ??
        (this.database as unknown as { all?: unknown }).all;
      if (typeof rawExec === 'function') {
        const fn = rawExec as (
          sql: string,
          params?: unknown[]
        ) => Promise<unknown>;
        const params = moduleID
          ? [fieldID, start, end, moduleID]
          : [fieldID, start, end];
        const rows = await fn.call(this.database, sql, params);
        const normalize = (rows as unknown as { rows?: unknown[] })?.rows
          ? (rows as unknown as { rows?: unknown[] }).rows
          : (rows as unknown as unknown[]);
        if (Array.isArray(normalize))
          return normalize.map((r: unknown) => ({
            value: String((r as { value: string }).value),
            count: Number((r as { count: number }).count),
          }));
      }
    } catch (err) {
      // fallback to in-memory
    }

    // Fetch records within time range and optional module filter (fallback)
    const records = (await this.database.query.RECORD.findMany(
      {}
    )) as TRecordAdapterEntity[];
    const validRecordIds = new Set(
      records
        .filter((r) => {
          const created = Number(r.createdAt ?? 0);
          if (created < start || created > end) return false;
          if (moduleID && r.moduleID !== moduleID) return false;
          return true;
        })
        .map((r) => r.id)
    );

    // Fetch record_fields for the given fieldID
    const recordFields = await this.database.query.RECORD_FIELD.findMany({
      where: (row, { eq }) => eq(row.fieldID, fieldID),
    });

    const map: Record<string, number> = {};
    recordFields
      .filter((rf) => validRecordIds.has(rf.recordID))
      .forEach((rf) => {
        const val = String(rf.value);
        map[val] = (map[val] ?? 0) + 1;
      });

    return Object.entries(map).map(([value, count]) => ({ value, count }));
  }
}

export default SQLiteRecordAdapter;
