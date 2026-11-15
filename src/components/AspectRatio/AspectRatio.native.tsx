import {View, StyleSheet} from 'react-native';
import type {AspectRatioNativeProps} from './types';
export function AspectRatio({
  ratio = 16 / 9,
  children,
  testID,
  style,
}: AspectRatioNativeProps) {
  const aspectRatio = Number.isFinite(ratio) && ratio > 0 ? ratio : 1;
  return (
    <View testID={testID} style={[styles.root, {aspectRatio}, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {width: '100%', overflow: 'hidden'},
});
