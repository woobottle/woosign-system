/**
 * Switch component - React Native implementation
 */

import { forwardRef, useCallback, useEffect, useRef } from 'react';
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  Animated,
} from 'react-native';
import type { SwitchNativeProps, SwitchSize } from './types';
import {
  switchTrackVariants,
  switchThumbVariants,
  switchLabelVariants,
  trackColors,
  trackDimensions,
  disabledStyle,
  containerGap,
} from './Switch.styles';

/**
 * Get thumb translate X range based on size
 */
function getThumbTranslateRange(size: SwitchSize) {
  const dims = trackDimensions[size];
  const start = dims.thumbOffset;
  const end = dims.width - dims.thumbSize - dims.thumbOffset;
  return { start, end };
}

/**
 * Switch component for React Native
 */
export const Switch = forwardRef<View, SwitchNativeProps>(
  function Switch(
    {
      checked = false,
      onCheckedChange,
      size = 'default',
      disabled = false,
      label,
      style,
      pressableProps,
      testID,
    },
    ref
  ) {
    const animatedValue = useRef(new Animated.Value(checked ? 1 : 0)).current;

    useEffect(() => {
      Animated.timing(animatedValue, {
        toValue: checked ? 1 : 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }, [checked, animatedValue]);

    const handlePress = useCallback(() => {
      if (!disabled && onCheckedChange) {
        onCheckedChange(!checked);
      }
    }, [disabled, checked, onCheckedChange]);

    const { start, end } = getThumbTranslateRange(size);

    const translateX = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [start, end],
    });

    const trackColor = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [trackColors.unchecked, trackColors.checked],
    });

    // Get variant styles
    const trackStyles = switchTrackVariants({ size });
    const thumbStyles = switchThumbVariants({ size });
    const labelStyles = switchLabelVariants({ size });

    return (
      <Pressable
        ref={ref}
        onPress={handlePress}
        disabled={disabled}
        testID={testID}
        style={[
          styles.container,
          disabled && disabledStyle,
          style,
        ]}
        accessibilityRole="switch"
        accessibilityState={{ checked, disabled }}
        {...pressableProps}
      >
        <Animated.View
          style={[
            trackStyles,
            { backgroundColor: trackColor },
          ]}
        >
          <Animated.View
            style={[
              thumbStyles,
              styles.thumb,
              { transform: [{ translateX }] },
            ]}
          />
        </Animated.View>
        {label && (
          <Text style={labelStyles}>{label}</Text>
        )}
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: containerGap,
  },
  thumb: {
    position: 'absolute',
  },
});

Switch.displayName = 'Switch';
