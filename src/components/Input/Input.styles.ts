/**
 * Input styles — WooBottle
 *
 * 12px rounded container on white, hairline border. Focus ring is an
 * ember-tinted glow (matches wb-input:focus in the design system's CSS).
 */

import {createVariants} from '../../core/variants';
import {
  spacing,
  borderRadius,
  typography,
  shadowsCss,
} from '../../core/theme/tokens';
import type {Colors} from '../../core/theme/types';

/**
 * Input container variants
 */
export const getInputContainerVariants = (c: Colors) =>
  createVariants({
    base: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: c.borderDefault,
      backgroundColor: c.card,
      gap: spacing[2],
    },
    variants: {
      variant: {
        default: {
          borderColor: c.borderDefault,
        },
        error: {
          borderColor: c.actionDanger,
          backgroundColor: c.errorTint,
        },
      },
      size: {
        default: {
          height: 44,
          paddingLeft: 14,
          paddingRight: 14,
        },
        sm: {
          height: 36,
          paddingLeft: spacing[3],
          paddingRight: spacing[3],
          borderRadius: borderRadius.sm,
        },
        lg: {
          height: 52,
          paddingLeft: spacing[4],
          paddingRight: spacing[4],
        },
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  });

/**
 * Input text variants
 */
export const getInputTextVariants = (c: Colors) =>
  createVariants({
    base: {
      fontFamily: typography.fontFamily.sans,
      fontWeight: typography.fontWeight.regular,
      fontSize: typography.fontSize.bodyMd.size,
      letterSpacing: typography.letterSpacing.tight,
      color: c.textPrimary,
      flex: 1,
    },
    variants: {
      variant: {
        default: {
          color: c.textPrimary,
        },
        error: {
          color: c.textPrimary,
        },
      },
      size: {
        default: {
          fontSize: typography.fontSize.bodyMd.size,
        },
        sm: {
          fontSize: typography.fontSize.bodySm.size,
        },
        lg: {
          fontSize: typography.fontSize.bodyLg.size,
        },
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  });

/**
 * Placeholder color — secondary ink on light
 */
export const getPlaceholderColor = (c: Colors) => c.textTertiary;

/**
 * Focus styles for web — ember focus ring per design system
 */
export const getFocusContainerStyle = (c: Colors): React.CSSProperties => ({
  outline: 'none',
  borderColor: c.borderFocus,
  boxShadow: shadowsCss.focusRing,
});

/**
 * Disabled style
 */
export const getDisabledStyle = (c: Colors) => ({
  opacity: 0.5,
  backgroundColor: c.section,
});

/**
 * Icon container style
 */
export const iconContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
