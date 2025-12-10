import { drizzle } from 'drizzle-orm/expo-sqlite';

import { SQLITE_DB } from '@/database/config/database.config';
import * as DB_SCHEMA from '@/database/schema';
import { DrizzleLogger } from '@/domain/core/adapter/drizzle.logger';
import { getStatusFromValue } from '@/domain/core/enum/status.enum';
import type { TModule } from '@/domain/module/entity/module.entity';
import type {
  TModuleField,
  TModuleFieldCreate,
} from '@/domain/module/entity/module-field.entity';
import {
  getModuleFieldTypeFromValue,
  MODULE_FIELD_TYPE_ENUM,
} from '@/domain/module/enum/module-field-type.enum';
// NOTE: keep imports minimal and use DB_SCHEMA export for references
import type { IModuleFieldPort } from '@/domain/module/port/module-field.port';

export type TModuleFieldAdapterEntity =
  typeof DB_SCHEMA.MODULE_FIELD.$inferSelect;

export class SQLiteModuleFieldAdapter implements IModuleFieldPort {
  private readonly database;

  constructor() {
    this.database = drizzle(SQLITE_DB, {
      schema: DB_SCHEMA,
      logger: new DrizzleLogger('Module Field Adapter'),
    });
  }

  private static toDomainEntity(
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
      moduleId: entity.moduleID,
      title: entity.title,
      description: entity.description ?? '',
      type,
      values: entity.values ?? '',
      required: Boolean(Number(entity.required)),
      order: Number(entity.order),
      module: {} as TModule,
    };
  }

  public async getById(id: number): Promise<TModuleField | null> {
    const record = await this.database.query.MODULE_FIELD.findFirst({
      where: (row, { eq }) => eq(row.id, id),
    });

    if (!record) return null;

    return SQLiteModuleFieldAdapter.toDomainEntity(record);
  }

  public async getAll(): Promise<TModuleField[]> {
    const list = await this.database.query.MODULE_FIELD.findMany({});

    return list.map(SQLiteModuleFieldAdapter.toDomainEntity);
  }

  public async getAllByModuleId(moduleId: number): Promise<TModuleField[]> {
    const list = await this.database.query.MODULE_FIELD.findMany({
      where: (row, { eq }) => eq(row.moduleID, moduleId),
      orderBy: (row, { asc }) => asc(row.order),
    });

    return list.map(SQLiteModuleFieldAdapter.toDomainEntity);
  }

  public async create(data: TModuleFieldCreate): Promise<TModuleField> {
    // Implement create if required. Minimal skyline for now.
    const insert = await this.database
      .insert(DB_SCHEMA.MODULE_FIELD)
      .values({
        moduleID: data.moduleId,
        title: data.title,
        description: data.description ?? '',
        type: data.type,
        values: data.values ?? null,
        required: data.required ? 1 : 0,
        order: data.order ?? 0,
      })
      .returning();

    return SQLiteModuleFieldAdapter.toDomainEntity(insert[0]);
  }
}

export default SQLiteModuleFieldAdapter;
