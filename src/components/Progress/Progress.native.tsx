import {forwardRef} from 'react';
import {View} from 'react-native';
import type {ProgressNativeProps} from './types';
import {getProgressStyles, normalizeProgress} from './Progress.styles';
import {useResolvedColors} from '../../core/hooks';

export const Progress = forwardRef<View, ProgressNativeProps>(function Progress(
  {
    value,
    max,
    tone = 'gold',
    surface = 'light',
    size = 'default',
    style,
    testID,
  },
  ref,
) {
  const colors = useResolvedColors();
  const pct = normalizeProgress(value, max);
  const {rail, fill} = getProgressStyles(colors, tone, surface, size);
  return (
    <View ref={ref} testID={testID} style={[rail, style]}>
      <View style={[fill, {width: `${pct * 100}%`}]} />
    </View>
  );
});

Progress.displayName = 'Progress';
