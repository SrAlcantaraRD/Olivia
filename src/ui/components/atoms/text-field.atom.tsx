import { TextField } from 'heroui-native';
import type React from 'react';

type TextFieldAtomProps = React.ComponentProps<typeof TextField>;

export const TextFieldAtom = (props: TextFieldAtomProps) => {
  return <TextField {...props} />;
};
