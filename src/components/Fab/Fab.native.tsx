import {forwardRef, useCallback} from 'react';
import {Pressable, View} from 'react-native';
import type {FabNativeProps} from './types';
import {getFabStyle} from './Fab.styles';

export const Fab = forwardRef<View, FabNativeProps>(function Fab(
  {
    tone = 'ember',
    size = 'default',
    disabled = false,
    onPress,
    children,
    accessibilityLabel,
    style,
    pressableProps,
    testID,
  },
  ref,
) {
  const base = getFabStyle(tone, size);
  const handlePress = useCallback(() => {
    if (!disabled && onPress) onPress();
  }, [disabled, onPress]);

  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={handlePress}
      disabled={disabled}
      testID={testID}
      style={({pressed}) => [
        base,
        pressed && !disabled ? {transform: [{scale: 0.95}]} : undefined,
        disabled ? {opacity: 0.5} : undefined,
        style,
      ]}
      {...pressableProps}>
      {children}
    </Pressable>
  );
});

Fab.displayName = 'Fab';
