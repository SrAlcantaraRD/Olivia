import { inArray } from 'drizzle-orm';

import {
  SQLiteModuleAdapter,
  type TModuleAdapterEntity,
} from '@/database/adapter/sqlite.module.adapter';
import {
  SQLiteRecordFieldAdapter,
  type TRecordFieldAdapterEntity,
} from '@/database/adapter/sqlite.record-field.adapter';
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
import type { TModuleField } from '@/domain/module/entity/module-field.entity';
import {
  getModuleFieldTypeFromValue,
  MODULE_FIELD_TYPE_ENUM,
} from '@/domain/module/enum/module-field-type.enum';
import type { IModuleFieldPort } from '@/domain/module/port/module-field.port';

export type TModuleFieldAdapterEntity =
  typeof DB_SCHEMA.MODULE_FIELD.$inferSelect & {
    module?: TModuleAdapterEntity;
    recordFieldList?: TRecordFieldAdapterEntity[];
  };

export class SQLiteModuleFieldAdapter implements IModuleFieldPort {
  private readonly database;

  constructor(database?: TAppDatabase) {
    this.database = database ?? buildAdapterClient('Module Field');
  }

  public static toDomainEntity(
    entity: TModuleFieldAdapterEntity
  ): TModuleField {
    // Normalize DB type strings to domain enum values
    let normalizedType = entity.type;

    // DB seeds sometimes store 'enum' for select and 'string' for text; normalize these values
    const lower = (entity.type ?? '').toLowerCase();
    switch (lower) {
      case 'enum':
        normalizedType = MODULE_FIELD_TYPE_ENUM.SELECT;
        break;
      case 'string':
        normalizedType = MODULE_FIELD_TYPE_ENUM.TEXT;
        break;
      default:
        // if the db contains uppercase domain values, keep as-is
        normalizedType = entity.type as MODULE_FIELD_TYPE_ENUM;
    }

    // Use domain enum validator to ensure it's valid; if invalid it will throw a domain error
    const type = getModuleFieldTypeFromValue(normalizedType);

    return {
      id: entity.id,
      status: getStatusFromValue(entity.status),
      createdAt: entity.createdAt,

      moduleId: entity.moduleID,
      code: entity.code,
      description: entity.description ?? '',
      type,
      values: entity.values ?? '',
      required: Boolean(Number(entity.required)),
      order: Number(entity.order),

      ...(entity.module && {
        module: SQLiteModuleAdapter.toDomainEntity(entity.module),
      }),

      ...(entity.recordFieldList && {
        recordFieldList: entity.recordFieldList.map(
          SQLiteRecordFieldAdapter.toDomainEntity
        ),
      }),
    } satisfies TModuleField;
  }

  public async batchActivate(idList: TID[]): Promise<void> {
    if (idList.length === 0) return;

    await this.database
      .update(DB_SCHEMA.MODULE_FIELD)
      .set({ status: STATUS_ENUM.ACTIVE })
      .where(inArray(DB_SCHEMA.MODULE_FIELD.id, idList));
  }

  public async getAllByModuleId(moduleId: TID): Promise<TModuleField[]> {
    const list = await this.database.query.MODULE_FIELD.findMany({
      where: (row, { eq }) => eq(row.moduleID, moduleId),
      orderBy: (row, { asc }) => asc(row.order),
    });

    return list.map(SQLiteModuleFieldAdapter.toDomainEntity);
  }

  public async batchDeactivate(): Promise<void> {
    await this.database
      .update(DB_SCHEMA.MODULE_FIELD)
      .set({ status: STATUS_ENUM.INACTIVE });
  }
}
