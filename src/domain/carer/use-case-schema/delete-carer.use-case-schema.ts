import { z } from 'zod';

import { IDSchema } from '@/domain/core/schemas/id.schema';

export const RequestDeleteCarerSchema = z.object({
  carerID: IDSchema,
});

export const ResponseDeleteCarerSchema = z.boolean();

export type TRequestDeleteCarer = z.infer<typeof RequestDeleteCarerSchema>;
export type TResponseDeleteCarer = z.infer<typeof ResponseDeleteCarerSchema>;
