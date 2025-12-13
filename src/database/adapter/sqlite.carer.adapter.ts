import { drizzle } from 'drizzle-orm/expo-sqlite';

import {
  SQLiteRecordAdapter,
  type TRecordAdapterEntity,
} from '@/database/adapter/sqlite.record.adapter';
import { SQLITE_DB } from '@/database/config/database.config';
import * as DB_SCHEMA from '@/database/schema';
import type { TCarer, TCarerCreate } from '@/domain/carer/entity/carer.entity';
import { getCarerTypeFromValue } from '@/domain/carer/enum/carer-type.enums';
import type { ICarerPort } from '@/domain/carer/port/carer.port';
import { DrizzleLogger } from '@/domain/core/adapter/drizzle.logger';
import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import {
  getStatusFromValue,
  STATUS_ENUM,
} from '@/domain/core/enum/status.enum';
import type { TID } from '@/domain/core/schemas/id.schema';

export type TCarerAdapterEntity = typeof DB_SCHEMA.CARER.$inferSelect & {
  recordList?: TRecordAdapterEntity[];
};

export class SQLiteCarerAdapter implements ICarerPort {
  private readonly database;

  constructor() {
    this.database = drizzle(SQLITE_DB, {
      schema: DB_SCHEMA,
      logger: new DrizzleLogger('Carer Adapter'),
    });
  }

  public static toDomainEntity(entity: TCarerAdapterEntity): TCarer {
    return {
      id: entity.id,
      status: getStatusFromValue(entity.status),
      createdAt: entity.createdAt,

      name: entity.name,
      type: getCarerTypeFromValue(entity.type),
      isPrimary: entity.isPrimary === 1,
      pinHash: entity.pinHash,

      ...(entity.recordList && {
        recordList: entity.recordList.map(SQLiteRecordAdapter.toDomainEntity),
      }),
    } satisfies TCarer;
  }

  public async create(dto: TCarerCreate): Promise<TCarer> {
    const [item] = await this.database
      .insert(DB_SCHEMA.CARER)
      .values({
        name: dto.name,
        type: dto.type,
        isPrimary: dto.isPrimary ? 1 : 0,
        pinHash: dto.pinHash,
        status: STATUS_ENUM.ACTIVE,
      })
      .returning();

    return SQLiteCarerAdapter.toDomainEntity(item);
  }

  public async getById(id: TID): Promise<TCarer | null> {
    const item = await this.database.query.CARER.findFirst({
      where: (row, { eq, and }) =>
        and(eq(row.id, id), eq(row.status, STATUS_ENUM.ACTIVE)),
    });

    return item ? SQLiteCarerAdapter.toDomainEntity(item) : null;
  }

  public async getAll(): Promise<TCarer[]> {
    const list = await this.database.query.CARER.findMany({
      where: (row, { eq }) => eq(row.status, STATUS_ENUM.ACTIVE),
    });

    return list.map((row) => SQLiteCarerAdapter.toDomainEntity(row));
  }

  public async existsAny(): Promise<boolean> {
    const item = await this.database.query.CARER.findFirst({
      where: (row, { eq }) => eq(row.status, STATUS_ENUM.ACTIVE),
    });

    BASE_LOGGER.info(
      `[SQLiteCarerAdapter] existsAny result: ${JSON.stringify(item)}[${!!item}]`
    );

    return !!item;
  }
}
