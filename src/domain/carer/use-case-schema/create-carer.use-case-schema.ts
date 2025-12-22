import type { z } from 'zod';

import {
  CarerCreateSchema,
  CarerEntitySchema,
} from '@/domain/carer/entity/carer.entity';

export const RequestCreateCarerSchema = CarerCreateSchema;

export const ResponseCreateCarerSchema = CarerEntitySchema;

export type TRequestCreateCarer = z.infer<typeof RequestCreateCarerSchema>;
export type TResponseCreateCarer = z.infer<typeof ResponseCreateCarerSchema>;
