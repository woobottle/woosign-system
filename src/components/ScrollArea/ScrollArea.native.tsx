import {ScrollView} from 'react-native';
import type {ScrollAreaNativeProps} from './types';
export function ScrollArea({
  children,
  horizontal,
  maxHeight = 320,
  label = '스크롤 영역',
  testID,
  style,
}: ScrollAreaNativeProps) {
  return (
    <ScrollView
      horizontal={horizontal}
      accessibilityLabel={label}
      testID={testID}
      style={[{maxHeight}, style]}>
      {children}
    </ScrollView>
  );
}
