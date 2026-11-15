import {StyleSheet, Text} from 'react-native';
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
        styles.label,
        {color: c.textPrimary},
        disabled && styles.disabled,
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

const styles = StyleSheet.create({
  label: {fontSize: 14, fontWeight: '500'},
  disabled: {opacity: 0.5},
});
