import { Button } from 'heroui-native';
import type React from 'react';

type ButtonAtomProps = React.ComponentProps<typeof Button>;

export const ButtonAtom = ({ children, ...props }: ButtonAtomProps) => {
  return <Button {...props}>{children}</Button>;
};
