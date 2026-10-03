import {View} from 'react-native';
import type {AspectRatioNativeProps} from './types';
export function AspectRatio({
  ratio = 16 / 9,
  children,
  testID,
  style,
}: AspectRatioNativeProps) {
  return (
    <View
      testID={testID}
      style={[
        {
          width: '100%',
          aspectRatio: Number.isFinite(ratio) && ratio > 0 ? ratio : 1,
          overflow: 'hidden',
        },
        style,
      ]}>
      {children}
    </View>
  );
}
