import {forwardRef, useCallback} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {ChipNativeProps} from './types';
import {getChipStyles} from './Chip.styles';
import {useResolvedColors} from '../../core/hooks';

export const Chip = forwardRef<View, ChipNativeProps>(function Chip(
  {
    tone = 'default',
    disabled = false,
    children,
    onPress,
    leftAdornment,
    rightAdornment,
    style,
    textStyle,
    pressableProps,
    testID,
  },
  ref,
) {
  const colors = useResolvedColors();
  const {container, text} = getChipStyles(colors, tone);
  const handlePress = useCallback(() => {
    if (!disabled && onPress) {
      onPress();
    }
  }, [disabled, onPress]);

  const inner = (
    <>
      {leftAdornment}
      {typeof children === 'string' ? (
        <Text style={[text, textStyle]}>{children}</Text>
      ) : (
        children
      )}
      {rightAdornment}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        ref={ref}
        onPress={handlePress}
        disabled={disabled}
        testID={testID}
        style={({pressed}) => [
          container,
          pressed && !disabled ? {transform: [{scale: 0.96}]} : undefined,
          disabled ? styles.disabled : undefined,
          style,
        ]}
        {...pressableProps}>
        {inner}
      </Pressable>
    );
  }

  return (
    <View
      ref={ref}
      testID={testID}
      style={[container, disabled ? styles.disabled : undefined, style]}>
      {inner}
    </View>
  );
});

Chip.displayName = 'Chip';

const styles = StyleSheet.create({
  disabled: {opacity: 0.5},
});
