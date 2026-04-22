import {forwardRef} from 'react';
import {Text} from 'react-native';
import type {Text as RNText} from 'react-native';
import type {EyebrowNativeProps} from './types';
import {getEyebrowStyle} from './Eyebrow.styles';

export const Eyebrow = forwardRef<RNText, EyebrowNativeProps>(function Eyebrow(
  {tone = 'default', children, style, testID},
  ref,
) {
  const base = getEyebrowStyle(tone);
  return (
    <Text ref={ref} testID={testID} style={[base, style]}>
      {children}
    </Text>
  );
});

Eyebrow.displayName = 'Eyebrow';
