import z from 'zod';

import { EThemeMode } from '@/domain/core/enum/settings.enum';

export const RequestGetAppThemeSchema = z.void();

export const ResponseGetAppThemeSchema = z.union([
  z.literal(EThemeMode.LIGHT),
  z.literal(EThemeMode.DARK),
]);

export type TRequestGetAppTheme = z.infer<typeof RequestGetAppThemeSchema>;
export type TResponseGetAppTheme = z.infer<typeof ResponseGetAppThemeSchema>;
