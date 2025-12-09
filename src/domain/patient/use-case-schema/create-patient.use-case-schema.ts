import { z } from 'zod';

import { AutonomyLevelSchema } from '@/domain/patient/enum/autonomy-level.enum';
import { SexSchema } from '@/domain/patient/enum/sex.enum';

export const CreatePatientSchema = z.object({
  name: z.string().min(1),
  birthDate: z.number().int(),
  sex: SexSchema,
  autonomyLevel: AutonomyLevelSchema,
  moduleIds: z.array(z.number()),
});

export type TCreatePatientInput = z.infer<typeof CreatePatientSchema>;
