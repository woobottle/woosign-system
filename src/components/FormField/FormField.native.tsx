import {View, Text, StyleSheet} from 'react-native';
import {useResolvedColors} from '../../core/hooks';
import {Label} from '../Label/Label.native';
import type {FormFieldNativeProps} from './types';
export function FormField({
  id,
  label,
  description,
  error,
  required,
  disabled,
  children,
  testID,
  style,
}: FormFieldNativeProps) {
  const c = useResolvedColors();
  return (
    <View testID={testID} style={[styles.container, style]}>
      <Label required={required} disabled={disabled}>
        {label}
      </Label>
      {children({
        id,
        required,
        disabled,
        accessibilityLabel: label,
        accessibilityHint: error ?? description,
        'aria-invalid': !!error,
      })}
      {description && (
        <Text style={[styles.helper, {color: c.textSecondary}]}>
          {description}
        </Text>
      )}
      {error && (
        <Text
          accessibilityLiveRegion="polite"
          style={[styles.helper, {color: c.actionDanger}]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {gap: 8},
  helper: {fontSize: 13},
});
