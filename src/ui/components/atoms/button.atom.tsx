import { Button } from 'heroui-native';
import type React from 'react';

import { TypographyParagraph } from '@/ui/components/atoms/typography.atom';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

type ButtonAtomProps = React.ComponentProps<typeof Button> & {
  title: Ti18nKeys;
};

export const ButtonAtom = ({ children, ...props }: ButtonAtomProps) => {
  return (
    <Button className="rounded-lg" {...props}>
      <TypographyParagraph i18nKey={props.title} />
    </Button>
  );
};
