import {
  buildAdapterClient,
  type TAppDatabase,
} from '@/database/config/database.config';
import * as DB_SCHEMA from '@/database/schema';
import {
  getStatusFromValue,
  STATUS_ENUM,
} from '@/domain/core/enum/status.enum';
import type {
  TPatient,
  TPatientCreate,
} from '@/domain/patient/entity/patient.entity';
import { getAutonomyLevelFromValue } from '@/domain/patient/enum/autonomy-level.enum';
import { getSexTypeFromValue } from '@/domain/patient/enum/sex.enum';
import type { IPatientPort } from '@/domain/patient/port/patient.port';

export type TPatientAdapterEntity = typeof DB_SCHEMA.PATIENT.$inferSelect;

export class SQLitePatientAdapter implements IPatientPort {
  private readonly database;

  constructor(database?: TAppDatabase) {
    this.database = database ?? buildAdapterClient('Patient');
  }

  public static toDomainEntity(entity: TPatientAdapterEntity): TPatient {
    return {
      id: entity.id,
      status: getStatusFromValue(entity.status),
      createdAt: entity.createdAt,

      name: entity.name,
      birthDate: entity.birthDate,
      sex: getSexTypeFromValue(entity.sex),
      autonomyLevel: getAutonomyLevelFromValue(entity.autonomyLevel),
    } satisfies TPatient;
  }

  public async create(dto: TPatientCreate): Promise<TPatient> {
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
}
