import {Text} from 'react-native';
import {useResolvedColors} from '../../core/hooks';
import type {LabelNativeProps} from './types';
export function Label({
  children,
  required,
  disabled,
  testID,
  style,
}: LabelNativeProps) {
  const c = useResolvedColors();
  return (
    <Text
      testID={testID}
      style={[
        {
          color: c.textPrimary,
          fontSize: 14,
          fontWeight: '500',
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}>
      {children}
      {required && (
        <Text accessibilityLabel="필수" style={{color: c.actionDanger}}>
          {' '}
          *
        </Text>
      )}
    </Text>
  );
}
