import type React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Text } from 'react-native';

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

export interface ITextTranslationProps {
  i18nKey: Ti18nKeys;
  values?: ITextTranslationEntity;
  components?: Record<string, React.ReactElement>;
}

export function TextTranslation({
  i18nKey,
  values,
  components,
}: ITextTranslationProps): React.ReactElement {
  const { t } = useTranslation();

  return (
    <Trans<Ti18nKeys>
      t={t}
      i18nKey={i18nKey}
      parent={Text}
      values={values}
      components={{
        // Default components available in all translations (React Native)
        // Use react-native `Text` with tailwind `className` so callers
        // can style consistently with uniwind/ tailwind tokens.
        italic: <Text className="italic" />,
        bold: <Text className="font-semibold text-primary" />,
        // `br` maps to a Text containing a newline in React Native
        br: <Text>{'\n'}</Text>,
        // Custom components passed by the caller (they should be React Native elements)
        ...components,
      }}
    />
  );
}
