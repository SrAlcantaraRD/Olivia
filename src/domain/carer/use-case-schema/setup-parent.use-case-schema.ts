import z from 'zod';

import { CarerCreateSchema } from '@/domain/carer/entity/carer.entity';
import { IDSchema } from '@/domain/core/schemas/id.schema';
import { PatientCreateSchema } from '@/domain/patient/entity/patient.entity';

export const RequestSetupParentSchema = z.object({
  parent: CarerCreateSchema,
  patient: PatientCreateSchema,
  moduleList: z.array(IDSchema),
});

export const ResponseSetupParentSchema = z.void();

export type TRequestSetupParent = z.infer<typeof RequestSetupParentSchema>;

export type TResponseSetupParent = z.infer<typeof ResponseSetupParentSchema>;
