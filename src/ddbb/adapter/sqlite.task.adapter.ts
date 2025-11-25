import { drizzle } from 'drizzle-orm/expo-sqlite';

import { DrizzleLogger } from '@/ddbb/adapter/drizzle.logger.adapter';
import { SQLITE_DB } from '@/ddbb/config/database.config';
import { STATUS_ENUM, type TLoggerPort } from '@/domain/core';
import * as DB_SCHEMA from '../schema';

export type TTaskAdapterEntity = typeof DB_SCHEMA.TASK.$inferSelect;
export type TTaskEntity = typeof DB_SCHEMA.TASK.$inferSelect;

export interface ITaskPort {
  getAll(): Promise<TTaskEntity[]>;
  create(title: string, description: string): Promise<TTaskEntity>;
  populateWithFakeData(): Promise<void>;
}

export class SQLiteTaskAdapter implements ITaskPort {
  private readonly database;

  constructor(private readonly logger: TLoggerPort) {
    this.database = drizzle(SQLITE_DB, {
      schema: DB_SCHEMA,
      logger: new DrizzleLogger(this.logger.extend('SQLiteTaskAdapter')),
    });
  }

  public static toDomainEntity(entity: TTaskAdapterEntity): TTaskEntity {
    return {
      id: entity.id,
      uuid: entity.uuid,
      title: entity.title,
      description: entity.description,
      status: entity.status,
      createdAt: entity.createdAt,
      deletedAt: entity.deletedAt,
    };
  }

  public async getAll(): Promise<TTaskEntity[]> {
    const entities = await this.database.query.TASK.findMany({
      where: (row, { eq }) => eq(row.status, STATUS_ENUM.ACTIVE),
      orderBy: (row, { desc }) => [desc(row.createdAt)],
    });

    if (!entities || entities.length === 0) return [];

    return entities.map(SQLiteTaskAdapter.toDomainEntity);
  }

  public async create(
    title: string,
    description: string
  ): Promise<TTaskEntity> {
    const [newTask] = await this.database
      .insert(DB_SCHEMA.TASK)
      .values({
        title,
        description,
        status: STATUS_ENUM.ACTIVE,
      })
      .returning();

    return SQLiteTaskAdapter.toDomainEntity(newTask);
  }

  public async populateWithFakeData(): Promise<void> {
    const tasks = [
      {
        title: 'Completar PEC 1',
        description: 'Implementar la funcionalidad de tareas con SQLite',
      },
      {
        title: 'Revisar documentación',
        description: 'Leer la documentación de Expo Router',
      },
      {
        title: 'Hacer testing',
        description: 'Escribir tests unitarios para los adapters',
      },
    ];

    for (const task of tasks) {
      await this.create(task.title, task.description);
    }
  }
}
