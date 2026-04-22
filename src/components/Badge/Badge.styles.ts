/**
 * Badge styles — WooBottle pills
 *
 * 4x10 padding, tight tracking (+0.02em), semibold. Gold is ceremonial — use
 * only for loyalty / achievements / rewards.
 */

import {createVariants} from '../../core/variants';
import {colors, borderRadius, typography} from '../../core/theme/tokens';

export const badgeVariants = createVariants({
  base: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // `alignSelf: center` stops the pill from stretching to fill the cross
    // axis of a flex-row parent (Box, etc.); height keeps it predictable.
    alignSelf: 'center',
    height: 22,
    borderRadius: borderRadius.pill,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  variants: {
    variant: {
      default: {
        backgroundColor: colors.actionPrimary,
      },
      secondary: {
        backgroundColor: colors.section,
      },
      destructive: {
        backgroundColor: colors.actionDanger,
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: colors.borderDefault,
      },
      brand: {
        backgroundColor: colors.brand,
      },
      gold: {
        backgroundColor: colors.gold,
      },
      success: {
        backgroundColor: colors.successTint,
      },
      reward: {
        backgroundColor: colors.reward,
        borderColor: colors.borderDefault,
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const badgeTextVariants = createVariants({
  base: {
    fontFamily: typography.fontFamily.sans,
    fontWeight: typography.fontWeight.semibold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.22, // 0.02em at 11px
  },
  variants: {
    variant: {
      default: {
        color: colors.textInverse,
      },
      secondary: {
        color: colors.textPrimary,
      },
      destructive: {
        color: colors.textInverse,
      },
      outline: {
        color: colors.textPrimary,
      },
      brand: {
        color: colors.textInverse,
      },
      gold: {
        color: colors.inverse,
      },
      success: {
        color: colors.brand,
      },
      reward: {
        color: colors.brand,
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

/** Hover — soft surface shift, no lift */
export const hoverStyles: Record<string, React.CSSProperties> = {
  default: {opacity: 0.92},
  secondary: {backgroundColor: colors.reward},
  destructive: {opacity: 0.92},
  outline: {backgroundColor: colors.section},
  brand: {opacity: 0.92},
  gold: {opacity: 0.92},
  success: {opacity: 0.92},
  reward: {backgroundColor: colors.section},
};
