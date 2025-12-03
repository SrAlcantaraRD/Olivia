import { drizzle } from 'drizzle-orm/expo-sqlite';

import { SQLITE_DB } from '@/database/config/database.config';
import * as DB_SCHEMA from '@/database/schema';
import type { TCarerCreateDTO } from '@/domain/carer/dto/carer.dto';
import type { TCarerEntity } from '@/domain/carer/entity/carer.entity';
import { getCarerTypeFromValue } from '@/domain/carer/enum/carer-type.enums';
import type { ICarerPort } from '@/domain/carer/port/carer.port';
import { DrizzleLogger } from '@/domain/core/adapter/drizzle.logger';
import {
  getStatusFromValue,
  STATUS_ENUM,
} from '@/domain/core/enum/status.enum';
import type { TID } from '@/domain/core/schemas/id.schema';

export type TCarerAdapterEntity = typeof DB_SCHEMA.CARER.$inferSelect;

export class SQLiteCarerAdapter implements ICarerPort {
  private readonly database;

  constructor() {
    this.database = drizzle(SQLITE_DB, {
      schema: DB_SCHEMA,
      logger: new DrizzleLogger('SQLiteCarerAdapter'),
    });
  }

  public static toDomainEntity(entity: TCarerAdapterEntity): TCarerEntity {
    return {
      id: entity.id,
      uuid: entity.uuid,

      name: entity.name,
      type: getCarerTypeFromValue(entity.type),
      isPrimary: entity.isPrimary === 1,
      pinHash: entity.pinHash,

      status: getStatusFromValue(entity.status),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt ?? undefined,
      deletedAt: entity.deletedAt ?? undefined,
    };
  }

  public async create(dto: TCarerCreateDTO): Promise<TCarerEntity> {
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

  public async getById(id: TID): Promise<TCarerEntity | null> {
    const item = await this.database.query.CARER.findFirst({
      where: (row, { eq, and }) =>
        and(eq(row.id, id), eq(row.status, STATUS_ENUM.ACTIVE)),
    });

    return item ? SQLiteCarerAdapter.toDomainEntity(item) : null;
  }

  public async getAll(): Promise<TCarerEntity[]> {
    const list = await this.database.query.CARER.findMany({
      where: (row, { eq }) => eq(row.status, STATUS_ENUM.ACTIVE),
    });

    return list.map((row) => SQLiteCarerAdapter.toDomainEntity(row));
  }
}
