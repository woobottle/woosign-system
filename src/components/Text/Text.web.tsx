/**
 * Text component - Web implementation
 */

import React, { forwardRef } from 'react';
import type { TextWebProps } from './types';
import { textVariants, getDefaultElement } from './Text.styles';
import { colors } from '../../core/theme/tokens';
import { mergeStyles } from '../../core/variants';
import { cssifyWebStyles } from '../../core/utils/cssifyWebStyles';

/**
 * Text component for web
 */
export const Text = forwardRef<HTMLElement, TextWebProps>(function Text(
  {
    variant = 'p',
    weight,
    align,
    color,
    muted = false,
    children,
    as,
    className,
    style,
    testID,
  },
  ref
) {
  // Determine the HTML element to render
  const Element = as || getDefaultElement(variant);

  // Get variant styles
  const variantStyles = textVariants({ variant, weight, align }) as React.CSSProperties;

  // Compose final styles
  const textStyle = cssifyWebStyles(
    mergeStyles(
      variantStyles,
      muted ? { color: colors.mutedForeground } : undefined,
      color ? { color } : undefined,
      style
    )
  ) as React.CSSProperties;

  return React.createElement(
    Element,
    {
      ref,
      className,
      style: textStyle,
      'data-testid': testID,
    },
    children
  );
});

Text.displayName = 'Text';
