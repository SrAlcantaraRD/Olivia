import { inArray } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';

import {
  SQLiteModuleFieldAdapter,
  type TModuleFieldAdapterEntity,
} from '@/database/adapter/sqlite.module-field.adapter';
import type { TRecordRow } from '@/database/adapter/common.adapter';
import { mapRecordRowToDomain } from '@/database/adapter/common.adapter';
import { SQLITE_DB } from '@/database/config/database.config';
import * as DB_SCHEMA from '@/database/schema';
import { DrizzleLogger } from '@/domain/core/adapter/drizzle.logger';
import {
  getStatusFromValue,
  STATUS_ENUM,
} from '@/domain/core/enum/status.enum';
import type { TID } from '@/domain/core/schemas/id.schema';
import type { TModule } from '@/domain/module/entity/module.entity';
import type { TModuleField } from '@/domain/module/entity/module-field.entity';
import { getModuleKeyFromValue } from '@/domain/module/enum/module-key.enum';
import type { IModulePort } from '@/domain/module/port/module.port';
import type { IModuleFieldPort } from '@/domain/module/port/module-field.port';

export type TModuleAdapterEntity = typeof DB_SCHEMA.MODULE.$inferSelect & {
  fieldList?: TModuleFieldAdapterEntity[];
  recordList?: TRecordRow[];
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
        recordList: entity.recordList.map(mapRecordRowToDomain),
      }),
    } satisfies TModule;
  }

  public async getAll(): Promise<TModule[]> {
    const list = await this.database.select().from(DB_SCHEMA.MODULE);

    // Load all module fields and group them by module ID for efficiency
    const moduleFieldAdapter: IModuleFieldPort = new SQLiteModuleFieldAdapter();
    const allFields: TModuleField[] = await moduleFieldAdapter.getAll();
    const fieldsByModule: Record<number, TModuleField[]> = {};
    allFields.forEach((f) => {
      if (!fieldsByModule[f.moduleId]) fieldsByModule[f.moduleId] = [];
      fieldsByModule[f.moduleId].push(f);
    });

    return list.map((dbModule) => {
      const module = SQLiteModuleAdapter.toDomainEntity(dbModule);
      return {
        ...module,
        fieldList: fieldsByModule[module.id] ?? [],
      };
    });
  }

  public async batchActivate(idList: TID[]): Promise<void> {
    if (idList.length === 0) return;

    await this.database
      .update(DB_SCHEMA.MODULE)
      .set({ active: STATUS_ENUM.ACTIVE })
      .where(inArray(DB_SCHEMA.MODULE.id, idList));
  }
}
