import {forwardRef, useCallback} from 'react';
import {Pressable, Text, View} from 'react-native';
import type {PillNativeProps} from './types';
import {getPillStyles} from './Pill.styles';

export const Pill = forwardRef<View, PillNativeProps>(function Pill(
  {
    active = false,
    disabled = false,
    children,
    onPress,
    style,
    textStyle,
    pressableProps,
    testID,
  },
  ref,
) {
  const {container, text} = getPillStyles(active);
  const handlePress = useCallback(() => {
    if (!disabled && onPress) onPress();
  }, [disabled, onPress]);

  return (
    <Pressable
      ref={ref}
      onPress={handlePress}
      disabled={disabled}
      testID={testID}
      style={({pressed}) => [
        container,
        pressed && !disabled ? {transform: [{scale: 0.95}]} : undefined,
        disabled ? {opacity: 0.5} : undefined,
        style,
      ]}
      {...pressableProps}>
      {typeof children === 'string' ? (
        <Text style={[text, textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
});

Pill.displayName = 'Pill';
