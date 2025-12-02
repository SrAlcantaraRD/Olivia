import type { TBaseMapper } from '@/domain/core';
import type { TPatientDTO } from '@/domain/patient/dto/patient.dto';
import type { TPatientEntity } from '@/domain/patient/entity/patient.entity';

export const patientMapper: TBaseMapper<TPatientEntity, TPatientDTO> = {
  toDTO: (entity: TPatientEntity): TPatientDTO => {
    return {
      uuid: entity.uuid,
      createdAt: entity.createdAt,
      name: entity.name,
      birthDate: entity.birthDate,
      sex: entity.sex,
      autonomyLevel: entity.autonomyLevel,
    };
  },
};
