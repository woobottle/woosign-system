import {StyleSheet, View} from 'react-native';
import {useResolvedColors} from '../../core/hooks';
import type {SkeletonNativeProps} from './types';
export function Skeleton({
  width,
  height = 20,
  circle = false,
  testID,
  style,
}: SkeletonNativeProps) {
  const c = useResolvedColors();
  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      testID={testID}
      style={[
        {
          width: width ?? (circle ? height : '100%'),
          height,
        },
        circle ? {borderRadius: height / 2} : styles.rounded,
        {backgroundColor: c.section},
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  rounded: {
    borderRadius: 8,
  },
});
