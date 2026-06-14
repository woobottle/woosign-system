/**
 * Text component - Web implementation
 */

import React, {forwardRef, useMemo} from 'react';
import type {TextWebProps} from './types';
import {getTextVariants, getDefaultElement} from './Text.styles';
import {mergeStyles} from '../../core/variants';
import {cssifyWebStyles} from '../../core/utils/cssifyWebStyles';
import {useResolvedColors} from '../../core/hooks';

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
  ref,
) {
  // Determine the HTML element to render
  const Element = as || getDefaultElement(variant);

  const colors = useResolvedColors();
  const textVariants = useMemo(() => getTextVariants(colors), [colors]);

  // Get variant styles
  const variantStyles = textVariants({
    variant,
    weight,
    align,
  }) as React.CSSProperties;

  // Compose final styles
  const textStyle = cssifyWebStyles(
    mergeStyles(
      variantStyles,
      muted ? {color: colors.mutedForeground} : undefined,
      color ? {color} : undefined,
      style,
    ),
  ) as React.CSSProperties;

  return React.createElement(
    Element,
    {
      ref,
      className,
      style: textStyle,
      'data-testid': testID,
    },
    children,
  );
});

Text.displayName = 'Text';
