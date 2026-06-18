/**
 * Radio - React Native. accessibilityRole=radio; reads RadioContext.
 */
import {forwardRef, useCallback, useContext, useMemo} from 'react';
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import type {RadioNativeProps} from './types';
import {RadioContext} from './RadioContext';
import {
  getRadioStyles,
  radioDimensions,
  containerGap,
  disabledStyle,
} from './Radio.styles';
import {useResolvedColors} from '../../core/hooks';

export const Radio = forwardRef<View, RadioNativeProps>(function Radio(
  {value, label, disabled: itemDisabled = false, size = 'default', style, testID},
  ref,
) {
  const ctx = useContext(RadioContext);
  const checked = ctx?.value === value;
  const disabled = itemDisabled || !!ctx?.disabled;

  const handlePress = useCallback(() => {
    if (!disabled) ctx?.onValueChange?.(value);
  }, [disabled, ctx, value]);

  const colors = useResolvedColors();
  const s = useMemo(() => getRadioStyles(colors), [colors]);
  const dims = radioDimensions[size];

  return (
    <Pressable
      ref={ref}
      onPress={handlePress}
      disabled={disabled}
      testID={testID}
      style={[styles.container, disabled && disabledStyle, style]}
      accessibilityRole="radio"
      accessibilityState={{selected: checked, disabled}}>
      <View
        style={[
          s.outerBase as ViewStyle,
          {width: dims.outer, height: dims.outer},
          (checked ? s.outerChecked : s.outerUnchecked) as ViewStyle,
        ]}>
        {checked && (
          <View
            style={[s.dot as ViewStyle, {width: dims.dot, height: dims.dot}]}
          />
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

Radio.displayName = 'Radio';
