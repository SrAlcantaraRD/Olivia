import z from 'zod';

import { CarerCreateSchema } from '@/domain/carer/entity/carer.entity';
import { IDSchema } from '@/domain/core/schemas/id.schema';
import { PatientCreateDTOSchema } from '@/domain/patient/dto/patient.dto';

export const RequestSetupParentSchema = z.object({
  parent: CarerCreateSchema,
  patient: PatientCreateDTOSchema,
  moduleList: z.array(IDSchema),
});

export const ResponseSetupParentSchema = z.void();

export type TRequestSetupParent = z.infer<typeof RequestSetupParentSchema>;

export type TResponseSetupParent = z.infer<typeof ResponseSetupParentSchema>;
