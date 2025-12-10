import z from 'zod';

export const RequestSetAppLocaleSchema = z.object({
  locale: z.enum(['en-EN', 'es-ES', 'ca-CA']),
});

export const ResponseSetAppLocaleSchema = z.void();

export type TRequestSetAppLocale = z.infer<typeof RequestSetAppLocaleSchema>;
export type TResponseSetAppLocale = z.infer<typeof ResponseSetAppLocaleSchema>;
