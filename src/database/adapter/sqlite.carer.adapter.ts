import { eq } from 'drizzle-orm';

import {
  SQLiteRecordAdapter,
  type TRecordAdapterEntity,
} from '@/database/adapter/sqlite.record.adapter';
import {
  buildAdapterClient,
  type TAppDatabase,
} from '@/database/config/database.config';
import * as DB_SCHEMA from '@/database/schema';
import type { TCarer, TCarerCreate } from '@/domain/carer/entity/carer.entity';
import { getCarerTypeFromValue } from '@/domain/carer/enum/carer-type.enums';
import type { ICarerPort } from '@/domain/carer/port/carer.port';
import {
  getStatusFromValue,
  STATUS_ENUM,
} from '@/domain/core/enum/status.enum';
import type { TID } from '@/domain/core/schemas/id.schema';

export type TCarerAdapterEntity = typeof DB_SCHEMA.CARER.$inferSelect & {
  recordList?: TRecordAdapterEntity[];
};
type TCarerAdapterInsert = typeof DB_SCHEMA.CARER.$inferInsert;

export class SQLiteCarerAdapter implements ICarerPort {
  private readonly database;

  constructor(database?: TAppDatabase) {
    this.database = database ?? buildAdapterClient('Carer');
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
      } satisfies TCarerAdapterInsert)
      .returning();

    return SQLiteCarerAdapter.toDomainEntity(item);
  }

  public async addSecondaryCarer(
    originCarerID: TID,
    dto: TCarerCreate
  ): Promise<TCarer> {
    const [item] = await this.database
      .insert(DB_SCHEMA.CARER)
      .values({
        id: originCarerID,
        name: dto.name,
        type: dto.type,
        isPrimary: dto.isPrimary ? 1 : 0,
        pinHash: dto.pinHash,
        status: STATUS_ENUM.ACTIVE,
      } satisfies TCarerAdapterInsert)
      .returning();

    return SQLiteCarerAdapter.toDomainEntity(item);
  }

  public async getByID(id: TID): Promise<TCarer | null> {
    const item = await this.database.query.CARER.findFirst({
      where: (row, { eq }) => eq(row.id, id),
    });

    return item ? SQLiteCarerAdapter.toDomainEntity(item) : null;
  }

  public async getAll(): Promise<TCarer[]> {
    const list = await this.database.query.CARER.findMany();

    return list.map((row) => SQLiteCarerAdapter.toDomainEntity(row));
  }

  public async updateStatus(id: TID, status: STATUS_ENUM): Promise<TCarer> {
    const [row] = await this.database
      .update(DB_SCHEMA.CARER)
      .set({
        status,
      })
      .where(eq(DB_SCHEMA.CARER.id, id))
      .returning();

    return SQLiteCarerAdapter.toDomainEntity(row);
  }
}
