import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';

import { DrizzleLogger } from '@/ddbb/adapter/drizzle.logger.adapter';
import { STATUS_ENUM, type TLoggerPort } from '@/domain/core';
import * as DB_SCHEMA from '../schema';

export type TAuhAdapterEntity = typeof DB_SCHEMA.TASK.$inferSelect;
type TTaskEntity = typeof DB_SCHEMA.TASK.$inferSelect;
interface ITaskPort {
  getAll(): Promise<TTaskEntity[]>;
  populateWithFakeData(): Promise<void>;
}

export class SQLiteTaskAdapter implements ITaskPort {
  private readonly database;

  constructor(private readonly logger: TLoggerPort) {
    const db = useSQLiteContext();

    this.database = drizzle(db, {
      schema: DB_SCHEMA,
      logger: new DrizzleLogger(this.logger.extend('SQLiteAuthAdapter')),
    });
  }

  public static toDomainEntity(entity: TAuhAdapterEntity): TTaskEntity {
    return {
      id: entity.id,
      uuid: entity.uuid,
      title: entity.title,
      description: entity.description,
      status: entity.status,
      createdAt: entity.createdAt,
      deletedAt: null,
    };
  }

  public async getAll(): Promise<TTaskEntity[]> {
    const entity = await this.database.query.TASK.findMany({
      where: (row, { eq }) => eq(row.status, STATUS_ENUM.ACTIVE),
    });

    if (!entity) return [];

    return entity.map(SQLiteTaskAdapter.toDomainEntity);
  }

  public async populateWithFakeData(): Promise<void> {
    this.database.insert(DB_SCHEMA.TASK).values({
      title: `Task ${Math.floor(Math.random() * 1000)}`,
      description: `Description ${Math.floor(Math.random() * 1000)}`,
      status: STATUS_ENUM.ACTIVE,
    });
  }
}
