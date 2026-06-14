import {forwardRef, useCallback} from 'react';
import {Pressable, Text, View} from 'react-native';
import type {PillNativeProps} from './types';
import {getPillStyles} from './Pill.styles';
import {useResolvedColors} from '../../core/hooks';

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
  const colors = useResolvedColors();
  const {container, text} = getPillStyles(colors, active);
  const handlePress = useCallback(() => {
    if (!disabled && onPress) {
      onPress();
    }
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
