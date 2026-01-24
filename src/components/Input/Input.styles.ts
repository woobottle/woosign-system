/**
 * Input styles using the variant system
 * shadcn/ui inspired design
 */

import { createVariants } from '../../core/variants';
import { colors, spacing, borderRadius, typography } from '../../core/theme/tokens';

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
    borderColor: colors.input,
    backgroundColor: colors.background,
    gap: spacing[2],
  },
  variants: {
    variant: {
      default: {
        borderColor: colors.input,
      },
      error: {
        borderColor: colors.destructive,
      },
    },
    size: {
      default: {
        height: 40,
        paddingLeft: spacing[3],
        paddingRight: spacing[3],
      },
      sm: {
        height: 36,
        paddingLeft: spacing[2],
        paddingRight: spacing[2],
        borderRadius: borderRadius.sm,
      },
      lg: {
        height: 44,
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
    fontWeight: typography.fontWeight.normal,
    fontSize: typography.fontSize.sm.size,
    color: colors.foreground,
    flex: 1,
  },
  variants: {
    variant: {
      default: {
        color: colors.foreground,
      },
      error: {
        color: colors.foreground,
      },
    },
    size: {
      default: {
        fontSize: typography.fontSize.sm.size,
      },
      sm: {
        fontSize: typography.fontSize.xs.size,
      },
      lg: {
        fontSize: typography.fontSize.base.size,
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

/**
 * Placeholder color
 */
export const placeholderColor = colors.mutedForeground;

/**
 * Focus styles for web
 */
export const focusContainerStyle: React.CSSProperties = {
  outline: 'none',
  borderColor: colors.ring,
  boxShadow: `0 0 0 2px ${colors.background}, 0 0 0 4px ${colors.ring}`,
};

/**
 * Disabled style
 */
export const disabledStyle = {
  opacity: 0.5,
  backgroundColor: colors.muted,
};

/**
 * Icon container style
 */
export const iconContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
