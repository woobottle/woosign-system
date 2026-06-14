/**
 * Switch styles using the variant system
 * shadcn/ui inspired design
 */

import {createVariants} from '../../core/variants';
import {spacing, borderRadius, typography} from '../../core/theme/tokens';
import type {Colors} from '../../core/theme/types';

// Track dimensions by size
export const trackDimensions = {
  sm: {width: 36, height: 20, thumbSize: 16, thumbOffset: 2},
  default: {width: 44, height: 24, thumbSize: 20, thumbOffset: 2},
  lg: {width: 52, height: 28, thumbSize: 24, thumbOffset: 2},
} as const;

/**
 * Switch track variants (the oval container) — 색 무관(치수/모양만), 정적 유지.
 * 실제 트랙 색은 getTrackColors(checked/unchecked)로 별도 적용된다.
 */
export const switchTrackVariants = createVariants({
  base: {
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
  },
  variants: {
    size: {
      sm: {
        width: trackDimensions.sm.width,
        height: trackDimensions.sm.height,
      },
      default: {
        width: trackDimensions.default.width,
        height: trackDimensions.default.height,
      },
      lg: {
        width: trackDimensions.lg.width,
        height: trackDimensions.lg.height,
      },
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

/**
 * Switch thumb variants (the sliding circle)
 */
export const getSwitchThumbVariants = (c: Colors) =>
  createVariants({
    base: {
      borderRadius: borderRadius.full,
      backgroundColor: c.background,
    },
    variants: {
      size: {
        sm: {
          width: trackDimensions.sm.thumbSize,
          height: trackDimensions.sm.thumbSize,
        },
        default: {
          width: trackDimensions.default.thumbSize,
          height: trackDimensions.default.thumbSize,
        },
        lg: {
          width: trackDimensions.lg.thumbSize,
          height: trackDimensions.lg.thumbSize,
        },
      },
    },
    defaultVariants: {
      size: 'default',
    },
  });

/**
 * Track colors
 */
export const getTrackColors = (c: Colors) => ({
  checked: c.primary,
  unchecked: c.input,
});

/**
 * Label variants
 */
export const getSwitchLabelVariants = (c: Colors) =>
  createVariants({
    base: {
      fontWeight: typography.fontWeight.medium,
      color: c.foreground,
    },
    variants: {
      size: {
        sm: {
          fontSize: typography.fontSize.sm.size,
          lineHeight: typography.fontSize.sm.lineHeight,
        },
        default: {
          fontSize: typography.fontSize.sm.size,
          lineHeight: typography.fontSize.sm.lineHeight,
        },
        lg: {
          fontSize: typography.fontSize.base.size,
          lineHeight: typography.fontSize.base.lineHeight,
        },
      },
    },
    defaultVariants: {
      size: 'default',
    },
  });

/**
 * Disabled style
 */
export const disabledStyle = {
  opacity: 0.5,
};

/**
 * Focus ring style for web
 */
export const getFocusRingStyle = (c: Colors): React.CSSProperties => ({
  outline: 'none',
  boxShadow: `0 0 0 2px ${c.background}, 0 0 0 4px ${c.ring}`,
});

/**
 * Container gap between switch and label
 */
export const containerGap = spacing[2];
