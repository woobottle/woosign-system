/**
 * Checkbox component - React Native implementation. controlled.
 */
import {forwardRef, useCallback, useMemo} from 'react';
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import type {CheckboxNativeProps} from './types';
import {
  getCheckboxStyles,
  checkboxDimensions,
  containerGap,
  disabledStyle,
} from './Checkbox.styles';
import {useResolvedColors} from '../../core/hooks';

export const Checkbox = forwardRef<View, CheckboxNativeProps>(function Checkbox(
  {
    checked = false,
    indeterminate = false,
    onCheckedChange,
    size = 'default',
    disabled = false,
    label,
    style,
    pressableProps,
    testID,
  },
  ref,
) {
  const handlePress = useCallback(() => {
    if (!disabled) onCheckedChange?.(!checked);
  }, [disabled, checked, onCheckedChange]);

  const colors = useResolvedColors();
  const s = useMemo(() => getCheckboxStyles(colors), [colors]);
  const dims = checkboxDimensions[size];
  const isOn = indeterminate || checked;

  return (
    <Pressable
      ref={ref}
      onPress={handlePress}
      disabled={disabled}
      testID={testID}
      style={[styles.container, disabled && disabledStyle, style]}
      accessibilityRole="checkbox"
      accessibilityState={{
        checked: indeterminate ? 'mixed' : checked,
        disabled,
      }}
      {...pressableProps}>
      <View
        style={[
          s.boxBase as ViewStyle,
          {width: dims.box, height: dims.box},
          (isOn ? s.boxChecked : s.boxUnchecked) as ViewStyle,
        ]}>
        {isOn && (
          <Text style={[s.glyph as TextStyle, {fontSize: dims.glyph}]}>
            {indeterminate ? '–' : '✓'}
          </Text>
        )}
      </View>
      {label != null && (
        <Text style={[s.label as TextStyle, {fontSize: dims.fontSize}]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: containerGap,
  },
});

Checkbox.displayName = 'Checkbox';
