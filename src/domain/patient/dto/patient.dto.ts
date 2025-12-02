import type { z } from 'zod';

import {
  GenerateCreateDTOSchema,
  GenerateDTOSchema,
} from '@/domain/core/entity/base-dto.entity';
import { PatientEntitySchema } from '@/domain/patient/entity/patient.entity';

export const PatientCreateDTOSchema =
  GenerateCreateDTOSchema(PatientEntitySchema);
export const PatientReadDTOSchema = GenerateDTOSchema(PatientEntitySchema);

export type TPatientCreateDTO = z.infer<typeof PatientCreateDTOSchema>;
export type TPatientDTO = z.infer<typeof PatientReadDTOSchema>;
