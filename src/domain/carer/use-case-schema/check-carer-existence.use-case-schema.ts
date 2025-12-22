import { z } from 'zod';

export const RequestCheckCarerExistenceSchema = z.void();

export const ResponseCheckCarerExistenceSchema = z.object({
  exists: z.boolean(),
});

export type TCheckCarerExistenceRequest = z.infer<
  typeof RequestCheckCarerExistenceSchema
>;
export type TCheckCarerExistenceResponse = z.infer<
  typeof ResponseCheckCarerExistenceSchema
>;
