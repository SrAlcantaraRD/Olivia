import { z } from 'zod';

import { AutonomyLevelSchema } from '@/domain/patient/enum/autonomy-level.enum';
import { SexSchema } from '@/domain/patient/enum/sex.enum';

export const CreatePatientSchema = z.object({
  name: z.string().min(1),
  birthDate: z.number().int(),
  sex: SexSchema.optional(),
  autonomyLevel: AutonomyLevelSchema.optional(),
  moduleIds: z.array(z.number()).optional(),
});

export type TCreatePatientInput = z.infer<typeof CreatePatientSchema>;
