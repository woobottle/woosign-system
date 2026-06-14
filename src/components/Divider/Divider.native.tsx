import {forwardRef} from 'react';
import {View} from 'react-native';
import type {DividerNativeProps} from './types';
import {getDividerStyle} from './Divider.styles';
import {useResolvedColors} from '../../core/hooks';

export const Divider = forwardRef<View, DividerNativeProps>(function Divider(
  {tone = 'default', orientation = 'horizontal', style, testID},
  ref,
) {
  const colors = useResolvedColors();
  const base = getDividerStyle(colors, tone, orientation === 'vertical');
  return <View ref={ref} testID={testID} style={[base, style]} />;
});

Divider.displayName = 'Divider';
