import { z } from 'zod';

export const RequestAddDemoDataSchema = z.void();

export const ResponseAddDemoDataSchema = z.void();

export type TRequestAddDemoData = z.infer<typeof RequestAddDemoDataSchema>;

export type TResponseAddDemoData = z.infer<typeof ResponseAddDemoDataSchema>;
