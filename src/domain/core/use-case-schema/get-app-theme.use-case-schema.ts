import z from 'zod';

export const RequestGetAppThemeSchema = z.void();

export const ResponseGetAppThemeSchema = z.union([
  z.literal('light'),
  z.literal('dark'),
  z.null(),
]);

export type TRequestGetAppTheme = z.infer<typeof RequestGetAppThemeSchema>;
export type TResponseGetAppTheme = z.infer<typeof ResponseGetAppThemeSchema>;
