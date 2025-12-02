import { z } from 'zod';

import { GenerateCreateEntitySchema } from '@/domain/core/entity/base-dto.entity';
import { BaseEntitySchema } from '@/domain/core/entity/base-entity.entity';
import { AutonomyLevelSchema } from '@/domain/patient/enum/autonomy-level.enum';
import { SexSchema } from '@/domain/patient/enum/sex.enum';

export const PatientEntitySchema = z.object({
  ...BaseEntitySchema.shape,
  name: z.string().min(1),
  birthDate: z.number().int(),
  sex: SexSchema,
  autonomyLevel: AutonomyLevelSchema,
});

export const PatientCreateEntitySchema =
  GenerateCreateEntitySchema(PatientEntitySchema);

export type TPatientEntity = z.infer<typeof PatientEntitySchema>;

export type TPatientCreateEntity = z.infer<typeof PatientCreateEntitySchema>;
