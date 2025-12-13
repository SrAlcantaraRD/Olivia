import { Card } from 'heroui-native';
import type React from 'react';

type CardAtomProps = React.ComponentProps<typeof Card>;

export const CardAtom = ({ children, ...props }: CardAtomProps) => {
  return (
    <Card variant="quaternary" {...props}>
      {children}
    </Card>
  );
};
