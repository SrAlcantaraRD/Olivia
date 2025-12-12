import { inArray } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';

import {
  SQLiteModuleFieldAdapter,
  type TModuleFieldAdapterEntity,
} from '@/database/adapter/sqlite.module-field.adapter';
import {
  SQLiteRecordAdapter,
  type TRecordAdapterEntity,
} from '@/database/adapter/sqlite.record.adapter';
import { SQLITE_DB } from '@/database/config/database.config';
import * as DB_SCHEMA from '@/database/schema';
import { DrizzleLogger } from '@/domain/core/adapter/drizzle.logger';
import {
  getStatusFromValue,
  STATUS_ENUM,
} from '@/domain/core/enum/status.enum';
import type { TID } from '@/domain/core/schemas/id.schema';
import type { TModule } from '@/domain/module/entity/module.entity';
import { getModuleKeyFromValue } from '@/domain/module/enum/module-key.enum';
import type { IModulePort } from '@/domain/module/port/module.port';

export type TModuleAdapterEntity = typeof DB_SCHEMA.MODULE.$inferSelect & {
  fieldList?: TModuleFieldAdapterEntity[];
  recordList?: TRecordAdapterEntity[];
};

export class SQLiteModuleAdapter implements IModulePort {
  private readonly database;

  constructor() {
    this.database = drizzle(SQLITE_DB, {
      schema: DB_SCHEMA,
      logger: new DrizzleLogger('Module Adapter'),
    });
  }

  public static toDomainEntity(entity: TModuleAdapterEntity): TModule {
    return {
      id: entity.id,
      status: getStatusFromValue(entity.status),

      code: getModuleKeyFromValue(entity.code),
      name: entity.name,
      description: entity.description,
      isActive: entity.active === STATUS_ENUM.ACTIVE,

      ...(entity.fieldList && {
        fieldList: entity.fieldList.map(
          SQLiteModuleFieldAdapter.toDomainEntity
        ),
      }),

      ...(entity.recordList && {
        recordList: entity.recordList.map(SQLiteRecordAdapter.toDomainEntity),
      }),
    } satisfies TModule;
  }

  public async getAll(): Promise<TModule[]> {
    const list = await this.database.query.MODULE.findMany({
      with: {
        fieldList: true,
      },
    });

    return list.map(SQLiteModuleAdapter.toDomainEntity);
  }

  public async batchActivate(idList: TID[]): Promise<void> {
    if (idList.length === 0) return;

    await this.database
      .update(DB_SCHEMA.MODULE)
      .set({ active: STATUS_ENUM.ACTIVE })
      .where(inArray(DB_SCHEMA.MODULE.id, idList));
  }
}
