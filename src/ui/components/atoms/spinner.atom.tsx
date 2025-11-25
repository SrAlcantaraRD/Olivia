import { Spinner } from 'heroui-native';
import type React from 'react';

type SpinnerAtomProps = React.ComponentProps<typeof Spinner>;

export const SpinnerAtom = (props: SpinnerAtomProps) => {
  return <Spinner {...props} />;
};
