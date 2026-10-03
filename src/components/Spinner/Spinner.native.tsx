import {ActivityIndicator, View} from 'react-native';
import {useResolvedColors} from '../../core/hooks';
import type {SpinnerNativeProps} from './types';
export function Spinner({
  size = 24,
  label = '불러오는 중',
  testID,
  style,
}: SpinnerNativeProps) {
  const c = useResolvedColors();
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      testID={testID}
      style={style}>
      <ActivityIndicator size={size} color={c.actionPrimary} />
    </View>
  );
}
