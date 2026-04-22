import {forwardRef} from 'react';
import {View} from 'react-native';
import type {DividerNativeProps} from './types';
import {getDividerStyle} from './Divider.styles';

export const Divider = forwardRef<View, DividerNativeProps>(function Divider(
  {tone = 'default', orientation = 'horizontal', style, testID},
  ref,
) {
  const base = getDividerStyle(tone, orientation === 'vertical');
  return <View ref={ref} testID={testID} style={[base, style]} />;
});

Divider.displayName = 'Divider';
