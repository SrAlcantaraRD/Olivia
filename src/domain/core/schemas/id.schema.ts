import { z } from 'zod';

export const IDSchema = z.number().int().positive().default(1);

export type TID = z.infer<typeof IDSchema>;
