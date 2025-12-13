import { drizzle } from 'drizzle-orm/expo-sqlite';

import SQLiteModuleFieldAdapter, {
  type TModuleFieldAdapterEntity,
} from '@/database/adapter/sqlite.module-field.adapter';
import {
  SQLiteRecordAdapter,
  type TRecordAdapterEntity,
} from '@/database/adapter/sqlite.record.adapter';
import { SQLITE_DB } from '@/database/config/database.config';
import * as DB_SCHEMA from '@/database/schema';
import { DrizzleLogger } from '@/domain/core/adapter/drizzle.logger';
import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import { getStatusFromValue } from '@/domain/core/enum/status.enum';
import type { TID } from '@/domain/core/schemas/id.schema';
import type {
  TRecordField,
  TRecordFieldCreate,
} from '@/domain/module/entity/record-field.entity';
import type { IRecordFieldPort } from '@/domain/module/port/record-field.port';

export type TRecordFieldAdapterEntity =
  typeof DB_SCHEMA.RECORD_FIELD.$inferSelect & {
    record?: TRecordAdapterEntity;
    moduleField?: TModuleFieldAdapterEntity;
  };

export type TRecordFieldAdapterInsert =
  typeof DB_SCHEMA.RECORD_FIELD.$inferInsert;

export class SQLiteRecordFieldAdapter implements IRecordFieldPort {
  private readonly database;

  constructor() {
    this.database = drizzle(SQLITE_DB, {
      schema: DB_SCHEMA,
      logger: new DrizzleLogger('Module Field Adapter'),
    });
  }

  public static toDomainEntity(
    entity: TRecordFieldAdapterEntity
  ): TRecordField {
    return {
      id: entity.id,
      status: getStatusFromValue(entity.status),
      createdAt: entity.createdAt,

      recordID: entity.recordID,
      fieldID: entity.fieldID,

      value: entity.value,

      ...(entity.record && {
        record: SQLiteRecordAdapter.toDomainEntity(entity.record),
      }),

      ...(entity.moduleField && {
        moduleField: SQLiteModuleFieldAdapter.toDomainEntity(
          entity.moduleField
        ),
      }),
    } satisfies TRecordField;
  }

  public async getAll(): Promise<TRecordField[]> {
    const list = await this.database.query.RECORD_FIELD.findMany({
      where: (row, { eq }) => eq(row.status, 1),
    });

    BASE_LOGGER.error(
      `Fetching all record fields from the database: ${list.length} found.`
    );

    return list.map(SQLiteRecordFieldAdapter.toDomainEntity);
  }

  public async batchCreate(
    recordID: TID,
    data: TRecordFieldCreate[]
  ): Promise<TRecordField[]> {
    const insertPayload = data.map(
      (item) =>
        ({
          recordID: Number(recordID),
          fieldID: Number(item.fieldID),
          value: item.value,
        }) satisfies TRecordFieldAdapterInsert
    );

    const inserted = await this.database
      .insert(DB_SCHEMA.RECORD_FIELD)
      .values(insertPayload)
      .returning();

    return inserted.map(SQLiteRecordFieldAdapter.toDomainEntity);
  }
}
