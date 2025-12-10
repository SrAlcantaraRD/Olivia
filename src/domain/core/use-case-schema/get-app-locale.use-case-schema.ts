import z from 'zod';

export const RequestGetAppLocaleSchema = z.void();

export const ResponseGetAppLocaleSchema = z.union([
  z.literal('en-EN'),
  z.literal('es-ES'),
  z.literal('ca-CA'),
  z.null(),
]);

export type TRequestGetAppLocale = z.infer<typeof RequestGetAppLocaleSchema>;
export type TResponseGetAppLocale = z.infer<typeof ResponseGetAppLocaleSchema>;
