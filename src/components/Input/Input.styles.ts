/**
 * Input styles — WooBottle
 *
 * 12px rounded container on white, hairline border. Focus ring is an
 * ember-tinted glow (matches wb-input:focus in the design system's CSS).
 */

import {createVariants} from '../../core/variants';
import {
  colors,
  spacing,
  borderRadius,
  typography,
  shadowsCss,
} from '../../core/theme/tokens';

/**
 * Input container variants
 */
export const inputContainerVariants = createVariants({
  base: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.card,
    gap: spacing[2],
  },
  variants: {
    variant: {
      default: {
        borderColor: colors.borderDefault,
      },
      error: {
        borderColor: colors.actionDanger,
        backgroundColor: colors.errorTint,
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
export const inputTextVariants = createVariants({
  base: {
    fontFamily: typography.fontFamily.sans,
    fontWeight: typography.fontWeight.regular,
    fontSize: typography.fontSize.bodyMd.size,
    letterSpacing: typography.letterSpacing.tight,
    color: colors.textPrimary,
    flex: 1,
  },
  variants: {
    variant: {
      default: {
        color: colors.textPrimary,
      },
      error: {
        color: colors.textPrimary,
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
export const placeholderColor = colors.textTertiary;

/**
 * Focus styles for web — ember focus ring per design system
 */
export const focusContainerStyle: React.CSSProperties = {
  outline: 'none',
  borderColor: colors.borderFocus,
  boxShadow: shadowsCss.focusRing,
};

/**
 * Disabled style
 */
export const disabledStyle = {
  opacity: 0.5,
  backgroundColor: colors.section,
};

/**
 * Icon container style
 */
export const iconContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
