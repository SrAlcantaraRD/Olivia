import React from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { cn } from '@/ui/lib/utils';

export const TextAtom = React.forwardRef<RNText, RNTextProps>((props, ref) => {
  const { className, ...restProps } = props;

  return (
    <RNText ref={ref} className={cn('font-normal', className)} {...restProps} />
  );
});

TextAtom.displayName = 'TextAtom';
