import { z } from 'zod';

import { CarerTypeSchema } from '@/domain/carer/enum/carer-type.enums';
import { GenerateCreateEntitySchema } from '@/domain/core/entity/base-dto.entity';
import { BaseEntitySchema } from '@/domain/core/entity/base-entity.entity';

export const CarerEntitySchema = z.object({
  ...BaseEntitySchema.shape,
  name: z.string().min(1),
  type: CarerTypeSchema,
  isPrimary: z.boolean(),
  pinHash: z.string(),
});

export const CarerCreateEntitySchema =
  GenerateCreateEntitySchema(CarerEntitySchema);

export type TCarerEntity = z.infer<typeof CarerEntitySchema>;

// Derive the Create DTO type from the schema's inferred type to preserve fields
export type TCarerCreateEntity = z.infer<typeof CarerCreateEntitySchema>;
