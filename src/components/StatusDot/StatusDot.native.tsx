import {forwardRef} from 'react';
import {View, Text} from 'react-native';
import type {StatusDotNativeProps} from './types';
import {getStatusDotStyle} from './StatusDot.styles';

export const StatusDot = forwardRef<View, StatusDotNativeProps>(
  function StatusDot(
    {tone = 'neutral', size = 'default', children, style, textStyle, testID},
    ref,
  ) {
    const {container, text} = getStatusDotStyle(tone, size);
    return (
      <View ref={ref} testID={testID} style={[container, style]}>
        {typeof children === 'string' ? (
          <Text style={[text, textStyle]}>{children}</Text>
        ) : (
          children
        )}
      </View>
    );
  },
);

StatusDot.displayName = 'StatusDot';
