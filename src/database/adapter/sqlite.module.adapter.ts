import { inArray } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';

import { SQLITE_DB } from '@/database/config/database.config';
import * as DB_SCHEMA from '@/database/schema';
import { DrizzleLogger } from '@/domain/core/adapter/drizzle.logger';
import { STATUS_ENUM } from '@/domain/core/enum/status.enum';
import type { TID } from '@/domain/core/schemas/id.schema';
import type { IModulePort } from '@/domain/module/port/module.port';

export class SQLiteModuleAdapter implements IModulePort {
  private readonly database;

  constructor() {
    this.database = drizzle(SQLITE_DB, {
      schema: DB_SCHEMA,
      logger: new DrizzleLogger('Module Adapter'),
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
