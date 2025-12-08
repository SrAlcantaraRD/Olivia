import { drizzle } from 'drizzle-orm/expo-sqlite';

import { SQLITE_DB } from '@/database/config/database.config';
import * as DB_SCHEMA from '@/database/schema';
import type { TPatientEntity } from '@/domain/patient/entity/patient.entity';

export type TPatientAdapterEntity = typeof DB_SCHEMA.PATIENT.$inferSelect;

import { DrizzleLogger } from '@/domain/core/adapter/drizzle.logger';
import {
  getStatusFromValue,
  STATUS_ENUM,
} from '@/domain/core/enum/status.enum';
import type { TPatientCreateDTO } from '@/domain/patient/dto/patient.dto';
import { getAutonomyLevelFromValue } from '@/domain/patient/enum/autonomy-level.enum';
import { getSexTypeFromValue } from '@/domain/patient/enum/sex.enum';
import type { IPatientPort } from '@/domain/patient/port/patient.port';

export class SQLitePatientAdapter implements IPatientPort {
  private readonly database;

  constructor() {
    this.database = drizzle(SQLITE_DB, {
      schema: DB_SCHEMA,
      logger: new DrizzleLogger('Patient Adapter'),
    });
  }

  public static toDomainEntity(entity: TPatientAdapterEntity): TPatientEntity {
    return {
      id: entity.id,

      name: entity.name,
      birthDate: entity.birthDate,
      sex: getSexTypeFromValue(entity.sex),
      autonomyLevel: getAutonomyLevelFromValue(entity.autonomyLevel),

      status: getStatusFromValue(entity.status),
    };
  }

  public async create(
    dto: TPatientCreateDTO,
    _moduleIds: number[] = []
  ): Promise<TPatientEntity> {
    const [item] = await this.database
      .insert(DB_SCHEMA.PATIENT)
      .values({
        name: dto.name,
        birthDate: dto.birthDate,
        sex: dto.sex,
        autonomyLevel: dto.autonomyLevel,
        status: STATUS_ENUM.ACTIVE,
      })
      .returning();

    return SQLitePatientAdapter.toDomainEntity(item);
  }

  public async getById(id: number): Promise<TPatientEntity | null> {
    const item = await this.database.query.PATIENT.findFirst({
      where: (row, { eq, and }) =>
        and(eq(row.id, id), eq(row.status, STATUS_ENUM.ACTIVE)),
    });

    return item ? SQLitePatientAdapter.toDomainEntity(item) : null;
  }

  public async getAll(): Promise<TPatientEntity[]> {
    const list = await this.database.query.PATIENT.findMany({
      where: (row, { eq }) => eq(row.status, STATUS_ENUM.ACTIVE),
    });

    return list.map(SQLitePatientAdapter.toDomainEntity);
  }
}
