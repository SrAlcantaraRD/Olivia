import z from 'zod';

import { ELocaleCode } from '@/domain/core/enum/settings.enum';

export const RequestGetAppLocaleSchema = z.void();

export const ResponseGetAppLocaleSchema = z.union([
  z.literal(ELocaleCode.es_ES),
  z.literal(ELocaleCode.en_EN),
  z.literal(ELocaleCode.ca_CA),
]);

export type TRequestGetAppLocale = z.infer<typeof RequestGetAppLocaleSchema>;
export type TResponseGetAppLocale = z.infer<typeof ResponseGetAppLocaleSchema>;
