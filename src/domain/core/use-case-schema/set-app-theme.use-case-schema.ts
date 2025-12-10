import z from 'zod';

export const RequestSetAppThemeSchema = z.object({
  theme: z.enum(['light', 'dark']),
});

export const ResponseSetAppThemeSchema = z.void();

export type TRequestSetAppTheme = z.infer<typeof RequestSetAppThemeSchema>;
export type TResponseSetAppTheme = z.infer<typeof ResponseSetAppThemeSchema>;
