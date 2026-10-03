import {View, Text} from 'react-native';
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
    <View testID={testID} style={[{gap: 8}, style]}>
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
        <Text style={{color: c.textSecondary, fontSize: 13}}>
          {description}
        </Text>
      )}
      {error && (
        <Text
          accessibilityLiveRegion="polite"
          style={{color: c.actionDanger, fontSize: 13}}>
          {error}
        </Text>
      )}
    </View>
  );
}
