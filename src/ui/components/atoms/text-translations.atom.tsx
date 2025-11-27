import { useTranslation } from 'react-i18next';

import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

// NOTE: Added optional `values` prop so callers can pass interpolation data.
// This enables usages like: <TextTranslation i18nKey="key" values={{ name: 'Robot' }} />
// The shape is intentionally permissive (string | number | boolean) matching i18next interpolation primitives.
export interface ITextTranslationEntity {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | undefined
    | Date
    | unknown[]
    | unknown;
}

interface IProps {
  i18nKey: Ti18nKeys;
  values?: ITextTranslationEntity;
}

export function TextTranslation({ i18nKey, values }: IProps) {
  const { t } = useTranslation();
  return <>{t(i18nKey, values)}</>;
}
