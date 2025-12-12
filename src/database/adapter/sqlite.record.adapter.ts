import { and, count, eq, gte, lte, sql } from 'drizzle-orm';
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
import {
  getStatusFromValue,
  STATUS_ENUM,
} from '@/domain/core/enum/status.enum';
import type { TID } from '@/domain/core/schemas/id.schema';
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
      synced: data.synced ? STATUS_ENUM.ACTIVE : STATUS_ENUM.INACTIVE,
      status: STATUS_ENUM.ACTIVE,
    } satisfies TRecordAdapterInsert;

    const [record] = await this.database
      .insert(DB_SCHEMA.RECORD)
      .values(insertPayload)
      .returning();

    return SQLiteRecordAdapter.toDomainEntity(record);
  }

  public async getByID(id: TID): Promise<TRecord | null> {
    const record = await this.database.query.RECORD.findFirst({
      where: (row, { eq }) => eq(row.id, id),
    });
    if (!record) return null;

    return SQLiteRecordAdapter.toDomainEntity(record);
  }

  public async getAll(): Promise<TRecord[]> {
    const list = await this.database.query.RECORD.findMany();

    return list.map(SQLiteRecordAdapter.toDomainEntity);
  }

  public async getCountsByModule(criteria?: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<{ moduleID: TID; count: number }[]> {
    const { startDate, endDate } = criteria || {};

    const rows = await this.database
      .select({
        moduleID: DB_SCHEMA.RECORD.moduleID,
        count: count(DB_SCHEMA.RECORD.id).as('count'),
      })
      .from(DB_SCHEMA.RECORD)
      .where(
        and(
          eq(DB_SCHEMA.RECORD.status, STATUS_ENUM.ACTIVE),
          ...(startDate ? [gte(DB_SCHEMA.RECORD.createdAt, startDate)] : []),
          ...(endDate ? [lte(DB_SCHEMA.RECORD.createdAt, endDate)] : [])
        )
      )
      .groupBy(DB_SCHEMA.RECORD.moduleID);

    return rows.map(({ moduleID, count }) => ({
      moduleID: Number(moduleID),
      count,
    }));
  }

  public async getCountsByDay(criteria?: {
    startDate?: Date;
    endDate?: Date;
    moduleID?: number;
  }): Promise<{ day: string; count: number }[]> {
    const { startDate, endDate, moduleID } = criteria || {};
    // createdAt is stored as unix epoch seconds in DB
    const dayExpr = sql`strftime('%Y-%m-%d', datetime(${DB_SCHEMA.RECORD.createdAt}, 'unixepoch'))`;

    type TDayCountRow = { day: string; count: number };

    const rows = (await this.database
      .select({
        day: dayExpr.as('day'),
        count: count(DB_SCHEMA.RECORD.id).as('count'),
      })
      .from(DB_SCHEMA.RECORD)
      .where(
        and(
          eq(DB_SCHEMA.RECORD.status, STATUS_ENUM.ACTIVE),
          ...(startDate ? [gte(DB_SCHEMA.RECORD.createdAt, startDate)] : []),
          ...(endDate ? [lte(DB_SCHEMA.RECORD.createdAt, endDate)] : []),
          ...(moduleID ? [eq(DB_SCHEMA.RECORD.moduleID, moduleID)] : [])
        )
      )
      .groupBy(dayExpr)
      .orderBy(dayExpr)) as TDayCountRow[];

    return rows;
  }

  public async getFieldDistribution(criteria: {
    fieldID: number;
    moduleID?: number;
    startDate?: Date;
    endDate?: Date;
  }): Promise<{ value: string; count: number }[]> {
    const { fieldID, moduleID, startDate, endDate = new Date() } = criteria;
    type TFieldCountRow = { value: string; count: number };

    const rows = (await this.database
      .select({
        value: DB_SCHEMA.RECORD_FIELD.value,
        count: count(DB_SCHEMA.RECORD_FIELD.id).as('count'),
      })
      .from(DB_SCHEMA.RECORD_FIELD)
      .innerJoin(
        DB_SCHEMA.RECORD,
        eq(DB_SCHEMA.RECORD_FIELD.recordID, DB_SCHEMA.RECORD.id)
      )
      .where(
        and(
          eq(DB_SCHEMA.RECORD_FIELD.fieldID, fieldID),
          eq(DB_SCHEMA.RECORD.status, STATUS_ENUM.ACTIVE),
          ...(startDate ? [gte(DB_SCHEMA.RECORD.createdAt, startDate)] : []),
          ...(endDate ? [lte(DB_SCHEMA.RECORD.createdAt, endDate)] : []),
          ...(moduleID ? [eq(DB_SCHEMA.RECORD.moduleID, moduleID)] : [])
        )
      )
      .groupBy(DB_SCHEMA.RECORD_FIELD.value)) as TFieldCountRow[];

    return rows;
  }
}
