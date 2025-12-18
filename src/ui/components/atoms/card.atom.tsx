import { Card } from 'heroui-native';
import type React from 'react';

import { cn } from '@/ui/lib/utils';

type CardAtomProps = React.ComponentProps<typeof Card>;

export const CardAtom = ({ children, className, ...props }: CardAtomProps) => {
  return (
    <Card
      variant="quaternary"
      {...props}
      className={cn('rounded-lg', className)}
    >
      {children}
    </Card>
  );
};
