import { drizzle } from 'drizzle-orm/expo-sqlite';

import { DrizzleLogger } from '@/ddbb/adapter/drizzle.logger.adapter';
import { SQLITE_DB } from '@/ddbb/config/database.config';
import {
  authStageFromString,
  type IAuthPort,
  type TAuthEntity,
} from '@/domain/auth';
import { STATUS_ENUM, type TLoggerPort } from '@/domain/core';
import * as DB_SCHEMA from '../schema';

export type TAuhAdapterEntity = typeof DB_SCHEMA.AUTH.$inferSelect;

export class SQLiteAuthAdapter implements IAuthPort {
  private readonly database;

  constructor(private readonly logger: TLoggerPort) {
    this.database = drizzle(SQLITE_DB, {
      schema: DB_SCHEMA,
      logger: new DrizzleLogger(this.logger.extend('SQLiteAuthAdapter')),
    });
  }
  public static toDomainEntity(entity: TAuhAdapterEntity): TAuthEntity {
    return {
      id: entity.id,
      uuid: entity.uuid,
      email: entity.email,
      password: entity.password,
      stage: authStageFromString(entity.stage),
      createdAt: new Date(entity.createdAt),
      status: Boolean(entity.status),
    };
  }

  public async findByEmail(email: string): Promise<TAuthEntity | null> {
    const entity = await this.database.query.AUTH.findFirst({
      where: (row, { eq, and }) =>
        and(eq(row.status, STATUS_ENUM.ACTIVE), eq(row.email, email)),
    });

    if (!entity) return null;

    return SQLiteAuthAdapter.toDomainEntity(entity);
  }
}
