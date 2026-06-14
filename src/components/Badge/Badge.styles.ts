/**
 * Badge styles — WooBottle pills
 *
 * 4x10 padding, tight tracking (+0.02em), semibold. Gold is ceremonial — use
 * only for loyalty / achievements / rewards.
 */

import {createVariants} from '../../core/variants';
import {borderRadius, typography} from '../../core/theme/tokens';
import type {Colors} from '../../core/theme/types';

export const getBadgeVariants = (c: Colors) =>
  createVariants({
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
          backgroundColor: c.actionPrimary,
        },
        secondary: {
          backgroundColor: c.section,
        },
        destructive: {
          backgroundColor: c.actionDanger,
        },
        outline: {
          backgroundColor: 'transparent',
          borderColor: c.borderDefault,
        },
        brand: {
          backgroundColor: c.brand,
        },
        gold: {
          backgroundColor: c.gold,
        },
        success: {
          backgroundColor: c.successTint,
        },
        reward: {
          backgroundColor: c.reward,
          borderColor: c.borderDefault,
        },
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  });

export const getBadgeTextVariants = (c: Colors) =>
  createVariants({
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
          color: c.textInverse,
        },
        secondary: {
          color: c.textPrimary,
        },
        destructive: {
          color: c.textInverse,
        },
        outline: {
          color: c.textPrimary,
        },
        brand: {
          color: c.textInverse,
        },
        gold: {
          color: c.inverse,
        },
        success: {
          color: c.brand,
        },
        reward: {
          color: c.brand,
        },
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  });

/** Hover — soft surface shift, no lift */
export const getHoverStyles = (
  c: Colors,
): Record<string, React.CSSProperties> => ({
  default: {opacity: 0.92},
  secondary: {backgroundColor: c.reward},
  destructive: {opacity: 0.92},
  outline: {backgroundColor: c.section},
  brand: {opacity: 0.92},
  gold: {opacity: 0.92},
  success: {opacity: 0.92},
  reward: {backgroundColor: c.section},
});
