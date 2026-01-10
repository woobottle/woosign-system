/**
 * Text component - React Native implementation
 */

import { forwardRef } from 'react';
import { Text as RNText } from 'react-native';
import type { TextNativeProps } from './types';
import { textVariants } from './Text.styles';
import { colors } from '../../core/theme/tokens';
import { mergeStyles } from '../../core/variants';

/**
 * Text component for React Native
 */
export const Text = forwardRef<RNText, TextNativeProps>(function Text(
  {
    variant = 'p',
    weight,
    align,
    color,
    muted = false,
    children,
    style,
    numberOfLines,
    ellipsizeMode,
    testID,
  },
  ref
) {
  // Get variant styles
  const variantStyles = textVariants({ variant, weight, align });

  // Compose final styles
  const textStyle = mergeStyles(
    variantStyles,
    muted ? { color: colors.mutedForeground } : undefined,
    color ? { color } : undefined,
    style
  );

  return (
    <RNText
      ref={ref}
      style={textStyle}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      testID={testID}
    >
      {children}
    </RNText>
  );
});

Text.displayName = 'Text';
