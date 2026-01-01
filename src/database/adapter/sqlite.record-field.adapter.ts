import { eq, gte, lte, type SQLWrapper } from 'drizzle-orm';

import {
  SQLiteModuleFieldAdapter,
  type TModuleFieldAdapterEntity,
} from '@/database/adapter/sqlite.module-field.adapter';
import {
  SQLiteRecordAdapter,
  type TRecordAdapterEntity,
} from '@/database/adapter/sqlite.record.adapter';
import {
  buildAdapterClient,
  type TAppDatabase,
} from '@/database/config/database.config';
import * as DB_SCHEMA from '@/database/schema';
import {
  getStatusFromValue,
  STATUS_ENUM,
} from '@/domain/core/enum/status.enum';
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

  constructor(database?: TAppDatabase) {
    this.database = database ?? buildAdapterClient('RecordField');
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

  public async getAllByFieldID(fieldID: TID): Promise<TRecordField[]> {
    const list = await this.database.query.RECORD_FIELD.findMany({
      where: (row, { eq, and }) =>
        and(
          eq(row.status, STATUS_ENUM.ACTIVE),
          eq(row.fieldID, Number(fieldID))
        ),
      orderBy: (row, { desc }) => [desc(row.createdAt)],
    });

    return list.map(SQLiteRecordFieldAdapter.toDomainEntity);
  }

  public async batchUpsert(
    recordID: TID,
    data: TRecordFieldCreate[],
    recordDate: Date
  ): Promise<TRecordField[]> {
    const insertPayload = data.map(
      (item) =>
        ({
          recordID: Number(recordID),
          fieldID: Number(item.fieldID),
          value: item.value,
          createdAt: recordDate,
        }) satisfies TRecordFieldAdapterInsert
    );

    const inserted = await this.database
      .insert(DB_SCHEMA.RECORD_FIELD)
      .values(insertPayload)
      .returning();

    return inserted.map(SQLiteRecordFieldAdapter.toDomainEntity);
  }

  public async getAll(criteria: {
    moduleId?: TID;
    fieldId?: TID;
    recordId?: TID;
    dateFrom?: Date;
    dateTo?: Date;
    carerID?: TID;
  }): Promise<TRecordField[]> {
    const { moduleId, fieldId, recordId, dateFrom, dateTo, carerID } = criteria;

    const conditions: SQLWrapper[] = [];

    if (fieldId) {
      conditions.push(eq(DB_SCHEMA.RECORD_FIELD.fieldID, fieldId));
    }

    if (recordId) {
      conditions.push(eq(DB_SCHEMA.RECORD_FIELD.recordID, recordId));
    }

    if (moduleId) {
      conditions.push(eq(DB_SCHEMA.MODULE_FIELD.moduleID, moduleId));
    }

    if (carerID) {
      conditions.push(eq(DB_SCHEMA.RECORD.carerID, carerID));
    }

    if (dateFrom) {
      conditions.push(gte(DB_SCHEMA.RECORD.createdAt, dateFrom));
    }

    if (dateTo) {
      conditions.push(lte(DB_SCHEMA.RECORD.createdAt, dateTo));
    }

    const list = await this.database.query.RECORD_FIELD.findMany({
      where: (row, { eq, and }) =>
        and(eq(row.status, STATUS_ENUM.ACTIVE), ...conditions),
      orderBy: (row, { desc }) => [desc(row.createdAt)],
      with: {
        record: true,
        moduleField: true,
      },
    });

    return list.map(SQLiteRecordFieldAdapter.toDomainEntity);
  }
}
